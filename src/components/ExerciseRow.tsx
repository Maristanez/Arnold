import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

interface ExerciseRowProps {
  name: string;
  sets: number;
  reps: string;
}

export function ExerciseRow({ name, sets, reps }: ExerciseRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.detail}>{sets} x {reps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  name: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  detail: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});
