import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

interface MacroSummaryCardProps {
  label: string;
  current: number;
  target?: number;
  color?: string;
}

export function MacroSummaryCard({
  label,
  current,
  target,
  color = Colors.brand,
}: MacroSummaryCardProps) {
  const progress = target ? Math.min(current / target, 1) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {Math.round(current)}
        {target ? (
          <Text style={styles.target}> / {target}</Text>
        ) : null}
      </Text>
      {target ? (
        <View style={styles.barBg}>
          <View
            style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: color }]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    flex: 1,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  target: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 12,
  },
  barBg: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
});
