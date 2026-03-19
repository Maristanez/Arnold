import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types";
import { useNutrition } from "@/hooks";
import { ScreenContainer, H1, H2, Body, Caption, Card } from "@/components";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList, "MealDetail">;
type Route = RouteProp<RootStackParamList, "MealDetail">;

export function MealDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { mealType } = route.params;
  const { meals } = useNutrition();

  const meal = meals.find((m) => m.meal_type === mealType);

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <H1 style={styles.title}>{mealType}</H1>
        </View>

        {meal ? (
          <>
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
              <Card style={styles.totalCard}>
                <Text style={styles.totalLabel}>Meal Total</Text>
                <View style={styles.macroRow}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.macros_total.calories}</Text>
                    <Caption>cal</Caption>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.macros_total.protein}g</Text>
                    <Caption>protein</Caption>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.macros_total.carbs}g</Text>
                    <Caption>carbs</Caption>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.macros_total.fat}g</Text>
                    <Caption>fat</Caption>
                  </View>
                </View>
              </Card>
            </Animated.View>

            {meal.foods.map((food, index) => (
              <Animated.View
                key={food.id}
                entering={FadeInDown.duration(300).delay(200 + index * 60)}
              >
                <Card style={styles.foodCard}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Caption>{food.serving_size} — {food.macros.calories} cal</Caption>
                  <View style={styles.foodMacros}>
                    <Caption>P: {food.macros.protein}g</Caption>
                    <Caption>C: {food.macros.carbs}g</Caption>
                    <Caption>F: {food.macros.fat}g</Caption>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </>
        ) : (
          <Card style={styles.emptyCard}>
            <Ionicons name="nutrition-outline" size={48} color={Colors.textTertiary} />
            <Body style={styles.emptyText}>No foods logged</Body>
          </Card>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    textTransform: "capitalize",
  },
  totalCard: {
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 18,
  },
  foodCard: {
    marginBottom: Spacing.sm,
  },
  foodName: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: 2,
  },
  foodMacros: {
    flexDirection: "row",
    gap: Spacing.base,
    marginTop: Spacing.sm,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.textSecondary,
  },
});
