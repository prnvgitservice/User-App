import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrendingSection from "../components/homescreen/TrendingSection";
import PopularSearchesSection from "../components/homescreen/PopularSearchesSection";
import BlogList from "../components/homescreen/BlogList";
// import CategoriesGrid from "../components/homescreen/CategoryGrid";
import CustomerReviews from "../components/homescreen/CustomerReviews";
import BannerCarousel from "../components/homescreen/BannerCarousel";
import SearchBarSection from "../components/homescreen/SearchBarSection";
import CategoriesGrid from "../components/homescreen/CategoryGrid";

// Define navigation param list
type RootStackParamList = {
  Login: undefined;
  GuestBook: undefined;
  Category: undefined;
  Blog: { blog: [] };
  Reviews: undefined;
  Profile: undefined; // Added Profile to the param list
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoginedIn, setIsLoginedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a data fetch or re-render trigger
    setTimeout(() => {
      setRefreshKey((prevKey) => prevKey + 1);
      setRefreshing(false); // Stop the refresh animation
    }, 1000); // Simulate a delay for refresh (adjust as needed)
  };

  useEffect(() => {
    const loginConform = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setIsLoginedIn(true);
        } else {
          setIsLoginedIn(false);
        }
      } catch (err) {
        Alert.alert("Error", String(err));
      }
    };

    loginConform();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#a259ff", "blue"]} // Customize refresh spinner colors
            tintColor="#a259ff" // iOS spinner color
          />
        }
      >
        {/* Header with Logo and Auth Options */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-4">
          <View className="bg-blue-900 rounded px-1 py-1 self-center">
            <Image
              source={require("../../assets/prnv_logo.jpg")}
              className="h-10 w-52"
              resizeMode="contain"
            />
          </View>
          <View className="space-x-1">
            {isLoginedIn ? (
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color="#a259ff"
                />
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("GuestBook")}>
                  <Text className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                    Guest
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View>
          <BannerCarousel />
          <SearchBarSection />
          <CategoriesGrid />
          <TrendingSection />
          <PopularSearchesSection />
          <BlogList />
          <CustomerReviews />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import TrendingSection from "../components/homescreen/TrendingSection";
// import PopularSearchesSection from "../components/homescreen/PopularSearchesSection";
// import BlogList from "../components/homescreen/BlogList";
// import CategoriesGrid from "../components/homescreen/CategoryGrid";
// import CustomerReviews from "../components/homescreen/CustomerReviews";
// import BannerCarousel from "../components/homescreen/BannerCarousel";
// import SearchBarSection from "../components/homescreen/SearchBarSection";

// // Define navigation param list
// type RootStackParamList = {
//   Login: undefined;
//   GuestBook: undefined;
//   Category: undefined;
//   Blog: { blog: [] };
//   Reviews: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [isLoginedIn, setIsLoginedIn] = useState(false); // Replace with actual auth state

//   useEffect(() => {
//     const loginConform = async () => {
//       try {
//         const user = await AsyncStorage.getItem("user");
//         if (user) {
//           setIsLoginedIn(true);
//         } else {
//           setIsLoginedIn(false);
//         }
//       } catch (err) {
//         Alert.alert(err);
//       }
//     };

//     loginConform();
//   }, []);

//   return (
//     <>
//       <View className="flex-1 bg-white">
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {/* Header with Logo and Auth Options */}
//           <View className="flex-row justify-between items-center px-5 pt-4 pb-4">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center">
//               <Image
//                 source={require("../../assets/prnv_logo.jpg")}
//                 className="h-10 w-52"
//                 resizeMode="contain"
//               />
//             </View>
//             <View className="space-x-1">
//               {isLoginedIn ? (
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("Profile")}
//                 >
//                   <Ionicons
//                     name="person-circle-outline"
//                     size={38}
//                     color="#a259ff"
//                   />
//                 </TouchableOpacity>
//               ) : (
//                 <View className="flex-row space-x-2 gap-2">
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate("Login")}
//                   >
//                     <Text className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
//                       Login
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate("GuestBook")}
//                   >
//                     <Text className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Guest</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>


//           <View>
//             <BannerCarousel />

//             <SearchBarSection />

//             <CategoriesGrid />

//             <TrendingSection />

//             <PopularSearchesSection />

//             <BlogList />

//             <CustomerReviews/>
//           </View>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// export default HomeScreen;
{/* <View className="h-2 bg-gray-100 mb-4" />

<Text className="text-center text-gray-600 mb-4">
  Most Popular Categories
</Text>
<View className="px-5 mb-5">
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {categories.map((cat, idx) => (
      <TouchableOpacity
        key={idx}
        className="bg-gray-100 p-3 rounded-lg mr-2"
        onPress={() => navigation.navigate("Category")}
      >
        <Text className="text-center text-gray-900">{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View> */}

