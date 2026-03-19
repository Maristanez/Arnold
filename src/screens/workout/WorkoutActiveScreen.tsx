import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RootStackParamList } from "@/types";
import { useWorkout } from "@/hooks";
import { ScreenContainer, Button, H2, Caption, LoadingScreen, ErrorBanner } from "@/components";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList, "WorkoutActive">;
type Route = RouteProp<RootStackParamList, "WorkoutActive">;

export function WorkoutActiveScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { dayNumber } = route.params;
  const {
    activeSession,
    exercises,
    startedAt,
    isLoading,
    error,
    startWorkout,
    logSet,
    completeExercise,
    completeWorkout,
  } = useWorkout();

  useEffect(() => {
    if (!activeSession) {
      startWorkout(dayNumber);
    }
  }, []);

  const handleComplete = () => {
    Alert.alert(
      "Complete Workout",
      "Finish this workout and get AI feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: async () => {
            const result = await completeWorkout();
            if (result.data) {
              navigation.replace("WorkoutCheckIn", { sessionId: result.data.id });
            }
          },
        },
      ]
    );
  };

  if (isLoading && !activeSession) return <LoadingScreen />;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Animated.View style={styles.timerSection} entering={FadeInDown.duration(400)}>
          {startedAt && <WorkoutTimer startedAt={startedAt} />}
          <Caption style={styles.dayLabel}>
            {activeSession?.day_name ?? `Day ${dayNumber}`}
          </Caption>
        </Animated.View>

        {error && <ErrorBanner message={error} />}

        <ScrollView
          style={styles.exerciseList}
          contentContainerStyle={styles.exerciseContent}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((exercise, index) => (
            <Animated.View
              key={exercise.exercise_id}
              entering={FadeInDown.duration(400).delay(index * 60)}
            >
              <ExerciseCard
                exercise={exercise}
                onLogSet={(setNum, weight, reps) =>
                  logSet(exercise.exercise_id, setNum, weight, reps)
                }
                onComplete={() => completeExercise(exercise.exercise_id)}
              />
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Complete Workout"
            onPress={handleComplete}
            loading={isLoading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerSection: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  dayLabel: {
    marginTop: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseContent: {
    padding: Spacing.base,
  },
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
  },
});
