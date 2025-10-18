import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// import HomeScreen from "../screens/HomeScreen";
import CategoriesPage from "../components/homescreen/CategoryScreen";
import CartScreen from "../screens/CartScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../components/auth/LoginScreen";
import RegisterScreen from "../components/auth/RegisterScreen";
import TechnicianProfile from "../screens/TechnicianProfile";
import BlogDetailPage from "../components/blog/BlogDetail";
import TechniciansScreen from "../screens/TechniciansScreen";
import AllBlogs from "../components/blog/AllBlogs";
import SearchFilterScreen from "../screens/SearchFilterScreen";
// import TransactionPageScreen from "../screens/TransactionScreen";
import ProfileScreen from "../components/homescreen/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GuestBooking from "../components/homescreen/GuestBooking";
import AboutUs from "../components/profile/AboutPageScreen";
import ContactUs from "../components/profile/ContactUsScreen";
import KeyFeaturesScreen from "../components/profile/KeyFeaturesScreen";
import FAQ from "../components/profile/FAQScreen";
import ProfessionalAgreementScreen from "../components/profile/ProfessionalAgreementScreen";
import RefundPolicyScreen from "../components/profile/RefundPolicyScreen";
import PrivacyPolicyScreen from "../components/profile/PrivacyPolicyScreen";
import TermsConditionsScreen from "../components/profile/TermsConditionsScreen";
import CompanyReviewScreen from "../components/profile/CompanyReviewScreen";
import ProfileEditPage from "../components/profile/EditProfile";
import HomeScreen from "../screens/HomeScreen";
import TransactionPageScreen from "../screens/TransactionScreen.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
// import TransactionPageScreen from "../screens/TransactionScreen.tsx";

// Root Stack Params
export type RootStackParamList = {
  OnBoarding: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Profile: undefined;
  BlogDetail: { blog: Blog };
  AllBlogs: undefined;
  Technicians: { category?: Category ,categoryId?: string};
  TechnicianProfile: { technicianId: string };
  GuestBook?: undefined;
  Category?: undefined;
  Blog?: { id: string };
  Reviews?: undefined;
  AboutUs?: undefined;
  ContactUs?: undefined;
  KeyFeatures?: undefined;
  Cart?: undefined;
  Transactions?: undefined;
  FAQ?: undefined;
  ProfessionalAgreement?: undefined;
  RefundPolicy?: undefined;
  PrivacyPolicy?: undefined;
  TermsConditions?: undefined;
  CompanyReview?: undefined;
  EditProfile?: undefined;
  SearchFilter?: {};
  PAG?: undefined; // Professional Agreement
};

export interface Blog {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status?: number;
}

// Tab Params (for MainTabs)
export type TabParamList = {
  Home: undefined;
  Category: undefined;
  Cart: undefined;
  Transactions: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// MainTabs (unchanged, but typed Tab)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Category") iconName = "list";
          else if (route.name === "Cart") iconName = "cart";
          else if (route.name === "Transactions") iconName = "receipt";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Category"
        component={CategoriesPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionPageScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// AppNavigator
function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return <SafeAreaView className="flex-1 bg-white" />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? "Main" : "OnBoarding"}
      screenOptions={{
        headerShown: false, // Disable header for all stack screens
      }}
    >
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Transactions" component={TransactionPageScreen} />
      <Stack.Screen name="Category" component={CategoriesPage} />
      <Stack.Screen name="Signup" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailPage}
        options={({ route }) => ({
          title: (route.params as { blog?: Blog })?.blog?.title || "Blog",
        })}
      />
      <Stack.Screen name="AllBlogs" component={AllBlogs} />
      <Stack.Screen name="GuestBook" component={GuestBooking} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="EditProfile" component={ProfileEditPage} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="KeyFeatures" component={KeyFeaturesScreen} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="PAG" component={ProfessionalAgreementScreen} />
      <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="CompanyReview" component={CompanyReviewScreen} />

      <Stack.Screen
        name="Technicians"
        component={TechniciansScreen}
        options={({ route }) => ({
          title:
            (route.params as { categoryId: string } | undefined)?.categoryId ||
            "Technicians",
        })}
      />
      <Stack.Screen
        name="TechnicianProfile"
        component={TechnicianProfile}
        options={({ route }) => ({
          title: (route.params as { technicianId: string } | undefined)
            ?.technicianId
            ? `Profile`
            : "TechnicianProfile",
        })}
      />
      
      <Stack.Screen
        name="SearchFilter"
        component={SearchFilterScreen}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";
// import HomeScreen from "../screens/HomeScreen";
// import CategoryScreen from "../components/homescreen/CategoryScreen";
// import OnboardingScreen from "../components/homescreen/OnboardingScreen";
// import LoginScreen from "../components/auth/LoginScreen";
// import RegisterScreen from "../components/auth/RegisterScreen";
// import ProfileScreen from "../components/homescreen/ProfileScreen";
// import TechniciansScreen from "../screens/TechniciansScreen";
// import TechnicianProfile from "../screens/TechnicianProfile";
// import CartScreen from "../screens/CartScreen";
// import BlogDetailPage from "../components/blog/BlogDetail";
// import AllBlogs from "../components/blog/AllBlogs";
// import { NavigationContainer } from "@react-navigation/native";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// export type RootStackParamList = {
//   Onboarding: undefined;
//   Login: undefined;
//   Signup: undefined;
//   Main: undefined;
//   Profile: undefined;
//   BlogDetail: { blog: Blog };  // Add Blog interface here if not already defined
//   AllBlogs: undefined;
//   Technicians: { category?: { category_name: string } };
//   TechnicianProfile: { technicianId: string };
//   // Add others like GuestBook if used elsewhere
//   GuestBook?: undefined;
//   Category?: undefined;
//   Blog?: { id: string };  // If you rename the route, update this
//   Reviews?: undefined;
// };

// // Export Blog interface if needed globally
// export interface Blog {
//   _id: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // For Category if used
// export interface Category {
//   category_name: string;
// }

// // Bottom Tabs Navigator (for main app after login/signup)
// function MainTabs({ navigation }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Home") iconName = "home";
//           else if (route.name === "Category") iconName = "list";
//           else if (route.name === "Cart") iconName = "cart";
//           else if (route.name === "Transactions") iconName = "receipt";
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Category"
//         component={CategoryScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Cart"
//         component={CartScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Transactions"
//         component={CategoryScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Main Stack Navigator (auth flow + main tabs)
// function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Onboarding"
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Signup" component={RegisterScreen} />
//         <Stack.Screen name="Main" component={MainTabs} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="BlogDetail" component={BlogDetailPage}
//         options={({ route }) => ({
//             title:
//               (route.params as { blog?: Blog })?.blog
//                 ?._id || "Blog",
//           })}
//         />
//         <Stack.Screen name="AllBlogs" component={AllBlogs} />
//         <Stack.Screen
//           name="Technicians"
//           component={TechniciansScreen}
//           options={({ route }) => ({
//             title:
//               (route.params as { category?: Category })?.category
//                 ?.category_name || "Technicians",
//           })}
//         />
//         <Stack.Screen
//           name="TechnicianProfile"
//           component={TechnicianProfile}
//           options={({ route }) => ({
//             title: (route.params as { technicianId: string })?.technicianId
//               ? `Profile`
//               : "TechnicianProfile",
//           })}
//         />

//         {/* Add more stacks for profile options if needed */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default AppNavigator;
