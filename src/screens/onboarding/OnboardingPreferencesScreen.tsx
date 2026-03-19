import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { OnboardingStackParamList } from "@/types";
import { useOnboardingStore } from "@/store";
import { ScreenContainer, Button, H1, Body, OnboardingProgress, SelectionCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<OnboardingStackParamList, "OnboardingPreferences">;

const daysOptions = [1, 2, 3, 4, 5, 6, 7];
const durationOptions = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];
const equipmentOptions = [
  "Full Gym",
  "Dumbbells",
  "Barbell & Rack",
  "Bodyweight Only",
  "Resistance Bands",
  "Cables & Machines",
];

export function OnboardingPreferencesScreen() {
  const navigation = useNavigation<Nav>();
  const { data, setField } = useOnboardingStore();
  const selectedEquipment = data.equipment ?? [];

  const toggleEquipment = (item: string) => {
    if (selectedEquipment.includes(item)) {
      setField("equipment", selectedEquipment.filter((e) => e !== item));
    } else {
      setField("equipment", [...selectedEquipment, item]);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <OnboardingProgress currentStep={4} />

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Preferences</H1>
          <Body style={styles.subtitle}>Customize your training schedule</Body>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Body style={styles.sectionLabel}>Days Per Week</Body>
          <View style={styles.daysRow}>
            {daysOptions.map((day) => (
              <View key={day} style={styles.dayItem}>
                <SelectionCard
                  title={String(day)}
                  selected={data.days_per_week === day}
                  onPress={() => setField("days_per_week", day)}
                  style={styles.dayCard}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <Body style={styles.sectionLabel}>Session Duration</Body>
          <View style={styles.durationRow}>
            {durationOptions.map((opt) => (
              <View key={opt.value} style={styles.durationItem}>
                <SelectionCard
                  title={opt.label}
                  selected={data.session_duration === opt.value}
                  onPress={() => setField("session_duration", opt.value)}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <Body style={styles.sectionLabel}>Available Equipment</Body>
          <View style={styles.equipmentGrid}>
            {equipmentOptions.map((item) => (
              <View key={item} style={styles.equipmentItem}>
                <SelectionCard
                  title={item}
                  selected={selectedEquipment.includes(item)}
                  onPress={() => toggleEquipment(item)}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate("OnboardingSummary")}
            disabled={!data.days_per_week || !data.session_duration || selectedEquipment.length === 0}
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
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  daysRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dayItem: {
    flex: 1,
  },
  dayCard: {
    minHeight: 48,
    paddingVertical: Spacing.sm,
  },
  durationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  durationItem: {
    width: "47%",
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  equipmentItem: {
    width: "47%",
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
