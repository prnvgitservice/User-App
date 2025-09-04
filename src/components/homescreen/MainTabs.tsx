import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import MyBookingScreen from './MyBookingScreen';
import CategoryScreen from './CategoryScreen';
import TechProfile from './ProfileScreen';
import SearchScreen from './SearchScreen';
import UserProfile from './UserProfile';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="SearchScreen" component={SearchScreen} />
      <HomeStack.Screen name="TechProfile" component={TechProfile} />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#a259ff',
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🗂️</Text>,
        }}
      />
      <Tab.Screen
        name="MyBooking"
        component={MyBookingScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
} 