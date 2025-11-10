import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LevelScreen from "./Screens/LevelScreen";
import GameScreen from "./Screens/GameScreen";
import * as NavigationBar from "expo-navigation-bar";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // 🔹 Oculta completamente la barra de navegación del sistema (Android)
    NavigationBar.setVisibilityAsync("hidden");
    // 🔹 Permite mostrarla deslizando
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Levels" component={LevelScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
