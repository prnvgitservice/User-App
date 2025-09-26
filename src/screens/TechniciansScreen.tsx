import React, { FC, useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { getTechByCategorie } from "../api/apiMethods";
import { Rating } from "./TechnicianProfile";

interface Technician {
  technician: {
    _id: string;
    username: string;
    profileImage?: string;
    service?: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    description?: string;
  };
  ratings?: Rating[];
  servicesDone?: number;
}

interface FilterIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface RouteParams {
  categoryId: string;
  category: string;
  activeFilter?: string;
}

const ads = [
  "https://img.freepik.com/premium-photo/service-concept-person-hand-holding-service-icon-virtual-screen_1296497-175.jpg?semt=ais_hybrid&w=740",
  "https://www.shutterstock.com/image-photo/african-american-carpenter-man-look-600nw-2251298121.jpg",
  "https://media.istockphoto.com/id/1395783965/photo/plumbing-technician-checking-water-installation-with-notepad-ok-gesture.jpg?s=612x612&w=0&k=20&c=At0CYTgR0t5Uw2lf7jIOo4GAh6mUu2WNyDbV2u3bMRs=",
  "https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-600nw-2488702851.jpg",
];

const FALLBACK_IMAGE =
  "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg";

const FILTER_ICONS: FilterIcon[] = [
  {
    id: "popular",
    label: "Popular",
    icon: <AntDesign name="star" size={23} color="#00b800" />,
  },
  {
    id: "topRated",
    label: "Top Rated",
    icon: <AntDesign name="star" size={23} color="#ffc71b" />,
  },
];

const AdvertisementBanner: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 3000); // Increased interval for better UX
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-6">
      <Image
        source={{ uri: ads[currentIndex] }}
        className="w-full h-full object-cover"
        resizeMode="cover"
        defaultSource={{ uri: FALLBACK_IMAGE }}
      />
    </View>
  );
};

