import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OnboardingStackParamList } from "@/types";
import { useOnboardingStore } from "@/store";
import { ScreenContainer, Button, H1, Body, Caption, OnboardingProgress, SelectionCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<OnboardingStackParamList, "OnboardingGoals">;

const allGoals = [
  { id: "build_muscle", title: "Build Muscle", subtitle: "Hypertrophy focused" },
  { id: "lose_fat", title: "Lose Fat", subtitle: "Cut & lean out" },
  { id: "get_stronger", title: "Get Stronger", subtitle: "Increase max lifts" },
  { id: "improve_endurance", title: "Improve Endurance", subtitle: "Cardio & stamina" },
  { id: "stay_healthy", title: "Stay Healthy", subtitle: "General wellness" },
  { id: "sport_performance", title: "Sport Performance", subtitle: "Athletic gains" },
];

export function OnboardingGoalsScreen() {
  const navigation = useNavigation<Nav>();
  const { data, setField } = useOnboardingStore();
  const selectedGoals = data.current_goals ?? [];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setField("current_goals", selectedGoals.filter((g) => g !== goalId));
    } else if (selectedGoals.length < 3) {
      setField("current_goals", [...selectedGoals, goalId]);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <OnboardingProgress currentStep={2} />

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>What are your goals?</H1>
          <Body style={styles.subtitle}>Select up to 3 goals</Body>
          <Caption style={styles.count}>{selectedGoals.length}/3 selected</Caption>
        </Animated.View>

        <View style={styles.list}>
          {allGoals.map((goal, index) => (
            <Animated.View
              key={goal.id}
              entering={FadeInDown.duration(400).delay(200 + index * 60)}
            >
              <SelectionCard
                title={goal.title}
                subtitle={goal.subtitle}
                selected={selectedGoals.includes(goal.id)}
                disabled={!selectedGoals.includes(goal.id) && selectedGoals.length >= 3}
                onPress={() => toggleGoal(goal.id)}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate("OnboardingHistory")}
            disabled={selectedGoals.length === 0}
          />
          <Button
            title="Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  count: {
    color: Colors.brand,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.md,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
