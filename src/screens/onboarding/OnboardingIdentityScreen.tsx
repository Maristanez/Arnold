import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingStackParamList, FitnessIdentity } from "@/types";
import { useOnboardingStore } from "@/store";
import { ScreenContainer, Button, H1, Body, OnboardingProgress, SelectionCard } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<OnboardingStackParamList, "OnboardingIdentity">;

const identities: { id: FitnessIdentity; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "bodybuilder", title: "Bodybuilder", subtitle: "Muscle & aesthetics", icon: "body" },
  { id: "powerlifter", title: "Powerlifter", subtitle: "Strength & PRs", icon: "barbell" },
  { id: "athlete", title: "Athlete", subtitle: "Sport performance", icon: "trophy" },
  { id: "crossfitter", title: "CrossFitter", subtitle: "Functional fitness", icon: "flame" },
  { id: "casual", title: "Casual", subtitle: "Stay active & healthy", icon: "heart" },
  { id: "beginner", title: "Beginner", subtitle: "Just getting started", icon: "star" },
];

export function OnboardingIdentityScreen() {
  const navigation = useNavigation<Nav>();
  const { data, setField } = useOnboardingStore();

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <OnboardingProgress currentStep={1} />

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>What's your fitness identity?</H1>
          <Body style={styles.subtitle}>This shapes your entire program</Body>
        </Animated.View>

        <View style={styles.grid}>
          {identities.map((item, index) => (
            <Animated.View
              key={item.id}
              style={styles.gridItem}
              entering={FadeInDown.duration(400).delay(200 + index * 80)}
            >
              <SelectionCard
                title={item.title}
                subtitle={item.subtitle}
                icon={<Ionicons name={item.icon} size={24} color={data.fitness_identity === item.id ? Colors.brand : Colors.textSecondary} />}
                selected={data.fitness_identity === item.id}
                onPress={() => setField("fitness_identity", item.id)}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => navigation.navigate("OnboardingGoals")}
            disabled={!data.fitness_identity}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%",
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
