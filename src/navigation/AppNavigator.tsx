import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../components/homescreen/HomeScreen';
import CategoryScreen from '../components/homescreen/CategoryScreen';
import OnboardingScreen from '../components/homescreen/OnboardingScreen';
import LoginScreen from '../components/auth/LoginScreen';
import RegisterScreen from '../components/auth/RegisterScreen';
import ProfileScreen from '../components/homescreen/ProfileScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs Navigator (for main app after login/signup)
function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Category') iconName = 'list';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Transactions') iconName = 'receipt';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Transactions" component={CategoryScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator (auth flow + main tabs)
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        {/* Add more stacks for profile options if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;