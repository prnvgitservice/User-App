import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
const handleScroll = useCallback(() => {
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pb-10">
      <ScrollView
        contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {/* Header */}
        <View className="flex-row items-center p-4 bg-white shadow">
          <TouchableOpacity>
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold">Settings</Text>
        </View>

        {/* User Profile */}
        <View className="flex-row items-center p-4 bg-white mt-2">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold">Lohitha</Text>
            <Text className="text-gray-500">9876543212</Text>
          </View>
        </View>

        {/* Quick Access Icons */}
        <View className="flex-row justify-around p-4 bg-white mt-2">
          <TouchableOpacity className="items-center">
            <Text className="text-2xl">📦</Text>
            <Text className="text-sm">Your Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Text className="text-2xl">💬</Text>
            <Text className="text-sm">Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Text className="text-2xl">❤️</Text>
            <Text className="text-sm">Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <View className="bg-green-100 p-4 mt-2 flex-row items-center justify-between">
          <View>
            <Text className="font-semibold">Unlock PRNV Pro - Save 20%!</Text>
            <Text className="text-sm text-gray-600">
              Enhance your experience
            </Text>
          </View>
          <TouchableOpacity className="bg-purple-600 px-4 py-2 rounded">
            <Text className="text-white">Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View className="bg-white p-4 mt-2">
          <Text className="font-semibold">PRNV Credits</Text>
          <View className="flex-row justify-between items-center mt-2">
            <Text>Available Balance: 50</Text>
            <TouchableOpacity className="bg-purple-600 px-3 py-1 rounded">
              <Text className="text-white">Add Credits</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-green-600">Free 5 Credits</Text>
            <Text className="text-purple-600">₹25</Text>
          </View>
        </View>

        {/* Your Information Section */}
        <View className="bg-white p-4 mt-2">
          <Text className="font-semibold">Your Information</Text>
          <TouchableOpacity className="py-2">
            <Text>Your Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Saved Locations</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Navigation History</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Payment Management</Text>
          </TouchableOpacity>
        </View>

        {/* Other Information Section */}
        <View className="bg-white p-4 mt-2">
          <Text className="font-semibold">Other Information</Text>
          <TouchableOpacity className="py-2">
            <Text>Suggest Features</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text>General Info</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="bg-white p-4 mt-2">
          <Text className="text-center font-semibold text-red-600">
            Log Out
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View className="p-4 mt-2">
          <Text className="text-center text-gray-500">App v2.5.4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
// import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
// // @ts-ignore: No type definitions for react-native-vector-icons/Ionicons
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const defaultProfileImg = 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600';
// const defaultTech = {
//   name: 'Jenny Wilson',
//   image: defaultProfileImg,
//   category: 'Cleaning',
//   pincode: '123456',
//   area: 'Downtown',
//   place: 'A',
// };

// const photos = [
//   'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
//   'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=600',
// ];
// const reviews = [
//   {
//     name: 'Lauralee Quintero',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     rating: 5,
//     text: 'Awesome! this is what i was looking for. i recommend to everyone❤️❤️❤️',
//     likes: 724,
//     time: '3 weeks ago',
//   },
//   {
//     name: 'Clinton Mcclure',
//     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
//     rating: 4,
//     text: 'The workers are very professional and the results are very satisfying! I like it very much! 💯💯💯',
//     likes: 783,
//     time: '1 week ago',
//   },
//   {
//     name: 'Chieko Chute',
//     avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
//     rating: 5,
//     text: 'This is the first time I\'ve used his services, and the results were amazing! 👍👍👍',
//     likes: 597,
//     time: '2 weeks ago',
//   },
// ];

// type RootStackParamList = {
//   ProfileScreen: { tech: any };
//   Calendar: undefined;
// };

// const ProfileScreen = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const route = useRoute<RouteProp<RootStackParamList, 'ProfileScreen'>>();
//   const tech = route.params?.tech || defaultTech;
//   const [selectedRating, setSelectedRating] = useState<string>('All');

//   const filteredReviews = selectedRating === 'All'
//     ? reviews
//     : reviews.filter(r => r.rating === parseInt(selectedRating));

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//       {/* Custom Header */}
//       <View style={styles.headerRow}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} accessible accessibilityLabel="Go back">
//           <Ionicons name="arrow-back" size={28} color="#222" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleBox}>
//           <Text style={styles.headerTitle}>Technician Details</Text>
//         </View>
//         <View style={{ width: 40 }} />
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         <Image source={{ uri: tech.image }} style={styles.topImage} />
//         <View style={styles.content}>
//           <Text style={styles.title}>{String(tech.name)}</Text>
//           <Text style={styles.techDetail}>Category: {String(tech.category)}</Text>
//           <Text style={styles.techDetail}>Pincode: {String(tech.pincode)}</Text>
//           <Text style={styles.techDetail}>Area: {String(tech.area)}</Text>
//           <Text style={styles.techDetail}>Place: {String(tech.place)}</Text>
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//             <Text style={styles.name}>Jenny Wilson</Text>
//             <Text style={{ color: '#FFD700', fontSize: 16, marginLeft: 8 }}>★</Text>
//             <Text style={styles.rating}>4.8 (4,479 reviews)</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//             <Text style={styles.categoryBtn}>Cleaning</Text>
//             <Text style={styles.location}>📍 255 Grand Park Avenue, New York</Text>
//           </View>
//           <Text style={styles.price}>$20 <Text style={styles.priceLabel}>(Floor price)</Text></Text>
//           <Text style={styles.sectionTitle}>About me</Text>
//           <Text style={styles.about}>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim nisi ut aliquip. <Text style={styles.readMore}>Read more...</Text>
//           </Text>
//           <View style={styles.photosHeader}>
//             <Text style={styles.sectionTitle}>Photos & Videos</Text>
//             <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//           </View>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
//             {photos.map((uri, idx) => (
//               <Image key={idx} source={{ uri }} style={styles.photo} />
//             ))}
//           </ScrollView>
//           <View style={styles.reviewsHeader}>
//             <Text style={styles.sectionTitle}>4.8 (4,479 reviews)</Text>
//             <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//           </View>
//           <View style={styles.ratingRow}>
//             <TouchableOpacity style={[styles.ratingBtn, selectedRating === 'All' && styles.ratingBtnActive]} onPress={() => setSelectedRating('All')}>
//               <Text style={[styles.ratingBtnText, selectedRating === 'All' && styles.ratingBtnTextActive]}>All</Text>
//             </TouchableOpacity>
//             {[5,4,3,2].map((star) => (
//               <TouchableOpacity key={star} style={[styles.ratingBtn, selectedRating === String(star) && styles.ratingBtnActive]} onPress={() => setSelectedRating(String(star))}>
//                 <Text style={[styles.ratingBtnText, selectedRating === String(star) && styles.ratingBtnTextActive]}>{star}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {filteredReviews.map((review, idx) => (
//             <View key={idx} style={styles.reviewCard}>
//               <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
//               <View style={{ flex: 1, marginLeft: 12 }}>
//                 <Text style={styles.reviewName}>{review.name}</Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
//                   {[...Array(review.rating)].map((_, i) => (
//                     <Text key={i} style={{ color: '#FFD700', fontSize: 15 }}>★</Text>
//                   ))}
//                 </View>
//                 <Text style={styles.reviewText}>{review.text}</Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//                   <Text style={styles.reviewLike}>❤️ {review.likes}</Text>
//                   <Text style={styles.reviewTime}>{review.time}</Text>
//                 </View>
//               </View>
//               <TouchableOpacity style={styles.reviewMore}><Text style={{ fontSize: 20 }}>⋯</Text></TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//       <SafeAreaView edges={['bottom']} style={styles.bottomActions}>
//         <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Calendar' as never)}><Text style={styles.bookBtnText}>Book Now</Text></TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   topImage: {
//     width: '100%',
//     height: 220,
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//   },
//   content: {
//     padding: 20,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 26,
//     color: '#222',
//     marginBottom: 4,
//   },
//   name: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   rating: {
//     color: '#888',
//     fontSize: 15,
//     marginLeft: 4,
//   },
//   categoryBtn: {
//     backgroundColor: '#f7f7f7',
//     color: '#a259ff',
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     fontSize: 13,
//     marginRight: 10,
//   },
//   location: {
//     color: '#888',
//     fontSize: 14,
//   },
//   price: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 22,
//     marginBottom: 12,
//   },
//   priceLabel: {
//     color: '#888',
//     fontSize: 14,
//     fontWeight: 'normal',
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     color: '#222',
//     marginTop: 18,
//     marginBottom: 6,
//   },
//   about: {
//     color: '#888',
//     fontSize: 15,
//     marginBottom: 10,
//   },
//   readMore: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//   },
//   photosHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   seeAll: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   photo: {
//     width: 100,
//     height: 100,
//     borderRadius: 16,
//     marginRight: 10,
//   },
//   reviewsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 8,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   ratingBtn: {
//     borderWidth: 1,
//     borderColor: '#a259ff',
//     borderRadius: 16,
//     paddingHorizontal: 14,
//     paddingVertical: 4,
//     marginRight: 8,
//     marginBottom: 6,
//   },
//   ratingBtnActive: {
//     backgroundColor: '#a259ff',
//     borderColor: '#a259ff',
//   },
//   ratingBtnText: {
//     color: '#a259ff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   ratingBtnTextActive: {
//     color: '#fff',
//   },
//   reviewCard: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   reviewAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//   },
//   reviewName: {
//     fontWeight: 'bold',
//     fontSize: 15,
//     color: '#222',
//     marginBottom: 2,
//   },
//   reviewText: {
//     color: '#444',
//     fontSize: 15,
//     marginBottom: 2,
//   },
//   reviewLike: {
//     color: '#a259ff',
//     fontSize: 14,
//     marginRight: 12,
//   },
//   reviewTime: {
//     color: '#888',
//     fontSize: 13,
//   },
//   reviewMore: {
//     marginLeft: 8,
//     padding: 4,
//   },
//   bottomActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     paddingBottom: 24,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//   },
//   bookBtn: {
//     backgroundColor: '#a259ff',
//     borderRadius: 24,
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//   },
//   bookBtnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 17,
//   },
//   techDetail: {
//     color: '#888',
//     fontSize: 15,
//     marginBottom: 2,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     marginTop: 40,
//     marginBottom: 8,
//     minHeight: 48,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//   },
//   headerTitleBox: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#222' },
// });

// export default ProfileScreen;
