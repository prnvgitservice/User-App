import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { ChevronRight } from "lucide-react-native"; 
import { getOrdersByUserId } from "../api/apiMethods"; // same API call
import BookingsListScreen from "../components/homescreen/BookingsListScreen";

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
}

interface Technician {
  _id: string;
  username: string;
  profileImage?: string;
}

interface Service {
  _id: string;
  serviceName: string;
  serviceImg: string;
}

interface BookingData {
  booking: Booking;
  technician: Technician;
  service: Service | null;
  user?: { username: string };
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: {
    bookings: BookingData[];
  };
}

const TransactionPageScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [role, setRole] = useState<"user" | "technician" | null>(null);
  const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = "user"; // replace with AsyncStorage if needed
    setRole(storedRole);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = "123"; // replace with AsyncStorage value
      const response: ApiResponse = await getOrdersByUserId(userId);
      if (response.success) {
        setBookingsData(response.result.bookings);
      } else {
        setError(response.message || "Failed to fetch bookings");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">My Transactions</Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-500">Home</Text>
          <ChevronRight size={16} color="#6b7280" />
          <Text className="text-gray-500">My Transactions</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row space-x-3 mb-4">
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab
                ? tab === "upcoming"
                  ? "bg-purple-100"
                  : tab === "completed"
                  ? "bg-green-100"
                  : "bg-red-100"
                : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-medium ${
                activeTab === tab
                  ? tab === "upcoming"
                    ? "text-purple-600"
                    : tab === "completed"
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" />
      ) : error ? (
        <Text className="text-red-500 text-center">{error}</Text>
      ) : (
        <BookingsListScreen
          bookings={bookingsData}
          activeTab={activeTab}
          onBookingSelect={(booking) => console.log("Selected Booking:", booking)}
          role={role}
        />
      )}
    </ScrollView>
  );
};

export default TransactionPageScreen;
