import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import BloqueScreen from './src/screens/BloqueScreen';
import PracticaScreen from './src/screens/PracticaScreen';
import MisPalabrasScreen from './src/screens/MisPalabrasScreen';
import IAScreen from './src/screens/IAScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { colors } from './src/theme';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen}/>
      <Stack.Screen name="Bloque" component={BloqueScreen}/>
      <Stack.Screen name="Practica" component={PracticaScreen}/>
      <Stack.Screen name="MisPalabras" component={MisPalabrasScreen}/>
      <Stack.Screen name="IA" component={IAScreen}/>
    </Stack.Navigator>
  );
}
export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  if (!onboardingDone) {
    return <OnboardingScreen onDone={() => setOnboardingDone(true)} />;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: { borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: "white", paddingBottom: 6, paddingTop: 4, height: 58 },
          tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
          tabBarIcon: ({ focused }) => {
            const icons = { Home:"🏠", Today:"📅", AI:"✨", Words:"✏️" };
            return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ title: "Home" }}/>
        <Tab.Screen name="Today" component={BloqueScreen} options={{ title: "Today" }}/>
        <Tab.Screen name="AI" component={IAScreen} options={{ title: "AI" }}/>
        <Tab.Screen name="Words" component={MisPalabrasScreen} options={{ title: "My Words" }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
