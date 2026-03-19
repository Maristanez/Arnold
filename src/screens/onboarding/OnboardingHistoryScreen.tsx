import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OnboardingStackParamList, ExperienceLevel } from "@/types";
import { useOnboardingStore } from "@/store";
import { ScreenContainer, Button, Input, H1, Body, OnboardingProgress, SelectionCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<OnboardingStackParamList, "OnboardingHistory">;

const experienceLevels: { id: ExperienceLevel; title: string; subtitle: string }[] = [
  { id: "beginner", title: "Beginner", subtitle: "Less than 1 year" },
  { id: "intermediate", title: "Intermediate", subtitle: "1-3 years" },
  { id: "advanced", title: "Advanced", subtitle: "3+ years" },
];

export function OnboardingHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { data, setField } = useOnboardingStore();

  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <OnboardingProgress currentStep={3} />

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Training history</H1>
          <Body style={styles.subtitle}>Help us understand your experience</Body>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Body style={styles.sectionLabel}>Experience Level</Body>
          <View style={styles.levelGrid}>
            {experienceLevels.map((level) => (
              <View key={level.id} style={styles.levelItem}>
                <SelectionCard
                  title={level.title}
                  subtitle={level.subtitle}
                  selected={data.experience_level === level.id}
                  onPress={() => setField("experience_level", level.id)}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={styles.fields} entering={FadeInDown.duration(500).delay(300)}>
          <Input
            label="Years Training"
            placeholder="e.g. 2"
            keyboardType="numeric"
            value={data.years_training?.toString() ?? ""}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              setField("years_training", isNaN(num) ? 0 : num);
            }}
          />
          <View style={styles.fieldSpacer} />
          <Input
            label="Current Injuries (optional)"
            placeholder="e.g. Lower back, right shoulder"
            value={data.injuries?.join(", ") ?? ""}
            onChangeText={(text) => {
              setField("injuries", text ? text.split(",").map((s) => s.trim()) : []);
            }}
          />
        </Animated.View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate("OnboardingPreferences")}
            disabled={!data.experience_level}
          />
          <Button
            title="Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  levelGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  levelItem: {
    flex: 1,
  },
  fields: {
    marginTop: Spacing.lg,
  },
  fieldSpacer: {
    height: Spacing.base,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
