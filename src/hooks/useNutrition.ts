import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { backboardService, nutritionService } from "@/services";
import { useAuthStore } from "@/store";
import { FoodEntry, FoodSearchResult, Macros, Meal, MealType } from "@/types";

const emptyMacros: Macros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export function useNutrition() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyMacros, setDailyMacros] = useState<Macros>(emptyMacros);
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshToday = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);

    const [mealsResult, macrosResult] = await Promise.all([
      nutritionService.getTodayMeals(userId),
      nutritionService.getDailyMacros(userId),
    ]);

    if (mealsResult.error) {
      setError(mealsResult.error);
    } else {
      setMeals(mealsResult.data ?? []);
    }

    if (macrosResult.error) {
      setError(macrosResult.error);
    } else {
      setDailyMacros(macrosResult.data ?? emptyMacros);
      await backboardService.storeNutritionMemory(userId, macrosResult.data ?? emptyMacros);
    }

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  const searchFood = useCallback((query: string) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      const result = await nutritionService.searchFood(query);

      if (result.error) {
        setError(result.error);
      } else {
        setSearchResults(result.data ?? []);
      }

      setIsSearching(false);
    }, 300);
  }, []);

  const logMeal = useCallback(
    async (mealType: MealType, foods: FoodEntry[]) => {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      setError(null);
      const result = await nutritionService.logMeal(userId, mealType, foods);

      if (result.error) {
        setError(result.error);
      } else {
        await refreshToday();
      }

      return result;
    },
    [userId, refreshToday]
  );

  const addFood = useCallback(
    async (mealId: string, food: FoodEntry) => {
      setError(null);

      const result = await nutritionService.addFoodToMeal(mealId, food);
      if (result.error) {
        setError(result.error);
      } else {
        await refreshToday();
      }

      return result;
    },
    [refreshToday]
  );

  const totals = useMemo(() => dailyMacros, [dailyMacros]);

  return {
    meals,
    dailyMacros: totals,
    searchResults,
    isLoading,
    isSearching,
    error,
    searchFood,
    logMeal,
    addFood,
    refreshToday,
  };
}
