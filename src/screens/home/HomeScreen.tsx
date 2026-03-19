import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types";
import { useProgram } from "@/hooks";
import { useUser } from "@/hooks";
import { ScreenContainer, H1, H2, Body, Caption, Card, LoadingScreen } from "@/components";
import { DayIndicator } from "@/components/DayIndicator";
import { WorkoutPreviewCard } from "@/components/WorkoutPreviewCard";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useUser();
  const { currentProgram, isLoading } = useProgram();

  if (isLoading) return <LoadingScreen />;

  const todayIndex = new Date().getDay();
  const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const todayDay = currentProgram?.days.find((d) => d.day_number === adjustedIndex + 1);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <Caption style={styles.greeting}>{greeting()}</Caption>
          <H1 style={styles.name}>
            {profile?.email?.split("@")[0] ?? "Athlete"}
          </H1>
        </Animated.View>

        {currentProgram && (
          <>
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
              <View style={styles.programHeader}>
                <View>
                  <H2 style={styles.programName}>{currentProgram.name}</H2>
                  <Caption>Week {currentProgram.week_number}</Caption>
                </View>
                <Pressable onPress={() => navigation.navigate("ProgramDetail")}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </Pressable>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(300)}>
              <View style={styles.weekRow}>
                {DAYS.map((label, index) => (
                  <DayIndicator
                    key={index}
                    label={label}
                    status={
                      index < adjustedIndex
                        ? "completed"
                        : index === adjustedIndex
                        ? "today"
                        : "upcoming"
                    }
                  />
                ))}
              </View>
            </Animated.View>

            {todayDay && (
              <Animated.View entering={FadeInDown.duration(500).delay(400)}>
                <Body style={styles.sectionLabel}>Today's Workout</Body>
                <WorkoutPreviewCard
                  day={todayDay}
                  onStart={() => navigation.navigate("WorkoutActive", { dayNumber: todayDay.day_number })}
                />
              </Animated.View>
            )}
          </>
        )}

        {!currentProgram && (
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Card style={styles.emptyCard}>
              <Ionicons name="barbell-outline" size={48} color={Colors.textTertiary} />
              <Body style={styles.emptyText}>No active program</Body>
              <Caption style={styles.emptyCaption}>
                Complete onboarding to generate your personalized program
              </Caption>
            </Card>
          </Animated.View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  greeting: {
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 11,
  },
  name: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  programHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  programName: {
    marginBottom: Spacing.xs,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  emptyCaption: {
    textAlign: "center",
    color: Colors.textTertiary,
  },
});
