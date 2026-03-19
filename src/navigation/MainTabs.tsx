import React from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabParamList, RootStackParamList } from "@/types";
import { Colors } from "@/constants/Colors";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { WorkoutHistoryScreen } from "@/screens/workout/WorkoutHistoryScreen";
import { NutritionDashboardScreen } from "@/screens/nutrition/NutritionDashboardScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<TabParamList>();

function FABButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={fabStyles.container}>
      <Animated.View style={[fabStyles.wrapper, { transform: [{ scale }] }]}>
        <Pressable
          style={fabStyles.button}
          onPress={() => navigation.navigate("WorkoutActive", { dayNumber: 1 })}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Ionicons name="barbell" size={28} color={Colors.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const fabStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  wrapper: {
    width: 56,
    height: 56,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceLight,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Workout") iconName = "fitness";
          else if (route.name === "NutritionTab") iconName = "nutrition";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Workout"
        component={WorkoutHistoryScreen}
        options={{ tabBarLabel: "Workout" }}
      />
      <Tab.Screen
        name="NutritionTab"
        component={NutritionDashboardScreen}
        options={{ tabBarLabel: "Nutrition" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
