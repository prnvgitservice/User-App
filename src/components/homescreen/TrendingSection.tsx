import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
}

interface TrendingSectionProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ categories, loading, error }) => {
  const navigation = useNavigation();

  const trendingCategoryNames = [
    'Plumber Services',
    'Electrician Services', 
    'Carpenter Services',
    'Painting Services',
    'Pest Control Services',
    'Deep Cleaning Services',
  ];

  const trendingCategories = categories.filter((category) =>
    trendingCategoryNames.includes(category.category_name)
  );

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Technicians', { category });
  };

  const renderTrendingItem = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="w-1/3 p-2"
    >
      <TouchableOpacity
        className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden active:scale-95"
        onPress={() => handleCategoryPress(item)}
      >
        {/* Colorful background effect on hover */}
        <View className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-active:opacity-20" />
        
        {/* Decorative ring effect */}
        <View className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 group-active:opacity-30 group-active:scale-150 -top-8 -left-8" />
        
        <Image
          source={{ uri: item.category_image }}
          className="w-16 h-16 relative z-10 group-active:scale-110"
          resizeMode="contain"
        />
        <Text className="font-semibold text-sm text-gray-800 text-center relative z-10 mt-2 group-active:text-indigo-600">
          {item.category_name}
        </Text>
        
        {/* Hover shine effect */}
        <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-active:opacity-60 transform -skew-x-12 translate-x-[-150%] group-active:translate-x-[150%]" />
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View className="text-center text-gray-600 py-4">
        <Text className="text-gray-600">Loading trending categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="text-center py-4">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto mb-8">
      {trendingCategories.length > 0 ? (
        <View>
          <Text className="text-2xl font-bold text-gray-900 mb-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            Trending Searches
          </Text>
          <FlatList
            data={trendingCategories}
            renderItem={renderTrendingItem}
            numColumns={3}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      ) : (
        <Text className="text-center text-gray-500 py-4">
          No trending categories available.
        </Text>
      )}
    </View>
  );
};

export default TrendingSection;