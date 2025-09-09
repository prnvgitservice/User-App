import React, { useContext, useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { CategoryContext } from '../../context/CategoryContext'; // Adjust path as needed
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
}

interface TrendingItemProps {
  item: Category;
  index: number;
}

interface TrendingSectionProps {
  // No props needed, data from context
}

// Separate component for each item to use hooks properly
const TrendingItem: React.FC<TrendingItemProps> = ({ item, index }) => {
  const navigation = useNavigation();
  const scaleValue = useSharedValue(1);
  const imageScaleValue = useSharedValue(1);
  const shineTranslate = useSharedValue(-150);
  const shineOpacity = useSharedValue(0.3);
  const ringOpacity = useSharedValue(0.2);
  const ringScale = useSharedValue(1);
  const textColor = useSharedValue('rgb(55, 65, 81)'); // text-gray-800

  const handleCategoryPress = useCallback(() => {
    navigation.navigate('Technicians', { category: item });
  }, [item, navigation]);

  const handlePressIn = () => {
    'worklet';
    scaleValue.value = withTiming(0.95, { duration: 150 });
    imageScaleValue.value = withTiming(1.1, { duration: 200 });
    shineTranslate.value = withTiming(150, { duration: 800 });
    shineOpacity.value = withTiming(0.6, { duration: 800 });
    ringOpacity.value = withTiming(0.3, { duration: 200 });
    ringScale.value = withTiming(1.5, { duration: 200 });
    textColor.value = withTiming('rgb(79, 70, 229)', { duration: 200 }); // indigo-600
  };

  const handlePressOut = () => {
    'worklet';
    scaleValue.value = withTiming(1, { duration: 150 });
    imageScaleValue.value = withTiming(1, { duration: 200 });
    shineTranslate.value = withTiming(-150, { duration: 300 });
    shineOpacity.value = withTiming(0.3, { duration: 300 });
    ringOpacity.value = withTiming(0.2, { duration: 200 });
    ringScale.value = withTiming(1, { duration: 200 });
    textColor.value = withTiming('rgb(55, 65, 81)', { duration: 200 });
  };

  const handleTap = () => {
    'worklet';
    runOnJS(handleCategoryPress)();
  };

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      handlePressIn();
    })
    .onEnd(() => {
      handlePressOut();
      handleTap();
    })
    .onFinalize(() => {
      handlePressOut();
    });

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScaleValue.value }],
  }));

  const animatedShineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shineTranslate.value }, { skewX: '-12deg' }],
    opacity: shineOpacity.value,
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  // Fallback image or validation
  const imageSource = item.category_image ? { uri: item.category_image } : { uri: 'https://via.placeholder.com/150' }; // Placeholder if image is missing

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="w-1/3 p-2"
    >
      <GestureDetector gesture={tapGesture}>
        <Animated.View
          className="relative rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden"
          style={animatedItemStyle}
        >
          {/* Gradient background */}
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']} // from-white to-gray-50
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 rounded-xl"
          />
          {/* Colorful background effect */}
          <Animated.View
            className="absolute inset-0"
            style={animatedRingStyle}
          >
            <LinearGradient
              colors={['#4F46E5', '#A855F7', '#EC4899']} // indigo-500 via-purple-500 to-pink-500
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0"
            />
          </Animated.View>
          {/* Decorative ring effect */}
          <Animated.View
            className="absolute w-24 h-24 rounded-full -top-8 -left-8"
            style={animatedRingStyle}
          >
            <LinearGradient
              colors={['#4F46E5', '#A855F7']} // indigo-400 to-purple-400
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0 rounded-full"
            />
          </Animated.View>
          <Animated.Image
            source={imageSource}
            className="w-16 h-16 relative z-10"
            resizeMode="contain"
            style={animatedImageStyle}
          />
          <Animated.Text
            className="font-semibold text-sm text-center relative z-10 mt-2 line-clamp-1"
            style={animatedTextStyle}
          >
            {item.category_name}
          </Animated.Text>
          {/* Shine effect */}
          <Animated.View
            className="absolute inset-0"
            style={animatedShineStyle}
          >
            <LinearGradient
              colors={['transparent', '#ffffff', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="absolute inset-0"
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const TrendingSection: React.FC<TrendingSectionProps> = () => {
  const { categories, loading, error } = useContext(CategoryContext);

  const trendingCategoryNames = [
    'Plumber Services',
    'Electrician Services',
    'Carpenter Services',
    'Painting Services',
    'Pest Control Services',
    'Deep Cleaning Services',
  ];

  const trendingCategories = categories.filter((category: Category) =>
    trendingCategoryNames.includes(category.category_name)
  );

  const renderItems = useCallback(() => {
    const rows = [];
    for (let i = 0; i < trendingCategories.length; i += 3) {
      const rowItems = trendingCategories.slice(i, i + 3);
      rows.push(
        <View key={i} className="flex-row justify-between">
          {rowItems.map((item, index) => (
            <TrendingItem key={item._id} item={item} index={i + index} />
          ))}
        </View>
      );
    }
    return rows;
  }, [trendingCategories]);

  if (loading) {
    return (
      <View className="text-center text-gray-600 py-4 animate-pulse">
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
    <View className="mx-auto mb-12 px-4">
      {trendingCategories.length > 0 ? (
        <View>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']} // indigo-600 to-purple-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-lg px-4 py-2 mb-4"
          >
            <Text className="text-2xl font-bold text-white">
              Trending Searches
            </Text>
          </LinearGradient>
          {renderItems()}
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
// import React, { useContext, useCallback } from 'react';
// import { View, Text, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
// import { CategoryContext } from '../../context/CategoryContext'; // Adjust path as needed
// import { LinearGradient } from 'expo-linear-gradient';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
// }

// interface TrendingItemProps {
//   item: Category;
//   index: number;
// }

// interface TrendingSectionProps {
//   // No props needed, data from context
// }

// // Separate component for each item to use hooks properly
// const TrendingItem: React.FC<TrendingItemProps> = ({ item, index }) => {
//   const navigation = useNavigation();
//   const scaleValue = useSharedValue(1);
//   const imageScaleValue = useSharedValue(1);
//   const shineTranslate = useSharedValue(-150);
//   const shineOpacity = useSharedValue(0.3);
//   const ringOpacity = useSharedValue(0.2);
//   const ringScale = useSharedValue(1);
//   const textColor = useSharedValue('rgb(55, 65, 81)'); // text-gray-800

//   const handleCategoryPress = useCallback(() => {
//     navigation.navigate('Technicians', { category: item });
//   }, [item, navigation]);

//   const handlePressIn = () => {
//     'worklet';
//     scaleValue.value = withTiming(0.95, { duration: 150 });
//     imageScaleValue.value = withTiming(1.1, { duration: 200 });
//     shineTranslate.value = withTiming(150, { duration: 800 });
//     shineOpacity.value = withTiming(0.6, { duration: 800 });
//     ringOpacity.value = withTiming(0.3, { duration: 200 });
//     ringScale.value = withTiming(1.5, { duration: 200 });
//     textColor.value = withTiming('rgb(79, 70, 229)', { duration: 200 }); // indigo-600
//   };

//   const handlePressOut = () => {
//     'worklet';
//     scaleValue.value = withTiming(1, { duration: 150 });
//     imageScaleValue.value = withTiming(1, { duration: 200 });
//     shineTranslate.value = withTiming(-150, { duration: 300 });
//     shineOpacity.value = withTiming(0.3, { duration: 300 });
//     ringOpacity.value = withTiming(0.2, { duration: 200 });
//     ringScale.value = withTiming(1, { duration: 200 });
//     textColor.value = withTiming('rgb(55, 65, 81)', { duration: 200 });
//   };

//   const handleTap = () => {
//     'worklet';
//     runOnJS(handleCategoryPress)();
//   };

//   const tapGesture = Gesture.Tap()
//     .onBegin(() => {
//       handlePressIn();
//     })
//     .onEnd(() => {
//       handlePressOut();
//       handleTap();
//     })
//     .onFinalize(() => {
//       handlePressOut();
//     });

//   const animatedItemStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scaleValue.value }],
//   }));

//   const animatedImageStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: imageScaleValue.value }],
//   }));

//   const animatedShineStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: shineTranslate.value }, { skewX: '-12deg' }],
//     opacity: shineOpacity.value,
//   }));

//   const animatedRingStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: ringScale.value }],
//     opacity: ringOpacity.value,
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => ({
//     color: textColor.value,
//   }));

//   return (
//     <Animated.View
//       entering={FadeInDown.delay(index * 100).springify()}
//       className="w-1/3 p-2"
//     >
//       <GestureDetector gesture={tapGesture}>
//         <Animated.View
//           className="relative rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden"
//           style={animatedItemStyle}
//         >
//           {/* Gradient background */}
//           <LinearGradient
//             colors={['#ffffff', '#f3f4f6']} // from-white to-gray-50
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             className="absolute inset-0 rounded-xl"
//           />
//           {/* Colorful background effect */}
//           <Animated.View
//             className="absolute inset-0"
//             style={animatedRingStyle}
//           >
//             <LinearGradient
//               colors={['#4F46E5', '#A855F7', '#EC4899']} // indigo-500 via-purple-500 to-pink-500
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               className="absolute inset-0"
//             />
//           </Animated.View>
//           {/* Decorative ring effect */}
//           <Animated.View
//             className="absolute w-24 h-24 rounded-full -top-8 -left-8"
//             style={animatedRingStyle}
//           >
//             <LinearGradient
//               colors={['#4F46E5', '#A855F7']} // indigo-400 to-purple-400
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               className="absolute inset-0 rounded-full"
//             />
//           </Animated.View>
//           <Animated.Image
//             source={{uri: item?.category_image}}
//             className="w-16 h-16 relative z-10"
//             resizeMode="contain"
//             style={animatedImageStyle}
//           />
//           <Animated.Text
//             className="font-semibold text-sm text-center relative z-10 mt-2 line-clamp-1"
//             style={animatedTextStyle}
//           >
//             {item.category_name}
//           </Animated.Text>
//           {/* Shine effect */}
//           <Animated.View
//             className="absolute inset-0"
//             style={animatedShineStyle}
//           >
//             <LinearGradient
//               colors={['transparent', '#ffffff', 'transparent']}
//               start={{ x: 0, y: 0.5 }}
//               end={{ x: 1, y: 0.5 }}
//               className="absolute inset-0"
//             />
//           </Animated.View>
//         </Animated.View>
//       </GestureDetector>
//     </Animated.View>
//   );
// };

// const TrendingSection: React.FC<TrendingSectionProps> = () => {
//   const { categories, loading, error } = useContext(CategoryContext);

//   const trendingCategoryNames = [
//     'Plumber Services',
//     'Electrician Services',
//     'Carpenter Services',
//     'Painting Services',
//     'Pest Control Services',
//     'Deep Cleaning Services',
//   ];

//   const trendingCategories = categories.filter((category: Category) =>
//     trendingCategoryNames.includes(category.category_name)
//   );

//   const renderItems = useCallback(() => {
//     const rows = [];
//     for (let i = 0; i < trendingCategories.length; i += 3) {
//       const rowItems = trendingCategories.slice(i, i + 3);
//       rows.push(
//         <View key={i} className="flex-row justify-between">
//           {rowItems.map((item, index) => (
//             <TrendingItem key={item._id} item={item} index={i + index} />
//           ))}
//         </View>
//       );
//     }
//     return rows;
//   }, [trendingCategories]);

//   if (loading) {
//     return (
//       <View className="text-center text-gray-600 py-4 animate-pulse">
//         <Text className="text-gray-600">Loading trending categories...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="text-center py-4">
//         <Text className="text-red-500">Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="mx-auto mb-12 px-4">
//       {trendingCategories.length > 0 ? (
//         <View>
//           <LinearGradient
//             colors={['#4F46E5', '#7C3AED']} // indigo-600 to-purple-600
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             className="rounded-lg px-4 py-2 mb-4"
//           >
//             <Text className="text-2xl font-bold text-white">
//               Trending Searches
//             </Text>
//           </LinearGradient>
//           {renderItems()}
//         </View>
//       ) : (
//         <Text className="text-center text-gray-500 py-4">
//           No trending categories available.
//         </Text>
//       )}
//     </View>
//   );
// };

// export default TrendingSection;
// import React, { useContext, useCallback } from 'react';
// import { View, Text, FlatList, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
// import { CategoryContext } from '../../context/CategoryContext'; // Adjust path as needed
// import { LinearGradient } from 'expo-linear-gradient';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
// }

// interface TrendingItemProps {
//   item: Category;
//   index: number;
// }

// interface TrendingSectionProps {
//   // No props needed, data from context
// }

// // Separate component for each item to use hooks properly
// const TrendingItem: React.FC<TrendingItemProps> = ({ item, index }) => {
//   const navigation = useNavigation();
//   const scaleValue = useSharedValue(1);
//   const imageScaleValue = useSharedValue(1);
//   const shineTranslate = useSharedValue(-150);
//   const shineOpacity = useSharedValue(0.3);
//   const ringOpacity = useSharedValue(0.2);
//   const ringScale = useSharedValue(1);
//   const textColor = useSharedValue('rgb(55, 65, 81)'); // text-gray-800

//   const handleCategoryPress = useCallback(() => {
//     navigation.navigate('Technicians', { category: item });
//   }, [item, navigation]);

//   const handlePressIn = () => {
//     'worklet';
//     scaleValue.value = withTiming(0.95, { duration: 150 });
//     imageScaleValue.value = withTiming(1.1, { duration: 200 });
//     shineTranslate.value = withTiming(150, { duration: 800 });
//     shineOpacity.value = withTiming(0.6, { duration: 800 });
//     ringOpacity.value = withTiming(0.3, { duration: 200 });
//     ringScale.value = withTiming(1.5, { duration: 200 });
//     textColor.value = withTiming('rgb(79, 70, 229)', { duration: 200 }); // indigo-600
//   };

//   const handlePressOut = () => {
//     'worklet';
//     scaleValue.value = withTiming(1, { duration: 150 });
//     imageScaleValue.value = withTiming(1, { duration: 200 });
//     shineTranslate.value = withTiming(-150, { duration: 300 });
//     shineOpacity.value = withTiming(0.3, { duration: 300 });
//     ringOpacity.value = withTiming(0.2, { duration: 200 });
//     ringScale.value = withTiming(1, { duration: 200 });
//     textColor.value = withTiming('rgb(55, 65, 81)', { duration: 200 });
//   };

//   const handleTap = () => {
//     'worklet';
//     runOnJS(handleCategoryPress)();
//   };

//   const tapGesture = Gesture.Tap()
//     .onBegin(() => {
//       handlePressIn();
//     })
//     .onEnd(() => {
//       handlePressOut();
//       handleTap();
//     })
//     .onFinalize(() => {
//       handlePressOut();
//     });

//   const animatedItemStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scaleValue.value }],
//   }));

//   const animatedImageStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: imageScaleValue.value }],
//   }));

//   const animatedShineStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: shineTranslate.value }, { skewX: '-12deg' }],
//     opacity: shineOpacity.value,
//   }));

//   const animatedRingStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: ringScale.value }],
//     opacity: ringOpacity.value,
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => ({
//     color: textColor.value,
//   }));

//   return (
//     <Animated.View
//       entering={FadeInDown.delay(index * 100).springify()}
//       className="w-1/3 p-2"
//     >
//       <GestureDetector gesture={tapGesture}>
//         <Animated.View
//           className="relative rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden"
//           style={animatedItemStyle}
//         >
//           {/* Gradient background */}
//           <LinearGradient
//             colors={['#ffffff', '#f3f4f6']} // from-white to-gray-50
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             className="absolute inset-0 rounded-xl"
//           />
//           {/* Colorful background effect */}
//           <Animated.View
//             className="absolute inset-0"
//             style={animatedRingStyle}
//           >
//             <LinearGradient
//               colors={['#4F46E5', '#A855F7', '#EC4899']} // indigo-500 via-purple-500 to-pink-500
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               className="absolute inset-0"
//             />
//           </Animated.View>
//           {/* Decorative ring effect */}
//           <Animated.View
//             className="absolute w-24 h-24 rounded-full -top-8 -left-8"
//             style={animatedRingStyle}
//           >
//             <LinearGradient
//               colors={['#4F46E5', '#A855F7']} // indigo-400 to-purple-400
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               className="absolute inset-0 rounded-full"
//             />
//           </Animated.View>
//           <Animated.Image
//             source={{ uri: item.category_image }}
//             className="w-16 h-16 relative z-10"
//             resizeMode="contain"
//             style={animatedImageStyle}
//           />
//           <Animated.Text
//             className="font-semibold text-sm text-center relative z-10 mt-2"
//             style={animatedTextStyle}
//           >
//             {item.category_name}
//           </Animated.Text>
//           {/* Shine effect */}
//           <Animated.View
//             className="absolute inset-0"
//             style={animatedShineStyle}
//           >
//             <LinearGradient
//               colors={['transparent', '#ffffff', 'transparent']}
//               start={{ x: 0, y: 0.5 }}
//               end={{ x: 1, y: 0.5 }}
//               className="absolute inset-0"
//             />
//           </Animated.View>
//         </Animated.View>
//       </GestureDetector>
//     </Animated.View>
//   );
// };

// const TrendingSection: React.FC<TrendingSectionProps> = () => {
//   const { categories, loading, error } = useContext(CategoryContext);

//   const trendingCategoryNames = [
//     'Plumber Services',
//     'Electrician Services',
//     'Carpenter Services',
//     'Painting Services',
//     'Pest Control Services',
//     'Deep Cleaning Services',
//   ];

//   const trendingCategories = categories.filter((category: Category) =>
//     trendingCategoryNames.includes(category.category_name)
//   );

//   const renderTrendingItem = useCallback(({ item, index }: { item: Category; index: number }) => (
//     <TrendingItem item={item} index={index} />
//   ), []);

//   if (loading) {
//     return (
//       <View className="text-center text-gray-600 py-4 animate-pulse">
//         <Text className="text-gray-600">Loading trending categories...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="text-center py-4">
//         <Text className="text-red-500">Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="mx-auto mb-12 px-4">
//       {trendingCategories.length > 0 ? (
//         <View>
//           <LinearGradient
//             colors={['#4F46E5', '#7C3AED']} // indigo-600 to-purple-600
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             className="rounded-lg px-4 py-2 mb-4"
//           >
//             <Text className="text-2xl font-bold text-white">
//               Trending Searches
//             </Text>
//           </LinearGradient>
//           <FlatList
//             data={trendingCategories}
//             renderItem={renderTrendingItem}
//             numColumns={3}
//             keyExtractor={(item) => item._id}
//             scrollEnabled={false}
//             contentContainerStyle={{ paddingHorizontal: 4 }}
//             columnWrapperStyle={{ justifyContent: 'space-between' }}
//           />
//         </View>
//       ) : (
//         <Text className="text-center text-gray-500 py-4">
//           No trending categories available.
//         </Text>
//       )}
//     </View>
//   );
// };

// export default TrendingSection;
// import React, { useContext } from 'react';
// import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Animated, { FadeInDown } from 'react-native-reanimated';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
// }

// interface TrendingSectionProps {
//   categories: Category[];
//   loading: boolean;
//   error: string | null;
// }

// const TrendingSection: React.FC<TrendingSectionProps> = ({ categories, loading, error }) => {
//   const navigation = useNavigation();

//   const trendingCategoryNames = [
//     'Plumber Services',
//     'Electrician Services', 
//     'Carpenter Services',
//     'Painting Services',
//     'Pest Control Services',
//     'Deep Cleaning Services',
//   ];

//   const trendingCategories = categories.filter((category) =>
//     trendingCategoryNames.includes(category.category_name)
//   );

//   const handleCategoryPress = (category: Category) => {
//     navigation.navigate('Technicians', { category });
//   };

//   const renderTrendingItem = ({ item, index }: { item: Category; index: number }) => (
//     <Animated.View
//       entering={FadeInDown.delay(index * 100).springify()}
//       className="w-1/3 p-2"
//     >
//       <TouchableOpacity
//         className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden active:scale-95"
//         onPress={() => handleCategoryPress(item)}
//       >
//         {/* Colorful background effect on hover */}
//         <View className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-active:opacity-20" />
        
//         {/* Decorative ring effect */}
//         <View className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 group-active:opacity-30 group-active:scale-150 -top-8 -left-8" />
        
//         <Image
//           source={{ uri: item.category_image }}
//           className="w-16 h-16 relative z-10 group-active:scale-110"
//           resizeMode="contain"
//         />
//         <Text className="font-semibold text-sm text-gray-800 text-center relative z-10 mt-2 group-active:text-indigo-600">
//           {item.category_name}
//         </Text>
        
//         {/* Hover shine effect */}
//         <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-active:opacity-60 transform -skew-x-12 translate-x-[-150%] group-active:translate-x-[150%]" />
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   if (loading) {
//     return (
//       <View className="text-center text-gray-600 py-4">
//         <Text className="text-gray-600">Loading trending categories...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="text-center py-4">
//         <Text className="text-red-500">Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="container mx-auto mb-8">
//       {trendingCategories.length > 0 ? (
//         <View>
//           <Text className="text-2xl font-bold text-gray-900 mb-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
//             Trending Searches
//           </Text>
//           <FlatList
//             data={trendingCategories}
//             renderItem={renderTrendingItem}
//             numColumns={3}
//             keyExtractor={(item) => item._id}
//             scrollEnabled={false}
//             contentContainerStyle={{ paddingHorizontal: 16 }}
//           />
//         </View>
//       ) : (
//         <Text className="text-center text-gray-500 py-4">
//           No trending categories available.
//         </Text>
//       )}
//     </View>
//   );
// };

// export default TrendingSection;