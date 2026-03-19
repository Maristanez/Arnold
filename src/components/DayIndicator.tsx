import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

interface DayIndicatorProps {
  label: string;
  status: "completed" | "today" | "upcoming";
}

export function DayIndicator({ label, status }: DayIndicatorProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(status === "today" ? 1.15 : 1, { damping: 15 }) }],
  }));

  return (
    <Animated.View style={[styles.circle, styles[status], animatedStyle]}>
      <Text style={[styles.label, status === "completed" && styles.labelCompleted]}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  completed: {
    backgroundColor: Colors.brand,
  },
  today: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.brand,
  },
  upcoming: {
    backgroundColor: Colors.surfaceLight,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  labelCompleted: {
    color: Colors.textPrimary,
  },
});
