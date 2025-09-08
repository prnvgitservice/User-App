import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import "./global.css"

export default function App() {
  return (
      <AppNavigator />
); 
}


// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import OnboardingScreen from './components/homescreen/OnboardingScreen';
// import LoginScreen from './components/auth/LoginScreen';
// import MainTabs from './components/homescreen/MainTabs';
// import CalendarScreen from './components/homescreen/CalendarScreen';
// import RegisterScreen from './components/auth/RegisterScreen';
// import ProfileScreen from './components/homescreen/ProfileScreen';
// import TechnicianProfile from './components/homescreen/TechnicianProfile';
// import BookingDetails from './components/homescreen/BookingDetails';
// import BuyProductScreen from './components/homescreen/BuyProductScreen';

// const Stack = createNativeStackNavigator();
// import "./global.css"

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Onboarding">
//         <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
//         <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
//         <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="BuyProduct" component={BuyProductScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="BookingDetails" component={BookingDetails} options={{ headerShown: false }} />
//         <Stack.Screen name="TechnicianProfile" component={TechnicianProfile} options={{ headerShown: false }} />
//         <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
