import {
  FoodEntry,
  FoodSearchResult,
  Json,
  Macros,
  Meal,
  MealType,
} from "@/types";
import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";

type OpenFoodFactsProduct = {
  code?: string;
  id?: string;
  product_name?: string;
  brands?: string;
  serving_size?: string;
  nutriments?: Record<string, unknown>;
};

type OpenFoodFactsResponse = {
  products?: OpenFoodFactsProduct[];
};

const emptyMacros: Macros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

function sumMacros(entries: FoodEntry[]): Macros {
  return entries.reduce(
    (acc, food) => ({
      calories: acc.calories + food.macros.calories * food.servings,
      protein: acc.protein + food.macros.protein * food.servings,
      carbs: acc.carbs + food.macros.carbs * food.servings,
      fat: acc.fat + food.macros.fat * food.servings,
    }),
    { ...emptyMacros }
  );
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export const nutritionService = {
  async logMeal(
    userId: string,
    mealType: MealType,
    foods: FoodEntry[]
  ): Promise<ServiceResult<Meal>> {
    const macros_total = sumMacros(foods);

    const { data, error } = await supabase
      .from("meals")
      .insert({
        user_id: userId,
        meal_type: mealType,
        foods: foods as unknown as Json,
        macros_total: macros_total as unknown as Json,
        logged_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Meal, error: null };
  },

  async addFoodToMeal(mealId: string, food: FoodEntry): Promise<ServiceResult<Meal>> {
    const { data: mealData, error: mealError } = await supabase
      .from("meals")
      .select("*")
      .eq("id", mealId)
      .single();

    if (mealError || !mealData) {
      return { data: null, error: mealError?.message ?? "Meal not found" };
    }

    const currentFoods = ((mealData as Meal).foods ?? []) as FoodEntry[];
    const foods = [...currentFoods, food];
    const macros_total = sumMacros(foods);

    const { data, error } = await supabase
      .from("meals")
      .update({
        foods: foods as unknown as Json,
        macros_total: macros_total as unknown as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mealId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Meal, error: null };
  },

  async getTodayMeals(userId: string): Promise<ServiceResult<Meal[]>> {
    const { start, end } = getTodayRange();
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .gte("logged_at", start)
      .lte("logged_at", end)
      .order("logged_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Meal[]) ?? [], error: null };
  },

  async getDailyMacros(userId: string): Promise<ServiceResult<Macros>> {
    const mealsResult = await this.getTodayMeals(userId);

    if (mealsResult.error || !mealsResult.data) {
      return { data: null, error: mealsResult.error ?? "Unable to load meals" };
    }

    const total = mealsResult.data.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.macros_total.calories,
        protein: acc.protein + meal.macros_total.protein,
        carbs: acc.carbs + meal.macros_total.carbs,
        fat: acc.fat + meal.macros_total.fat,
      }),
      { ...emptyMacros }
    );

    return { data: total, error: null };
  },

  async searchFood(query: string): Promise<ServiceResult<FoodSearchResult[]>> {
    const trimmed = query.trim();

    if (!trimmed) {
      return { data: [], error: null };
    }

    const encoded = encodeURIComponent(trimmed);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&json=true&page_size=20`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { data: null, error: "Food search failed" };
      }

      const json = (await response.json()) as OpenFoodFactsResponse;
      const products = Array.isArray(json.products) ? json.products : [];

      const mapped: FoodSearchResult[] = products.map((product) => {
        const nutriments = product.nutriments ?? {};
        return {
          id: String(product.code ?? product.id ?? Math.random()),
          name: product.product_name ?? "Unknown food",
          brand: product.brands ?? undefined,
          serving_size: product.serving_size ?? "N/A",
          macros_per_serving: {
            calories:
              typeof nutriments["energy-kcal_serving"] === "number"
                ? nutriments["energy-kcal_serving"]
                : null,
            protein:
              typeof nutriments.proteins_serving === "number"
                ? nutriments.proteins_serving
                : null,
            carbs:
              typeof nutriments.carbohydrates_serving === "number"
                ? nutriments.carbohydrates_serving
                : null,
            fat:
              typeof nutriments.fat_serving === "number"
                ? nutriments.fat_serving
                : null,
          },
        };
      });

      return { data: mapped, error: null };
    } catch {
      return { data: null, error: "Food search failed" };
    }
  },
};
