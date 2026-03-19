import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, AppState } from "react-native";
import { Colors } from "@/constants/Colors";

interface WorkoutTimerProps {
  startedAt: number;
}

export function WorkoutTimer({ startedAt }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const tick = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        tick();
      }
      appState.current = nextState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [startedAt]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return <Text style={styles.timer}>{display}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
});
