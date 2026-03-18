import React, { useRef } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

interface SelectionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function SelectionCard({
  title,
  subtitle,
  icon,
  selected = false,
  disabled = false,
  onPress,
  style,
}: SelectionCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.card,
          selected && styles.cardSelected,
          disabled && styles.cardDisabled,
          style,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[styles.title, selected && styles.titleSelected]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  cardSelected: {
    borderColor: Colors.brand,
    backgroundColor: "rgba(76, 175, 80, 0.08)",
  },
  cardDisabled: {
    opacity: 0.4,
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  titleSelected: {
    color: Colors.brand,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
});
