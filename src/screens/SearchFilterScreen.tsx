import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { getAllTechByAddress } from "../api/apiMethods";
import { useWindowDimensions } from "react-native";
import { AdvertisementBanner, ServiceFilters } from "./TechniciansScreen";

// Define interfaces
interface Technician {
  _id: string;
  username: string;
  profileImage?: string;
  categories?: string;
  areaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneNumber?: string;
  description?: string;
  servicesDone?: number; // Added for "popular" filter
}

interface Rating {
  rating: number;
}

interface TechnicianProfile {
  technician: Technician;
  ratings?: Rating[];
}

interface RouteParams {
  path?: string;
  categoryId?: string;
  pincode?: string;
  Area?: string | null;
  subArea?: string | null;
  city?: string;
  state?: string;
  category?: string;
  activeFilter?: string; // Added to track active filter in navigation params
}

const SearchFilterScreen: React.FC<{ searchParams?: RouteParams }> = ({ searchParams }) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { width } = useWindowDimensions();

  // Merge searchParams with route.params
  const params = { ...route.params, ...searchParams } as RouteParams;

  const [originalTechnicians, setOriginalTechnicians] = useState<TechnicianProfile[]>([]); // Store original data
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(params.activeFilter || null);

  // Extract route parameters
  const { path, categoryId, pincode, Area, subArea, city, state, category } = params;

  const formData = { categoryId, areaName: Area, subAreaName: subArea, pincode, city, state };

  // Fetch technicians based on search parameters
  const fetchTechBySearch = async () => {
    if (!categoryId || !city) {
      setError("Category and city are required search parameters");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllTechByAddress(formData);
      if (response.success && Array.isArray(response.result)) {
        setOriginalTechnicians(response.result); // Store original data
        applyFilter(response.result, activeFilter); // Apply active filter to new data
      } else {
        setOriginalTechnicians([]);
        setTechnicians([]);
        setError("No technicians found for the given parameters");
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setError("Failed to fetch technicians. Please try again.");
      setOriginalTechnicians([]);
      setTechnicians([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filter to technicians
  const applyFilter = useCallback(
    (techList: TechnicianProfile[], filter: string | null) => {
      let updatedTechnicians = [...techList];

      if (filter === "topRated") {
        updatedTechnicians = updatedTechnicians
          .filter((tech) => {
            if (!tech.ratings || tech.ratings.length === 0) return false;
            const averageRating =
              tech.ratings.reduce((sum, r) => sum + r.rating, 0) / tech.ratings.length;
            return averageRating >= 3.0;
          })
          .sort((a, b) => {
            const avgRatingA =
              a.ratings && a.ratings.length > 0
                ? a.ratings.reduce((sum, r) => sum + r.rating, 0) / a.ratings.length
                : 0;
            const avgRatingB =
              b.ratings && b.ratings.length > 0
                ? b.ratings.reduce((sum, r) => sum + r.rating, 0) / b.ratings.length
                : 0;
            return avgRatingB - avgRatingA; // Sort descending
          });
      } else if (filter === "popular") {
        updatedTechnicians = updatedTechnicians.sort((a, b) => {
          const servicesDoneA = a.technician.servicesDone ?? 0;
          const servicesDoneB = b.technician.servicesDone ?? 0;
          return servicesDoneB - servicesDoneA; // Sort descending
        });
      }

      setTechnicians(updatedTechnicians);
    },
    []
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (filter: string) => {
      setActiveFilter(filter);
      applyFilter(originalTechnicians, filter);
      navigation.setParams({ activeFilter: filter }); // Persist filter in navigation
    },
    [originalTechnicians, navigation, applyFilter]
  );

  // Fetch data on mount and when parameters change
  useEffect(() => {
    fetchTechBySearch();
  }, [categoryId, Area, subArea, pincode, city, state]);

  // Handle technician click
  const handleTechnicianClick = (technicianId: string, city?: string, pincode?: string) => {
    const cityPincode = pincode && city ? `${pincode}-${city}` : pincode || city || "";
    navigation.navigate("TechnicianProfile", {
      technicianId,
      cityPincode,
    });
  };

  // Open WhatsApp
  const openWhatsApp = useCallback((phoneNumber: number) => {
    const message = `Hello, I'm interested in your services`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => alert("WhatsApp is not installed"));
  }, []);

  // Render individual technician item
  const renderTechnician = ({ item }: { item: TechnicianProfile }) => (
    <TouchableOpacity
      className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row items-center bg-white shadow-md"
      onPress={() =>
        handleTechnicianClick(
          item.technician._id,
          item.technician.city,
          item.technician.pincode
        )
      }
    >
      <Image
        source={{
          uri:
            item.technician.profileImage ||
            "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg",
        }}
        className="w-24 h-24 rounded-2xl mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.technician.username || "Unknown Technician"}</Text>
        <View className="flex-row items-center mt-1">
          <View className="flex-row items-center border border-yellow-500 rounded-lg px-2">
            <Text className="font-bold">
              {item.ratings && item.ratings.length > 0
                ? (item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length).toFixed(1)
                : "4"}
            </Text>
            <MaterialCommunityIcons
              name="star-outline"
              size={20}
              color="#ffc71b"
              style={{ marginLeft: 4 }}
            />
          </View>
          {item.ratings && item.ratings.length > 0 && (
            <Text className="text-gray-600 text-sm ml-2">{item.ratings.length} Ratings</Text>
          )}
        </View>
        {item.technician.categories && (
          <View className="bg-pink-200 px-3 py-1 rounded-xl mt-1">
            <Text className="text-sm">{item.technician.categories}</Text>
          </View>
        )}
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={20} color="red" />
          <Text className="text-sm font-light ml-2 flex-1">
            {[
              item.technician.areaName,
              item.technician.city,
              item.technician.state,
              item.technician.pincode,
            ]
              .filter(Boolean)
              .join(", ") || "Location not available"}
          </Text>
        </View>
        {item.technician.description && (
          <View className="flex-row items-center mt-1">
            <FontAwesome name="thumbs-up" size={20} color="#00B800" />
            <Text className="text-sm font-light ml-2">
              {item.technician.description} years in Services
            </Text>
          </View>
        )}
        <TouchableOpacity
          className="bg-green-600 rounded px-2 py-1 mt-2 flex-row items-center w-32"
          onPress={() => openWhatsApp(item.technician.phoneNumber ? parseInt(item.technician.phoneNumber) : 919603558369)}
        >
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-sm">Whatsapp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        {/* Advertisement and Filters */}
        <AdvertisementBanner />
        <Text className="text-xl font-semibold my-4">{category || "Technicians"}</Text>
        <ServiceFilters onFilterChange={handleFilterChange} />

        {/* Technicians List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        ) : technicians.length > 0 ? (
          <FlatList
            data={technicians}
            renderItem={renderTechnician}
            keyExtractor={(item, index) => item.technician._id || index.toString()}
            contentContainerStyle={{
              paddingHorizontal: 1,
              paddingBottom: 100,
            }}
            ListHeaderComponent={<View className="h-4" />}
            scrollEnabled={false}
          />
        ) : (
          <Text className="text-gray-500 text-center mt-4">No technicians found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SearchFilterScreen;
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   ScrollView,
//   Linking,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   FontAwesome,
//   AntDesign,
// } from "@expo/vector-icons";
// import { getAllTechByAddress} from "../api/apiMethods";
// // import RenderHtml from "react-native-render-html"; // For rendering HTML content
// import { useWindowDimensions } from "react-native";
// import { AdvertisementBanner, ServiceFilters } from "./TechniciansScreen";

// // Import custom components (assuming they exist)

// // Define interfaces based on API responses and requirements
// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
//   categories?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   phoneNumber?: string;
//   description?: string;
// }

// interface Rating {
//   rating: number;
// }

// interface TechnicianProfile {
//   technician: Technician;
//   ratings?: Rating[];
// }

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   areaName: string;
//   subAreaName?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
// }

// interface RouteParams {
//   path?: string;
//   categoryId?: string;
//   pincode?: string;
//   Area?: string | null;
//   subArea?: string | null;
//   city?: string;
//   state?: string;
//   category?: string;
// }

// const SearchFilterScreen: React.FC<{ searchParams?: RouteParams }> = ({ searchParams }) => {
//   const navigation = useNavigation<any>(); // Use specific navigation type if available
//   const route = useRoute();
//   const { width } = useWindowDimensions(); // For responsive HTML rendering

//   // Merge searchParams with route.params, prioritizing searchParams
//   const params = { ...route.params, ...searchParams } as RouteParams;

//   const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Extract route parameters
//   const { path, categoryId, pincode, Area, subArea, city, state, category } = params;

//   const formData = { categoryId, areaName: Area, subAreaName: subArea, pincode, city, state };

//   // Fetch technicians based on search parameters
//   const fetchTechBySearch = async () => {
//     if (!categoryId || !city ) {
//       setError("Category and city are required search parameters");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await getAllTechByAddress(formData);
//       if (response.success && Array.isArray(response.result)) {
//         setTechnicians(response.result);
//       } else {
//         setTechnicians([]);
//         setError("No technicians found for the given parameters");
//       }
//     } catch (error) {
//       console.error("Error fetching technicians:", error);
//       setError("Failed to fetch technicians. Please try again.");
//       setTechnicians([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch SEO content
//   // const fetchSearchContent = async () => {
//   //   if (!categoryId || !city) {
//   //     setErrorContent("Category and city are required for content");
//   //     return;
//   //   }
//   //   setIsDataLoading(true);
//   //   setErrorContent(null);
//   //   try {
//   //     const response = await getSearchContentByAddress(formData);
//   //     if (response?.success && response?.result) {
//   //       setContent(response.result);
//   //     } else {
//   //       setContent(null);
//   //       setErrorContent("No content found for this address");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching search content:", error);
//   //     setContent(null);
//   //     setErrorContent("Failed to fetch search content.");
//   //   } finally {
//   //     setIsDataLoading(false);
//   //   }
//   // };

//   // Trigger data fetching on mount and when parameters change
//   useEffect(() => {
//     fetchTechBySearch();
//     // fetchSearchContent();
//   }, [categoryId, Area, subArea, pincode, city, state]);

//   // Handle technician click
//   const handleTechnicianClick = (technicianId: string, city?: string, pincode?: string) => {
//     const cityPincode = pincode && city ? `${pincode}-${city}` : pincode || city || "";
//     navigation.navigate("TechnicianProfile", {
//       technicianId,
//       cityPincode,
//     });
//   };

//    const handleFilterChange = useCallback(
//       (filter: string) => {
//         let updatedTechnicians = [...technicians];
  
//         if (filter === "topRated") {
//           updatedTechnicians = updatedTechnicians
//             .filter((tech) => {
//               if (!tech.ratings || tech.ratings.length === 0) return false;
//               const averageRating =
//                 tech.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                 tech.ratings.length;
//               return averageRating >= 3.0;
//             })
//             .sort((a, b) => {
//               const avgRatingA =
//                 a.ratings && a.ratings.length > 0
//                   ? a.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                     a.ratings.length
//                   : 0;
//               const avgRatingB =
//                 b.ratings && b.ratings.length > 0
//                   ? b.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                     b.ratings.length
//                   : 0;
//               return avgRatingB - avgRatingA;
//             });
//         } else if (filter === "popular") {
//           updatedTechnicians = updatedTechnicians.sort(
//             (a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0)
//           );
//         } else {
//           updatedTechnicians = [...technicians];
//         }
  
//         setTechnicians(updatedTechnicians);
//         // Update navigation params to persist filter
//         navigation.setParams({ activeFilter: filter });
//       },
//       [technicians, navigation]
//     );

//   // Open WhatsApp
//    const openWhatsApp = useCallback((prnvNumber: number) => {
//       const message = `Hello , I'm interested in your services`;
//       const url = `whatsapp://send?phone=${prnvNumber}&text=${encodeURIComponent(message)}`;
//       Linking.openURL(url).catch(() => alert("WhatsApp is not installed"));
//     }, []);

//   // Render individual technician item
//   const renderTechnician = ({ item }: { item: TechnicianProfile }) => (
//     <TouchableOpacity
//       className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row items-center bg-white shadow-md"
//       onPress={() =>
//         handleTechnicianClick(
//           item.technician._id,
//           item.technician.city,
//           item.technician.pincode
//         )
//       }
//     >
//       <Image
//         source={{
//           uri:
//             item.technician.profileImage ||
//             "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg",
//         }}
//         className="w-24 h-24 rounded-2xl mr-3"
//         resizeMode="cover"
//       />
//       <View className="flex-1">
//         <Text className="text-lg font-semibold">{item.technician.username || "Unknown Technician"}</Text>
//         <View className="flex-row items-center mt-1">
//           <View className="flex-row items-center border border-yellow-500 rounded-lg px-2">
//             <Text className="font-bold">
//               {item.ratings && item.ratings.length > 0
//                 ? (item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length).toFixed(1)
//                 : "4"}
//             </Text>
//             <MaterialCommunityIcons
//               name="star-outline"
//               size={20}
//               color="#ffc71b"
//               style={{ marginLeft: 4 }}
//             />
//           </View>
//           {item.ratings && item.ratings.length > 0 && (
//             <Text className="text-gray-600 text-sm ml-2">{item.ratings.length} Ratings</Text>
//           )}
//         </View>
//         {item.technician.categories && (
//           <View className="bg-pink-200 px-3 py-1 rounded-xl mt-1">
//             <Text className="text-sm">{item.technician.categories}</Text>
//           </View>
//         )}
//         <View className="flex-row items-center mt-1">
//           <Ionicons name="location-outline" size={20} color="red" />
//           <Text className="text-sm font-light ml-2 flex-1">
//             {[
//               item.technician.areaName,
//               item.technician.city,
//               item.technician.state,
//               item.technician.pincode,
//             ]
//               .filter(Boolean)
//               .join(", ") || "Location not available"}
//           </Text>
//         </View>
//         {item.technician.description && (
//           <View className="flex-row items-center mt-1">
//             <FontAwesome name="thumbs-up" size={20} color="#00B800" />
//             <Text className="text-sm font-light ml-2">
//               {item.technician.description} years in Services
//             </Text>
//           </View>
//         )}
//         <TouchableOpacity
//           className="bg-green-600 rounded px-2 py-1 mt-2 flex-row items-center w-32"
//           onPress={() =>
//             openWhatsApp( 919603558369)
//           }
//         >
//           <Ionicons
//             name="logo-whatsapp"
//             size={20}
//             color="white"
//             style={{ marginRight: 8 }}
//           />
//           <Text className="text-white text-sm">Whatsapp</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView className="flex-1 bg-gray-100">
//       <View className="p-4">
//         {/* Advertisement and Filters */}
//         <AdvertisementBanner />
//         <Text className="text-xl font-semibold my-4">{category || "Technicians"}</Text>
//         <ServiceFilters onFilterChange={handleFilterChange} />

//         {/* Technicians List */}
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
//         ) : error ? (
//           <Text className="text-red-500 text-center mt-4">{error}</Text>
//         ) : technicians.length > 0 ? (
//           <FlatList
//             data={technicians}
//             renderItem={renderTechnician}
//             keyExtractor={(item, index) => item.technician._id || index.toString()}
//             contentContainerStyle={{
//               paddingHorizontal: 16,
//               paddingBottom: 100,
//             }}
//             ListHeaderComponent={<View className="h-4" />}
//             scrollEnabled={false} // Disable FlatList scrolling to allow parent ScrollView to handle it
//           />
//         ) : (
//           <Text className="text-gray-500 text-center mt-4">No technicians found.</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default SearchFilterScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import {
//   Ionicons,
//   MaterialIcons,
//   FontAwesome,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import {
//   getAllTechByAddress,
// } from "../api/apiMethods";
// import { AdvertisementBanner, ServiceFilters } from "./TechniciansScreen";

// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
//   categories?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   phoneNumber?: string;
//   description?: string;
// }

// interface TechnicianProfile {
//   technician: Technician;
//   ratings?: {
//     rating: number;
//   };
// }

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: any;
// }

// const SearchFilterScreen = ({searchParams}) => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   route.params = searchParams;
//   const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
//   const [content, setContent] = useState<SearchContent | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [errorContent, setErrorContent] = useState<string | null>(null);

//   // Access route parameters
//   const { path, categoryId, pincode, Area,subArea, city, state ,category } = route.params as {
//     path?: string;
//     categoryId?: string;
//     pincode?: string;
//     Area?: string | null;
//     subArea?:string | null,
//     city?: String;
//     state?: string;
//     category: string;
//   };

//   const formData = { categoryId, areaName: Area,subAreaName: subArea, pincode, city, state };

//   const fetchTechBySearch = async () => {
//     if (!categoryId || !city) {
//       setError("category and city required search parameters");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await getAllTechByAddress(formData);
//       if (response.success && Array.isArray(response.result)) {
//         setTechnicians(response.result);
//       } else {
//         setTechnicians([]);
//       }
//     } catch (error) {
//       console.error("Error fetching technicians:", error);
//       setError("Failed to fetch technicians. Please try again.");
//       setTechnicians([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   //   const fetchSearchContent = async () => {
//   //     if (!categoryId || !Area || !pincode) {
//   //       setErrorContent('Missing required search parameters');
//   //       return;
//   //     }
//   //     setIsDataLoading(true);
//   //     setErrorContent(null);
//   //     try {
//   //       const response = await getSearchContentByAddress(formData);
//   //       if (response?.success === true) {
//   //         setContent(response?.result);
//   //       } else {
//   //         setContent(null);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching search content:', error);
//   //       setContent(null);
//   //       setErrorContent('Failed to fetch search content.');
//   //     } finally {
//   //       setIsDataLoading(false);
//   //     }
//   //   };

//   useEffect(() => {
//     fetchTechBySearch();
//   }, [categoryId, Area, pincode, city]);

//   const handleTechnicianClick = (
//     technicianId: string,
//     city?: string,
//     pincode?: string
//   ) => {
//     const cityPincode =
//       pincode && city ? `${pincode}-${city}` : pincode || city || "";
//   };

//   const renderTechnician = ({ item }: { item: Technician }) => (
//     <TouchableOpacity
//       className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row items-center bg-white shadow-md"
//       onPress={() =>
//         navigation.navigate("TechnicianProfile", {
//           technicianId: item.technician._id,
//         })
//       }
//     >
//       <Image
//         source={{
//           uri:
//             item.technician.profileImage ||
//             "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg",
//         }}
//         className="w-24 h-24 rounded-2xl mr-3"
//       />
//       <View className="flex-1">
//         <Text className="text-lg font-semibold">
//           {item.technician.username}
//         </Text>
//         <View className="flex-row items-center mt-1">
//           <View className="flex-row items-center border border-yellow-500 rounded-lg px-2">
//             <Text className="font-bold">{item.ratings?.rating ?? "4"}</Text>
//             <MaterialCommunityIcons
//               name="star-outline"
//               size={20}
//               color="#ffc71b"
//               className="ml-1"
//             />
//           </View>
//           {item.ratings?.rating && (
//             <Text className="text-gray-600 text-sm ml-2">
//               {item.ratings.rating} Ratings
//             </Text>
//           )}
//         </View>
//         {item.technician?.service && (
//           <View className="bg-pink-200 px-3 py-1 rounded-xl mt-1">
//             <Text className="text-sm">{item.technician.service}</Text>
//           </View>
//         )}
//         <View className="flex-row items-center mt-1">
//           <Ionicons name="location-outline" size={20} color="red" />
//           <Text className="text-sm font-light ml-2 flex-1">
//             {item.technician.areaName}, {item.technician.city},{" "}
//             {item.technician.state}, {item.technician.pincode}
//           </Text>
//         </View>
//         {item.technician?.description && (
//           <View className="flex-row items-center mt-1">
//             <FontAwesome name="thumbs-up" size={20} color="#00B800" />
//             <Text className="text-sm font-light ml-2">
//               {item.technician.description} years in Services
//             </Text>
//           </View>
//         )}
//         <TouchableOpacity
//           className="bg-green-600 rounded px-2 py-1 mt-2 flex-row items-center w-32"
//           onPress={() =>
//             openWhatsApp(
//               "919603558369",
//               "Hello, I am interested in your services"
//             )
//           }
//         >
//           <MaterialCommunityIcons
//             name="message-text-outline"
//             size={20}
//             color="white"
//             className="mr-2"
//           />
//           <Text className="text-white text-sm">Message</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//       <View className="flex-1 bg-gray-100">
//         {/* Header content outside FlatList */}
//         <View className="p-4">
//           <AdvertisementBanner />
//           <Text className="text-xl font-semibold my-4">{category || "Technicians"}</Text>
//           <ServiceFilters />
//         </View>
//         {/* Technician list */}
//         {isLoading || isDataLoading ? (
//           <ActivityIndicator
//             size="large"
//             color="#0000ff"
//             style={{ marginTop: 20 }}
//           />
//         ) : error || errorContent ? (
//           <Text className="text-red-500 text-center mt-4">
//             {error || errorContent}
//           </Text>
//         ) : technicians.length > 0 ? (
//           <FlatList
//             data={technicians}
//             renderItem={renderTechnician}
//             keyExtractor={(item, index) =>
//               item.technician._id || index.toString()
//             }
//             contentContainerStyle={{
//               paddingHorizontal: 16,
//               paddingBottom: 100,
//             }}
//             ListHeaderComponent={<View className="h-4" />} // Optional spacing
//           />
//         ) : (
//           <Text className="text-gray-500 text-center mt-4">
//             No technicians found.
//           </Text>
//         )}
//       </View>
//   );
// };

// export default SearchFilterScreen;
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Using Expo vector icons
// import { getAllTechByAddress, getSearchContentByAddress } from '../api/apiMethods'; // Assuming these are reusable
// import { AdvertisementBanner, ServiceFilters } from './TechniciansScreen';

// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
//   categories?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   phoneNumber?: string;
//   description?: string;
// }

// interface TechnicianProfile {
//   technician: Technician;
//   ratings?: {
//     rating: number;
//   };
// }

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: any;
// }

// const SearchFilterScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
//   const [content, setContent] = useState<SearchContent | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [errorContent, setErrorContent] = useState<string | null>(null);

//   // Access route parameters from navigation
//   const { path, categoryId, pincode, subArea, categoryName } = route.params as {
//     path?: string;
//     categoryId?: string;
//     pincode?: string;
//     subArea?: string | null;
//     categoryName?: string;
//   };

//   const formData = { categoryId, areaName: subArea, pincode, city: '', state: '' }; // Adjust based on available data

//   const fetchTechBySearch = async () => {
//     if (!categoryId || !subArea || !pincode) {
//       setError('Missing required search parameters');
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await getAllTechByAddress(formData);
//       if (response.success && Array.isArray(response.result)) {
//         setTechnicians(response.result);
//       } else {
//         setTechnicians([]);
//       }
//     } catch (error) {
//       console.error('Error fetching technicians:', error);
//       setError('Failed to fetch technicians. Please try again.');
//       setTechnicians([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSearchContent = async () => {
//     if (!categoryId || !subArea || !pincode) {
//       setErrorContent('Missing required search parameters');
//       return;
//     }
//     setIsDataLoading(true);
//     setErrorContent(null);
//     try {
//       const response = await getSearchContentByAddress(formData);
//       if (response?.success === true) {
//         setContent(response?.result);
//       } else {
//         setContent(null);
//       }
//     } catch (error) {
//       setContent(null);
//     } finally {
//       setIsDataLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTechBySearch();
//     fetchSearchContent();
//   }, [categoryId, subArea, pincode]);

//   const handleTechnicianClick = (technicianId: string, city?: string, pincode?: string) => {
//     const cityPincode = pincode && city ? `${pincode}-${city}` : pincode || city || '';
//     navigation.navigate('TechnicianById', {
//       technicianId,
//       cityPincode,
//     });
//   };

//   const renderTechnician = ({ item, index }: { item: TechnicianProfile; index: number }) => (
//     <TouchableOpacity
//       className="border border-gray-300 rounded-2xl shadow p-3 flex-row items-center mb-3 bg-white"
//       onPress={() => handleTechnicianClick(item.technician._id, item.technician.city, item.technician.pincode)}
//     >
//       <Image
//         source={{
//           uri: item.technician.profileImage || 'https://via.placeholder.com/150',
//         }}
//         className="w-36 h-36 rounded-2xl"
//         resizeMode="cover"
//       />
//       <View className="flex-1 ml-4 space-y-2">
//         <Text className="text-lg font-semibold">{item.technician.username || 'Unknown Technician'}</Text>
//         <View className="flex-row items-center">
//           <View className="flex-row items-center border border-amber-500 rounded-lg px-2">
//             <Text className="text-black font-bold">{item.ratings?.rating ?? '4'}</Text>
//             <MaterialIcons name="star" size={20} color="#ffc71b" style={{ marginLeft: 4 }} />
//           </View>
//           {item.ratings?.rating && (
//             <Text className="text-gray-600 text-sm ml-2">{item.ratings.rating} Ratings</Text>
//           )}
//         </View>
//         {item.technician?.categories && (
//           <View className="bg-fuchsia-200 px-3 py-1 rounded-xl">
//             <Text className="text-black text-sm">{item.technician.categories}</Text>
//           </View>
//         )}
//         <View className="flex-row items-center">
//           <Ionicons name="location-outline" size={20} color="red" />
//           <Text className="text-sm font-light ml-2">
//             {[
//               item.technician.areaName?.toLowerCase(),
//               item.technician.city,
//               item.technician.state,
//               item.technician.pincode,
//             ]
//               .filter(Boolean)
//               .join(', ') || 'Location not available'}
//           </Text>
//         </View>
//         {item.technician?.description && (
//           <View className="flex-row items-center">
//             <FontAwesome name="thumbs-up" size={22} color="#00B800" />
//             <Text className="text-sm font-light ml-2">
//               {item.technician.description} years in Services
//             </Text>
//           </View>
//         )}
//         <View className="flex-row gap-3">
//           <TouchableOpacity
//             className="flex-row items-center bg-fuchsia-500 rounded px-2 py-1"
//             onPress={() => { /* Handle call action */ }}
//           >
//             <Ionicons name="call" size={20} color="white" style={{ marginRight: 8 }} />
//             <Text className="text-white text-sm">{item.technician.phoneNumber || 'N/A'}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="flex-row items-center bg-green-600 rounded px-2 py-1"
//             onPress={() => { /* Handle message action */ }}
//           >
//             <MaterialIcons name="message" size={20} color="white" style={{ marginRight: 8 }} />
//             <Text className="text-white text-sm">Message</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-gray-100">
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
//         <AdvertisementBanner />
//         <Text className="text-xl font-semibold my-4">Technicians</Text>
//         <ServiceFilters />
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : error ? (
//           <Text className="text-red-500 text-center">{error}</Text>
//         ) : technicians.length > 0 ? (
//           <FlatList
//             data={technicians}
//             renderItem={renderTechnician}
//             keyExtractor={(item, index) => item.technician._id || index.toString()}
//             contentContainerStyle={{ paddingBottom: 16 }}
//           />
//         ) : (
//           <Text className="text-gray-500 text-center">No technicians found.</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default SearchFilterScreen;