{ /* <View className="h-2 bg-gray-100 mb-4" />

{/* <Text className="text-center text-gray-600 mb-4">
  Most Popular Categories
</Text>
<View className="px-5 mb-5">
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {categories.map((cat, idx) => (
      <TouchableOpacity
        key={idx}
        className="bg-gray-100 p-3 rounded-lg mr-2"
        onPress={() => navigation.navigate("Category")}
      >
        <Text className="text-center text-gray-900">{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View> */
}

{
  /* <View className="h-2 bg-gray-100 mb-4" />
<Text className="text-center text-gray-600 mb-4">Other categories</Text>
<View className="px-5 mb-5">
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {categories.map((cat, idx) => (
      <TouchableOpacity
        key={idx}
        className="bg-gray-100 p-3 rounded-lg mr-2"
        onPress={() => navigation.navigate("Category")}
      >
        <Text className="text-center text-gray-900">{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View> */
}

{
  /* <BlogSection/> */
}

{
  /* Banners
<View className="mx-5 mb-5 bg-gray-200 h-24 rounded-2xl flex items-center justify-center">
  <Text className="text-gray-900 text-lg">Banners Placeholder</Text>
</View> */
}

{
  /* Categories
<View className="px-5 mb-5">
  <Text className="text-lg font-bold text-gray-900 mb-2">
    Categories
  </Text>
  <View className="flex-row flex-wrap justify-between">
    {categories.map((cat, idx) => (
      <TouchableOpacity
        key={idx}
        className="w-[48%] bg-gray-100 p-3 rounded-lg mb-2"
        onPress={() => navigation.navigate("Category")}
      >
        <Text className="text-center text-gray-900">{cat}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View> */
}

{
  /* <View className="px-5 mb-5">
  <Text className="text-lg font-bold text-gray-900 mb-2">
    Trending Services
  </Text>
  <View className="flex-row flex-wrap justify-between">
    {trendingServices.map((service, idx) => (
      <View
        key={idx}
        className="w-[30%] bg-gray-100 p-2 rounded-lg mb-2"
      >
        <Text className="text-center text-gray-900 text-sm">
          {service}
        </Text>
      </View>
    ))}
  </View>
</View> */
}

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";

// // Define navigation param list
// type RootStackParamList = {
//   SearchScreen: { id: number };
//   Category: undefined;
//   MainTabs: { screen: string; params?: { screen: string } };
//   TechProfile: undefined;
// };

// // Define navigation prop type
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // Data
// const offerImages = [
//   "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=600",
//   "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&w=600",
//   "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=600",
// ];

// const serviceIcons = [
//   "https://img.icons8.com/color/96/000000/broom.png",
//   "https://img.icons8.com/color/96/000000/maintenance.png",
//   "https://img.icons8.com/color/96/000000/paint-brush.png",
//   "https://img.icons8.com/color/96/000000/washing-machine.png",
//   "https://img.icons8.com/?size=64&id=RjFNU63A1OeB&format=png",
//   "https://img.icons8.com/?size=80&id=vmPNvJ0De3an&format=png",
//   "https://img.icons8.com/?size=80&id=CWh28Ph9219F&format=png",
//   "https://img.icons8.com/color/96/000000/more.png",
// ];

// const serviceNames = [
//   "Cleaning",
//   "Repairing",
//   "Painting",
//   "Laundry",
//   "Appliance",
//   "Plumbing",
//   "Shifting",
//   "More",
// ];

// const popularServices = [
//   {
//     name: "House Cleaning",
//     price: 25,
//     image:
//       "https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600",
//     user: "Kylee Danford",
//     rating: 4.8,
//     reviews: 8289,
//     type: "Cleaning",
//   },
//   {
//     name: "Floor Cleaning",
//     price: 20,
//     image:
//       "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600",
//     user: "Alfonso Schuessler",
//     rating: 4.9,
//     reviews: 6182,
//     type: "Cleaning",
//   },
//   {
//     name: "Washing Clothes",
//     price: 22,
//     image:
//       "https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600",
//     user: "Sanjuanita Ordonez",
//     rating: 4.7,
//     reviews: 7938,
//     type: "Laundry",
//   },
//   {
//     name: "Bathroom Cleaning",
//     price: 24,
//     image:
//       "https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600",
//     user: "Freida Varnes",
//     rating: 4.9,
//     reviews: 6182,
//     type: "Cleaning",
//   },
//   {
//     name: "Painting Room",
//     price: 30,
//     image:
//       "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600",
//     user: "Alex Painter",
//     rating: 4.6,
//     reviews: 5123,
//     type: "Painting",
//   },
// ];

// const categoriessearch = [
//   { id: 1, name: "Cleaning" },
//   { id: 2, name: "Plumbing" },
//   { id: 3, name: "Electrician" },
//   { id: 4, name: "Gardening" },
//   { id: 5, name: "Babysitting" },
//   { id: 6, name: "Car Repair" },
//   { id: 7, name: "Laundry" },
//   { id: 8, name: "Cooking" },
//   { id: 9, name: "Repairing" },
//   { id: 10, name: "Painting" },
// ];

// const categories = ["All", ...categoriessearch.map((c) => c.name)];

