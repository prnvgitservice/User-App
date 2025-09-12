import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAllPincodes, userEditProfile, userGetProfile } from '@/src/api/apiMethods';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const ProfileEditPage: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    profileImage: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    houseName: '',
    areaName: '',
    subArea: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pincodeData, setPincodeData] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<any[]>([]);

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
          const userData = response?.result;
          setFormData({
            profileImage: userData.profileImage || '', // Update this field based on actual API response
            username: userData.username || '',
            phoneNumber: userData.phoneNumber || '',
            password: '',
            confirmPassword: '',
            houseName: userData.buildingName || '',
            areaName: userData.areaName || '',
            subArea: userData.subAreaName || '', // Note: API uses subAreaName
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || '',
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
    const fetchPincodes = async () => {
      try {
        const response = await getAllPincodes();
        if (Array.isArray(response?.data)) {
          setPincodeData(response.data);
        }
      } catch (err) {
        console.log('Failed to fetch pincodes:', err);
      }
    };

    fetchPincodes();
  }, []);

  useEffect(() => {
    if (formData.pincode) {
      const found = pincodeData.find((p) => p.code === formData.pincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
      } else {
        setAreaOptions([]);
      }
    } else {
      setAreaOptions([]);
    }
  }, [formData.pincode, pincodeData]);

  useEffect(() => {
    if (formData.areaName) {
      const foundArea = areaOptions.find((a) => a.name === formData.areaName);
      if (foundArea && foundArea.subAreas) {
        setSubAreaOptions(foundArea.subAreas);
      } else {
        setSubAreaOptions([]);
      }
    } else {
      setSubAreaOptions([]);
    }
  }, [formData.areaName, areaOptions]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploadingImage(true);
        
        // Convert image to base64
        const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Create data URL
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
        
        // Update form data with the new image
        setFormData(prev => ({ ...prev, profileImage: imageDataUrl }));
        setSuccess('Profile image selected successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to select image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
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
      if (!userId || !token) {
        setError('User ID or token not found. Please login again.');
        return;
      }

      // Prepare data matching API expectations
      const updateData = {
        id: userId,
        username: formData.username,
        password: formData.password || undefined, // Only send if changed
        buildingName: formData.houseName,
        areaName: formData.areaName,
        subAreaName: formData.subArea, // Note: API expects subAreaName
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        profileImage: formData.profileImage
      };

      const response = await userEditProfile(updateData);

      if (response && response.success) {
        setSuccess('Profile updated successfully!');

        const userData = response.result;
        const updatedUser = {
          ...userData,
          id: userId,
          username: userData.username,
          buildingName: userData.buildingName,
          phoneNumber: userData.phoneNumber,
          areaName: userData.areaName,
          subArea: userData.subAreaName, // Map back to our local state naming
          pincode: userData.pincode,
          state: userData.state,
          city: userData.city,
          profileImage: userData.profileImage || formData.profileImage,
          token,
        };

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        setTimeout(() => {
          navigation.goBack(); // Go back to profile page
        }, 2000);
      } else {
        setError(response?.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#d1fae5', '#e6fffa', '#cffafe']}
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
      >
        <View className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full items-center">
          <ActivityIndicator size="large" color="#0d9488" />
          <Text className="text-gray-600 mt-4 text-base font-medium">Loading profile data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScrollView style={{ width: '100%', height: '100%' }}>
      <LinearGradient
        colors={['#d1fae5', '#e6fffa', '#cffafe']}
        style={{ width: '100%', minHeight: height, padding: 16 }}
      >
        <View className="max-w-2xl w-full mx-auto">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-emerald-600">Edit Profile</Text>
          </View>

          {/* Main Form Card */}
          <LinearGradient
            colors={['#10b981', '#14b8a6', '#06b6d4']}
            style={{ borderRadius: 16, padding: 2 }}
          >
            <View className="bg-white rounded-2xl p-8">
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
              <View className="flex-col items-center space-y-4">
                <Text className="text-sm font-medium text-gray-700">Profile Image</Text>
                <View className="w-24 h-24 rounded-full">
                  <LinearGradient
                    colors={['#10b981', '#14b8a6', '#06b6d4']}
                    className="p-1 rounded-full shadow-lg"
                  >
                    <View className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <Image
                          source={{ uri: formData.profileImage }}
                          className="w-full h-full rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Icon name="user" size={32} color="#9ca3af" />
                      )}
                    </View>
                  </LinearGradient>
                </View>
                <TouchableOpacity
                  className="py-2 px-4 rounded-full"
                  onPress={pickImage}
                  disabled={uploadingImage}
                >
                  <LinearGradient
                    colors={['#d1fae5', '#cffafe']}
                    className="py-2 px-4 rounded-full"
                  >
                    {uploadingImage ? (
                      <ActivityIndicator size="small" color="#0d9488" />
                    ) : (
                      <Text className="text-emerald-700 font-semibold text-sm">Choose Image</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View className="mt-6 flex flex-row flex-wrap -mx-3">
                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
                  <TextInput
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
                    value={formData.username}
                    onChangeText={(value) => handleChange('username', value)}
                    placeholder="Enter your name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
                  <TextInput
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 text-base"
                    value={formData.phoneNumber}
                    editable={false}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                  <View className="relative">
                    <TextInput
                      className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
                      value={formData.password}
                      onChangeText={(value) => handleChange('password', value)}
                      secureTextEntry={!showPassword}
                      maxLength={10}
                      placeholder="Enter new password"
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
                  <View className="relative">
                    <TextInput
                      className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                      maxLength={10}
                      placeholder="Confirm new password"
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">House/Building Name</Text>
                  <TextInput
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
                    value={formData.houseName}
                    onChangeText={(value) => handleChange('houseName', value)}
                    placeholder="Enter house or building name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Pincode</Text>
                  <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={formData.pincode}
                      onValueChange={(value) => handleChange('pincode', value)}
                      style={{ height: 50, width: '100%' }}
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

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Area Name</Text>
                  <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={formData.areaName}
                      onValueChange={(value) => handleChange('areaName', value)}
                      style={{ height: 50, width: '100%' }}
                    >
                      <Picker.Item label="Select Area" value="" />
                      {areaOptions.map((a: any) => (
                        <Picker.Item key={a._id} label={a.name} value={a.name} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Sub Area</Text>
                  <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={formData.subArea}
                      onValueChange={(value) => handleChange('subArea', value)}
                      style={{ height: 50, width: '100%' }}
                    >
                      <Picker.Item label="Select Sub Area" value="" />
                      {subAreaOptions.map((sa: any) => (
                        <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
                  <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={formData.city}
                      onValueChange={(value) => handleChange('city', value)}
                      style={{ height: 50, width: '100%' }}
                    >
                      <Picker.Item label="Select City" value="" />
                      {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
                        <Picker.Item
                          label={pincodeData.find((p) => p.code === formData.pincode)?.city}
                          value={pincodeData.find((p) => p.code === formData.pincode)?.city}
                        />
                      ) : (
                        pincodeData.map((p) => (
                          <Picker.Item key={p._id} label={p.city} value={p.city} />
                        ))
                      )}
                    </Picker>
                  </View>
                </View>

                <View className="w-full md:w-1/2 px-3 mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
                  <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={formData.state}
                      onValueChange={(value) => handleChange('state', value)}
                      style={{ height: 50, width: '100%' }}
                    >
                      <Picker.Item label="Select State" value="" />
                      {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
                        <Picker.Item
                          label={pincodeData.find((p) => p.code === formData.pincode)?.state}
                          value={pincodeData.find((p) => p.code === formData.pincode)?.state}
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
              <View className="flex-row gap-4 pt-6">
                <TouchableOpacity
                  className="flex-1 items-center"
                  onPress={handleSubmit}
                >
                  <LinearGradient
                    colors={['#10b981', '#14b8a6', '#06b6d4']}
                    className="rounded-xl py-3 px-6 w-full items-center"
                  >
                    <View className="flex-row items-center gap-2">
                      <Icon name="save" size={16} color="#fff" />
                      <Text className="text-white font-semibold text-base">Update Profile</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 items-center"
                  onPress={() => navigation.goBack()}
                >
                  <View className="bg-gray-500 rounded-xl py-3 px-6 w-full items-center">
                    <View className="flex-row items-center gap-2">
                      <Icon name="times" size={16} color="#fff" />
                      <Text className="text-white font-semibold text-base">Cancel</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default ProfileEditPage;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { getAllPincodes, userEditProfile, userGetProfile } from '@/src/api/apiMethods';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// const ProfileEditPage: React.FC = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState({
//     profileImage: '',
//     username: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     houseName: '',
//     areaName: '',
//     subArea: '',
//     city: '',
//     state: '',
//     pincode: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userId = await AsyncStorage.getItem('userId');
//         if (!userId) {
//           setError('User ID not found. Please login again.');
//           return;
//         }

//         const response = await userGetProfile(userId);
//         if (response) {
//           const userData = response?.result;
//           setFormData({
//             profileImage: userData.ProfileImage || '',
//             username: userData.username || '',
//             phoneNumber: userData.phoneNumber || '',
//             password: '',
//             confirmPassword: '',
//             houseName: userData.buildingName || '',
//             areaName: userData.areaName || '',
//             subArea: userData.subArea || '',
//             city: userData.city || '',
//             state: userData.state || '',
//             pincode: userData.pincode || '',
//           });
//         }
//       } catch (err: any) {
//         setError(err?.message || 'Failed to fetch profile data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     const fetchPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (err) {
//         console.log('Failed to fetch pincodes:', err);
//       }
//     };

//     fetchPincodes();
//   }, []);

//   useEffect(() => {
//     if (formData.pincode) {
//       const found = pincodeData.find((p) => p.code === formData.pincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//     }
//   }, [formData.pincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const foundArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (foundArea && foundArea.subAreas) {
//         setSubAreaOptions(foundArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//     } else {
//       setSubAreaOptions([]);
//     }
//   }, [formData.areaName, areaOptions]);

//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImagePick = () => {
//     // Placeholder for image picker (e.g., using react-native-image-picker)
//     setFormData((prev) => ({ ...prev, profileImage: 'https://via.placeholder.com/150' }));
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     setSuccess(null);

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//       setError('Password must be between 6 and 10 characters long');
//       return;
//     }

//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('jwt_token');
//       if (!userId || !token) {
//         setError('User ID or token not found. Please login again.');
//         return;
//       }

//       const updateData = {
//         id: userId,
//         username: formData.username,
//         password: formData.password,
//         buildingName: formData.houseName,
//         areaName: formData.areaName,
//         subArea: formData.subArea,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       const response = await userEditProfile(updateData);

//       if (response && response.success) {
//         setSuccess('Profile updated successfully!');

//         const userData = response.result;
//         const updatedUser = {
//           ...userData,
//           id: userId,
//           username: userData.username,
//           buildingName: userData.buildingName,
//           phoneNumber: userData.phoneNumber,
//           areaName: userData.areaName,
//           subArea: userData.subArea,
//           pincode: userData.pincode,
//           state: userData.state,
//           city: userData.city,
//           token,
//         };

//         await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

//         setTimeout(() => {
//           navigation.navigate('Profile'); // Adjust to your navigation route
//         }, 4000);
//       } else {
//         setError(response?.message || 'Failed to update profile.');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to update profile. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
//       >
//         <View className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full items-center">
//           <ActivityIndicator size="large" color="#0d9488" />
//           <Text className="text-gray-600 mt-4 text-base font-medium">Loading profile data...</Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <ScrollView style={{ width: '100%', height: '100%' }}>
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={{ width: '100%', minHeight: height, padding: 16 }}
//       >
//         <View className="max-w-2xl w-full mx-auto">
//           {/* Header */}
//           <View className="items-center mb-8">
//             <Text className="text-3xl font-bold text-emerald-600">Edit Profile</Text>
//           </View>

//           {/* Main Form Card */}
//           <LinearGradient
//             colors={['#10b981', '#14b8a6', '#06b6d4']}
//             style={{ borderRadius: 16, padding: 2 }}
//           >
//             <View className="bg-white rounded-2xl p-8">
//               {error && (
//                 <View className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
//                   <Text className="text-red-500 text-sm font-medium">{error}</Text>
//                 </View>
//               )}
//               {success && (
//                 <View className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
//                   <Text className="text-green-600 text-sm font-medium">{success}</Text>
//                 </View>
//               )}

//               {/* Profile Image */}
//               <View className="flex-col items-center space-y-4">
//                 <Text className="text-sm font-medium text-gray-700">Profile Image</Text>
//                 <View className="w-24 h-24 rounded-full">
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     className="p-1 rounded-full shadow-lg"
//                   >
//                     <View className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                       {formData.profileImage ? (
//                         <Image
//                           source={{ uri: formData.profileImage }}
//                           className="w-full h-full rounded-full"
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <Icon name="user" size={32} color="#9ca3af" />
//                       )}
//                     </View>
//                   </LinearGradient>
//                 </View>
//                 <TouchableOpacity
//                   className="py-2 px-4 rounded-full"
//                   onPress={handleImagePick}
//                 >
//                   <LinearGradient
//                     colors={['#d1fae5', '#cffafe']}
//                     className="py-2 px-4 rounded-full"
//                   >
//                     <Text className="text-emerald-700 font-semibold text-sm">Choose Image</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>

//               {/* Form Fields */}
//               <View className="mt-6 flex flex-row flex-wrap -mx-3">
//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
//                     value={formData.username}
//                     onChangeText={(value) => handleChange('username', value)}
//                     placeholder="Enter your name"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 text-base"
//                     value={formData.phoneNumber}
//                     editable={false}
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
//                   <View className="relative">
//                     <TextInput
//                       className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
//                       value={formData.password}
//                       onChangeText={(value) => handleChange('password', value)}
//                       secureTextEntry={!showPassword}
//                       maxLength={10}
//                       placeholder="Enter new password"
//                       placeholderTextColor="#9ca3af"
//                     />
//                     <TouchableOpacity
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       onPress={() => setShowPassword((prev) => !prev)}
//                     >
//                       <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
//                   <View className="relative">
//                     <TextInput
//                       className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
//                       value={formData.confirmPassword}
//                       onChangeText={(value) => handleChange('confirmPassword', value)}
//                       secureTextEntry={!showConfirmPassword}
//                       maxLength={10}
//                       placeholder="Confirm new password"
//                       placeholderTextColor="#9ca3af"
//                     />
//                     <TouchableOpacity
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       onPress={() => setShowConfirmPassword((prev) => !prev)}
//                     >
//                       <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">House/Building Name</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
//                     value={formData.houseName}
//                     onChangeText={(value) => handleChange('houseName', value)}
//                     placeholder="Enter house or building name"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Pincode</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.pincode}
//                       onValueChange={(value) => handleChange('pincode', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select Pincode" value="" />
//                       {pincodeData
//                         .sort((a, b) => Number(a.code) - Number(b.code))
//                         .map((p) => (
//                           <Picker.Item key={p._id} label={p.code} value={p.code} />
//                         ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Area Name</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.areaName}
//                       onValueChange={(value) => handleChange('areaName', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select Area" value="" />
//                       {areaOptions.map((a: any) => (
//                         <Picker.Item key={a._id} label={a.name} value={a.name} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Sub Area</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.subArea}
//                       onValueChange={(value) => handleChange('subArea', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select Sub Area" value="" />
//                       {subAreaOptions.map((sa: any) => (
//                         <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.city}
//                       onValueChange={(value) => handleChange('city', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select City" value="" />
//                       {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                         <Picker.Item
//                           label={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                           value={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                         />
//                       ) : (
//                         pincodeData.map((p) => (
//                           <Picker.Item key={p._id} label={p.city} value={p.city} />
//                         ))
//                       )}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View className="w-full md:w-1/2 px-3 mb-6">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.state}
//                       onValueChange={(value) => handleChange('state', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select State" value="" />
//                       {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                         <Picker.Item
//                           label={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                           value={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                         />
//                       ) : (
//                         pincodeData.map((p) => (
//                           <Picker.Item key={p._id} label={p.state} value={p.state} />
//                         ))
//                       )}
//                     </Picker>
//                   </View>
//                 </View>
//               </View>

//               {/* Action Buttons */}
//               <View className="flex-row gap-4 pt-6">
//                 <TouchableOpacity
//                   className="flex-1 items-center"
//                   onPress={handleSubmit}
//                 >
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     className="rounded-xl py-3 px-6 w-full items-center"
//                   >
//                     <View className="flex-row items-center gap-2">
//                       <Icon name="save" size={16} color="#fff" />
//                       <Text className="text-white font-semibold text-base">Update Profile</Text>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="flex-1 items-center"
//                   onPress={() => navigation.navigate('Profile')} // Adjust to your navigation route
//                 >
//                   <View className="bg-gray-500 rounded-xl py-3 px-6 w-full items-center">
//                     <View className="flex-row items-center gap-2">
//                       <Icon name="times" size={16} color="#fff" />
//                       <Text className="text-white font-semibold text-base">Cancel</Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>
//         </View>
//       </LinearGradient>
//     </ScrollView>
//   );
// };

// export default ProfileEditPage;
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { LinearGradient } from 'expo-linear-gradient';
// const { width, height } = Dimensions.get('window');

// const ProfileEditPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     profileImage: '',
//     username: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     houseName: '',
//     areaName: '',
//     city: '',
//     state: '',
//     pincode: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Mock data for pickers
//   const pincodeData = [
//     { _id: '1', code: '123456', city: 'Sample City', state: 'Sample State', areas: [{ _id: 'a1', name: 'Area 1' }, { _id: 'a2', name: 'Area 2' }] },
//     { _id: '2', code: '654321', city: 'Another City', state: 'Another State', areas: [{ _id: 'a3', name: 'Area 3' }, { _id: 'a4', name: 'Area 4' }] },
//   ];
//   const areaOptions = formData.pincode ? pincodeData.find(p => p.code === formData.pincode)?.areas || [] : [];

//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImagePick = () => {
//     // Placeholder for image picker
//     setFormData((prev) => ({ ...prev, profileImage: 'https://via.placeholder.com/150' }));
//   };

//   if (loading) {
//     return (
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
//       >
//         <View className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full items-center">
//           <ActivityIndicator size="large" color="#0d9488" />
//           <Text className="text-gray-600 mt-4 text-base">Loading profile data...</Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <ScrollView style={{ width: '100%', height: '100%' }}>
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={{ width: '100%', minHeight: height, padding: 16 }}
//       >
//         <View className="max-w-2xl w-full mx-auto">
//           {/* Header */}
//           <View className="items-center mb-8">
//             <Text className="text-3xl font-bold text-emerald-600">Edit Profile</Text>
//           </View>

//           {/* Main Form Card */}
//           <LinearGradient
//             colors={['#10b981', '#14b8a6', '#06b6d4']}
//             style={{ borderRadius: 16, padding: 2 }}
//           >
//             <View className="bg-white rounded-2xl p-8">
//               {error && (
//                 <View className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
//                   <Text className="text-red-500 text-sm font-medium">{error}</Text>
//                 </View>
//               )}
//               {success && (
//                 <View className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
//                   <Text className="text-green-600 text-sm font-medium">{success}</Text>
//                 </View>
//               )}

//               {/* Profile Image */}
//               <View className="flex-col items-center space-y-4">
//                 <Text className="text-sm font-medium text-gray-700">Profile Image</Text>
//                 <View className="w-24 h-24 rounded-full">
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     className="p-1 rounded-full shadow-lg"
//                   >
//                     <View className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                       {formData.profileImage ? (
//                         <Image
//                           source={{ uri: formData.profileImage }}
//                           className="w-full h-full rounded-full"
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <Icon name="user" size={32} color="#9ca3af" />
//                       )}
//                     </View>
//                   </LinearGradient>
//                 </View>
//                 <TouchableOpacity
//                   className="py-2 px-4 rounded-full"
//                   onPress={handleImagePick}
//                 >
//                   <LinearGradient
//                     colors={['#d1fae5', '#cffafe']}
//                     className="py-2 px-4 rounded-full"
//                   >
//                     <Text className="text-emerald-700 font-semibold text-sm">Choose Image</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>

//               {/* Form Fields */}
//               <View className="space-y-6 mt-6">
//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
//                     value={formData.username}
//                     onChangeText={(value) => handleChange('username', value)}
//                     placeholder="Enter your name"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 text-base"
//                     value={formData.phoneNumber}
//                     editable={false}
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
//                   <View className="relative">
//                     <TextInput
//                       className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
//                       value={formData.password}
//                       onChangeText={(value) => handleChange('password', value)}
//                       secureTextEntry={!showPassword}
//                       maxLength={10}
//                       placeholder="Enter new password"
//                       placeholderTextColor="#9ca3af"
//                     />
//                     <TouchableOpacity
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       onPress={() => setShowPassword((prev) => !prev)}
//                     >
//                       <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
//                   <View className="relative">
//                     <TextInput
//                       className="w-full border border-gray-300 rounded-xl p-3 pr-10 text-gray-700 text-base"
//                       value={formData.confirmPassword}
//                       onChangeText={(value) => handleChange('confirmPassword', value)}
//                       secureTextEntry={!showConfirmPassword}
//                       maxLength={10}
//                       placeholder="Confirm new password"
//                       placeholderTextColor="#9ca3af"
//                     />
//                     <TouchableOpacity
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       onPress={() => setShowConfirmPassword((prev) => !prev)}
//                     >
//                       <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#6b7280" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">House/Building Name</Text>
//                   <TextInput
//                     className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-base"
//                     value={formData.houseName}
//                     onChangeText={(value) => handleChange('houseName', value)}
//                     placeholder="Enter house or building name"
//                     placeholderTextColor="#9ca3af"
//                   />
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Pincode</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.pincode}
//                       onValueChange={(value) => handleChange('pincode', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select Pincode" value="" />
//                       {pincodeData.map((p) => (
//                         <Picker.Item key={p._id} label={p.code} value={p.code} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Area Name</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.areaName}
//                       onValueChange={(value) => handleChange('areaName', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select Area" value="" />
//                       {areaOptions.map((a: any) => (
//                         <Picker.Item key={a._id} label={a.name} value={a.name} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.city}
//                       onValueChange={(value) => handleChange('city', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select City" value="" />
//                       {pincodeData.map((p) => (
//                         <Picker.Item key={p._id} label={p.city} value={p.city} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>

//                 <View>
//                   <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
//                   <View className="w-full border border-gray-300 rounded-xl overflow-hidden">
//                     <Picker
//                       selectedValue={formData.state}
//                       onValueChange={(value) => handleChange('state', value)}
//                       style={{ height: 50, width: '100%' }}
//                     >
//                       <Picker.Item label="Select State" value="" />
//                       {pincodeData.map((p) => (
//                         <Picker.Item key={p._id} label={p.state} value={p.state} />
//                       ))}
//                     </Picker>
//                   </View>
//                 </View>
//               </View>

//               {/* Action Buttons */}
//               <View className="flex-row gap-4 pt-6">
//                 <TouchableOpacity
//                   className="flex-1 items-center"
//                   onPress={() => setSuccess('Profile updated successfully!')}
//                 >
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     className="rounded-xl py-3 px-6 w-full items-center"
//                   >
//                     <View className="flex-row items-center gap-2">
//                       <Icon name="save" size={16} color="#fff" />
//                       <Text className="text-white font-semibold text-base">Update Profile</Text>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="flex-1 items-center"
//                   onPress={() => setError('Action cancelled')}
//                 >
//                   <View className="bg-gray-500 rounded-xl py-3 px-6 w-full items-center">
//                     <View className="flex-row items-center gap-2">
//                       <Icon name="times" size={16} color="#fff" />
//                       <Text className="text-white font-semibold text-base">Cancel</Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>
//         </View>
//       </LinearGradient>
//     </ScrollView>
//   );
// };

// export default ProfileEditPage;