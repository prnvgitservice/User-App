import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Blog {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Blog[];
}

const BlogSection: React.FC = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now - replace with your API call
  useEffect(() => {
    const mockBlogs = [
      {
        _id: '1',
        name: 'Plumbing Tips',
        title: 'Need To Find Hidden Water Leaks In Your Home? 5 Expert Tips',
        image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
        description: 'Expert tips for finding water leaks',
        createdAt: '2025-09-04T00:00:00.000Z',
        updatedAt: '2025-09-04T00:00:00.000Z',
        tags: ['plumbing']
      },
      {
        _id: '2',
        name: 'Pest Control Guide',
        title: '5 Dos and Don\'ts of an Effective Pest Control',
        image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
        description: 'Essential pest control tips',
        createdAt: '2025-09-04T00:00:00.000Z',
        updatedAt: '2025-09-04T00:00:00.000Z',
        tags: ['pestcontrol']
      },
      {
        _id: '3',
        name: 'Appliance Maintenance',
        title: '12 Essential Washing Machine Maintenance Tips',
        image: 'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
        description: 'Keep your washing machine running smoothly',
        createdAt: '2025-09-04T00:00:00.000Z',
        updatedAt: '2025-09-04T00:00:00.000Z',
        tags: ['washingmachine']
      }
    ];

    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBlogPress = (blog: Blog) => {
    navigation.navigate('Blog', { blog });
  };

  const handleViewAllPress = () => {
    navigation.navigate('AllBlogs');
  };

  const getBlogCategory = (tags: string[]) => {
    if (tags.includes('plumbing')) return 'Plumbing Services';
    if (tags.includes('pestcontrol')) return 'Pest Control Service';
    if (tags.includes('washingmachine')) return 'Washing Machine Service';
    return 'General';
  };

  const getBlogCategoryColor = (tags: string[]) => {
    if (tags.includes('plumbing')) return 'bg-blue-500';
    if (tags.includes('pestcontrol')) return 'bg-green-500';
    if (tags.includes('washingmachine')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const renderBlogItem = ({ item, index }: { item: Blog; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 150).springify()}
      className="w-80 mr-4"
    >
      <TouchableOpacity
        className="bg-white rounded-lg shadow-md overflow-hidden active:scale-95"
        onPress={() => handleBlogPress(item)}
      >
        <View className="relative">
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/400x200' }}
            className="h-48 w-full"
            resizeMode="cover"
          />
          <View className="absolute top-3 left-3">
            <View className={`${getBlogCategoryColor(item.tags)} px-3 py-1 rounded-full`}>
              <Text className="text-white text-xs font-medium">
                {getBlogCategory(item.tags)}
              </Text>
            </View>
          </View>
        </View>
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2" numberOfLines={2}>
            {item.title}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 ml-2 font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-red-600 text-sm font-semibold mr-1">Read More</Text>
              <Ionicons name="arrow-forward" size={14} color="#dc2626" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-500">Loading blogs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-8 items-center">
        <Text className="text-red-600 text-base font-semibold">{error}</Text>
      </View>
    );
  }

  if (blogs.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-600">No blogs available at the moment.</Text>
      </View>
    );
  }

  return (
    <View className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <View className="w-1 h-12 bg-gradient-to-b from-pink-500 to-purple-500 mr-4" />
          <Text className="text-4xl font-bold text-gray-900">Blogs</Text>
        </View>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text className="text-xl font-semibold text-blue-600">View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </View>
  );
};

export default BlogSection;