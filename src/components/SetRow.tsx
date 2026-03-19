import React from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

interface SetRowProps {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onComplete: () => void;
}

export function SetRow({
  setNumber,
  weight,
  reps,
  completed,
  onWeightChange,
  onRepsChange,
  onComplete,
}: SetRowProps) {
  return (
    <View style={[styles.row, completed && styles.rowCompleted]}>
      <Text style={styles.setLabel}>Set {setNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="lbs"
        placeholderTextColor={Colors.textTertiary}
        keyboardType="numeric"
        value={weight?.toString() ?? ""}
        onChangeText={(t) => { const n = parseFloat(t); if (!isNaN(n)) onWeightChange(n); }}
        editable={!completed}
      />
      <TextInput
        style={styles.input}
        placeholder="reps"
        placeholderTextColor={Colors.textTertiary}
        keyboardType="numeric"
        value={reps?.toString() ?? ""}
        onChangeText={(t) => { const n = parseInt(t, 10); if (!isNaN(n)) onRepsChange(n); }}
        editable={!completed}
      />
      <Pressable
        style={[styles.check, completed && styles.checkCompleted]}
        onPress={onComplete}
        hitSlop={8}
      >
        <Ionicons
          name={completed ? "checkmark-circle" : "checkmark-circle-outline"}
          size={28}
          color={completed ? Colors.brand : Colors.textTertiary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  rowCompleted: {
    opacity: 0.6,
  },
  setLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    width: 44,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    padding: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: "center",
    minHeight: 40,
  },
  check: {
    padding: Spacing.xs,
  },
  checkCompleted: {},
});
