import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { RootNavigator } from "@/navigation";
import { useAuth } from "@/hooks";
import { useUser } from "@/hooks";

export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isOnboarded, isLoading: userLoading } = useUser();

  const isBootstrapping = authLoading || (isAuthenticated && userLoading);

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <RootNavigator
          isBootstrapping={isBootstrapping}
          isAuthenticated={isAuthenticated}
          isOnboarded={isOnboarded}
        />
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
