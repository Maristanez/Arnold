import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types";
import { ScreenContainer, Button, H1, H2, Body, Caption, Card } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<RootStackParamList, "WorkoutCheckIn">;

export function WorkoutCheckInScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={styles.iconWrapper} entering={FadeInUp.duration(600).delay(200)}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color={Colors.textPrimary} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)}>
            <H1 style={styles.title}>Workout Complete!</H1>
            <Body style={styles.subtitle}>
              Great work! Your session has been saved and your AI coach is analyzing your performance.
            </Body>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(600)}>
            <Card style={styles.feedbackCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Ionicons name="sparkles" size={16} color={Colors.brand} />
                  <Caption style={styles.badgeText}>AI Feedback</Caption>
                </View>
              </View>
              <Body style={styles.feedbackText}>
                Your workout data is being processed. Check back on your next session for personalized adjustments.
              </Body>
            </Card>
          </Animated.View>
        </View>

        <Animated.View style={styles.footer} entering={FadeInDown.duration(500).delay(800)}>
          <Button
            title="Back to Home"
            onPress={() => navigation.navigate("Main")}
          />
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  iconWrapper: {
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  feedbackCard: {
    width: "100%",
  },
  badgeRow: {
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.brand,
    fontWeight: "600",
  },
  feedbackText: {
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    padding: Spacing.base,
  },
});