// const screenWidth = Dimensions.get("window").width;

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [offerIndex, setOfferIndex] = useState<number>(0);
//   const [query, setQuery] = useState<string>("");
//   const [filteredCategories, setFilteredCategories] = useState<
//     { id: number; name: string }[]
//   >([]);
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);
//   const [selectedCategoryObj, setSelectedCategoryObj] = useState<{
//     id: number;
//     name: string;
//   } | null>(null);
//   const [selectedFilter, setSelectedFilter] = useState<string>("All");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOfferIndex((prev) => (prev + 1) % offerImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const filteredServices =
//     selectedFilter === "All"
//       ? popularServices
//       : popularServices.filter((s) => s.type === selectedFilter);

//   const handleChange = (text: string) => {
//     setQuery(text);
//     if (text.length > 0) {
//       const filtered = categoriessearch.filter((cat) =>
//         cat.name.toLowerCase().startsWith(text.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//       setShowDropdown(true);
//     } else {
//       setShowDropdown(false);
//       setFilteredCategories([]);
//     }
//   };

//   const handleSelect = (item: { id: number; name: string }) => {
//     setQuery(item.name);
//     setSelectedCategoryObj(item);
//     setShowDropdown(false);
//   };

//   const handleSearch = () => {
//     if (selectedCategoryObj) {
//       navigation.navigate("SearchScreen", { id: selectedCategoryObj.id });
//     } else {
//       alert("Please select a category from the suggestions.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             <Image
//               source={require("../../../assets/prnv_logo.jpg")} // Ensure this path is correct
//               // style={styles.logo}
//               className="w-[220px] h-[38px] p-4"
//             />
//           </View>
//           <Ionicons name="person-circle-outline" size={50} color="#a259ff" />
//         </View>

