import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { CategoryContext } from "@/src/context/CategoryContext";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status?: number;
}

const bgColors = [
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-emerald-100",
  "bg-orange-100",
];

const getRandomBgColor = () => {
  const i = Math.floor(Math.random() * bgColors.length);
  return bgColors[i];
};

const CategoriesGrid = () => {
  const navigation = useNavigation<any>();
  const { categories, loading, error } = useContext(CategoryContext);

  const renderCategory = (item: Category, index: number) => {
    const bgColor = getRandomBgColor();
    return (
      <Animated.View
        key={item._id}
        entering={FadeInDown.delay(index * 120).springify()}
        className="w-1/3 p-2"
      >
        <TouchableOpacity
          className="flex flex-col items-center p-4 rounded-2xl border border-gray-200 bg-white shadow-md active:scale-95"
          onPress={() =>
            navigation.navigate("Technicians", {
              categoryId: item._id,
              category: item.category_name,
            })
          }
        >
          <View
            className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-3 overflow-hidden`}
          >
            <Animated.Image
              entering={ZoomIn}
              source={{ uri: item.category_image }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
          <Text
            className="text-center text-sm line-clamp-1 font-medium text-gray-700"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.category_name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-500">Loading Categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white ">
        <Text className="text-red-500 text-base font-semibold">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-xl"
          onPress={() => {
            /* Retry logic can be handled in context if needed */
          }}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="px-4">
      {/* Most Popular */}

      <Text className="text-2xl font-bold text-gray-900 mb-3 mt-2">
        Most Popular Categories
      </Text>
      <View className="flex-row flex-wrap -mx-2">
        {categories
          .filter((c) => c.status === 1)
          .sort((a, b) => a.category_name.localeCompare(b.category_name))
          .map((item, index) => renderCategory(item, index))}
      </View>

      {/* Other Categories */}
      {/* <Text className="text-2xl font-bold text-gray-900 mt-6 mb-3">Other Categories</Text>
      <View className="flex-row flex-wrap -mx-2 mb-10">
      {categories
      .filter((c) => c.status === 0)
      .sort((a, b) => a.category_name.localeCompare(b.category_name))
      .map((item, index) => renderCategory(item, index))}
      </View> */}
    </View>
  );
};

export default CategoriesGrid;
