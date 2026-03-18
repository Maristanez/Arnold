import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

function Dot({ status }: { status: "complete" | "current" | "upcoming" }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(status === "current" ? 1.2 : 1, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
    opacity: withSpring(status === "upcoming" ? 0.4 : 1, {
      damping: 15,
      stiffness: 150,
    }),
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        status === "complete" && styles.dotComplete,
        status === "current" && styles.dotCurrent,
        status === "upcoming" && styles.dotUpcoming,
        animatedStyle,
      ]}
    />
  );
}

export function OnboardingProgress({
  currentStep,
  totalSteps = 5,
}: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        let status: "complete" | "current" | "upcoming";
        if (step < currentStep) {
          status = "complete";
        } else if (step === currentStep) {
          status = "current";
        } else {
          status = "upcoming";
        }
        return <Dot key={step} status={status} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotComplete: {
    backgroundColor: Colors.brand,
  },
  dotCurrent: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.brand,
  },
  dotUpcoming: {
    backgroundColor: Colors.textTertiary,
  },
});
