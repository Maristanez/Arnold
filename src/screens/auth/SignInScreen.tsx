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

type Nav = NativeStackNavigationProp<AuthStackParamList, "SignIn">;

export function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) return;
    await signIn(email.trim(), password);
  };

  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <H1 style={styles.title}>Welcome back</H1>
          <Body style={styles.subtitle}>Sign in to continue your training</Body>
        </Animated.View>

        {error && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <ErrorBanner message={error} />
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
            placeholder="Enter your password"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>

        <Animated.View style={styles.actions} entering={FadeInDown.duration(500).delay(300)}>
          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={!email.trim() || !password.trim()}
          />
          <Pressable
            style={styles.link}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
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
