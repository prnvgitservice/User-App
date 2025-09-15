import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { ChevronRight, Clock, MapPin, User, Star } from "react-native-feather";
import { RefreshControl } from "react-native-gesture-handler";

interface BookingData {
  booking: {
    _id: string;
    status: string;
    bookingDate: string;
    totalPrice: number;
    quantity: number;
    servicePrice: number;
    rating?: number;
    review?: string;
  };
  technician: {
    username: string;
    phoneNumber: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    profileImage?: string;
  };
  service: {
    serviceName: string;
    serviceImg: string;
  } | null;
  user: {
    username: string;
    phoneNumber: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface BookingsListProps {
  bookings: BookingData[];
  activeTab: "upcoming" | "completed" | "cancelled";
  onBookingSelect: (booking: BookingData) => void;
}

const BookingsListScreen: React.FC<BookingsListProps> = ({
  bookings,
  activeTab,
  onBookingSelect,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for item fade-in

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return ["upcoming", "accepted", "started"].includes(
        booking.booking.status.toLowerCase()
      );
    } else if (activeTab === "completed") {
      return booking.booking.status.toLowerCase() === "completed";
    } else if (activeTab === "cancelled") {
      return ["cancelled", "declined"].includes(
        booking.booking.status.toLowerCase()
      );
    }
    return false;
  });

