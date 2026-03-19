import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/types";
import { OnboardingIdentityScreen } from "@/screens/onboarding/OnboardingIdentityScreen";
import { OnboardingGoalsScreen } from "@/screens/onboarding/OnboardingGoalsScreen";
import { OnboardingHistoryScreen } from "@/screens/onboarding/OnboardingHistoryScreen";
import { OnboardingPreferencesScreen } from "@/screens/onboarding/OnboardingPreferencesScreen";
import { OnboardingSummaryScreen } from "@/screens/onboarding/OnboardingSummaryScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="OnboardingIdentity" component={OnboardingIdentityScreen} />
      <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="OnboardingHistory" component={OnboardingHistoryScreen} />
      <Stack.Screen name="OnboardingPreferences" component={OnboardingPreferencesScreen} />
      <Stack.Screen name="OnboardingSummary" component={OnboardingSummaryScreen} />
    </Stack.Navigator>
  );
}
