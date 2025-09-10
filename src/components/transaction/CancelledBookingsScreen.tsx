// screens/CancelledBookingsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Calendar, MapPin, Clock, User, RotateCcw } from "lucide-react-native";

interface Booking {
  _id: string;
  serviceName: string;
  serviceImg: string;
  technicianName: string;
  technicianImage: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  cancellationReason?: string;
}

const CancelledBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const fakeData: Booking[] = [
        {
          _id: "1",
          serviceName: "AC Repair Service",
          serviceImg: "https://via.placeholder.com/100",
          technicianName: "John Smith",
          technicianImage: "https://via.placeholder.com/50",
          bookingDate: "2024-01-12",
          bookingTime: "10:00 AM",
          address: "123 Main St, Hyderabad",
          totalPrice: 1499,
          status: "cancelled",
          cancellationReason: "Changed my mind"
        },
        {
          _id: "2",
          serviceName: "Deep Cleaning",
          serviceImg: "https://via.placeholder.com/100",
          technicianName: "Sarah Johnson",
          technicianImage: "https://via.placeholder.com/50",
          bookingDate: "2024-01-09",
          bookingTime: "2:30 PM",
          address: "456 Oak Ave, Hyderabad",
          totalPrice: 2499,
          status: "cancelled",
          cancellationReason: "Unexpected travel"
        },
      ];
      setBookings(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleReBook = (bookingId: string) => {
    // Handle rebooking logic here
    console.log("Re-booking:", bookingId);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Cancelled Bookings</Text>
      
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Calendar size={64} color="#9ca3af" />
          <Text className="text-gray-500 text-lg mt-4">No cancelled bookings</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <View key={booking._id} className="bg-white rounded-xl p-4 shadow-md mb-4">
            <View className="flex-row items-start mb-3">
              <Image
                source={{ uri: booking.serviceImg }}
                className="w-16 h-16 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {booking.serviceName}
                </Text>
                <Text className="text-red-600 font-medium text-lg mt-1">
                  ₹{booking.totalPrice}
                </Text>
              </View>
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-600 text-xs font-medium">Cancelled</Text>
              </View>
            </View>

            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Calendar size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">
                  {booking.bookingDate} at {booking.bookingTime}
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <MapPin size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2 flex-1">{booking.address}</Text>
              </View>
              
              <View className="flex-row items-center">
                <User size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">{booking.technicianName}</Text>
              </View>
            </View>

            {booking.cancellationReason && (
              <View className="bg-gray-50 p-3 rounded-lg mb-3">
                <Text className="text-gray-700">
                  <Text className="font-medium">Cancellation Reason: </Text>
                  {booking.cancellationReason}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => handleReBook(booking._id)}
              className="bg-purple-600 py-3 rounded-lg items-center flex-row justify-center"
            >
              <RotateCcw size={18} color="white" />
              <Text className="text-white font-medium ml-2">Re-book Service</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CancelledBookingsScreen;