import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getAllBlogs } from "../../api/apiMethods"; // Adjust path as needed

// Define the Blog interface based on API response
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

// Define the API response interface
interface ApiResponse {
  success: boolean;
  data: Blog[];
}

const BlogList: React.FC = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.8; // 80% of screen width
  const cardSpacing = 16;
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response: ApiResponse = await getAllBlogs();
        if (response.success && Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          setError("No blogs found");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || blogs.length === 0) return;

    const autoScroll = () => {
      if (scrollViewRef.current) {
        const currentOffset = scrollPosition;
        const maxScroll = (cardWidth + cardSpacing) * (blogs.length - 1);

        if (currentOffset >= maxScroll - 1) {
          // Scroll back to the beginning
          scrollViewRef.current.scrollTo({ x: 0, animated: true });
          setScrollPosition(0);
        } else {
          // Scroll to the next card
          const newOffset = currentOffset + cardWidth + cardSpacing;
          scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
          setScrollPosition(newOffset);
        }
      }
    };

    scrollInterval.current = setInterval(autoScroll, 1000);

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [isPaused, blogs, scrollPosition]);

  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll events
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  // Handle touch events for swipe
  const handleTouchStart = () => {
    setIsPaused(true);
    // Resume auto-scroll after a delay when user stops interacting
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Calculate active indicator
  const getActiveIndicator = () => {
    return Math.floor(scrollPosition / (cardWidth + cardSpacing));
  };

  // Navigate to blog detail
  const navigateToBlog = (blog: Blog) => {
    navigation.navigate("BlogDetail", { blog });
  };

  // Navigate to all blogs
  const navigateToAllBlogs = () => {
    navigation.navigate("AllBlogs");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <Text className="text-gray-600">Loading blogs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }

  if (blogs.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <Text className="text-gray-600">No blogs available at the moment.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 py-6" onTouchStart={handleTouchStart}>
      <View className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-1 h-12 bg-pink-500 mr-3 rounded-full" />
            <Text className="text-3xl font-bold text-gray-900">Blogs</Text>
          </View>
          <TouchableOpacity onPress={navigateToAllBlogs}>
            <Text className="text-lg font-semibold text-blue-600">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Blog Cards ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          snapToInterval={cardWidth + cardSpacing}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: (screenWidth - cardWidth) / 2 - cardSpacing,
          }}
          className="pb-8"
        >
          {blogs.map((blog) => (
            <TouchableOpacity
              key={blog._id}
              className="bg-white rounded-xl shadow-md mx-2 overflow-hidden relative"
              style={{ width: cardWidth }}
              onPress={() => navigateToBlog(blog)}
              activeOpacity={0.9}
            >
              <View className="relative">
                <Image
                  source={{
                    uri: blog.image || "https://via.placeholder.com/300x200",
                  }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <View className="p-4">
                  <Text
                    className="text-lg font-bold text-gray-900 mb-2"
                    numberOfLines={2}
                  >
                    {blog.title}
                  </Text>
                  <View className="flex-row flex-wrap">
                    <View style={{ marginRight: 4 }}>
                      <Text style={{ fontSize: 18, color: "#2563EB" }}>🏷️</Text>
                    </View>
                    {blog.tags.slice(0, 2).map((tag, index) => (
                      <View
                        key={index}
                        className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-xs text-blue-800">{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View className="w-full flex flex-row justify-between items-center gap-2">

                  <Text className="text-xs text-gray-500 mt-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </Text>
                  <LinearGradient
                    colors={["#2563EB", "#7C3AED"]} // from-blue-600 to-purple-600
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{borderRadius:20, width: 'auto', paddingVertical: 10, paddingHorizontal: 20,}}
                    className=""
                  >
                    <Text className="text-white text-xs font-semibold text-center">
                      {blog.name}
                    </Text>
                  </LinearGradient>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Indicators */}
        <View className="flex-row justify-center mt-4">
          {blogs.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === getActiveIndicator()
                  ? "bg-blue-600 w-6"
                  : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default BlogList;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Animated, { FadeInDown } from 'react-native-reanimated';

// interface Blog {
//   _id: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Blog[];
// }

// const BlogSection: React.FC = () => {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Mock data for now - replace with your API call
//   useEffect(() => {
//     const mockBlogs = [
//       {
//         _id: '1',
//         name: 'Plumbing Tips',
//         title: 'Need To Find Hidden Water Leaks In Your Home? 5 Expert Tips',
//         image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
//         description: 'Expert tips for finding water leaks',
//         createdAt: '2025-09-04T00:00:00.000Z',
//         updatedAt: '2025-09-04T00:00:00.000Z',
//         tags: ['plumbing']
//       },
//       {
//         _id: '2',
//         name: 'Pest Control Guide',
//         title: '5 Dos and Don\'ts of an Effective Pest Control',
//         image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
//         description: 'Essential pest control tips',
//         createdAt: '2025-09-04T00:00:00.000Z',
//         updatedAt: '2025-09-04T00:00:00.000Z',
//         tags: ['pestcontrol']
//       },
//       {
//         _id: '3',
//         name: 'Appliance Maintenance',
//         title: '12 Essential Washing Machine Maintenance Tips',
//         image: 'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
//         description: 'Keep your washing machine running smoothly',
//         createdAt: '2025-09-04T00:00:00.000Z',
//         updatedAt: '2025-09-04T00:00:00.000Z',
//         tags: ['washingmachine']
//       }
//     ];

//     setTimeout(() => {
//       setBlogs(mockBlogs);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const getBlogCategory = (tags: string[]) => {
//     if (tags.includes('plumbing')) return 'Plumbing Services';
//     if (tags.includes('pestcontrol')) return 'Pest Control Service';
//     if (tags.includes('washingmachine')) return 'Washing Machine Service';
//     return 'General';
//   };

//   const getBlogCategoryColor = (tags: string[]) => {
//     if (tags.includes('plumbing')) return 'bg-blue-500';
//     if (tags.includes('pestcontrol')) return 'bg-green-500';
//     if (tags.includes('washingmachine')) return 'bg-purple-500';
//     return 'bg-gray-500';
//   };

//   const renderBlogItem = ({ item, index }: { item: Blog; index: number }) => (
//     <Animated.View
//       entering={FadeInDown.delay(index * 150).springify()}
//       className="w-80 mr-4"
//     >
//       <TouchableOpacity
//         className="bg-white rounded-lg shadow-md overflow-hidden active:scale-95"
//       >
//         <View className="relative">
//           <Image
//             source={{ uri: item.image || 'https://via.placeholder.com/400x200' }}
//             className="h-48 w-full"
//             resizeMode="cover"
//           />
//           <View className="absolute top-3 left-3">
//             <View className={`${getBlogCategoryColor(item.tags)} px-3 py-1 rounded-full`}>
//               <Text className="text-white text-xs font-medium">
//                 {getBlogCategory(item.tags)}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <View className="p-4">
//           <Text className="text-lg font-semibold text-gray-800 mb-2" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center">
//               <Ionicons name="calendar" size={14} color="#6b7280" />
//               <Text className="text-xs text-gray-500 ml-2 font-medium">
//                 {new Date(item.createdAt).toLocaleDateString()}
//               </Text>
//             </View>
//             <View className="flex-row items-center">
//               <Text className="text-red-600 text-sm font-semibold mr-1">Read More</Text>
//               <Ionicons name="arrow-forward" size={14} color="#dc2626" />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   if (loading) {
//     return (
//       <View className="py-8 items-center">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="mt-2 text-gray-500">Loading blogs...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="py-8 items-center">
//         <Text className="text-red-600 text-base font-semibold">{error}</Text>
//       </View>
//     );
//   }

//   if (blogs.length === 0) {
//     return (
//       <View className="py-8 items-center">
//         <Text className="text-gray-600">No blogs available at the moment.</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
//       <View className="flex-row justify-between items-center mb-6">
//         <View className="flex-row items-center">
//           <View className="w-1 h-12 bg-gradient-to-b from-pink-500 to-purple-500 mr-4" />
//           <Text className="text-4xl font-bold text-gray-900">Blogs</Text>
//         </View>
//         <TouchableOpacity >
//           <Text className="text-xl font-semibold text-blue-600">View All</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={blogs}
//         renderItem={renderBlogItem}
//         keyExtractor={(item) => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 4 }}
//       />
//     </View>
//   );
// };

// export default BlogSection;
