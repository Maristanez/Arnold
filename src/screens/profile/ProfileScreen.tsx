import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@/hooks";
import { ScreenContainer, Button, H1, Body, Caption, Card } from "@/components";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

export function ProfileScreen() {
  const { signOut, isLoading } = useAuth();
  const { profile } = useUser();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(500).delay(100)}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={Colors.textSecondary} />
          </View>
          <H1 style={styles.email}>{profile?.email ?? "—"}</H1>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Caption>Fitness Identity</Caption>
              <Body style={styles.infoValue}>
                {profile?.fitness_identity ?? "—"}
              </Body>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Caption>Experience</Caption>
              <Body style={styles.infoValue}>
                {profile?.experience_level ?? "—"}
              </Body>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Caption>Training Days</Caption>
              <Body style={styles.infoValue}>
                {profile?.days_per_week ?? "—"} days/week
              </Body>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Caption>Member Since</Caption>
              <Body style={styles.infoValue}>{memberSince}</Body>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={styles.footer} entering={FadeInDown.duration(500).delay(300)}>
          <Button
            title="Sign Out"
            variant="secondary"
            onPress={signOut}
            loading={isLoading}
            style={styles.signOutButton}
          />
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.base,
  },
  email: {
    fontSize: 20,
    textAlign: "center",
  },
  infoCard: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  infoValue: {
    color: Colors.textPrimary,
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceLight,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  signOutButton: {
    borderColor: Colors.error,
  },
});
