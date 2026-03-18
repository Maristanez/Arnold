import type { MealType } from "./nutrition";

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type OnboardingStackParamList = {
  OnboardingIdentity: undefined;
  OnboardingGoals: undefined;
  OnboardingHistory: undefined;
  OnboardingPreferences: undefined;
  OnboardingSummary: undefined;
};

export type TabParamList = {
  Home: undefined;
  Workout: undefined;
  NutritionTab: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  WorkoutActive: { dayNumber: number };
  WorkoutCheckIn: { sessionId: string };
  ProgramDetail: undefined;
  FoodSearch: { mealType: MealType };
  MealDetail: { mealId: string; mealType: MealType };
};
