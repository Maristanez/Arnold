import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { SessionExercise } from "@/types";
import { SetRow } from "./SetRow";

interface ExerciseCardProps {
  exercise: SessionExercise;
  onLogSet: (setNumber: number, weight: number, reps: number) => void;
  onComplete: () => void;
}

export function ExerciseCard({ exercise, onLogSet, onComplete }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  const rotation = useDerivedValue(() =>
    withTiming(expanded ? 180 : 0, { duration: 200 })
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.card, exercise.completed && styles.cardCompleted]}>
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, exercise.completed && styles.statusDotDone]} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.progress}>
              {completedSets}/{exercise.planned_sets} sets — {exercise.planned_reps} reps
            </Text>
          </View>
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
        </Animated.View>
      </Pressable>

      {expanded && (
        <View style={styles.sets}>
          {exercise.sets.map((set) => (
            <SetRow
              key={set.set_number}
              setNumber={set.set_number}
              weight={set.weight}
              reps={set.reps}
              completed={set.completed}
              onWeightChange={(w) => onLogSet(set.set_number, w, set.reps ?? 0)}
              onRepsChange={(r) => onLogSet(set.set_number, set.weight ?? 0, r)}
              onComplete={() => onLogSet(set.set_number, set.weight ?? 0, set.reps ?? 0)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  cardCompleted: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.brand,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textTertiary,
  },
  statusDotDone: {
    backgroundColor: Colors.brand,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  progress: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sets: {
    marginTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
    paddingTop: Spacing.sm,
  },
});