//         {/* Search Box */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search category (e.g. Cleaning)"
//               placeholderTextColor="#6b7280"
//               value={query}
//               onChangeText={handleChange}
//             />
//             <TouchableOpacity onPress={handleSearch}>
//               <Image
//                 source={{
//                   uri: "https://cdn-icons-png.flaticon.com/512/54/54481.png",
//                 }}
//                 style={styles.searchIcon}
//               />
//             </TouchableOpacity>
//           </View>
//           {showDropdown && filteredCategories.length > 0 && (
//             <View style={styles.dropdown}>
//               {filteredCategories.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.dropdownItem}
//                   onPress={() => handleSelect(item)}
//                 >
//                   <Text style={styles.dropdownText}>{item.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Special Offers Carousel */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Special Offers</Text>
//         </View>
//         <View style={styles.carouselContainer}>
//           <Image
//             source={{ uri: offerImages[offerIndex] }}
//             style={styles.carouselImage}
//             resizeMode="cover"
//           />
//           <View style={styles.carouselOverlay} />
//           <View style={styles.carouselTextContainer}>
//             <Text style={styles.carouselDiscount}>30%</Text>
//             <Text style={styles.carouselTitle}>Today's Special!</Text>
//             <Text style={styles.carouselSubtitle}>
//               Get discount for every order, only valid for today
//             </Text>
//           </View>
//           <View style={styles.carouselIndicators}>
//             {offerImages.map((_, idx) => (
//               <Text
//                 key={idx}
//                 style={[
//                   styles.carouselIndicator,
//                   offerIndex === idx
//                     ? styles.activeIndicator
//                     : styles.inactiveIndicator,
//                 ]}
//               >
//                 –
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Services */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Services</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Category")}>
//             <Text style={styles.seeAllText}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.servicesContainer}>
//           {serviceIcons.map((icon, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={styles.serviceItem}
//               onPress={() =>
//                 idx === serviceIcons.length - 1
//                   ? navigation.navigate("Category")
//                   : navigation.navigate("Category")
//               }
//             >
//               <View style={styles.serviceIconContainer}>
//                 <Image source={{ uri: icon }} style={styles.serviceIcon} />
//               </View>
//               <Text style={styles.serviceName}>{serviceNames[idx]}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Most Popular Services */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Most Popular Services</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Category")}>
//             <Text style={styles.seeAllText}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.filterContainer}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               style={[
//                 styles.filterButton,
//                 selectedFilter === cat
//                   ? styles.activeFilter
//                   : styles.inactiveFilter,
//               ]}
//               onPress={() => setSelectedFilter(cat)}
//             >
//               <Text
//                 style={
//                   selectedFilter === cat
//                     ? styles.activeFilterText
//                     : styles.inactiveFilterText
//                 }
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={styles.popularServicesContainer}>
//           {filteredServices.map((service, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={styles.serviceCard}
//               onPress={() =>
//                 navigation.navigate("MainTabs", {
//                   screen: "HomeStack",
//                   params: { screen: "TechProfile" },
//                 })
//               }
//             >
//               <Image
//                 source={{ uri: service.image }}
//                 style={styles.serviceImage}
//               />
//               <View style={styles.serviceInfo}>
//                 <Text style={styles.serviceUser}>{service.user}</Text>
//                 <Text style={styles.serviceNameText}>{service.name}</Text>
//                 <Text style={styles.servicePrice}>${service.price}</Text>
//                 <View style={styles.ratingContainer}>
//                   <Text style={styles.ratingStar}>★</Text>
//                   <Text style={styles.ratingText}>{service.rating}</Text>
//                   <Text style={styles.reviewsText}>
//                     | {service.reviews} reviews
//                   </Text>
//                 </View>
//               </View>
//               <Ionicons
//                 name="chevron-forward-circle"
//                 size={28}
//                 color="#a259ff"
//                 style={styles.serviceArrow}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 16,
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2563eb",
//     borderRadius: 24,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   logo: {
//     width: 220,
//     height: 38,
//     padding: 4,
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     height: 48,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     height: 40,
//     color: "#1f2937",
//   },
//   searchIcon: {
//     width: 24,
//     height: 24,
//     marginLeft: 8,
//   },
//   dropdown: {
//     marginTop: 4,
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 8,
//     maxHeight: 144,
//     overflow: "scroll",
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f3f4f6",
//   },
//   dropdownText: {
//     color: "#1f2937",
//     fontSize: 14,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1f2937",
//   },
//   seeAllText: {
//     color: "#a259ff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   carouselContainer: {
//     marginHorizontal: 20,
//     borderRadius: 24,
//     overflow: "hidden",
//     height: 144,
//     position: "relative",
//   },
//   carouselImage: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//   },
//   carouselOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#a259ff",
//     opacity: 0.7,
//   },
//   carouselTextContainer: {
//     position: "absolute",
//     left: 24,
//     top: 24,
//   },
//   carouselDiscount: {
//     color: "#ffffff",
//     fontSize: 30,
//     fontWeight: "bold",
//   },
//   carouselTitle: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   carouselSubtitle: {
//     color: "#ffffff",
//     fontSize: 12,
//     width: 176,
//   },
//   carouselIndicators: {
//     position: "absolute",
//     bottom: 12,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   carouselIndicator: {
//     fontSize: 24,
//     marginHorizontal: 4,
//     opacity: 0.9,
//   },
//   activeIndicator: {
//     color: "#ffffff",
//   },
//   inactiveIndicator: {
//     color: "#d1d5db",
//   },
//   servicesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginHorizontal: 4,
//     marginBottom: 20,
//   },
//   serviceItem: {
//     flexDirection: "column",
//     alignItems: "center",
//     width: "23%",
//     marginBottom: 20,
//   },
//   serviceIconContainer: {
//     backgroundColor: "#ffffff",
//     padding: 8,
//     borderRadius: 9999,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   serviceIcon: {
//     width: 48,
//     height: 48,
//   },
//   serviceName: {
//     color: "#1f2937",
//     fontSize: 12,
//     textAlign: "center",
//     marginTop: 4,
//   },
//   filterContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     marginBottom: 16,
//     overflow: "scroll",
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   activeFilter: {
//     backgroundColor: "#a259ff",
//   },
//   inactiveFilter: {
//     backgroundColor: "#f3f4f6",
//   },
//   activeFilterText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   inactiveFilterText: {
//     color: "#6b7280",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   popularServicesContainer: {
//     marginBottom: 40,
//   },
//   serviceCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     padding: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   serviceImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//   },
//   serviceInfo: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   serviceUser: {
//     color: "#6b7280",
//     fontSize: 12,
//   },
//   serviceNameText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1f2937",
//   },
//   servicePrice: {
//     color: "#a259ff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },
//   ratingStar: {
//     color: "#facc15",
//     fontSize: 16,
//   },
//   ratingText: {
//     color: "#1f2937",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginLeft: 4,
//   },
//   reviewsText: {
//     color: "#6b7280",
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   serviceArrow: {
//     marginLeft: 8,
//     alignSelf: "center",
//   },
// });

// export default HomeScreen;
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";

// // Define navigation param list
// type RootStackParamList = {
//   SearchScreen: { id: number };
//   Category: undefined;
//   MainTabs: { screen: string; params?: { screen: string } };
//   TechProfile: undefined;
// };

// // Define navigation prop type
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // Data
// const offerImages = [
//   "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=600",
//   "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&w=600",
//   "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=600",
// ];

// const serviceIcons = [
//   "https://img.icons8.com/color/96/000000/broom.png",
//   "https://img.icons8.com/color/96/000000/maintenance.png",
//   "https://img.icons8.com/color/96/000000/paint-brush.png",
//   "https://img.icons8.com/color/96/000000/washing-machine.png",
//   "https://img.icons8.com/?size=64&id=RjFNU63A1OeB&format=png",
//   "https://img.icons8.com/?size=80&id=vmPNvJ0De3an&format=png",
//   "https://img.icons8.com/?size=80&id=CWh28Ph9219F&format=png",
//   "https://img.icons8.com/color/96/000000/more.png",
// ];

// const serviceNames = [
//   "Cleaning",
//   "Repairing",
//   "Painting",
//   "Laundry",
//   "Appliance",
//   "Plumbing",
//   "Shifting",
//   "More",
// ];

// const popularServices = [
//   {
//     name: "House Cleaning",
//     price: 25,
//     image:
//       "https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600",
//     user: "Kylee Danford",
//     rating: 4.8,
//     reviews: 8289,
//     type: "Cleaning",
//   },
//   {
//     name: "Floor Cleaning",
//     price: 20,
//     image:
//       "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600",
//     user: "Alfonso Schuessler",
//     rating: 4.9,
//     reviews: 6182,
//     type: "Cleaning",
//   },
//   {
//     name: "Washing Clothes",
//     price: 22,
//     image:
//       "https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600",
//     user: "Sanjuanita Ordonez",
//     rating: 4.7,
//     reviews: 7938,
//     type: "Laundry",
//   },
//   {
//     name: "Bathroom Cleaning",
//     price: 24,
//     image:
//       "https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600",
//     user: "Freida Varnes",
//     rating: 4.9,
//     reviews: 6182,
//     type: "Cleaning",
//   },
//   {
//     name: "Painting Room",
//     price: 30,
//     image:
//       "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600",
//     user: "Alex Painter",
//     rating: 4.6,
//     reviews: 5123,
//     type: "Painting",
//   },
// ];

// const categoriessearch = [
//   { id: 1, name: "Cleaning" },
//   { id: 2, name: "Plumbing" },
//   { id: 3, name: "Electrician" },
//   { id: 4, name: "Gardening" },
//   { id: 5, name: "Babysitting" },
//   { id: 6, name: "Car Repair" },
//   { id: 7, name: "Laundry" },
//   { id: 8, name: "Cooking" },
//   { id: 9, name: "Repairing" },
//   { id: 10, name: "Painting" },
// ];

// const categories = ["All", ...categoriessearch.map((c) => c.name)];

// const screenWidth = Dimensions.get("window").width;

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [offerIndex, setOfferIndex] = useState<number>(0);
//   const [query, setQuery] = useState<string>("");
//   const [filteredCategories, setFilteredCategories] = useState<
//     { id: number; name: string }[]
//   >([]);
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);
//   const [selectedCategoryObj, setSelectedCategoryObj] = useState<{
//     id: number;
//     name: string;
//   } | null>(null);
//   const [selectedFilter, setSelectedFilter] = useState<string>("All");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOfferIndex((prev) => (prev + 1) % offerImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const filteredServices =
//     selectedFilter === "All"
//       ? popularServices
//       : popularServices.filter((s) => s.type === selectedFilter);

//   const handleChange = (text: string) => {
//     setQuery(text);
//     if (text.length > 0) {
//       const filtered = categoriessearch.filter((cat) =>
//         cat.name.toLowerCase().startsWith(text.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//       setShowDropdown(true);
//     } else {
//       setShowDropdown(false);
//       setFilteredCategories([]);
//     }
//   };

//   const handleSelect = (item: { id: number; name: string }) => {
//     setQuery(item.name);
//     setSelectedCategoryObj(item);
//     setShowDropdown(false);
//   };

//   const handleSearch = () => {
//     if (selectedCategoryObj) {
//       navigation.navigate("SearchScreen", { id: selectedCategoryObj.id });
//     } else {
//       alert("Please select a category from the suggestions.");
//     }
//   };

//   return (
//     <View className="flex-1 bg-white">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View className="flex-row justify-between items-center w-full px-5 pt-12 pb-4">
//           <View className="bg-blue-600 rounded-xl p-4">
//             <Image
//               source={require("../../../assets/prnv_logo.jpg")} // Ensure this path is correct
//               className="w-32 h-8 rounded-xl"
//             />
//           </View>
//           <Ionicons name="person-circle-outline" size={36} color="#a259ff" />
//         </View>

//         {/* Search Box */}
//         <View className="px-5 mb-5">
//           <View className="flex-row items-center bg-gray-200 rounded-xl px-4 h-12">
//             <TextInput
//               className="flex-1 text-base text-gray-700"
//               placeholder="Search category (e.g. Cleaning)"
//               placeholderTextColor="#6b7280"
//               value={query}
//               onChangeText={handleChange}
//             />
//             <TouchableOpacity onPress={handleSearch}>
//               <Image
//                 source={{
//                   uri: "https://cdn-icons-png.flaticon.com/512/54/54481.png",
//                 }}
//                 className="w-6 h-6 ml-2"
//               />
//             </TouchableOpacity>
//           </View>
//           {showDropdown && filteredCategories.length > 0 && (
//             <View className="mt-1 bg-white border border-gray-300 rounded-lg max-h-36 overflow-scroll">
//               {filteredCategories.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   className="px-3 py-2 border-b border-gray-200"
//                   onPress={() => handleSelect(item)}
//                 >
//                   <Text className="text-gray-700 text-base">{item.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Special Offers Carousel */}
//         <View className="px-5">
//           <Text className="text-xl font-bold text-gray-700 mb-2">Special Offers</Text>
//         </View>
//         <View className="mx-5 rounded-xl overflow-hidden h-36 relative">
//           <Image
//             source={{ uri: offerImages[offerIndex] }}
//             className="absolute top-0 left-0 w-full h-full"
//             resizeMode="cover"
//           />
//           <View className="absolute top-0 left-0 right-0 bottom-0 bg-purple-600 opacity-70" />
//           <View className="absolute left-6 top-6">
//             <Text className="text-white text-3xl font-bold">30%</Text>
//             <Text className="text-white text-lg font-bold">Today's Special!</Text>
//             <Text className="text-white text-xs w-44">
//               Get discount for every order, only valid for today
//             </Text>
//           </View>
//           <View className="absolute bottom-3 left-0 right-0 flex-row justify-center items-center">
//             {offerImages.map((_, idx) => (
//               <Text
//                 key={idx}
//                 className={`text-2xl mx-1 opacity-90 ${offerIndex === idx ? 'text-white' : 'text-gray-400'}`}
//               >
//                 –
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Services */}
//         <View className="px-5">
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-xl font-bold text-gray-700">Services</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Category")}>
//               <Text className="text-purple-600 text-base font-bold">See All</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View className="flex-row flex-wrap justify-between mx-1 mb-5">
//           {serviceIcons.map((icon, idx) => (
//             <TouchableOpacity
//               key={idx}
//               className="flex-col items-center w-1/4 mb-5"
//               onPress={() =>
//                 idx === serviceIcons.length - 1
//                   ? navigation.navigate("Category")
//                   : navigation.navigate("Category")
//               }
//             >
//               <View className="bg-white p-2 rounded-full shadow-md shadow-black">
//                 <Image source={{ uri: icon }} className="w-12 h-12" />
//               </View>
//               <Text className="text-gray-700 text-xs text-center mt-1">{serviceNames[idx]}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Most Popular Services */}
//         <View className="px-5">
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-xl font-bold text-gray-700">Most Popular Services</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("Category")}>
//               <Text className="text-purple-600 text-base font-bold">See All</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View className="px-5 mb-4 overflow-scroll flex-row">
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               className={`px-4 py-2 rounded-xl mr-2 ${selectedFilter === cat ? 'bg-purple-600' : 'bg-gray-200'}`}
//               onPress={() => setSelectedFilter(cat)}
//             >
//               <Text
//                 className={selectedFilter === cat ? 'text-white text-base font-bold' : 'text-gray-500 text-base font-bold'}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View className="mb-10">
//           {filteredServices.map((service, idx) => (
//             <TouchableOpacity
//               key={idx}
//               className="flex-row items-center bg-white rounded-xl mx-5 mb-4 p-3 shadow-md shadow-black"
//               onPress={() =>
//                 navigation.navigate("MainTabs", {
//                   screen: "HomeStack",
//                   params: { screen: "TechProfile" },
//                 })
//               }
//             >
//               <Image
//                 source={{ uri: service.image }}
//                 className="w-16 h-16 rounded-xl"
//               />
//               <View className="flex-1 ml-4">
//                 <Text className="text-gray-500 text-xs">{service.user}</Text>
//                 <Text className="text-gray-700 text-base font-bold">{service.name}</Text>
//                 <Text className="text-purple-600 text-base font-bold">${service.price}</Text>
//                 <View className="flex-row items-center mt-1">
//                   <Text className="text-yellow-400 text-base">★</Text>
//                   <Text className="text-gray-700 text-sm font-bold ml-1">{service.rating}</Text>
//                   <Text className="text-gray-500 text-xs ml-2">| {service.reviews} reviews</Text>
//                 </View>
//               </View>
//               <Ionicons
//                 name="chevron-forward-circle"
//                 size={28}
//                 color="#a259ff"
//                 className="ml-2 self-center"
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default HomeScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

