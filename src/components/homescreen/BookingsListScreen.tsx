import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";

interface BookingData {
  booking: {
    _id: string;
    status: string;
    bookingDate: string;
    totalPrice: number;
    quantity: number;
    servicePrice: number;
  };
  technician: {
    username: string;
    profileImage?: string;
  };
  service: {
    serviceName: string;
    serviceImg: string;
  } | null;
  user?: {
    username: string;
  };
}

interface BookingsListProps {
  bookings: BookingData[];
  activeTab: "upcoming" | "completed" | "cancelled";
  onBookingSelect: (booking: BookingData) => void;
  role: "user" | "technician" | null;
}

const BookingsListScreen: React.FC<BookingsListProps> = ({
  bookings,
  activeTab,
  onBookingSelect,
  role,
}) => {
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return ["upcomming", "upcoming", "accepted", "started"].includes(
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

  if (filteredBookings?.length === 0) {
    return (
      <View className="bg-white rounded-lg border border-gray-200 min-h-96">
        <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
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
              size={16}
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
            {activeTab === "upcoming"
              ? "Upcoming"
              : activeTab === "completed"
              ? "Completed"
              : "Cancelled"}
          </Text>
        </View>
        <View className="p-6 items-center justify-center h-64">
          <Text className="text-gray-500">No {activeTab} bookings found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg border border-gray-200 min-h-96">
      <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
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
            size={16}
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
          {activeTab === "upcoming"
            ? "Upcoming"
            : activeTab === "completed"
            ? "Completed"
            : "Cancelled"}
        </Text>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.booking._id}
        renderItem={({ item }) => {
          const isCancelled = ["cancelled", "declined"].includes(
            item.booking.status.toLowerCase()
          );

          return (
            <TouchableOpacity
              disabled={isCancelled}
              onPress={() => !isCancelled && onBookingSelect(item)}
              className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3 ${
                isCancelled
                  ? "opacity-80"
                  : "active:bg-gray-100"
              }`}
            >
              <View className="flex-row items-center space-x-4">
                <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
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
                  <Text className="font-semibold text-gray-900 text-lg" numberOfLines={1}>
                    {item.service?.serviceName || "Service not specified"}
                  </Text>
                  <Text className="text-gray-500 text-sm" numberOfLines={1}>
                    {role === "user" ? "Technician Name: " : "User Name: "}
                    <Text className="text-gray-900">
                      {role === "user"
                        ? item.technician?.username
                        : item?.user?.username}
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
                      {new Date(item.booking.bookingDate).toLocaleDateString()}
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

                {!isCancelled && (
                  <ChevronRight size={20} color="#9ca3af" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default BookingsListScreen;
