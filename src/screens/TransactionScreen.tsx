import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrdersByUserId } from "../api/apiMethods";
import BookingsListScreen from "../components/transaction/BookingsList";
import CompletedDetailsScreen from "../components/transaction/CompletedDetailsScreen";
import CancelledCard from "../components/transaction/CancelledCard";
import SavingsScreen from "../components/transaction/SavingsScreen";
import FinalRatingScreen from "../components/transaction/FinalRatingScreen";
import CongratulationsModal from "../components/transaction/CongratulationsModal";
import BookingDetailsScreen from "../components/transaction/BookingDetaillsScreen";
import { RefreshControl } from "react-native-gesture-handler";

interface Booking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  quantity: number;
  bookingDate: string;
  servicePrice: number;
  gst: number;
  totalPrice: number;
  status: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rating?: number;
  review?: string;
}

interface Technician {
  _id: string;
  username: string;
  phoneNumber: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
}

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
}

interface Service {
  _id: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
}

interface BookingData {
  booking: Booking;
  technician: Technician;
  service: Service | null;
  user: User;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: {
    bookings: BookingData[];
  };
}

const TransactionPageScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");
  const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("bookings");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for content fade-in
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings(); // Re-fetch bookings data
    setRefreshing(false);
  };

    const transactionTabs = [
    { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-600' },
    { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-600' },
    { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-600' },
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const response: ApiResponse = await getOrdersByUserId(userId);
      if (response.success) {
        setBookingsData(response.result.bookings);
      } else {
        setError(response.message || "Failed to fetch bookings");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingSelect = (booking: BookingData) => {
    setSelectedBooking(booking);
    fadeAnim.setValue(0); 
    if (booking.booking.status.toLowerCase() === "completed") {
      setCurrentStep("completed-details");
    } else if (
      ["cancelled", "declined"].includes(booking.booking.status.toLowerCase())
    ) {
      setCurrentStep("cancelled-details");
    } else {
      setCurrentStep("booking-details");
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleTabPress = (tab: "upcoming" | "completed" | "cancelled") => {
    setActiveTab(tab);
    setCurrentStep("bookings");
    fadeAnim.setValue(0); 
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleRetry = () => {
    setError(null);
    fetchBookings();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#9333ea" />
          <Text className="mt-4 text-gray-600">
            Loading your transactions...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="bg-purple-600 px-6 py-2 rounded-full"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {currentStep === "bookings" && (
          <BookingsListScreen
            bookings={bookingsData}
            activeTab={activeTab}
            onBookingSelect={handleBookingSelect}
          />
        )}
        {currentStep === "booking-details" && selectedBooking && (
          <BookingDetailsScreen
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            setActiveTab={setActiveTab}
            refetchBookings={fetchBookings}
          />
        )}
        {currentStep === "completed-details" && selectedBooking && (
          <CompletedDetailsScreen
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === "cancelled-details" && selectedBooking && (
          <CancelledCard
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === "savings" && selectedBooking && (
          <SavingsScreen
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === "final-rating" && selectedBooking && (
          <FinalRatingScreen
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            refetchBookings={fetchBookings}
          />
        )}
        {currentStep === "congratulations" && (
          <CongratulationsModal setCurrentStep={setCurrentStep} />
        )}
      </Animated.View>
    );
  };

  return (
       
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white shadow-md">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          My Transactions
        </Text>

        <View className="flex-row justify-around">
          {transactionTabs.map((tab) => (
            <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id as 'upcoming' | 'completed' | 'cancelled')}
            className={`flex-1 py-3 rounded-lg mx-1 ${
                activeTab === tab.id ? tab.bgColor + ' border-b-2 ' + tab.borderColor : 'bg-gray-200'
              }`}
              accessibilityLabel={`Switch to ${tab.name} transactions`}
              accessibilityRole="button"
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab.id ? tab.color : 'text-gray-600'
                }`}
                >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView className="flex-1 px-4"
       refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#A21CAF", "fuchsia"]}
            tintColor="#A21CAF"
          />
        }

      >{renderContent()}</ScrollView>
                
    </View>
  );
};

export default TransactionPageScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getOrdersByUserId } from '../api/apiMethods';
// import BookingsListScreen from '../components/transaction/BookingsListScreen';
// import CompletedDetailsScreen from '../components/transaction/CompletedDetailsScreen';
// import CancelledCard from '../components/transaction/CancelledCard';
// import SavingsScreen from '../components/transaction/SavingsScreen';
// import FinalRatingScreen from '../components/transaction/FinalRatingScreen';
// import CongratulationsModal from '../components/transaction/CongratulationsModal';
// import BookingDetailsScreen from '../components/transaction/BookingDetaillsScreen';

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   rating?: number;
//   review?: string;
// }

// interface Technician {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// interface Service {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   service: Service | null;
//   user: User;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: {
//     bookings: BookingData[];
//   };
// }

// const TransactionPageScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
//   const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<string>('bookings');
//   const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem('userId');
//       const response: ApiResponse = await getOrdersByUserId(userId);
//       if (response.success) {
//         setBookingsData(response.result.bookings);
//       } else {
//         setError(response.message || 'Failed to fetch bookings');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Error fetching bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleBookingSelect = (booking: BookingData) => {
//     setSelectedBooking(booking);
//     if (booking.booking.status.toLowerCase() === 'completed') {
//       setCurrentStep('completed-details');
//     } else if (['cancelled', 'declined'].includes(booking.booking.status.toLowerCase())) {
//       setCurrentStep('cancelled-details');
//     } else {
//       setCurrentStep('booking-details');
//     }
//   };

//   const renderContent = () => {
//     if (currentStep === 'bookings') {
//       return (
//         <BookingsListScreen
//           bookings={bookingsData}
//           activeTab={activeTab}
//           onBookingSelect={handleBookingSelect}
//         />
//       );
//     }

//     if (currentStep === 'booking-details' && selectedBooking) {
//       return (
//         <BookingDetailsScreen
//           booking={selectedBooking}
//           setCurrentStep={setCurrentStep}
//           setActiveTab={setActiveTab}
//           refetchBookings={fetchBookings}
//         />
//       );
//     }

//     if (currentStep === 'completed-details' && selectedBooking) {
//       return (
//         <CompletedDetailsScreen
//           booking={selectedBooking}
//           setCurrentStep={setCurrentStep}
//         />
//       );
//     }

//     if (currentStep === 'cancelled-details' && selectedBooking) {
//       return (
//         <CancelledCard
//           booking={selectedBooking}
//           setCurrentStep={setCurrentStep}
//         />
//       );
//     }

//     if (currentStep === 'savings' && selectedBooking) {
//       return (
//         <SavingsScreen
//           booking={selectedBooking}
//           setCurrentStep={setCurrentStep}
//         />
//       );
//     }

//     if (currentStep === 'final-rating' && selectedBooking) {
//       return (
//         <FinalRatingScreen
//           booking={selectedBooking}
//           setCurrentStep={setCurrentStep}
//           refetchBookings={fetchBookings}
//         />
//       );
//     }

//     if (currentStep === 'congratulations') {
//       return (
//         <CongratulationsModal
//           setCurrentStep={setCurrentStep}
//         />
//       );
//     }

//     return null;
//   };

//   return (
//     <View className="flex-1 bg-gray-50 p-4">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold text-gray-900 mb-2">My Transactions</Text>
//       </View>

//       {currentStep === 'bookings' && (
//         <View className="flex-row space-x-3 mb-4">
//           {['upcoming', 'completed', 'cancelled'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab as any)}
//               className={`px-4 py-2 rounded-full ml-5 ${
//                 activeTab === tab
//                   ? tab === 'upcoming'
//                     ? 'bg-purple-100'
//                     : tab === 'completed'
//                       ? 'bg-green-100'
//                       : 'bg-red-100'
//                   : 'bg-gray-100'
//               }`}
//             >
//               <Text
//                 className={`font-medium ${
//                   activeTab === tab
//                     ? tab === 'upcoming'
//                       ? 'text-purple-600'
//                       : tab === 'completed'
//                         ? 'text-green-600'
//                         : 'text-red-600'
//                     : 'text-gray-600'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color="#9333ea" />
//       ) : error ? (
//         <Text className="text-red-500 text-center">{error}</Text>
//       ) : (
//         renderContent()
//       )}
//     </View>
//   );
// };

// export default TransactionPageScreen;
// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
// // import { ChevronRight } from "lucide-react-native";
// import { getOrdersByUserId } from "../api/apiMethods";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BookingsListScreen from "../components/transaction/BookingsListScreen";

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
// }

// interface Service {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   service: Service | null;
//   user?: { username: string };
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: {
//     bookings: BookingData[];
//   };
// }

// const TransactionPageScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<
//     "upcoming" | "completed" | "cancelled"
//   >("upcoming");
//   const [role, setRole] = useState<"user" | "technician" | null>(null);
//   const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = "user";
//     setRole(storedRole);
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem("userId");
//       const response: ApiResponse = await getOrdersByUserId(userId);
//       if (response.success) {
//         setBookingsData(response.result.bookings);
//       } else {
//         setError(response.message || "Failed to fetch bookings");
//       }
//     } catch (err: any) {
//       setError(err.message || "Error fetching bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   return (
//     <View className="flex-1 bg-gray-50 p-4">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold text-gray-900 mb-2">
//           My Transactions
//         </Text>
//         {/* <View className="flex-row items-center space-x-2">
//           <Text className="text-gray-500">Home</Text>
//           <ChevronRight size={16} color="#6b7280" />
//           <Text className="text-gray-500">My Transactions</Text>
//         </View> */}
//       </View>

//       {/* Tabs */}
//       <View className="flex-row space-x-3 mb-4">
//         {["upcoming", "completed", "cancelled"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab as any)}
//             className={`px-4 py-2 rounded-full ml-5 ${
//               activeTab === tab
//                 ? tab === "upcoming"
//                   ? "bg-purple-100"
//                   : tab === "completed"
//                     ? "bg-green-100"
//                     : "bg-red-100"
//                 : "bg-gray-100"
//             }`}
//           >
//             <Text
//               className={`font-medium ${
//                 activeTab === tab
//                   ? tab === "upcoming"
//                     ? "text-purple-600"
//                     : tab === "completed"
//                       ? "text-green-600"
//                       : "text-red-600"
//                   : "text-gray-600"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Content */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#9333ea" />
//       ) : error ? (
//         <Text className="text-red-500 text-center">{error}</Text>
//       ) : (
//         <BookingsListScreen
//           bookings={bookingsData}
//           activeTab={activeTab}
//           onBookingSelect={(booking) =>
//             console.log("Selected Booking:", booking)
//           }
//           role={role}
//         />
//       )}
//     </View>
//   );
// };

// export default TransactionPageScreen;
// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
// import { ChevronRight } from "lucide-react-native";
// import { getOrdersByUserId } from "../api/apiMethods";
// import BookingsListScreen from "../components/transaction/BookingsListScreen";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
// }

// interface Service {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   service: Service | null;
//   user?: { username: string };
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: {
//     bookings: BookingData[];
//   };
// }

// const TransactionPageScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
//   const [role, setRole] = useState<"user" | "technician" | null>(null);
//   const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = "user";
//     setRole(storedRole);
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem('userId');
//       const response: ApiResponse = await getOrdersByUserId(userId);
//       if (response.success) {
//         setBookingsData(response.result.bookings);
//       } else {
//         setError(response.message || "Failed to fetch bookings");
//       }
//     } catch (err: any) {
//       setError(err.message || "Error fetching bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   return (
//     <ScrollView className="flex-1 bg-gray-50 p-4">
//       <View className="mb-6">
//         {/* <Text className="text-3xl font-bold text-gray-900 mb-2">My Transactions</Text> */}
//         <View className="flex-row items-center space-x-2">
//           <Text className="text-gray-500">Home</Text>
//           <ChevronRight size={16} color="#6b7280" />
//           {/* <Text className="text-gray-500">My Transactions</Text> */}
//         </View>
//       </View>

//       {/* Tabs */}
//       <View className="flex-row space-x-3 mb-4">
//         {["upcoming", "completed", "cancelled"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab as any)}
//             className={`px-4 py-2 rounded-full ${
//               activeTab === tab
//                 ? tab === "upcoming"
//                   ? "bg-purple-100"
//                   : tab === "completed"
//                   ? "bg-green-100"
//                   : "bg-red-100"
//                 : "bg-gray-100"
//             }`}
//           >
//             <Text
//               className={`font-medium ${
//                 activeTab === tab
//                   ? tab === "upcoming"
//                     ? "text-purple-600"
//                     : tab === "completed"
//                     ? "text-green-600"
//                     : "text-red-600"
//                   : "text-gray-600"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Content */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#9333ea" />
//       ) : error ? (
//         <Text className="text-red-500 text-center">{error}</Text>
//       ) : (
//         <BookingsListScreen
//           bookings={bookingsData}
//           activeTab={activeTab}
//           onBookingSelect={(booking) => console.log("Selected Booking:", booking)}
//           role={role}
//         />
//       )}
//     </ScrollView>
//   );
// };

// export default TransactionPageScreen;
