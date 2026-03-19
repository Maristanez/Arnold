import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { ProgramDay } from "@/types";

interface WorkoutPreviewCardProps {
  day: ProgramDay;
  onStart: () => void;
}

export function WorkoutPreviewCard({ day, onStart }: WorkoutPreviewCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500)}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="barbell" size={20} color={Colors.brand} />
            <Text style={styles.dayName}>{day.name}</Text>
          </View>
          <Text style={styles.focus}>{day.focus}</Text>
        </View>

        <View style={styles.exercises}>
          {day.exercises.slice(0, 3).map((ex) => (
            <Text key={ex.id} style={styles.exerciseText}>
              {ex.name} — {ex.sets} x {ex.reps}
            </Text>
          ))}
          {day.exercises.length > 3 && (
            <Text style={styles.moreText}>+{day.exercises.length - 3} more</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.startButton}>
            <Text style={styles.startText} onPress={onStart}>
              Start Workout
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.brand} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brand,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dayName: {
    ...Typography.h3,
    fontSize: 18,
  },
  focus: {
    ...Typography.caption,
    color: Colors.brand,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  exercises: {
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  exerciseText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  moreText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
    paddingTop: Spacing.md,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  startText: {
    ...Typography.button,
    color: Colors.brand,
    fontWeight: "600",
  },
});
