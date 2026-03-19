import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { FoodEntry } from "@/types";

interface MealGroupProps {
  mealType: string;
  foods: FoodEntry[];
  onAddFood: () => void;
}

export function MealGroup({ mealType, foods, onAddFood }: MealGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mealType}</Text>
      {foods.map((food) => (
        <View key={food.id} style={styles.foodRow}>
          <Text style={styles.foodName} numberOfLines={1}>{food.name}</Text>
          <Text style={styles.calories}>{food.macros.calories} cal</Text>
        </View>
      ))}
      <Pressable style={styles.addButton} onPress={onAddFood}>
        <Ionicons name="add" size={16} color={Colors.brand} />
        <Text style={styles.addText}>Add Food</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
  },
  header: {
    ...Typography.label,
    color: Colors.textPrimary,
    textTransform: "capitalize",
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  foodName: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  calories: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingTop: Spacing.md,
  },
  addText: {
    ...Typography.label,
    color: Colors.brand,
  },
});
