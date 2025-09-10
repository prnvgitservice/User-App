import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

// Your 3 ad images (using your provided paths)
const bannerImages = [
  {
    id: "1",
    source: require("../../../assets/user_b.jpg"),
  },
  {
    id: "2",
    source: require("../../../assets/user_b2.jpg"),
  },
  {
    id: "3",
    source: require("../../../assets/u.jpg"),
  },
];

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000); // Increased to 3s for better user experience
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-white items-center pt-4 px-4">
      {/* Welcome header and subtitle */}
      <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
        Hyderabad's Largest Marketplace !!
      </Text>
      <Text className=" font-semibold text-blue-800 text-center mb-4">
        Search From Awesome Verified Professionals
      </Text>

      {/* Image Carousel */}
      <View
        className="rounded-xl overflow-hidden shadow-lg mb-4"
        style={{ width: screenWidth - 32, height: 160 }} // Inline style for dynamic width
      >
        <Image
          source={bannerImages[currentIndex].source} // Use source directly
          className="w-full h-full"
          resizeMode="cover"
          accessibilityLabel={`Banner image ${currentIndex + 1}`}
        />
      </View>

      {/* Carousel Indicators */}
      {/* <View className="flex-row justify-center items-center">
        {bannerImages.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              currentIndex === index ? "bg-blue-800" : "bg-gray-300"
            }`}
          />
        ))}
      </View> */}
    </View>
  );
};

export default BannerCarousel;
{/* Carousel with AdvertisementBanner's UI */}
{/* <Carousel
  width={screenWidth - 32} // Padding for edge spacing
  height={BANNER_HEIGHT}
  data={bannerImages}
  loop={true}
  autoPlay={true}
  autoPlayInterval={2000} // Match AdvertisementBanner's 2s interval
  mode="parallax" // Keep smooth parallax effect
  modeConfig={{
    parallaxScrollingScale: 0.9, // Subtle zoom-out for adjacent slides
    parallaxScrollingOffset: 50, // Spacing between slides
  }}
  renderItem={renderItem}
  onSnapToItem={(index) => setCurrentIndex(index % bannerImages.length)}
  style={{ borderRadius: 12, overflow: 'hidden' }} // Slightly tighter radius for consistency
/>

{/* Pagination */}
{/* {renderPagination()} */}
// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Carousel from 'react-native-reanimated-carousel';

// const { width: screenWidth } = Dimensions.get('window');
// const BANNER_HEIGHT = 150; // Adjust for your design; ~40% of screen height is ideal

// // Your 3 ad images (replace with your actual images)
// const bannerImages = [
//   { id: '1', source: require('../../../assets/user_b.jpg'), title: 'Discover Amazing Deals!' },
//   { id: '2', source: require('../../../assets/user_b2.jpg'), title: 'Unlock Exclusive Offers' },
//   { id: '3', source: require('../../../assets/u.jpg'), title: 'Shop Now & Save Big' },
// ];

// const BannerCarousel: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Render each carousel item
//   const renderItem = ({ item }: { item: typeof bannerImages[0] }) => (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       className="w-full h-40 rounded-2xl overflow-hidden"
//       onPress={() => console.log(`Ad ${item.id} clicked!`)} // Add navigation or action
//     >
//       <Image
//         source={item.source}
//         className="w-full h-full"
//         resizeMode="cover" // Ensures images scale nicely
//       />
//       {/* Overlay for ad text/CTA */}
//       <View className="absolute bottom-4 left-4 right-4">
//         <Text className="text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-md">
//           {item.title}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   // Pagination dots
//   const renderPagination = () => (
//     <View className="flex-row justify-center items-center mt-4">
//       {bannerImages.map((_, index) => (
//         <TouchableOpacity
//           key={index}
//           className={`w-2.5 h-2.5 rounded-full mx-1.5 ${
//             index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
//           }`}
//           onPress={() => setCurrentIndex(index)} // Optional: Allow dot tap to navigate
//         />
//       ))}
//     </View>
//   );

//   return (
//     <GestureHandlerRootView className="flex-1 bg-white">
//       <View className="flex-1 justify-center items-center px-4 pt-6">
//         {/* Welcome header for first-screen feel */}
//         <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
//           {/* Welcome to Our App! */}
//           Hyderabad's Largest Marketplace !!
//         </Text>

//         <Text className="text-sm font-bold text-blue-800 mb-4 text-center">
//           Search From Awesome Verified Professionals
//         </Text>

//         {/* Carousel */}
//         <Carousel
//           width={screenWidth - 32} // Padding for edge spacing
//           height={BANNER_HEIGHT}
//           data={bannerImages}
//           loop={true}
//           autoPlay={true}
//           autoPlayInterval={3000} // 3s auto-scroll
//           mode="parallax" // Smooth, modern effect
//           modeConfig={{
//             parallaxScrollingScale: 0.9, // Subtle zoom-out for adjacent slides
//             parallaxScrollingOffset: 50, // Spacing between slides
//           }}
//           renderItem={renderItem}
//           onSnapToItem={(index) => setCurrentIndex(index % bannerImages.length)}
//           style={{ borderRadius: 16, overflow: 'hidden' }} // Rounded carousel container
//         />

//         {/* Pagination */}
//         {renderPagination()}
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default BannerCarousel;