  // Animation effect when activeTab or bookings change
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, bookings]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulate refresh, replace with actual API call if needed
  }, []);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        className="w-24 h-24 mb-4 opacity-50"
      />
      <Text className="text-gray-500 text-lg text-center mb-4">
        No {activeTab} bookings found
      </Text>
      <TouchableOpacity
        className="bg-purple-600 px-6 py-3 rounded-full"
        onPress={() => {
          /* Navigate to booking creation screen */
        }}
      >
        <Text className="text-white font-medium">Book a Service Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompletedItem = useCallback(
    ({ item }: { item: BookingData }) => {
      const formattedAddress = `${item.technician.buildingName}, ${item.technician.areaName}, ${item.technician.city}, ${item.technician.state} - ${item.technician.pincode}`;
      return (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="bg-white rounded-xl p-4 shadow-md mb-4"
        >
          <TouchableOpacity
            onPress={() => onBookingSelect(item)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${item.service?.serviceName}`}
          >
            <View className="flex-row items-center mb-3">
              <Image
                source={{
                  uri:
                    item.service?.serviceImg ||
                    "https://via.placeholder.com/100",
                }}
                className="w-16 h-16 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {item.service?.serviceName || "Service not specified"}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  Technician:{" "}
                  <Text className="text-gray-900">
                    {item.technician.username}
                  </Text>
                </Text>
                <View className="flex-row justify-between mt-2">
                  <Text
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeTab === "upcoming"
                        ? "bg-purple-100 text-purple-600"
                        : activeTab === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.booking.status.charAt(0).toUpperCase() +
                      item.booking.status.slice(1).toLowerCase()}
                  </Text>
                </View>
                {/* <Text className="text-green-600 font-medium text-lg mt-1">
                  ₹{item.booking.totalPrice.toFixed(2)}
                </Text> */}
                <Text className="mt-2 text-sm text-gray-700">
                  ₹{" "}
                  <Text className="text-green-600 ">
                    {item.booking.totalPrice.toFixed(2)}
                  </Text>{" "}
                  • {item.booking.quantity}{" "}
                  {item.booking.quantity > 1 ? "services" : "service"}
                </Text>
              </View>
              <ChevronRight width={20} height={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [fadeAnim, onBookingSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: BookingData }) => (
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="bg-white rounded-xl p-4 border border-gray-100 mb-3 shadow-sm"
      >
        <TouchableOpacity
          onPress={() => onBookingSelect(item)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.service?.serviceName}`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center space-x-4">
            <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden mr-3">
              <Image
                source={{
                  uri:
                    item.service?.serviceImg ||
                    item.technician?.profileImage ||
                    "https://via.placeholder.com/80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text
                className="font-semibold text-gray-900 text-lg"
                numberOfLines={1}
              >
                {item.service?.serviceName || "Service not specified"}
              </Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                Technician:{" "}
                <Text className="text-gray-900">
                  {item.technician.username}
                </Text>
              </Text>
              <View className="flex-row justify-between mt-2">
                <Text
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeTab === "upcoming"
                      ? "bg-purple-100 text-purple-600"
                      : activeTab === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.booking.status.charAt(0).toUpperCase() +
                    item.booking.status.slice(1).toLowerCase()}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {new Date(item.booking.bookingDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </Text>
              </View>
              <Text className="mt-2 text-sm text-gray-700">
                ₹{" "}
                <Text className="text-blue-500">
                  {item.booking.totalPrice.toFixed(2)}
                </Text>{" "}
                • {item.booking.quantity}{" "}
                {item.booking.quantity > 1 ? "services" : "service"}
              </Text>
            </View>
            <ChevronRight width={20} height={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    ),
    [activeTab, fadeAnim, onBookingSelect]
  );

  return (
    <View className="flex-1 bg-gray-50 rounded-lg">
      <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3 gap-3 bg-white">
        <View
          className={`w-8 h-8 rounded-lg items-center justify-center ${
            activeTab === "upcoming"
              ? "bg-purple-100"
              : activeTab === "completed"
                ? "bg-green-100"
                : "bg-red-100"
          }`}
        >
          <ChevronRight
            width={16}
            height={16}
            color={
              activeTab === "upcoming"
                ? "#9333ea"
                : activeTab === "completed"
                  ? "#16a34a"
                  : "#dc2626"
            }
          />
        </View>
        <Text className="text-xl font-semibold text-gray-900">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (
          {filteredBookings.length})
        </Text>
      </View>

      {filteredBookings.length === 0 ? (
        renderEmptyState()
      ) : activeTab === "completed" ? (
        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredBookings.map((item, index) => (
            <View key={item.booking._id}>{renderCompletedItem({ item })}</View>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          className="flex-1 p-4"
          data={filteredBookings}
          keyExtractor={(item) => item.booking._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View className="h-4" />}
        />
      )}
    </View>
  );
};

export default React.memo(BookingsListScreen);
// import React from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { ChevronRight, Clock, MapPin, User, Star } from 'react-native-feather';

// interface BookingData {
//   booking: {
//     _id: string;
//     status: string;
//     bookingDate: string;
//     totalPrice: number;
//     quantity: number;
//     servicePrice: number;
//     rating?: number;
//     review?: string;
//   };
//   technician: {
//     username: string;
//     phoneNumber: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     profileImage?: string;
//   };
//   service: {
//     serviceName: string;
//     serviceImg: string;
//   } | null;
//   user: {
//     username: string;
//     phoneNumber: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
// }

// interface BookingsListProps {
//   bookings: BookingData[];
//   activeTab: 'upcoming' | 'completed' | 'cancelled';
//   onBookingSelect: (booking: BookingData) => void;
// }

// const BookingsListScreen: React.FC<BookingsListProps> = ({
//   bookings,
//   activeTab,
//   onBookingSelect,
// }) => {
//   const filteredBookings = bookings.filter((booking) => {
//     if (activeTab === 'upcoming') {
//       return ['upcoming', 'accepted', 'started'].includes(booking.booking.status.toLowerCase());
//     } else if (activeTab === 'completed') {
//       return booking.booking.status.toLowerCase() === 'completed';
//     } else if (activeTab === 'cancelled') {
//       return ['cancelled', 'declined'].includes(booking.booking.status.toLowerCase());
//     }
//     return false;
//   });

//   if (filteredBookings.length === 0) {
//     return (
//       <View className="flex-1 bg-white rounded-lg border border-gray-200">
//         <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//           <View
//             className={`w-8 h-8 rounded-lg items-center justify-center ${
//               activeTab === 'upcoming'
//                 ? 'bg-purple-100'
//                 : activeTab === 'completed'
//                 ? 'bg-green-100'
//                 : 'bg-red-100'
//             }`}
//           >
//             <ChevronRight
//               width={16}
//               height={16}
//               color={
//                 activeTab === 'upcoming'
//                   ? '#9333ea'
//                   : activeTab === 'completed'
//                   ? '#16a34a'
//                   : '#dc2626'
//               }
//             />
//           </View>
//           <Text className="text-xl font-semibold text-gray-900">
//             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//           </Text>
//         </View>
//         <View className="flex-1 p-6 items-center justify-center">
//           <Text className="text-gray-500">No {activeTab} bookings found</Text>
//         </View>
//       </View>
//     );
//   }

//   const renderCompletedItem = (item: BookingData) => {
//     const formattedAddress = `${item.technician.buildingName}, ${item.technician.areaName}, ${item.technician.city}, ${item.technician.state} - ${item.technician.pincode}`;
//     return (
//       <TouchableOpacity onPress={() => onBookingSelect(item)} className="bg-white rounded-xl p-4 shadow-md mb-4">
//         <View className="flex-row items-start mb-3">
//           <Image
//             source={{ uri: item.service?.serviceImg || 'https://via.placeholder.com/100' }}
//             className="w-16 h-16 rounded-lg mr-4"
//           />
//           <View className="flex-1">
//             <Text className="text-lg font-semibold text-gray-900">
//               {item.service?.serviceName}
//             </Text>
//             <Text className="text-green-600 font-medium text-lg mt-1">
//               ₹{item.booking.totalPrice}
//             </Text>
//           </View>
//           <View className="bg-green-100 px-3 py-1 rounded-full">
//             <Text className="text-green-600 text-xs font-medium">Completed</Text>
//           </View>
//         </View>

//         <View className="space-y-2 mb-3">
//           <View className="flex-row items-center">
//             <Clock width={16} height={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">
//               {new Date(item.booking.bookingDate).toLocaleDateString()}
//             </Text>
//           </View>

//           <View className="flex-row items-center">
//             <MapPin width={16} height={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2 flex-1">{formattedAddress}</Text>
//           </View>

//           <View className="flex-row items-center">
//             <User width={16} height={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{item.technician.username}</Text>
//           </View>
//         </View>

//         {item.booking.rating && (
//           <View className="flex-row items-center mb-2">
//             <View className="flex-row">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   width={16}
//                   height={16}
//                   fill={star <= (item.booking.rating || 0) ? "#fbbf24" : "none"}
//                   color="#fbbf24"
//                 />
//               ))}
//             </View>
//             <Text className="text-gray-600 ml-2">{item.booking.rating}/5</Text>
//           </View>
//         )}

//         {item.booking.review && (
//           <View className="bg-gray-50 p-3 rounded-lg mb-3">
//             <Text className="text-gray-700 italic">"{item.booking.review}"</Text>
//           </View>
//         )}

//         <TouchableOpacity className="bg-purple-600 py-3 rounded-lg items-center">
//           <Text className="text-white font-medium">Book Again</Text>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//         <View
//           className={`w-8 h-8 rounded-lg items-center justify-center ${
//             activeTab === 'upcoming'
//               ? 'bg-purple-100'
//               : activeTab === 'completed'
//               ? 'bg-green-100'
//               : 'bg-red-100'
//           }`}
//         >
//           <ChevronRight
//             width={16}
//             height={16}
//             color={
//               activeTab === 'upcoming'
//                 ? '#9333ea'
//                 : activeTab === 'completed'
//                 ? '#16a34a'
//                 : '#dc2626'
//             }
//           />
//         </View>
//         <Text className="ml-4 text-xl font-semibold text-gray-900">
//           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//         </Text>
//       </View>

//       {activeTab === 'completed' ? (
//         <ScrollView className="flex-1 p-4">
//           {filteredBookings.map((item) => renderCompletedItem(item))}
//         </ScrollView>
//       ) : (
//         <FlatList
//           className="flex-1"
//           data={filteredBookings}
//           keyExtractor={(item) => item.booking._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => onBookingSelect(item)}
//               className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3 active:bg-gray-100"
//             >
//               <View className="flex-row items-center space-x-4">
//                 <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
//                   <Image
//                     source={{
//                       uri:
//                         item.service?.serviceImg ||
//                         item.technician?.profileImage ||
//                         'https://via.placeholder.com/80',
//                     }}
//                     className="w-full h-full"
//                     resizeMode="cover"
//                   />
//                 </View>

//                 <View className="ml-4 flex-1">
//                   <Text className="font-semibold text-gray-900 text-lg" numberOfLines={1}>
//                     {item.service?.serviceName || 'Service not specified'}
//                   </Text>
//                   <Text className="text-gray-500 text-sm" numberOfLines={1}>
//                     Technician Name: <Text className="text-gray-900">{item.technician?.username}</Text>
//                   </Text>

//                   <View className="flex-row justify-between mt-2">
//                     <Text
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         activeTab === 'upcoming'
//                           ? 'bg-purple-100 text-purple-600'
//                           : activeTab === 'completed'
//                           ? 'bg-green-100 text-green-600'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {item.booking.status.charAt(0).toUpperCase() +
//                         item.booking.status.slice(1).toLowerCase()}
//                     </Text>
//                     <Text className="text-gray-400 text-xs">
//                       {new Date(item.booking.bookingDate).toLocaleDateString()}
//                     </Text>
//                   </View>

//                   <Text className="mt-2 text-sm text-gray-700">
//                     ₹ <Text className="text-blue-500">{item.booking.totalPrice.toFixed(2)}</Text> •{' '}
//                     {item.booking.quantity} {item.booking.quantity > 1 ? 'services' : 'service'}
//                   </Text>
//                 </View>

//                 <ChevronRight width={20} height={20} color="#9ca3af" />
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default BookingsListScreen;
// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { ChevronRight } from "lucide-react-native";

// interface BookingData {
//   booking: {
//     _id: string;
//     status: string;
//     bookingDate: string;
//     totalPrice: number;
//     quantity: number;
//     servicePrice: number;
//   };
//   technician: {
//     username: string;
//     profileImage?: string;
//   };
//   service: {
//     serviceName: string;
//     serviceImg: string;
//   } | null;
//   user?: {
//     username: string;
//   };
// }

// interface BookingsListProps {
//   bookings: BookingData[];
//   activeTab: "upcoming" | "completed" | "cancelled";
//   onBookingSelect: (booking: BookingData) => void;
//   role: "user" | "technician" | null;
// }

// const BookingsListScreen: React.FC<BookingsListProps> = ({
//   bookings,
//   activeTab,
//   onBookingSelect,
//   role,
// }) => {
//   const filteredBookings = bookings.filter((booking) => {
//     if (activeTab === "upcoming") {
//       return ["upcoming", "accepted", "started"].includes(
//         booking.booking.status.toLowerCase()
//       );
//     } else if (activeTab === "completed") {
//       return booking.booking.status.toLowerCase() === "completed";
//     } else if (activeTab === "cancelled") {
//       return ["cancelled", "declined"].includes(
//         booking.booking.status.toLowerCase()
//       );
//     }
//     return false;
//   });

//   if (filteredBookings?.length === 0) {
//     return (
//       <View className="flex-1 bg-white rounded-lg border border-gray-200">
//         <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//           <View
//             className={`w-8 h-8 rounded-lg items-center justify-center ${
//               activeTab === "upcoming"
//                 ? "bg-purple-100"
//                 : activeTab === "completed"
//                 ? "bg-green-100"
//                 : "bg-red-100"
//             }`}
//           >
//             <ChevronRight
//               size={16}
//               color={
//                 activeTab === "upcoming"
//                   ? "#9333ea"
//                   : activeTab === "completed"
//                   ? "#16a34a"
//                   : "#dc2626"
//               }
//             />
//           </View>
//           <Text className="text-xl font-semibold text-gray-900">
//             {activeTab === "upcoming"
//               ? "Upcoming"
//               : activeTab === "completed"
//               ? "Completed"
//               : "Cancelled"}
//           </Text>
//         </View>
//         <View className="flex-1 p-6 items-center justify-center">
//           <Text className="text-gray-500">No {activeTab} bookings found</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//         <View
//           className={`w-8 h-8 rounded-lg items-center justify-center ${
//             activeTab === "upcoming"
//               ? "bg-purple-100"
//               : activeTab === "completed"
//               ? "bg-green-100"
//               : "bg-red-100"
//           }`}
//         >
//           <ChevronRight
//             size={16}
//             color={
//               activeTab === "upcoming"
//                 ? "#9333ea"
//                 : activeTab === "completed"
//                 ? "#16a34a"
//                 : "#dc2626"
//             }
//             className=""
//           />
//         </View>
//         <Text className="ml-4 text-xl font-semibold text-gray-900">
//           {activeTab === "upcoming"
//             ? "Upcoming"
//             : activeTab === "completed"
//             ? "Completed"
//             : "Cancelled"}
//         </Text>
//       </View>

//       <FlatList
//         className="flex-1"
//         data={filteredBookings}
//         keyExtractor={(item) => item.booking._id}
//         renderItem={({ item }) => {
//           const isCancelled = ["cancelled", "declined"].includes(
//             item.booking.status.toLowerCase()
//           );

//           return (
//             <TouchableOpacity
//               disabled={isCancelled}
//               onPress={() => !isCancelled && onBookingSelect(item)}
//               className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3 ${
//                 isCancelled
//                   ? "opacity-80"
//                   : "active:bg-gray-100"
//               }`}
//             >
//               <View className="flex-row items-center space-x-4">
//                 <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
//                   <Image
//                     source={{
//                       uri:
//                         item.service?.serviceImg ||
//                         item.technician?.profileImage ||
//                         "https://via.placeholder.com/80",
//                     }}
//                     className="w-full h-full"
//                     resizeMode="cover"
//                   />
//                 </View>

//                 <View className="ml-4 flex-1">
//                   <Text className="font-semibold text-gray-900 text-lg" numberOfLines={1}>
//                     {item.service?.serviceName || "Service not specified"}
//                   </Text>
//                   <Text className="text-gray-500 text-sm" numberOfLines={1}>
//                     {role === "user" ? "Technician Name: " : "User Name: "}
//                     <Text className="text-gray-900">
//                       {role === "user"
//                         ? item.technician?.username
//                         : item?.user?.username}
//                     </Text>
//                   </Text>

//                   <View className="flex-row justify-between mt-2">
//                     <Text
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         activeTab === "upcoming"
//                           ? "bg-purple-100 text-purple-600"
//                           : activeTab === "completed"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.booking.status.charAt(0).toUpperCase() +
//                         item.booking.status.slice(1).toLowerCase()}
//                     </Text>
//                     <Text className="text-gray-400 text-xs">
//                       {new Date(item.booking.bookingDate).toLocaleDateString()}
//                     </Text>
//                   </View>

//                   <Text className="mt-2 text-sm text-gray-700">
//                     ₹{" "}
//                     <Text className="text-blue-500">
//                       {item.booking.totalPrice.toFixed(2)}
//                     </Text>{" "}
//                     • {item.booking.quantity}{" "}
//                     {item.booking.quantity > 1 ? "services" : "service"}
//                   </Text>
//                 </View>

//                 {!isCancelled && (
//                   <ChevronRight size={20} color="#9ca3af" />
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };

// export default BookingsListScreen;
// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { ChevronRight } from "lucide-react-native";

// interface BookingData {
//   booking: {
//     _id: string;
//     status: string;
//     bookingDate: string;
//     totalPrice: number;
//     quantity: number;
//     servicePrice: number;
//   };
//   technician: {
//     username: string;
//     profileImage?: string;
//   };
//   service: {
//     serviceName: string;
//     serviceImg: string;
//   } | null;
//   user?: {
//     username: string;
//   };
// }

// interface BookingsListProps {
//   bookings: BookingData[];
//   activeTab: "upcoming" | "completed" | "cancelled";
//   onBookingSelect: (booking: BookingData) => void;
//   role: "user" | "technician" | null;
// }

// const BookingsListScreen: React.FC<BookingsListProps> = ({
//   bookings,
//   activeTab,
//   onBookingSelect,
//   role,
// }) => {
//   const filteredBookings = bookings.filter((booking) => {
//     if (activeTab === "upcoming") {
//       return ["upcomming", "upcoming", "accepted", "started"].includes(
//         booking.booking.status.toLowerCase()
//       );
//     } else if (activeTab === "completed") {
//       return booking.booking.status.toLowerCase() === "completed";
//     } else if (activeTab === "cancelled") {
//       return ["cancelled", "declined"].includes(
//         booking.booking.status.toLowerCase()
//       );
//     }
//     return false;
//   });

//   if (filteredBookings?.length === 0) {
//     return (
//       <View className="bg-white rounded-lg border border-gray-200 min-h-96">
//         <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//           <View
//             className={`w-8 h-8 rounded-lg items-center justify-center ${
//               activeTab === "upcoming"
//                 ? "bg-purple-100"
//                 : activeTab === "completed"
//                 ? "bg-green-100"
//                 : "bg-red-100"
//             }`}
//           >
//             <ChevronRight
//               size={16}
//               color={
//                 activeTab === "upcoming"
//                   ? "#9333ea"
//                   : activeTab === "completed"
//                   ? "#16a34a"
//                   : "#dc2626"
//               }
//             />
//           </View>
//           <Text className="text-xl font-semibold text-gray-900">
//             {activeTab === "upcoming"
//               ? "Upcoming"
//               : activeTab === "completed"
//               ? "Completed"
//               : "Cancelled"}
//           </Text>
//         </View>
//         <View className="p-6 items-center justify-center h-64">
//           <Text className="text-gray-500">No {activeTab} bookings found</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="bg-white rounded-lg border border-gray-200 min-h-96">
//       <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//         <View
//           className={`w-8 h-8 rounded-lg items-center justify-center ${
//             activeTab === "upcoming"
//               ? "bg-purple-100"
//               : activeTab === "completed"
//               ? "bg-green-100"
//               : "bg-red-100"
//           }`}
//         >
//           <ChevronRight
//             size={16}
//             color={
//               activeTab === "upcoming"
//                 ? "#9333ea"
//                 : activeTab === "completed"
//                 ? "#16a34a"
//                 : "#dc2626"
//             }
//           />
//         </View>
//         <Text className="text-xl font-semibold text-gray-900">
//           {activeTab === "upcoming"
//             ? "Upcoming"
//             : activeTab === "completed"
//             ? "Completed"
//             : "Cancelled"}
//         </Text>
//       </View>

//       <FlatList
//         data={filteredBookings}
//         keyExtractor={(item) => item.booking._id}
//         renderItem={({ item }) => {
//           const isCancelled = ["cancelled", "declined"].includes(
//             item.booking.status.toLowerCase()
//           );

//           return (
//             <TouchableOpacity
//               disabled={isCancelled}
//               onPress={() => !isCancelled && onBookingSelect(item)}
//               className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3 ${
//                 isCancelled
//                   ? "opacity-80"
//                   : "active:bg-gray-100"
//               }`}
//             >
//               <View className="flex-row items-center space-x-4">
//                 <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
//                   <Image
//                     source={{
//                       uri:
//                         item.service?.serviceImg ||
//                         item.technician?.profileImage ||
//                         "https://via.placeholder.com/80",
//                     }}
//                     className="w-full h-full"
//                     resizeMode="cover"
//                   />
//                 </View>

//                 <View className="flex-1">
//                   <Text className="font-semibold text-gray-900 text-lg" numberOfLines={1}>
//                     {item.service?.serviceName || "Service not specified"}
//                   </Text>
//                   <Text className="text-gray-500 text-sm" numberOfLines={1}>
//                     {role === "user" ? "Technician Name: " : "User Name: "}
//                     <Text className="text-gray-900">
//                       {role === "user"
//                         ? item.technician?.username
//                         : item?.user?.username}
//                     </Text>
//                   </Text>

//                   <View className="flex-row justify-between mt-2">
//                     <Text
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         activeTab === "upcoming"
//                           ? "bg-purple-100 text-purple-600"
//                           : activeTab === "completed"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {item.booking.status.charAt(0).toUpperCase() +
//                         item.booking.status.slice(1).toLowerCase()}
//                     </Text>
//                     <Text className="text-gray-400 text-xs">
//                       {new Date(item.booking.bookingDate).toLocaleDateString()}
//                     </Text>
//                   </View>

//                   <Text className="mt-2 text-sm text-gray-700">
//                     ₹{" "}
//                     <Text className="text-blue-500">
//                       {item.booking.totalPrice.toFixed(2)}
//                     </Text>{" "}
//                     • {item.booking.quantity}{" "}
//                     {item.booking.quantity > 1 ? "services" : "service"}
//                   </Text>
//                 </View>

//                 {!isCancelled && (
//                   <ChevronRight size={20} color="#9ca3af" />
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };

// export default BookingsListScreen;
