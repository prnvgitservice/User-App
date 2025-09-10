
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Calendar, MapPin, Clock, User, Star } from "lucide-react-native";

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
  rating?: number;
  review?: string;
}

const CompletedBookingsScreen: React.FC = () => {
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
          bookingDate: "2024-01-10",
          bookingTime: "10:00 AM",
          address: "123 Main St, Hyderabad",
          totalPrice: 1499,
          status: "completed",
          rating: 5,
          review: "Excellent service! Technician was very professional."
        },
        {
          _id: "2",
          serviceName: "Deep Cleaning",
          serviceImg: "https://via.placeholder.com/100",
          technicianName: "Sarah Johnson",
          technicianImage: "https://via.placeholder.com/50",
          bookingDate: "2024-01-08",
          bookingTime: "2:30 PM",
          address: "456 Oak Ave, Hyderabad",
          totalPrice: 2499,
          status: "completed",
          rating: 4,
          review: "Good service, but a bit delayed."
        },
        {
          _id: "3",
          serviceName: "Plumbing Repair",
          serviceImg: "https://via.placeholder.com/100",
          technicianName: "Mike Wilson",
          technicianImage: "https://via.placeholder.com/50",
          bookingDate: "2024-01-05",
          bookingTime: "11:15 AM",
          address: "789 Pine Rd, Hyderabad",
          totalPrice: 1299,
          status: "completed",
          rating: 5,
          review: "Quick and efficient service. Highly recommended!"
        },
      ];
      setBookings(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Completed Bookings</Text>
      
      {bookings.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Calendar size={64} color="#9ca3af" />
          <Text className="text-gray-500 text-lg mt-4">No completed bookings</Text>
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
                <Text className="text-green-600 font-medium text-lg mt-1">
                  ₹{booking.totalPrice}
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-600 text-xs font-medium">Completed</Text>
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

            {booking.rating && (
              <View className="flex-row items-center mb-2">
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= booking.rating! ? "#fbbf24" : "none"}
                      color="#fbbf24"
                    />
                  ))}
                </View>
                <Text className="text-gray-600 ml-2">{booking.rating}/5</Text>
              </View>
            )}

            {booking.review && (
              <View className="bg-gray-50 p-3 rounded-lg mb-3">
                <Text className="text-gray-700 italic">"{booking.review}"</Text>
              </View>
            )}

            <TouchableOpacity className="bg-purple-600 py-3 rounded-lg items-center">
              <Text className="text-white font-medium">Book Again</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CompletedBookingsScreen;