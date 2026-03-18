import React from "react";
import { View, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  scroll = false,
  padding = true,
  style,
}: ScreenContainerProps) {
  const content = (
    <View style={[styles.content, padding && styles.padding, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: Spacing.base,
  },
});
