import React, { useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, FoodSearchResult, FoodEntry } from "@/types";
import { useNutrition } from "@/hooks";
import { ScreenContainer, Input, H2, Caption, Body } from "@/components";
import { FoodResultRow } from "@/components/FoodResultRow";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList, "FoodSearch">;
type Route = RouteProp<RootStackParamList, "FoodSearch">;

export function FoodSearchScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { mealType } = route.params;
  const { searchResults, isSearching, searchFood, logMeal } = useNutrition();
  const [query, setQuery] = useState("");

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length >= 2) {
      searchFood(text.trim());
    }
  };

  const handleSelect = async (result: FoodSearchResult) => {
    const food: FoodEntry = {
      id: result.id,
      name: result.name,
      brand: result.brand,
      serving_size: result.serving_size,
      servings: 1,
      macros: {
        calories: result.macros_per_serving.calories ?? 0,
        protein: result.macros_per_serving.protein ?? 0,
        carbs: result.macros_per_serving.carbs ?? 0,
        fat: result.macros_per_serving.fat ?? 0,
      },
    };
    await logMeal(mealType, [food]);
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(400)}>
          <View style={styles.headerRow}>
            <Ionicons
              name="close"
              size={24}
              color={Colors.textPrimary}
              onPress={() => navigation.goBack()}
            />
            <H2 style={styles.title}>Add Food</H2>
            <View style={{ width: 24 }} />
          </View>
          <Caption style={styles.mealLabel}>{mealType}</Caption>
        </Animated.View>

        <View style={styles.searchBox}>
          <Input
            placeholder="Search foods..."
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>

        {isSearching && (
          <ActivityIndicator
            color={Colors.brand}
            style={styles.spinner}
          />
        )}

        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FoodResultRow
              name={item.name}
              brand={item.brand}
              calories={item.macros_per_serving.calories}
              onPress={() => handleSelect(item)}
            />
          )}
          ListEmptyComponent={
            query.length >= 2 && !isSearching ? (
              <Body style={styles.emptyText}>No results found</Body>
            ) : null
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    textAlign: "center",
  },
  mealLabel: {
    textAlign: "center",
    textTransform: "capitalize",
    color: Colors.brand,
    marginTop: Spacing.xs,
  },
  searchBox: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  spinner: {
    paddingVertical: Spacing.base,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textSecondary,
    paddingTop: Spacing.xl,
  },
});
