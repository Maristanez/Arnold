import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store";
import { sessionService } from "@/services";
import { Session } from "@/types";
import { ScreenContainer, H1, Body, Caption, Card, LoadingScreen } from "@/components";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

export function WorkoutHistoryScreen() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const result = await sessionService.getSessionHistory(userId);
      if (result.data) setSessions(result.data);
      setIsLoading(false);
    })();
  }, [userId]);

  if (isLoading) return <LoadingScreen />;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <H1 style={styles.title}>Workout History</H1>

        {sessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="fitness-outline" size={48} color={Colors.textTertiary} />
            <Body style={styles.emptyText}>No workouts yet</Body>
            <Caption>Complete your first workout to see it here</Caption>
          </Card>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
                <Card style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View>
                      <Text style={styles.sessionDay}>{item.day_name}</Text>
                      <Caption>{formatDate(item.started_at)}</Caption>
                    </View>
                    <View style={styles.sessionMeta}>
                      <Text style={styles.duration}>{formatDuration(item.duration_seconds)}</Text>
                      {item.ai_assessment && (
                        <View style={styles.assessmentBadge}>
                          <Text style={styles.assessmentText}>{item.ai_assessment}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              </Animated.View>
            )}
          />
        )}
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
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  sessionCard: {
    marginBottom: Spacing.md,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionDay: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  sessionMeta: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  duration: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  assessmentBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  assessmentText: {
    ...Typography.caption,
    color: Colors.brand,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