//  // Replace with actual profile image URL
// const offerImages = [
//   'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=600',
// ];
// const screenWidth = Dimensions.get('window').width;
// const serviceIcons = [
//   'https://img.icons8.com/color/96/000000/broom.png',
//   'https://img.icons8.com/color/96/000000/maintenance.png',
//   'https://img.icons8.com/color/96/000000/paint-brush.png',
//   'https://img.icons8.com/color/96/000000/washing-machine.png',
//   'https://img.icons8.com/?size=64&id=RjFNU63A1OeB&format=png',
//   'https://img.icons8.com/?size=80&id=vmPNvJ0De3an&format=png',
//   'https://img.icons8.com/?size=80&id=CWh28Ph9219F&format=png',
//   'https://img.icons8.com/color/96/000000/more.png',
// ];
// const serviceNames = [
//   'Cleaning', 'Repairing', 'Painting', 'Laundry', 'Appliance', 'Plumbing', 'Shifting', 'More'
// ];
// const popularServices = [
//   {
//     name: 'House Cleaning',
//     price: 25,
//     image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
//     user: 'Kylee Danford',
//     rating: 4.8,
//     reviews: 8289,
//     type: 'Cleaning',
//   },
//   {
//     name: 'Floor Cleaning',
//     price: 20,
//     image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
//     user: 'Alfonso Schuessler',
//     rating: 4.9,
//     reviews: 6182,
//     type: 'Cleaning',
//   },
//   {
//     name: 'Washing Clothes',
//     price: 22,
//     image: 'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
//     user: 'Sanjuanita Ordonez',
//     rating: 4.7,
//     reviews: 7938,
//     type: 'Laundry',
//   },
//   {
//     name: 'Bathroom Cleaning',
//     price: 24,
//     image: 'https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600',
//     user: 'Freida Varnes',
//     rating: 4.9,
//     reviews: 6182,
//     type: 'Cleaning',
//   },
//   {
//     name: 'Painting Room',
//     price: 30,
//     image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600',
//     user: 'Alex Painter',
//     rating: 4.6,
//     reviews: 5123,
//     type: 'Painting',
//   },
// ];

