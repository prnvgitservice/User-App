import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Rating } from "../../screens/TechnicianProfile";

interface ReviewsProps {
  ratings: Rating[];
}

const Reviews = ({ ratings }: ReviewsProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderReview = ({ item }: { item: Rating }) => (
    <View className="border border-gray-200 shadow rounded-xl p-3 flex-col">
      <View className="flex-row gap-3 items-center">
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/50" }}
          className="w-14 h-14 object-cover rounded-full"
        />
        <View className="flex-col">
          <Text className="text-md font-light">{item.name || "Anonymous"}</Text>
          <Text className="text-sm text-gray-500">{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <View className="flex-row ms-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name="star-outline"
            size={20}
            color={i < item.rating ? "#ffc71b" : "#ddd"}
          />
        ))}
      </View>
      <Text className="my-3 text-sm font-light ml-2 text-gray-600">{item.review || "No review provided"}</Text>
    </View>
  );

  return (
    <View className="border border-gray-200 shadow-md rounded-xl p-4 max-h-[80vh]">
      <Text className="text-xl font-light mb-4">Reviews</Text>

      {ratings?.length === 0 ? (
        <Text className="text-gray-600">No reviews available</Text>
      ) : (
        <FlatList
          data={ratings}
          renderItem={renderReview}
          keyExtractor={(item) => item._id}
          numColumns={1}
          contentContainerStyle={{ gap: 16 }}
        />
      )}
    </View>
  );
};

export default Reviews;