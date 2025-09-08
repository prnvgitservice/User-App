import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Technician, Rating } from "../../screens/TechnicianProfile";

interface ProfileCardProps {
  technician: Technician;
  ratings: Rating[];
}

const ProfileCard = ({ technician}: ProfileCardProps) => {
  // const averageRating = ratings.length > 0
  //   ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
  //   : "N/A";
  // const ratingCount = ratings.length;

  return (
    <View className="border border-gray-300 rounded-xl p-5 flex-col relative overflow-hidden">
      <View className="flex-col items-center mb-4 w-full">
        <Image
          source={{ uri: technician.profileImage || "https://via.placeholder.com/150" }}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-xl font-semibold truncate">{technician.username || "Unknown Technician"}</Text>

        <View className="flex-row items-center gap-4 my-3">
          <View className="flex-row items-center border border-yellow-500 rounded-lg px-2 py-1">
            <Text>4.5</Text>
            <MaterialCommunityIcons name="star-outline" size={18} color="#ffc71b" className="ml-1" />
          </View>
          <Text className="text-gray-600 text-sm font-light">4 Ratings</Text>
        </View>
        {technician.service && (
          <View className="flex-row gap-2">
            <Text className="bg-pink-200 px-3 py-1 rounded-xl text-black text-sm font-light">
              {technician.service}
            </Text>
          </View>
        )}

        <View className="flex-row my-3 items-center">
          <Ionicons name="location-outline" size={27} color="red" />
          <Text className="text-sm font-light ml-2">
            {[
              technician.buildingName,
              technician.areaName,
              technician.city,
              technician.state,
            ]
              .filter(Boolean)
              .join(", ") || "Location not available"}
          </Text>
        </View>
        {technician.description && (
          <View className="flex-row items-center">
            <FontAwesome name="thumbs-up" size={22} color="#00B800" />
            <Text className="text-sm font-light ml-2">{technician.description}</Text>
          </View>
        )}

        <View className="flex-row gap-4 mt-4">
          <TouchableOpacity className="flex-row items-center bg-green-600 rounded-xl text-white px-4 py-1">
            <MaterialCommunityIcons name="message-text-outline" size={18} color="white" className="mr-2" />
            <Text className="text-white font-bold">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-blue-500 rounded-xl text-white px-4 py-1">
            <Ionicons name="share-social" size={18} color="white" className="mr-2" />
            <Text className="text-white font-bold">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;