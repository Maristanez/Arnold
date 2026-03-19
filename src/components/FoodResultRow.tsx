import React, { useRef } from "react";
import { Pressable, View, Text, StyleSheet, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

interface FoodResultRowProps {
  name: string;
  brand?: string;
  calories: number | null;
  onPress: () => void;
}

export function FoodResultRow({ name, brand, calories, onPress }: FoodResultRowProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={styles.row}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      >
        <View style={styles.left}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {brand && <Text style={styles.brand} numberOfLines={1}>{brand}</Text>}
        </View>
        <Text style={styles.calories}>
          {calories != null ? `${calories} cal` : "—"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  left: {
    flex: 1,
    marginRight: Spacing.base,
  },
  name: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  brand: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  calories: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});
