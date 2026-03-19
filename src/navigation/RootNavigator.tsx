import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { LoadingScreen } from "@/components";
import { AuthStack } from "./AuthStack";
import { OnboardingStack } from "./OnboardingStack";
import { MainTabs } from "./MainTabs";
import { WorkoutActiveScreen } from "@/screens/workout/WorkoutActiveScreen";
import { WorkoutCheckInScreen } from "@/screens/workout/WorkoutCheckInScreen";
import { ProgramDetailScreen } from "@/screens/home/ProgramDetailScreen";
import { FoodSearchScreen } from "@/screens/nutrition/FoodSearchScreen";
import { MealDetailScreen } from "@/screens/nutrition/MealDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

export function RootNavigator({
  isBootstrapping,
  isAuthenticated,
  isOnboarded,
}: RootNavigatorProps) {
  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !isOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="WorkoutActive"
            component={WorkoutActiveScreen}
            options={{ animation: "slide_from_bottom", gestureEnabled: false }}
          />
          <Stack.Screen
            name="WorkoutCheckIn"
            component={WorkoutCheckInScreen}
            options={{ animation: "fade" }}
          />
          <Stack.Screen
            name="ProgramDetail"
            component={ProgramDetailScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="FoodSearch"
            component={FoodSearchScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="MealDetail"
            component={MealDetailScreen}
            options={{ animation: "slide_from_right" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