const ServiceFilters: FC<{ onFilterChange: (filter: string) => void }> = ({
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("");

  const handleFilterClick = useCallback(
    (filterId: string) => {
      const newFilter = activeFilter === filterId ? "" : filterId;
      setActiveFilter(newFilter);
      onFilterChange(newFilter);
    },
    [activeFilter, onFilterChange]
  );

  return (
    <View className="flex-row flex-wrap my-3 px-2 gap-4">
      {FILTER_ICONS.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          className={`flex-row items-center border border-gray-500 shadow-md py-2 px-4 rounded-xl ${
            activeFilter === filter.id ? "bg-fuchsia-300" : "bg-white"
          }`}
          onPress={() => handleFilterClick(filter.id)}
          accessibilityLabel={`Filter by ${filter.label}`}
          accessibilityRole="button"
        >
          {filter.icon}
          <Text className="text-base ml-2 font-medium">{filter.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SkeletonLoader: FC = () => (
  <View className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row gap-2 items-center bg-white shadow-md">
    <View className="w-24 h-24 rounded-2xl bg-gray-200 animate-pulse" />
    <View className="flex-1 gap-2">
      <View className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
      <View className="flex-row items-center gap-3">
        <View className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
        <View className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      </View>
      <View className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
      <View className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
    </View>
  </View>
);

const TechnicianItem = memo(({ item }: { item: Technician }) => {
  const navigation = useNavigation();

  const openWhatsApp = useCallback(() => {
    const message = `Hello ${item.technician.username}, I'm interested in your ${item.technician.service || "services"}`;
    const url = `whatsapp://send?phone=${item.technician.phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => alert("WhatsApp is not installed"));
  }, [item]);

  return (
    <TouchableOpacity
      className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row gap-2 items-center bg-white shadow-md"
      onPress={() =>
        navigation.navigate("TechnicianProfile", {
          technicianId: item.technician._id,
        })
      }
      accessibilityLabel={`View profile of ${item.technician.username}`}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: item.technician.profileImage || FALLBACK_IMAGE }}
        className="w-24 h-24 rounded-2xl mr-3"
        resizeMode="cover"
        defaultSource={{ uri: FALLBACK_IMAGE }}
      />
      <View className="flex-1 gap-1">
        <Text className="text-lg font-semibold">{item.technician.username}</Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center border border-yellow-500 rounded-lg px-2 py-0.5">
            <Text className="font-bold text-sm">
              {item.ratings && item.ratings.length > 0
                ? (
                    item.ratings.reduce((sum, r) => sum + r.rating, 0) /
                    item.ratings.length
                  ).toFixed(1)
                : "4.0"}
            </Text>
            <MaterialCommunityIcons
              name="star-outline"
              size={18}
              color="#ffc71b"
              className="ml-1"
            />
          </View>
          {item.ratings && (
            <Text className="text-gray-600 text-sm">
              {item.ratings.length} Ratings
            </Text>
          )}
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={18} color="red" />
          <Text className="text-sm font-light ml-2 flex-1">
            {item.technician.areaName}, {item.technician.city},{" "}
            {item.technician.state}, {item.technician.pincode}
          </Text>
        </View>
        {item.technician.description && (
          <View className="flex-row items-center mt-1">
            <FontAwesome name="thumbs-up" size={18} color="#00B800" />
            <Text className="text-sm font-light ml-2">
              {item.technician.description} years in Services
            </Text>
          </View>
        )}
        <TouchableOpacity
          className="bg-green-600 rounded-lg px-3 py-1.5 mt-2 flex-row items-center w-32"
          onPress={openWhatsApp}
          accessibilityLabel={`Contact ${item.technician.username} via WhatsApp`}
          accessibilityRole="button"
        >
          <Ionicons name="logo-whatsapp" size={18} color="white" className="mr-2" />
          <Text className="text-white text-sm font-medium">WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const TechniciansScreen: FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, category, activeFilter: initialFilter } = route.params as RouteParams;
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTechByCategoryId = useCallback(async () => {
    if (!categoryId) {
      setError("No category ID provided");
      return;
    }

    try {
      setIsDataLoading(true);
      const response = await getTechByCategorie(categoryId);
      const data = response?.result?.technicians || [];

      const mappedTechnicians: Technician[] = data.map((item: any) => ({
        technician: {
          _id: item.technician._id,
          username: item.technician.username,
          profileImage: item.technician.profileImage,
          service:
            item.services?.length > 0 ? item.services[0].serviceName : undefined,
          areaName: item.technician.areaName,
          city: item.technician.city,
          state: item.technician.state,
          pincode: item.technician.pincode,
          phoneNumber: item.technician.phoneNumber,
          description: item.technician.description,
        },
        ratings: item.ratings || null,
        servicesDone: item.techSubDetails?.subscriptions[0]?.ordersCount || 0,
      }));

      setTechnicians(mappedTechnicians);
      setFilteredTechnicians(mappedTechnicians);
    } catch (error: any) {
      setError(error?.message || "Failed to fetch technicians");
      // TODO: Log error to a service like Sentry
    } finally {
      setIsDataLoading(false);
      setRefreshing(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchTechByCategoryId();
  }, [fetchTechByCategoryId]);

  const handleFilterChange = useCallback(
    (filter: string) => {
      let updatedTechnicians = [...technicians];

      if (filter === "topRated") {
        updatedTechnicians = updatedTechnicians
          .filter((tech) => {
            if (!tech.ratings || tech.ratings.length === 0) return false;
            const averageRating =
              tech.ratings.reduce((sum, r) => sum + r.rating, 0) /
              tech.ratings.length;
            return averageRating >= 3.0;
          })
          .sort((a, b) => {
            const avgRatingA =
              a.ratings && a.ratings.length > 0
                ? a.ratings.reduce((sum, r) => sum + r.rating, 0) /
                  a.ratings.length
                : 0;
            const avgRatingB =
              b.ratings && b.ratings.length > 0
                ? b.ratings.reduce((sum, r) => sum + r.rating, 0) /
                  b.ratings.length
                : 0;
            return avgRatingB - avgRatingA;
          });
      } else if (filter === "popular") {
        updatedTechnicians = updatedTechnicians.sort(
          (a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0)
        );
      } else {
        updatedTechnicians = [...technicians];
      }

      setFilteredTechnicians(updatedTechnicians);
      // Update navigation params to persist filter
      navigation.setParams({ activeFilter: filter });
    },
    [technicians, navigation]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTechByCategoryId();
  }, [fetchTechByCategoryId]);

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <AdvertisementBanner />
      <Text className="text-xl font-bold mb-4 text-gray-800">
        {category || "Technicians"}
      </Text>
      <ServiceFilters onFilterChange={handleFilterChange} />
      {isDataLoading && !refreshing ? (
        <View className="flex-1">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-red-500 text-lg text-center">{error}</Text>
          <Pressable
            className="bg-blue-500 rounded-lg px-4 py-2"
            onPress={fetchTechByCategoryId}
            accessibilityLabel="Retry fetching technicians"
            accessibilityRole="button"
          >
            <Text className="text-white font-medium">Retry</Text>
          </Pressable>
        </View>
      ) : filteredTechnicians.length > 0 ? (
        <FlatList
          data={filteredTechnicians}
          renderItem={({ item }) => <TechnicianItem item={item} />}
          keyExtractor={(item) => item.technician._id}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-gray-500 text-lg text-center">
            No technicians found for this category.
          </Text>
          <Pressable
            className="bg-blue-500 rounded-lg px-4 py-2"
            onPress={fetchTechByCategoryId}
            accessibilityLabel="Refresh technicians list"
            accessibilityRole="button"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default TechniciansScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Linking,
//   ActivityIndicator,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   FontAwesome,
//   AntDesign,
// } from "@expo/vector-icons";
// import { getTechByCategorie } from "../api/apiMethods";
// import { Rating } from "./TechnicianProfile";

// interface Technician {
//   technician: {
//     _id: string;
//     username: string;
//     profileImage?: string;
//     service?: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     phoneNumber: string;
//     description?: string;
//   };
//   ratings?: Rating[];
//   servicesDone?: number;
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   meta_title: string;
//   meta_description: string;
//   status: number;
//   seo_content?: string;
// }


// interface FilterIcon {
//   id: string;
//   label: string;
//   icon: React.ReactNode;
// }


// const ads = [
//   "https://img.freepik.com/premium-photo/service-concept-person-hand-holding-service-icon-virtual-screen_1296497-175.jpg?semt=ais_hybrid&w=740",
//   "https://www.shutterstock.com/image-photo/african-american-carpenter-man-look-600nw-2251298121.jpg",
//   "https://media.istockphoto.com/id/1395783965/photo/plumbing-technician-checking-water-installation-with-notepad-ok-gesture.jpg?s=612x612&w=0&k=20&c=At0CYTgR0t5Uw2lf7jIOo4GAh6mUu2WNyDbV2u3bMRs=",
//   "https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-600nw-2488702851.jpg",
// ];

// export const AdvertisementBanner = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % ads.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-6">
//       <Image
//         source={{ uri: ads[currentIndex] }}
//         className="w-full h-full object-cover"
//         resizeMode="cover"
//       />
//     </View>
//   );
// };

// const FILTER_ICONS: FilterIcon[] = [
//   {
//     id: "popular",
//     label: "Popular",
//     icon: <AntDesign name="star" size={23} color="#00b800" />,
//   },
//   {
//     id: "topRated",
//     label: "Top Rated",
//     icon: <AntDesign name="star" size={23} color="#ffc71b" />,
//   },
// ];

// export const ServiceFilters = (onFilterChange: (filter: string) => void) => {
//   const [activeFilter, setActiveFilter] = useState<string>("");

//   const handleFilterClick = (filterId: string) => {
//     const newFilter = activeFilter === filterId ? "" : filterId;
//     setActiveFilter(newFilter);
//     onFilterChange(newFilter);
//   };

//   return (
//     <View className="flex-row flex-wrap my-3 px-2 gap-4">
//       {FILTER_ICONS.map((filter) => (
//         <TouchableOpacity
//           key={filter.id}
//           className={`flex-row items-center border border-gray-500 shadow-md py-2 px-4 rounded-xl ${
//             activeFilter === filter.id ? "bg-fuchsia-300" : "bg-white"
//           }`}
//           onPress={() => handleFilterClick(filter.id)}
//         >
//           {filter.icon}
//           <Text className="text-base ml-2">{filter.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const TechniciansScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { categoryId, category } = route.params as {
//     categoryId: string;
//     category: string;
//   };
//   const [technicians, setTechnicians] = useState<Technician[]>([]);
//   const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(
//     []
//   );
//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!categoryId) {
//       setError("No category ID provided");
//       return;
//     }

//     const fetchTechByCategoryId = async () => {
//       try {
//         setIsDataLoading(true);
//         const response = await getTechByCategorie(categoryId);
//         const data = response?.result?.technicians || [];

//         const mappedTechnicians: Technician[] = data.map((item: any) => ({
//           technician: {
//             _id: item.technician._id,
//             username: item.technician.username,
//             profileImage: item.technician.profileImage,
//             service:
//               item.services?.length > 0
//                 ? item.services[0].serviceName
//                 : undefined,
//             areaName: item.technician.areaName,
//             city: item.technician.city,
//             state: item.technician.state,
//             pincode: item.technician.pincode,
//             phoneNumber: item.technician.phoneNumber,
//             description: item.technician.description,
//           },
//           ratings: item.ratings || null,
//           servicesDone: item.techSubDetails?.subscriptions[0]?.ordersCount || 0,
//         }));

//         setTechnicians(mappedTechnicians);
//         setFilteredTechnicians(mappedTechnicians);
//       } catch (error: any) {
//         setError(error?.message || "Failed to fetch technicians");
//       } finally {
//         setIsDataLoading(false);
//       }
//     };

//     fetchTechByCategoryId();
//   }, [categoryId]);

//   const openWhatsApp = (number: string, message: string) => {
//     const url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`;
//     Linking.openURL(url).catch(() => alert("WhatsApp is not installed"));
//   };

//   const handleFilterChange = (filter: string) => {
//     let updatedTechnicians = [...technicians];

//     if (filter === "topRated") {
//       // Filter technicians with an average rating >= 3.0
//       updatedTechnicians = updatedTechnicians
//         .filter((tech) => {
//           if (!tech.ratings || tech.ratings.length === 0) return false;
//           const averageRating =
//             tech.ratings.reduce((sum, r) => sum + r.rating, 0) /
//             tech.ratings.length;
//           return averageRating >= 3.0;
//         })
//         .sort((a, b) => {
//           const avgRatingA =
//             a.ratings && a.ratings.length > 0
//               ? a.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                 a.ratings.length
//               : 0;
//           const avgRatingB =
//             b.ratings && b.ratings.length > 0
//               ? b.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                 b.ratings.length
//               : 0;
//           return avgRatingB - avgRatingA; // Sort in descending order
//         });
//     } else if (filter === "popular") {
//       // Sort by servicesDone in descending order
//       updatedTechnicians = updatedTechnicians.sort(
//         (a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0)
//       );
//     } else {
//       // Reset to original list if no filter is selected
//       updatedTechnicians = [...technicians];
//     }

//     setFilteredTechnicians(updatedTechnicians);
//   };

//   const renderTechnician = ({ item }: { item: Technician }) => (
//     <TouchableOpacity
//       className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row gap-2 items-center bg-white shadow-md"
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
//       <View className="flex-1 gap-1">
//         <Text className="text-lg font-semibold">
//           {item.technician.username}
//         </Text>
//         <View className="flex-row items-center gap-3">
//           <View className="flex-row items-center border border-yellow-500 rounded-lg px-2">
//             <Text className="font-bold">
//               {item.ratings && item.ratings.length > 0
//                 ? (
//                     item.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                     item.ratings.length
//                   ).toFixed(1)
//                 : "4"}
//             </Text>
//             <MaterialCommunityIcons
//               name="star-outline"
//               size={20}
//               color="#ffc71b"
//               className="ml-1"
//             />
//           </View>
//           {item.ratings && (
//             <Text className="text-gray-600 text-sm">
//               {item.ratings.length || 0} Ratings
//             </Text>
//           )}
//         </View>
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
//           <Ionicons
//             name="logo-whatsapp"
//             size={18}
//             color="white"
//             className="mr-2"
//           />

//           <Text className="text-white text-sm">Whatsapp</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-gray-100 px-4">
//       <AdvertisementBanner />
//       <Text className="text-xl font-semibold mb-4">
//         {category || "Technicians"}
//       </Text>
//       <ServiceFilters onFilterChange={handleFilterChange} />
//       {isDataLoading ? (
//         <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
//       ) : error ? (
//         <Text className="text-red-500 text-center mt-4">{error}</Text>
//       ) : filteredTechnicians.length > 0 ? (
//         <FlatList
//           data={filteredTechnicians}
//           renderItem={renderTechnician}
//           keyExtractor={(item) => item.technician._id}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <Text className="text-gray-500 text-center mt-4">
//           No technicians found.
//         </Text>
//       )}
//     </View>
//   );
// };

// export default TechniciansScreen;

