import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // RN version of lucide-react
import { getAllBlogs } from "../../api/apiMethods";

interface Blog {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: Blog[];
}

const AllBlogs: React.FC = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response: ApiResponse = await getAllBlogs({});
        if (response.success) {
          setBlogs(response.data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        setError("An error occurred while fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-2">Loading...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <Text className="text-red-600">{error}</Text>
        </View>
    );
  }

  const renderItem = ({ item }: { item: Blog }) => (
    <View className="bg-white rounded-xl shadow-md overflow-hidden m-2 flex-1">
      {/* Blog Image */}
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/400x200" }}
        className="h-40 w-full"
        resizeMode="cover"
      />

      {/* Blog Details */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-800" numberOfLines={2}>
          {item.title}
        </Text>

        {/* Date + Button Row */}
        <View className="flex-row w-full gap-3 justify-between items-center mt-3">
          <View className="flex-row items-center gap-2">
            {/* <Calendar size={16} color="#6b7280" className="mr-2" /> */}
            {/* <Ionicons name="calendar-outline" color="#000" size={16} /> */}
            <Text className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("BlogDetail", { blog: item })}
            className="px-2 py-1 rounded-lg bg-red-100"
          >
            <Text className="text-red-600 font-semibold text-sm">
              Read More →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
      <View className="flex-1 bg-gray-50 p-3">
        <FlatList
          data={blogs}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      </View>
  );
};

export default AllBlogs;
