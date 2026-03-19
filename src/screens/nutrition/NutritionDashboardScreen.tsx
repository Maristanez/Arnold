import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RootStackParamList, MealType } from "@/types";
import { useNutrition } from "@/hooks";
import { ScreenContainer, H1, LoadingScreen } from "@/components";
import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { MealGroup } from "@/components/MealGroup";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function NutritionDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { meals, dailyMacros, isLoading } = useNutrition();

  if (isLoading) return <LoadingScreen />;

  const getMealFoods = (type: MealType) => {
    const meal = meals.find((m) => m.meal_type === type);
    return meal?.foods ?? [];
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Nutrition</H1>
        </Animated.View>

        <Animated.View style={styles.macroRow} entering={FadeInDown.duration(500).delay(200)}>
          <MacroSummaryCard label="Calories" current={dailyMacros.calories} color={Colors.brand} />
          <MacroSummaryCard label="Protein" current={dailyMacros.protein} color="#4FC3F7" />
        </Animated.View>
        <Animated.View style={styles.macroRow} entering={FadeInDown.duration(500).delay(250)}>
          <MacroSummaryCard label="Carbs" current={dailyMacros.carbs} color={Colors.warning} />
          <MacroSummaryCard label="Fat" current={dailyMacros.fat} color="#E57373" />
        </Animated.View>

        <View style={styles.meals}>
          {MEAL_TYPES.map((type, index) => (
            <Animated.View
              key={type}
              entering={FadeInDown.duration(400).delay(300 + index * 80)}
            >
              <MealGroup
                mealType={type}
                foods={getMealFoods(type)}
                onAddFood={() => navigation.navigate("FoodSearch", { mealType: type })}
              />
            </Animated.View>
          ))}
        </View>
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
  title: {
    marginBottom: Spacing.lg,
  },
  macroRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  meals: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