// const categoriessearch = [
//   { id: 1, name: 'Cleaning' },
//   { id: 2, name: 'Plumbing' },
//   { id: 3, name: 'Electrician' },
//   { id: 4, name: 'Gardening' },
//   { id: 5, name: 'Babysitting' },
//   { id: 6, name: 'Car Repair' },
//   { id: 7, name: 'Laundry' },
//   { id: 8, name: 'Cooking' },
//   { id: 9, name: 'Repairing' },
//   { id: 10, name: 'Painting' },
// ];
// const categories = ['All', ...categoriessearch.map(c => c.name)];

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [offerIndex, setOfferIndex] = useState(0);
//   const [query, setQuery] = useState('');
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
//   const [selectedFilter, setSelectedFilter] = useState('All');

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOfferIndex(prev => (prev + 1) % offerImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const filteredServices = selectedFilter === 'All'
//     ? popularServices
//     : popularServices.filter(s => s.type === selectedFilter);

//   const handleChange = (text) => {
//     setQuery(text);
//     if (text.length > 0) {
//       const filtered = categoriessearch.filter((cat) =>
//         cat.name.toLowerCase().startsWith(text.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//       setShowDropdown(true);
//     } else {
//       setShowDropdown(false);
//       setFilteredCategories([]);
//     }
//   };

//   const handleSelect = (item) => {
//     setQuery(item.name);
//     setSelectedCategoryObj(item);
//     setShowDropdown(false);
//   };

//   const handleSearch = () => {
//     if (selectedCategoryObj) {
//       navigation.navigate('SearchScreen', { id: selectedCategoryObj.id });
//     } else {
//       alert('Please select a category from the suggestions.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//     <ScrollView showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={[styles.header, { marginTop: 24 }]}>
//         <Image source={require('../../assets/Prnv_logo.jpg')} className='bg-blue-600 w-full h-12 rounded-full' />

//         <Ionicons name="person-circle-outline" className='text-purple-600' size={36} color="#a259ff" />
//         {/* <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
//           <Text style={styles.greeting}>Good Morning <Text style={{ fontSize: 18 }}>👋</Text></Text>
//           <Text style={styles.userName}>Andrew Ainsley</Text>
//         </View> */}
//         {/* <TouchableOpacity>
//           <Text style={{ fontSize: 24 }}>🛎️</Text>
//         </TouchableOpacity> */}
//       </View>

//       {/* Search Box */}
//       <View>
//         <View style={styles.searchContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search category (e.g. Cleaning)"
//             value={query}
//             onChangeText={handleChange}
//           />
//           <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
//             <Image
//               source={{ uri: 'https://cdn-icons-png.flaticon.com/512/54/54481.png' }}
//               style={{ width: 24, height: 24 }}
//             />
//           </TouchableOpacity>
//         </View>

//         {showDropdown && filteredCategories.length > 0 && (
//           <View style={styles.dropdown}>
//             {filteredCategories.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.item}
//                 onPress={() => handleSelect(item)}
//               >
//                 <Text>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//         {/* Special Offers Carousel */}
//         <View style={styles.sectionRow}>
//           <Text style={styles.sectionTitle}>Special Offers</Text>
//         </View>
//         <View style={[styles.offerCard, { width: screenWidth - 40, borderRadius: 20 }]}>
//           <Image source={{ uri: offerImages[offerIndex] }} style={[styles.offerImage, { borderRadius: 0 }]} />
//           <View style={styles.offerOverlay} />
//           <View style={styles.offerContent}>
//             <Text style={styles.offerPercent}>30%</Text>
//             <Text style={styles.offerSpecial}>Today's Special!</Text>
//             <Text style={styles.offerDesc}>Get discount for every order, only valid for today</Text>
//           </View>
//           <View style={styles.carouselDots}>
//             {offerImages.map((_, idx) => (
//               <Text key={idx} style={{ color: offerIndex === idx ? '#fff' : '#ccc', fontSize: 28, marginHorizontal: 2, opacity: 0.9 }}>
//                 –
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Services */}
//         <View style={styles.sectionRow }>
//           <Text style={styles.sectionTitle}>Services</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Category')}>
//             <Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//         </View>
//         <View style={styles.servicesRow}>
//           {serviceIcons.map((icon, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={styles.serviceItem}
//               onPress={() => idx === serviceIcons.length - 1 ? navigation.navigate('Category') : navigation.navigate('Category')}
//             >
//               <Image source={{ uri: icon }} style={styles.serviceIcon} />
//               <Text style={styles.serviceName}>{serviceNames[idx]}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Most Popular Services */}
//         <View style={styles.sectionRow}>
//           <Text style={styles.sectionTitle}>Most Popular Services</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Category')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//         </View>
//         <View style={styles.categoriesRow}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               style={[styles.categoryBtn, selectedFilter === cat && styles.categoryBtnActive]}
//               onPress={() => setSelectedFilter(cat)}
//             >
//               <Text style={[styles.categoryText, selectedFilter === cat && styles.categoryTextActive]}>{cat}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={{ marginBottom: 40 }}>
//           {filteredServices.map((service, idx) => (
//             <TouchableOpacity key={idx} style={styles.popularCard} onPress={() => navigation.navigate('MainTabs', { screen: 'HomeStack', params: { screen: 'TechProfile' } })}>
//               <Image source={{ uri: service.image }} style={styles.popularImage} />
//               <View style={{ flex: 1, marginLeft: 16 }}>
//                 <Text style={styles.popularUser}>{service.user}</Text>
//                 <Text style={styles.popularTitle}>{service.name}</Text>
//                 <Text style={styles.popularPrice}>${service.price}</Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//                   <Text style={{ color: '#FFD700', fontSize: 16 }}>★</Text>
//                   <Text style={styles.popularRating}>{service.rating}</Text>
//                   <Text style={styles.popularReviews}>| {service.reviews} reviews</Text>
//                 </View>
//               </View>
//               <Ionicons name="chevron-forward-circle" size={28} color="#a259ff" style={{ marginLeft: 8, alignSelf: 'center' }} />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     marginBottom: 16,
//   },
//   profileImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   greeting: {
//     color: '#888',
//     fontSize: 16,
//   },
//   userName: {
//     fontWeight: 'bold',
//     fontSize: 20,
//     color: '#222',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//     borderRadius: 16,
//     marginHorizontal: 20,
//     marginBottom: 5,
//     paddingHorizontal: 16,
//     height: 48,
//     top:10
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderTopWidth: 0,
//     maxHeight: 150,
//     backgroundColor: 'white',
//     borderRadius: 8,
//   },
//   item: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     height: 40,
//     color: '#222',
//   },
//   searchIcon: {
//     marginLeft: 8,
//     fontSize: 18,
//     color: '#a259ff',
//   },
//   sectionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: 18,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     color: '#222',
//   },
//   seeAll: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   offerCard: {
//     marginHorizontal: 20,
//     borderRadius: 24,
//     overflow: 'hidden',
//     marginBottom: 3,
//     marginTop: 10,
//     height: 140,
//     position: 'relative',
//   },
//   offerImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   offerOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(162,89,255,0.7)',
//   },
//   offerContent: {
//     position: 'absolute',
//     left: 24,
//     top: 24,
//   },
//   offerPercent: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 32,
//     marginBottom: 2,
//   },
//   offerSpecial: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 2,
//   },
//   offerDesc: {
//     color: '#fff',
//     fontSize: 13,
//     width: 180,
//   },
//   servicesRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginHorizontal: 5,
//     marginBottom: 5,
//     top:10
//   },
//   serviceItem: {
//     alignItems: 'center',
//     width: '23%',
//     marginBottom: 20,
//   },
//   serviceIcon: {
//     width: 48,
//     height: 48,
//     marginBottom: 6,
//   },
//   serviceName: {
//     fontSize: 13,
//     color: '#222',
//     textAlign: 'center',
//   },
//   categoriesRow: {
//     flexDirection: 'row',
//     marginHorizontal: 20,
//     marginBottom: 17,
//     top:5
//   },
//   categoryBtn: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f7f7f7',
//     marginRight: 10,
//   },
//   categoryBtnActive: {
//     backgroundColor: '#a259ff',
//   },
//   categoryText: {
//     color: '#888',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   categoryTextActive: {
//     color: '#fff',
//   },
//   popularCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     marginHorizontal: 20,
//     marginBottom: 18,
//     padding: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   popularImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 16,
//   },
//   popularUser: {
//     color: '#888',
//     fontSize: 13,
//     marginBottom: 2,
//   },
//   popularTitle: {
//     fontWeight: 'bold',
//     fontSize: 17,
//     color: '#222',
//     marginBottom: 2,
//   },
//   popularPrice: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   popularRating: {
//     color: '#222',
//     fontWeight: 'bold',
//     marginLeft: 4,
//     fontSize: 15,
//   },
//   popularReviews: {
//     color: '#888',
//     fontSize: 13,
//     marginLeft: 8,
//   },
//   serviceIconWrapper: {
//   backgroundColor: '#fff',
//   padding: 10,
//   borderRadius: 30,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 1 },
//   shadowOpacity: 0.1,
//   shadowRadius: 2,
//   elevation: 3,
// },
//   carouselDots: {
//     position: 'absolute',
//     bottom: 12,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;
