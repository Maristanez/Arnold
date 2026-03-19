import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types";
import { useProgram } from "@/hooks";
import { ScreenContainer, H1, H2, Body, Caption, Card, LoadingScreen } from "@/components";
import { ExerciseRow } from "@/components/ExerciseRow";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProgramDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { currentProgram, isLoading } = useProgram();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (isLoading || !currentProgram) return <LoadingScreen />;

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <H1 style={styles.title}>{currentProgram.name}</H1>
        </View>

        <Caption style={styles.subtitle}>
          Week {currentProgram.week_number} — {currentProgram.description}
        </Caption>

        {currentProgram.days.map((day, index) => (
          <Animated.View
            key={day.day_number}
            entering={FadeInDown.duration(400).delay(index * 80)}
          >
            <Card style={styles.dayCard}>
              <Pressable
                style={styles.dayHeader}
                onPress={() => setExpandedDay(expandedDay === day.day_number ? null : day.day_number)}
              >
                <View>
                  <H2 style={styles.dayName}>Day {day.day_number}</H2>
                  <Body style={styles.dayFocus}>{day.name} — {day.focus}</Body>
                </View>
                <Ionicons
                  name={expandedDay === day.day_number ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>

              {expandedDay === day.day_number && (
                <View style={styles.exerciseList}>
                  {day.exercises.map((ex) => (
                    <ExerciseRow
                      key={ex.id}
                      name={ex.name}
                      sets={ex.sets}
                      reps={ex.reps}
                    />
                  ))}
                </View>
              )}
            </Card>
          </Animated.View>
        ))}
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
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  dayCard: {
    marginBottom: Spacing.md,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayName: {
    fontSize: 18,
  },
  dayFocus: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  exerciseList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
});
