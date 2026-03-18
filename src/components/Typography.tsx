import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { Typography as TypographyStyles } from "@/constants/Typography";

interface TypoProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function H1({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.h1, style]} {...props}>
      {children}
    </Text>
  );
}

export function H2({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.h2, style]} {...props}>
      {children}
    </Text>
  );
}

export function H3({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.h3, style]} {...props}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodySmall({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.bodySmall, style]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.caption, style]} {...props}>
      {children}
    </Text>
  );
}

export function Label({ children, style, ...props }: TypoProps) {
  return (
    <Text style={[TypographyStyles.label, style]} {...props}>
      {children}
    </Text>
  );
}
