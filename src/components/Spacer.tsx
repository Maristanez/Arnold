import React from "react";
import { View } from "react-native";

interface SpacerProps {
  height?: number;
  width?: number;
}

export function Spacer({ height = 0, width = 0 }: SpacerProps) {
  return <View style={{ height, width }} />;
}
