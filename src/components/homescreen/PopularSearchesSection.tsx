import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
}

interface PopularSearchesSectionProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const PopularSearchesSection: React.FC<PopularSearchesSectionProps> = ({ categories, loading, error }) => {
  const navigation = useNavigation();

  const popularCategoryNames = [
    'CCTV Repair & Services',
    'Lift Repair & Services',
    'Web & App Development Services',
    'Health Insurance Services',
    'Digital Marketing Services',
    'AC Repair & Services',
  ];

  const popularCategories = categories
    .filter((category) =>
      popularCategoryNames.some(
        (name) => category.category_name.toLowerCase() === name.toLowerCase()
      )
    )
    .slice(0, 6);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Technicians', { category });
  };

  const renderPopularItem = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 120).springify()}
      className="w-1/3 p-2"
    >
      <TouchableOpacity
        className="group relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center overflow-hidden active:shadow-xl"
        onPress={() => handleCategoryPress(item)}
      >
        {/* Animated gradient border on hover */}
        <View className="absolute inset-0 border-2 border-transparent rounded-lg group-active:border-emerald-400" />
        
        {/* Dynamic background glow on hover */}
        <View className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-active:opacity-30" />
        
        <Image
          source={{ uri: item.category_image }}
          className="w-16 h-16 relative z-10 group-active:scale-110"
          resizeMode="contain"
        />
        <Text className="text-xs font-semibold text-gray-800 text-center group-active:text-emerald-600 mt-2">
          {item.category_name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View className="text-center py-4">
        <Text className="text-gray-600">Loading popular categories...</Text>
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
    <View className="mb-8 mx-4 bg-gradient-to-br from-teal-100 to-blue-50 p-6 rounded-lg">
      <Text className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        Popular Searches
      </Text>
      <FlatList
        data={popularCategories.length > 0 ? popularCategories : []}
        renderItem={renderPopularItem}
        numColumns={3}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 col-span-6">
            No popular categories available.
          </Text>
        }
      />
    </View>
  );
};

export default PopularSearchesSection;