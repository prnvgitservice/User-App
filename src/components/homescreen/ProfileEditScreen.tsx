import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useUser } from '../../context/UserContext';
import { userGetProfile, } from '../../api/apiMethods';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

type RootStackParamList = {
  Home: undefined;
  TechnicianById: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    profileImage: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    houseName: '',
    areaName: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pincodeData, setPincodeData] = useState<any[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>('');
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setError('User ID not found. Please login again.');
          return;
        }

        const response = await userGetProfile(userId);
        if (response) {
          const userData = (response as any)?.result?.user || (response as any)?.result || response;
          setFormData({
            profileImage: '',
            username: userData.username || '',
            phoneNumber: userData.phoneNumber || '',
            password: '',
            confirmPassword: '',
            houseName: userData.buildingName || '',
            areaName: userData.areaName || '',
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || ''
          });
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
      } else {
        setAreaOptions([]);
      }
    } else {
      setAreaOptions([]);
    }
  }, [selectedPincode, pincodeData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'pincode') {
      setSelectedPincode(value);
    }
  };

  const handleImagePick = async () => {
    // Note: Image picker implementation would require a library like react-native-image-picker
    // This is a placeholder for image picking functionality
    setFormData((prev) => ({ ...prev, profileImage: 'placeholder-image-uri' }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
      setError('Password must be between 6 and 10 characters long');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('jwt_token');
      if (!userId) {
        setError('User ID not found. Please login again.');
        return;
      }

      const updateData: any = {
        id: userId,
        username: formData.username,
        password: formData.password,
        buildingName: formData.houseName,
        areaName: formData.areaName,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      const response = await userEditProfile(updateData);

      if (response && (response as any).success) {
        setSuccess('Profile updated successfully!');
        const userData = (response as any).result;
        const updatedUser = {
          ...userData,
          id: userId,
          username: userData.username,
          buildingName: userData.buildingName,
          phoneNumber: userData.phoneNumber,
          areaName: userData.areaName,
          pincode: userData.pincode,
          state: userData.state,
          token: token,
          city: userData.city,
        };

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        setTimeout(() => {
          navigation.navigate('Home');
        }, 4000);
      } else {
        setError((response as any)?.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gradient-to-br from-emerald-50 to-cyan-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className="text-gray-600 mt-4">Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-emerald-50 to-cyan-50 p-4">
      <View className="max-w-2xl mx-auto">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
            Edit Profile
          </Text>
        </View>

        {/* Main Form Card */}
        <View className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl p-1 shadow-2xl">
          <View className="bg-white rounded-2xl p-6">
            {error && (
              <View className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                <Text className="text-red-500 text-sm font-medium">{error}</Text>
              </View>
            )}
            {success && (
              <View className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                <Text className="text-green-600 text-sm font-medium">{success}</Text>
              </View>
            )}

            {/* Profile Image */}
            <View className="flex items-center mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Profile Image</Text>
              <TouchableOpacity onPress={handleImagePick}>
                <View className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-1 shadow-lg">
                  <View className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {formData.profileImage ? (
                      <Image
                        source={{ uri: formData.profileImage }}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <Icon name="user" size={32} color="#9ca3af" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl p-3 focus:border-emerald-500"
                  value={formData.username}
                  onChangeText={(value) => handleChange('username', value)}
                  placeholder="Enter your name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500"
                  value={formData.phoneNumber}
                  editable={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-300 rounded-xl p-3 pr-10"
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry={!showPassword}
                    maxLength={10}
                    placeholder="Enter new password"
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-300 rounded-xl p-3 pr-10"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    maxLength={10}
                    placeholder="Confirm new password"
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">House/Building Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl p-3"
                  value={formData.houseName}
                  onChangeText={(value) => handleChange('houseName', value)}
                  placeholder="Enter house or building name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Pincode</Text>
                <View className="border border-gray-300 rounded-xl">
                  <Picker
                    selectedValue={formData.pincode}
                    onValueChange={(value) => handleChange('pincode', value)}
                  >
                    <Picker.Item label="Select Pincode" value="" />
                    {pincodeData
                      .sort((a, b) => Number(a.code) - Number(b.code))
                      .map((p) => (
                        <Picker.Item key={p._id} label={p.code} value={p.code} />
                      ))}
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Area Name</Text>
                <View className="border border-gray-300 rounded-xl">
                  <Picker
                    selectedValue={formData.areaName}
                    onValueChange={(value) => handleChange('areaName', value)}
                  >
                    <Picker.Item label="Select Area" value="" />
                    {areaOptions.map((a: any) => (
                      <Picker.Item key={a._id} label={a.name} value={a.name} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
                <View className="border border-gray-300 rounded-xl">
                  <Picker
                    selectedValue={formData.city}
                    onValueChange={(value) => handleChange('city', value)}
                  >
                    <Picker.Item label="Select City" value="" />
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                      <Picker.Item
                        label={pincodeData.find((p) => p.code === selectedPincode)?.city}
                        value={pincodeData.find((p) => p.code === selectedPincode)?.city}
                      />
                    ) : (
                      pincodeData.map((p) => (
                        <Picker.Item key={p._id} label={p.city} value={p.city} />
                      ))
                    )}
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
                <View className="border border-gray-300 rounded-xl">
                  <Picker
                    selectedValue={formData.state}
                    onValueChange={(value) => handleChange('state', value)}
                  >
                    <Picker.Item label="Select State" value="" />
                    {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                      <Picker.Item
                        label={pincodeData.find((p) => p.code === selectedPincode)?.state}
                        value={pincodeData.find((p) => p.code === selectedPincode)?.state}
                      />
                    ) : (
                      pincodeData.map((p) => (
                        <Picker.Item key={p._id} label={p.state} value={p.state} />
                      ))
                    )}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl py-3 px-6 items-center justify-center"
                onPress={handleSubmit}
              >
                <View className="flex-row items-center gap-2">
                  <Icon name="save" size={16} color="white" />
                  <Text className="text-white font-semibold">Update Profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-500 rounded-xl py-3 px-6 items-center justify-center"
                onPress={() => navigation.navigate('TechnicianById')}
              >
                <View className="flex-row items-center gap-2">
                  <Icon name="times" size={16} color="white" />
                  <Text className="text-white font-semibold">Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileEditScreen;












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