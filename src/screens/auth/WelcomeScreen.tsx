import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { AuthStackParamList } from "@/types";
import { ScreenContainer, Button, H1, Body } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Welcome">;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <H1 style={styles.wordmark}>ARNOLD</H1>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(600).delay(400)}>
            <Body style={styles.tagline}>
              AI-powered fitness programming{"\n"}built for your goals.
            </Body>
          </Animated.View>
        </View>

        <Animated.View
          style={styles.actions}
          entering={FadeInDown.duration(600).delay(600)}
        >
          <Button
            title="Create Account"
            onPress={() => navigation.navigate("SignUp")}
          />
          <View style={styles.spacer} />
          <Button
            title="Sign In"
            variant="secondary"
            onPress={() => navigation.navigate("SignIn")}
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
    paddingVertical: Spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.base,
  },
  wordmark: {
    fontSize: 48,
    letterSpacing: 12,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  actions: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  spacer: {
    height: Spacing.md,
  },
});
