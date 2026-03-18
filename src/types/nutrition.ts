export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NullableMacros {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export interface FoodEntry {
  id: string;
  name: string;
  brand?: string;
  serving_size: string;
  servings: number;
  macros: Macros;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  user_id: string;
  meal_type: MealType;
  foods: FoodEntry[];
  macros_total: Macros;
  logged_at: string;
  created_at: string;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  serving_size: string;
  macros_per_serving: NullableMacros;
}
