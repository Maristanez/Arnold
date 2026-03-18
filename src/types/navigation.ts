import { NavigatorScreenParams } from "@react-navigation/native";
import { MealType } from "./nutrition";

export type RootStackParamList = {
  Loading: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

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
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  StartWorkout: undefined;
  NutritionTab: NavigatorScreenParams<NutritionStackParamList>;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProgramDetail: { programId: string };
};

export type WorkoutStackParamList = {
  WorkoutHistory: undefined;
  WorkoutActive: { dayNumber: number };
  WorkoutCheckIn: { sessionId: string };
};

export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  FoodSearch: { mealType: MealType };
  MealDetail: { mealId: string };
};
