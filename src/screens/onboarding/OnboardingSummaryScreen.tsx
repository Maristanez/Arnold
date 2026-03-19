import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RootStackParamList, OnboardingData } from "@/types";
import { useOnboardingStore } from "@/store";
import { useUser } from "@/hooks";
import { useProgram } from "@/hooks";
import { ScreenContainer, Button, H1, Body, Card, Label, Caption, ErrorBanner } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function OnboardingSummaryScreen() {
  const navigation = useNavigation<Nav>();
  const { data } = useOnboardingStore();
  const { completeOnboarding } = useUser();
  const { generateNewProgram } = useProgram();
  const { reset } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    const onboardingData = data as OnboardingData;

    const profileResult = await completeOnboarding(onboardingData);
    if (profileResult.error) {
      setError(profileResult.error);
      setIsLoading(false);
      return;
    }

    const programResult = await generateNewProgram(onboardingData);
    if (programResult.error) {
      setError(programResult.error);
      setIsLoading(false);
      return;
    }

    reset();
    setIsLoading(false);
  };

  const summaryRows = [
    { label: "Identity", value: data.fitness_identity ?? "—" },
    { label: "Goals", value: data.current_goals?.join(", ") ?? "—" },
    { label: "Experience", value: data.experience_level ?? "—" },
    { label: "Years Training", value: data.years_training?.toString() ?? "—" },
    { label: "Days/Week", value: data.days_per_week?.toString() ?? "—" },
    { label: "Session Length", value: data.session_duration ? `${data.session_duration} min` : "—" },
    { label: "Equipment", value: data.equipment?.join(", ") ?? "—" },
  ];

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Your Profile</H1>
          <Body style={styles.subtitle}>Review your selections before we generate your program</Body>
        </Animated.View>

        {error && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <ErrorBanner message={error} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={styles.card}>
            {summaryRows.map((row) => (
              <View key={row.label} style={styles.row}>
                <Caption style={styles.rowLabel}>{row.label}</Caption>
                <Body style={styles.rowValue}>{row.value}</Body>
              </View>
            ))}
          </Card>
        </Animated.View>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "Generating Your Program..." : "Generate My Program"}
            onPress={handleGenerate}
            loading={isLoading}
          />
          <Button
            title="Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
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
    paddingTop: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  card: {
    gap: Spacing.base,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    color: Colors.textSecondary,
    flex: 1,
  },
  rowValue: {
    color: Colors.textPrimary,
    flex: 2,
    textAlign: "right",
    textTransform: "capitalize",
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
