import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AuthStackParamList } from "@/types";
import { useAuth } from "@/hooks";
import { ScreenContainer, Button, Input, H1, Body, ErrorBanner } from "@/components";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Nav = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

export function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    await signUp(email.trim(), password);
  };

  const displayError = localError || error;

  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Create Account</H1>
          <Body style={styles.subtitle}>Start your personalized fitness journey</Body>
        </Animated.View>

        {displayError && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <ErrorBanner message={displayError} />
          </Animated.View>
        )}

        <Animated.View style={styles.form} entering={FadeInDown.duration(500).delay(200)}>
          <Input
            label="Email"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.fieldSpacer} />
          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.fieldSpacer} />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </Animated.View>

        <Animated.View style={styles.actions} entering={FadeInDown.duration(500).delay(300)}>
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={!email.trim() || !password.trim() || !confirmPassword.trim()}
          />
          <Pressable
            style={styles.link}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: Spacing.base,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  form: {
    marginTop: Spacing.lg,
  },
  fieldSpacer: {
    height: Spacing.base,
  },
  actions: {
    marginTop: Spacing.xl,
  },
  link: {
    alignItems: "center",
    paddingVertical: Spacing.base,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkBold: {
    color: Colors.brand,
    fontWeight: "600",
  },
});
