import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  userGetProfile,
  userEditProfile,
  getAllPincodes,
} from "@/src/api/apiMethods";
import { useNavigation } from "@react-navigation/native";

const ProfileEditPage = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    profileImage: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    houseName: "",
    areaName: "",
    subAreaName: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [pincodeData, setPincodeData] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [subAreaOptions, setSubAreaOptions] = useState([]);
  const [imageFile, setImageFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------- Fetch User Profile --------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          setError("User not found. Please login again.");
          return;
        }
        const res = await userGetProfile(userId);
        if (res?.success && res?.result) {
          const u = res.result;
          setFormData({
            profileImage: u.profileImage || "",
            username: u.username || "",
            phoneNumber: u.phoneNumber || "",
            password: "",
            confirmPassword: "",
            houseName: u.buildingName || "",
            areaName: u.areaName || "",
            subAreaName: u.subAreaName || "",
            city: u.city || "",
            state: u.state || "",
            pincode: u.pincode || "",
          });
        }
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // -------------------- Fetch Pincodes --------------------
  useEffect(() => {
    const loadPincodes = async () => {
      try {
        const res = await getAllPincodes();
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      } catch (err) {
        console.log("Pincode fetch error:", err);
      }
    };
    loadPincodes();
  }, []);

  // -------------------- Area & SubArea Cascade --------------------
  useEffect(() => {
    const found = pincodeData.find((p) => p.code === formData.pincode);
    if (found) {
      setAreaOptions(found.areas || []);
      setFormData((prev) => ({
        ...prev,
        city: found.city,
        state: found.state,
      }));
    } else {
      setAreaOptions([]);
      setSubAreaOptions([]);
    }
  }, [formData.pincode, pincodeData]);

  useEffect(() => {
    const area = areaOptions.find((a) => a.name === formData.areaName);
    if (area) setSubAreaOptions(area.subAreas || []);
    else setSubAreaOptions([]);
  }, [formData.areaName, areaOptions]);

  // -------------------- Handlers --------------------
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const file = result.assets[0];
      setImageFile({
        uri: file.uri,
        name: file.fileName || "profile.jpg",
        type: file.mimeType || "image/jpeg",
      });
      setFormData((prev) => ({ ...prev, profileImage: file.uri }));
    }
  };

  // -------------------- Submit --------------------
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (
        formData.password &&
        formData.password !== formData.confirmPassword
      ) {
        setError("Passwords do not match.");
        setSaving(false);
        return;
      }

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setError("User not found. Please login again.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      form.append("id", userId);
      form.append("username", formData.username);
      if (formData.password) form.append("password", formData.password);
      form.append("buildingName", formData.houseName);
      form.append("areaName", formData.areaName);
      form.append("subAreaName", formData.subAreaName);
      form.append("city", formData.city);
      form.append("state", formData.state);
      form.append("pincode", formData.pincode);

      if (imageFile) form.append("profileImage", imageFile);

      console.log("Submitting form data:", form);

      const res = await userEditProfile(form);
      console.log("Submit response:", res);
      if (res?.success) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        setError(res?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      console.log("Submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="gray" />
        <Text className="text-gray-600 mt-2">Loading profile...</Text>
      </View>
    );
  }

  // -------------------- UI --------------------
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-semibold text-center mb-5">Edit Profile</Text>

      {error && <Text className="text-red-500 text-center mb-3">{error}</Text>}

      <View className="items-center mb-5">
        {formData.profileImage ? (
          <Image
            source={{ uri: formData.profileImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#ddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No Image</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-200 px-3 py-1 rounded mt-2"
        >
          <Text>Select Image</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text>Name</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        value={formData.username}
        onChangeText={(v) => handleChange("username", v)}
      />

      {/* Phone */}
      <Text>Phone Number</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3 text-gray-500"
        value={formData.phoneNumber}
        editable={false}
      />

      {/* Password */}
      <Text>New Password</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        value={formData.password}
        secureTextEntry
        onChangeText={(v) => handleChange("password", v)}
      />

      {/* Confirm Password */}
      <Text>Confirm Password</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        value={formData.confirmPassword}
        secureTextEntry
        onChangeText={(v) => handleChange("confirmPassword", v)}
      />

      {/* House Name */}
      <Text>House / Building Name</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        value={formData.houseName}
        onChangeText={(v) => handleChange("houseName", v)}
      />

      {/* Pincode */}
      <Text>Pincode</Text>
      <View className="border border-gray-300 rounded mb-3">
        <Picker
          selectedValue={formData.pincode}
          onValueChange={(v) => handleChange("pincode", v)}
        >
          <Picker.Item label="Select Pincode" value="" />
          {pincodeData.map((p: any) => (
            <Picker.Item key={p._id} label={p.code} value={p.code} />
          ))}
        </Picker>
      </View>

      {/* Area */}
      <Text>Area</Text>
      <View className="border border-gray-300 rounded mb-3">
        <Picker
          selectedValue={formData.areaName}
          onValueChange={(v) => handleChange("areaName", v)}
        >
          <Picker.Item label="Select Area" value="" />
          {areaOptions.map((a: any) => (
            <Picker.Item key={a._id} label={a.name} value={a.name} />
          ))}
        </Picker>
      </View>

      {/* Sub Area */}
      <Text>Sub Area</Text>
      <View className="border border-gray-300 rounded mb-3">
        <Picker
          selectedValue={formData.subAreaName}
          onValueChange={(v) => handleChange("subAreaName", v)}
        >
          <Picker.Item label="Select Sub Area" value="" />
          {subAreaOptions.map((sa: any) => (
            <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
          ))}
        </Picker>
      </View>

      {/* City */}
      <Text>City</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-3"
        value={formData.city}
        editable={false}
      />

      {/* State */}
      <Text>State</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-5"
        value={formData.state}
        editable={false}
      />

      {/* Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={saving}
          className="flex-1 bg-blue-500 py-2 rounded mr-1"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center">Update</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-1 bg-gray-400 py-2 rounded ml-1"
        >
          <Text className="text-white text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileEditPage;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   Alert,
//   Platform,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import * as ImagePicker from "expo-image-picker";
// import {
//   User,
//   Eye,
//   EyeOff,
//   Save,
//   X,
//   Camera,
//   Phone,
//   Lock,
//   Home,
//   MapPin,
// } from "lucide-react-native";
// import { useNavigation, useRouter } from "expo-router";
// import { getAllPincodes, userEditProfile, userGetProfile } from "@/src/api/apiMethods";
// // import {
// //   getAllPincodes,
// //   userEditProfile,
// //   userGetProfile,
// // } from "@/src/api/apiMethods";

// const { width } = Dimensions.get("window");

// interface SubArea {
//   _id: string;
//   name: string;
// }

// interface Area {
//   _id: string;
//   name: string;
//   subAreas?: SubArea[];
// }

// interface Pincode {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: Area[];
// }

// interface FormData {
//   profileImage: string;
//   username: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
//   houseName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface UserProfile {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// const ProfileEditPage: React.FC = () => {
//   const router = useRouter();
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>({
//     profileImage: "",
//     username: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     houseName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updating, setUpdating] = useState<boolean>(false);
//   const [uploadingImage, setUploadingImage] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<Pincode[]>([]);
//   const [areaOptions, setAreaOptions] = useState<Area[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState<boolean>(false);

//   useEffect(() => {
//     const fetchUserProfile = async (): Promise<void> => {
//       try {
//         const userId = await AsyncStorage.getItem("userId");
//         if (!userId) {
//           setError("User ID not found. Please login again.");
//           return;
//         }

//         const response = await userGetProfile(userId);
//         if (response && response.success) {
//           const userData: UserProfile = response.result;
//           setFormData({
//             profileImage: userData.profileImage || "",
//             username: userData.username || "",
//             phoneNumber: userData.phoneNumber || "",
//             password: "",
//             confirmPassword: "",
//             houseName: userData.buildingName || "",
//             areaName: userData.areaName || "",
//             subAreaName: userData.subAreaName || "",
//             city: userData.city || "",
//             state: userData.state || "",
//             pincode: userData.pincode || "",
//           });
//         }
//       } catch (err: any) {
//         setError(err?.message || "Failed to fetch profile data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     const fetchPincodes = async (): Promise<void> => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//           const foundPincode = response.data.find(
//             (p) => p.code === formData.pincode
//           );
//           if (foundPincode) {
//             setAreaOptions(foundPincode.areas || []);
//             setFormData((prev) => ({
//               ...prev,
//               city: foundPincode.city,
//               state: foundPincode.state,
//             }));
//             const foundArea = foundPincode.areas.find(
//               (a) => a.name === formData.areaName
//             );
//             if (foundArea) {
//               setSubAreaOptions(foundArea.subAreas || []);
//             }
//           }
//         }
//       } catch (err) {
//         setError("Failed to fetch pincodes. Please try again.");
//       }
//     };

//     fetchPincodes();
//   }, [formData.pincode]);

//   useEffect(() => {
//     if (formData.pincode) {
//       const found = pincodeData.find((p) => p.code === formData.pincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         // Pre-select the area if it exists in the fetched data
//         const defaultArea = found.areas.find(
//           (a) => a.name === formData.areaName
//         );
//         if (defaultArea) {
//           setSubAreaOptions(defaultArea.subAreas || []);
//         } else {
//           setSubAreaOptions([]);
//         }
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//         setSubAreaOptions([]);
//       }
//     }
//   }, [formData.pincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName && areaOptions.length > 0) {
//       const foundArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (foundArea && foundArea.subAreas) {
//         setSubAreaOptions(foundArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//     }
//   }, [formData.areaName, areaOptions]);

//   const handleChange = (name: keyof FormData, value: string): void => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError(null);
//     if (success) setSuccess(null);
//   };

//   const pickImage = async (): Promise<void> => {
//     try {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "Sorry, we need camera roll permissions to make this work!"
//         );
//         return;
//       }

//       setUploadingImage(true);

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//         base64: true,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageDataUrl = `data:image/jpeg;base64,${result.assets[0].base64}`;
//         setFormData((prev) => ({ ...prev, profileImage: imageDataUrl }));
//         setSuccess("Profile image selected successfully!");
//         setTimeout(() => setSuccess(null), 3000);
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       setError("Failed to select image. Please try again.");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleCancel = (): void => {
//     navigation.navigate("Profile" as never);
//   };

//   const handleSubmit = async (): Promise<void> => {
//     setError(null);
//     setSuccess(null);
//     setUpdating(true);

//     try {
//       if (formData.password && formData.password !== formData.confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }

//       if (
//         formData.password &&
//         (formData.password.length < 6 || formData.password.length > 10)
//       ) {
//         setError("Password must be between 6 and 10 characters long");
//         return;
//       }

//       const userId = await AsyncStorage.getItem("userId");
//       const token = await AsyncStorage.getItem("jwt_token");
//       if (!userId || !token) {
//         setError("User ID or token not found. Please login again.");
//         return;
//       }

//       const updateData = {
//         id: userId,
//         username: formData.username,
//         password: formData.password || undefined,
//         profileImage: formData.profileImage,
//         buildingName: formData.houseName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       const response = await userEditProfile(updateData);

//       if (response && response.success) {
//         setSuccess("Profile updated successfully!");
//         const userData = response.result;
//         const updatedUser = {
//           ...userData,
//           id: userId,
//           username: userData.username,
//           buildingName: userData.buildingName,
//           phoneNumber: userData.phoneNumber,
//           areaName: userData.areaName,
//           subAreaName: userData.subAreaName,
//           pincode: userData.pincode,
//           state: userData.state,
//           city: userData.city,
//           profileImage: userData.profileImage || formData.profileImage,
//           token,
//         };

//         await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
//         setTimeout(() => navigation.navigate("Profile" as never), 2000);
//       } else {
//         setError(response?.message || "Failed to update profile.");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to update profile. Please try again.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <LinearGradient
//         colors={["#f0f4f8", "#e0e7ff"]}
//         className="flex-1 justify-center items-center"
//       >
//         <ActivityIndicator size="large" color="#4c51bf" />
//         <Text className="text-gray-600 mt-2">Loading profile data...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       <View className="p-4">
//         {/* Header */}
//         <Text className="text-2xl font-semibold text-gray-800 text-center mb-6">
//           Edit Profile
//         </Text>

//         {/* Profile Image */}
//         <View className="flex-1 items-center mb-6">
//           {/* Error/Success Messages */}
//           {error && (
//             <Text className="text-red-500 text-center mt-2 mb-3">{error}</Text>
//           )}
//           {success && (
//             <Text className="text-green-500 text-center mt-2 mb-3">{success}</Text>
//           )}
//           {/* <View className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
//             {formData.profileImage ? (
//               <Image
//                 source={{ uri: formData.profileImage }}
//                 className="w-full h-full"
//                 resizeMode="cover"
//               />
//             ) : (
//               <User size={56} color="#9ca3af" className="mx-auto mt-4" />
//             )}
//           </View> */}
//           <View className="w-28 h-28 rounded-full bg-teal-400 p-1 shadow-lg">
//             <View className="w-full h-full rounded-full bg-white justify-center items-center overflow-hidden">
//               {formData.profileImage ? (
//                 <Image
//                   source={{ uri: formData.profileImage }}
//                   className="w-full h-full"
//                 />
//               ) : (
//                 <User size={50} color="gray" />
//               )}
//             </View>
//           </View>

//           <TouchableOpacity
//             className="mt-3 bg-blue-500 rounded-lg px-4 py-2"
//             onPress={pickImage}
//             disabled={uploadingImage}
//           >
//             {uploadingImage ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text className="text-white text-center">Choose Image</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Form Fields */}
//         <View className="space-y-3">
//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg p-3 bg-white text-gray-800"
//               value={formData.username}
//               onChangeText={(value) => handleChange("username", value)}
//               placeholder="Enter your name"
//               placeholderTextColor="#9ca3af"
//             />
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Phone Number
//             </Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
//               <Phone size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-500"
//                 value={formData.phoneNumber}
//                 editable={false}
//                 placeholder="Enter phone number"
//                 placeholderTextColor="#9ca3af"
//               />
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Lock size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.password}
//                 onChangeText={(value) => handleChange("password", value)}
//                 secureTextEntry={!showPassword}
//                 maxLength={10}
//                 placeholder="Enter new password"
//                 placeholderTextColor="#9ca3af"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword((prev) => !prev)}
//               >
//                 {showPassword ? (
//                   <EyeOff size={16} color="#6b7280" />
//                 ) : (
//                   <Eye size={16} color="#6b7280" />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Lock size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.confirmPassword}
//                 onChangeText={(value) => handleChange("confirmPassword", value)}
//                 secureTextEntry={!showConfirmPassword}
//                 maxLength={10}
//                 placeholder="Confirm new password"
//                 placeholderTextColor="#9ca3af"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowConfirmPassword((prev) => !prev)}
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff size={16} color="#6b7280" />
//                 ) : (
//                   <Eye size={16} color="#6b7280" />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               House/Building Name
//             </Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Home size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.houseName}
//                 onChangeText={(value) => handleChange("houseName", value)}
//                 placeholder="Enter house or building name"
//                 placeholderTextColor="#9ca3af"
//               />
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Pincode
//             </Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.pincode}
//                 onValueChange={(value) => handleChange("pincode", value)}
//                 style={{ height: Platform.OS === "ios" ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Pincode" value="" />
//                 {pincodeData
//                   .sort((a, b) => Number(a.code) - Number(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} />
//                   ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Area Name
//             </Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.areaName}
//                 onValueChange={(value) => handleChange("areaName", value)}
//                 style={{ height: Platform.OS === "ios" ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Area" value="" />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               Sub Area
//             </Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.subAreaName}
//                 onValueChange={(value) => handleChange("subAreaName", value)}
//                 style={{ height: Platform.OS === "ios" ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Sub Area" value="" />
//                 {subAreaOptions.map((sa) => (
//                   <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">City</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.city}
//                 onValueChange={(value) => handleChange("city", value)}
//                 style={{ height: Platform.OS === "ios" ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select City" value="" />
//                 {formData.pincode &&
//                 pincodeData.find((p) => p.code === formData.pincode) ? (
//                   <Picker.Item
//                     label={
//                       pincodeData.find((p) => p.code === formData.pincode)?.city
//                     }
//                     value={
//                       pincodeData.find((p) => p.code === formData.pincode)?.city
//                     }
//                   />
//                 ) : (
//                   [...new Set(pincodeData.map((p) => p.city))].map((city) => (
//                     <Picker.Item key={city} label={city} value={city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">
//               State
//             </Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.state}
//                 onValueChange={(value) => handleChange("state", value)}
//                 style={{ height: Platform.OS === "ios" ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {formData.pincode &&
//                 pincodeData.find((p) => p.code === formData.pincode) ? (
//                   <Picker.Item
//                     label={
//                       pincodeData.find((p) => p.code === formData.pincode)
//                         ?.state
//                     }
//                     value={
//                       pincodeData.find((p) => p.code === formData.pincode)
//                         ?.state
//                     }
//                   />
//                 ) : (
//                   [...new Set(pincodeData.map((p) => p.state))].map((state) => (
//                     <Picker.Item key={state} label={state} value={state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <View className="flex-row justify-between mt-6">
//             <TouchableOpacity
//               className="flex-1 bg-blue-500 rounded-lg py-2 mr-1"
//               onPress={handleSubmit}
//               disabled={updating}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text className="text-white text-center">Update</Text>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex-1 bg-gray-400 rounded-lg py-2 ml-1"
//               onPress={handleCancel}
//               disabled={updating}
//             >
//               <Text className="text-white text-center">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default ProfileEditPage;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Alert, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { User, Eye, EyeOff, Save, X, Camera, Phone, Lock, Home, MapPin } from 'lucide-react-native';
// import { useNavigation, useRouter } from 'expo-router';
// import { getAllPincodes, userEditProfile, userGetProfile } from '@/src/api/apiMethods';

// const { width } = Dimensions.get('window');

// interface SubArea {
//   _id: string;
//   name: string;
// }

// interface Area {
//   _id: string;
//   name: string;
//   subAreas?: SubArea[];
// }

// interface Pincode {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: Area[];
// }

// interface FormData {
//   profileImage: string;
//   username: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
//   houseName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface UserProfile {
//   id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// const ProfileEditPage: React.FC = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     profileImage: '',
//     username: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     houseName: '',
//     areaName: '',
//     subAreaName: '',
//     city: '',
//     state: '',
//     pincode: '',
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updating, setUpdating] = useState<boolean>(false);
//   const [uploadingImage, setUploadingImage] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<Pincode[]>([]);
//   const [areaOptions, setAreaOptions] = useState<Area[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//   const navigation =  useNavigation()

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userId = await AsyncStorage.getItem('userId');
//         if (!userId) {
//           setError('User ID not found. Please login again.');
//           return;
//         }

//         const response = await userGetProfile(userId);
//         if (response && response.success) {
//           const userData: UserProfile = response.result;
//           setFormData({
//             profileImage: userData.profileImage || '',
//             username: userData.username || '',
//             phoneNumber: userData.phoneNumber || '',
//             password: '',
//             confirmPassword: '',
//             houseName: userData.buildingName || '',
//             areaName: userData.areaName || '',
//             subAreaName: userData.subAreaName || '',
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
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//           areaName: '',
//           subAreaName: '',
//         }));
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
//         setFormData((prev) => ({ ...prev, subAreaName: '' }));
//       } else {
//         setSubAreaOptions([]);
//       }
//     } else {
//       setSubAreaOptions([]);
//     }
//   }, [formData.areaName, areaOptions]);

//   const handleChange = (name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError(null);
//     if (success) setSuccess(null);
//   };

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       setUploadingImage(true);

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//         base64: true,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageDataUrl = `data:image/jpeg;base64,${result.assets[0].base64}`;
//         setFormData((prev) => ({ ...prev, profileImage: imageDataUrl }));
//         setSuccess('Profile image selected successfully!');
//         setTimeout(() => setSuccess(null), 3000);
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       setError('Failed to select image. Please try again.');
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleCancel = () => {
//     navigation.navigate('Profile')
//   }

//   const handleSubmit = async () => {
//     setError(null);
//     setSuccess(null);
//     setUpdating(true);

//     try {
//       if (formData.password && formData.password !== formData.confirmPassword) {
//         setError('Passwords do not match');
//         return;
//       }

//       if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//         setError('Password must be between 6 and 10 characters long');
//         return;
//       }

//       const userId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('jwt_token');
//       if (!userId || !token) {
//         setError('User ID or token not found. Please login again.');
//         return;
//       }

//       const updateData = {
//         id: userId,
//         username: formData.username,
//         password: formData.password || undefined,
//         profileImage: formData.profileImage,
//         buildingName: formData.houseName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName,
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
//           subAreaName: userData.subAreaName,
//           pincode: userData.pincode,
//           state: userData.state,
//           city: userData.city,
//           profileImage: userData.profileImage || formData.profileImage,
//           token,
//         };

//         await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//         setTimeout(() => navigation.navigate("Profile"), 2000);
//       } else {
//         setError(response?.message || 'Failed to update profile.');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to update profile. Please try again.');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <LinearGradient colors={['#f0f4f8', '#e0e7ff']} className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#4c51bf" />
//         <Text className="text-gray-600 mt-2">Loading profile data...</Text>
//       </LinearGradient>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       <View className="p-4">
//         {/* Header */}
//         <Text className="text-2xl font-semibold text-gray-800 text-center mb-6">Edit Profile</Text>

//         {/* Profile Image */}
//         <View className="items-center mb-6">
//           <View className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
//             {formData.profileImage ? (
//               <Image source={{ uri: formData.profileImage }} className="w-full h-full" resizeMode="cover" />
//             ) : (
//               <User size={48} color="#9ca3af" className="items-center" />
//             )}
//           </View>
//           <TouchableOpacity
//             className="mt-3 bg-blue-500 rounded-lg px-4 py-2"
//             onPress={pickImage}
//             disabled={uploadingImage}
//           >
//             {uploadingImage ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text className="text-white text-center">Choose Image</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Form Fields */}
//         <View className="space-y-4">
//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg p-3 bg-white text-gray-800"
//               value={formData.username}
//               onChangeText={(value) => handleChange('username', value)}
//               placeholder="Enter your name"
//               placeholderTextColor="#9ca3af"
//             />
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Phone Number</Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
//               <Phone size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-500"
//                 value={formData.phoneNumber}
//                 editable={false}
//                 placeholder="Enter phone number"
//                 placeholderTextColor="#9ca3af"
//               />
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">New Password</Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Lock size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.password}
//                 onChangeText={(value) => handleChange('password', value)}
//                 secureTextEntry={!showPassword}
//                 maxLength={10}
//                 placeholder="Enter new password"
//                 placeholderTextColor="#9ca3af"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
//                 {showPassword ? <EyeOff size={16} color="#6b7280" /> : <Eye size={16} color="#6b7280" />}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Confirm Password</Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Lock size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.confirmPassword}
//                 onChangeText={(value) => handleChange('confirmPassword', value)}
//                 secureTextEntry={!showConfirmPassword}
//                 maxLength={10}
//                 placeholder="Confirm new password"
//                 placeholderTextColor="#9ca3af"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
//                 {showConfirmPassword ? <EyeOff size={16} color="#6b7280" /> : <Eye size={16} color="#6b7280" />}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">House/Building Name</Text>
//             <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
//               <Home size={16} color="#6b7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-800"
//                 value={formData.houseName}
//                 onChangeText={(value) => handleChange('houseName', value)}
//                 placeholder="Enter house or building name"
//                 placeholderTextColor="#9ca3af"
//               />
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Pincode</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.pincode}
//                 onValueChange={(value) => handleChange('pincode', value)}
//                 style={{ height: Platform.OS === 'ios' ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Pincode" value="" />
//                 {pincodeData.sort((a, b) => Number(a.code) - Number(b.code)).map((p) => (
//                   <Picker.Item key={p._id} label={p.code} value={p.code} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Area Name</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.areaName}
//                 onValueChange={(value) => handleChange('areaName', value)}
//                 style={{ height: Platform.OS === 'ios' ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Area" value="" />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">Sub Area</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.subAreaName}
//                 onValueChange={(value) => handleChange('subAreaName', value)}
//                 style={{ height: Platform.OS === 'ios' ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select Sub Area" value="" />
//                 {subAreaOptions.map((sa) => (
//                   <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">City</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.city}
//                 onValueChange={(value) => handleChange('city', value)}
//                 style={{ height: Platform.OS === 'ios' ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select City" value="" />
//                 {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                     value={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                   />
//                 ) : (
//                   [...new Set(pincodeData.map((p) => p.city))].map((city) => (
//                     <Picker.Item key={city} label={city} value={city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>

//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-1">State</Text>
//             <View className="border border-gray-300 rounded-lg bg-white">
//               <Picker
//                 selectedValue={formData.state}
//                 onValueChange={(value) => handleChange('state', value)}
//                 style={{ height: Platform.OS === 'ios' ? 50 : 50 }}
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                     value={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                   />
//                 ) : (
//                   [...new Set(pincodeData.map((p) => p.state))].map((state) => (
//                     <Picker.Item key={state} label={state} value={state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>

//           {/* Error/Success Messages */}
//           {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}
//           {success && <Text className="text-green-500 text-center mt-2">{success}</Text>}

//           {/* Action Buttons */}
//           <View className="flex-row justify-between mt-6">
//             <TouchableOpacity
//               className="flex-1 bg-blue-500 rounded-lg py-3 mr-2"
//               onPress={handleSubmit}
//               disabled={updating}
//             >
//               {updating ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text className="text-white text-center font-medium">Update Profile</Text>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex-1 bg-gray-400 rounded-lg py-3 ml-2"
//               onPress={handleCancel}
//               disabled={updating}
//             >
//               <Text className="text-white text-center font-medium">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default ProfileEditPage;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   Alert,
//   StyleSheet,
//   Platform,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { User, Eye, EyeOff, Save, X, Camera, Phone, Lock, Chrome as Home, MapPin } from 'lucide-react-native';
// import { useRouter } from 'expo-router';

// const { width, height } = Dimensions.get('window');

// interface FormData {
//   profileImage: string;
//   username: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
//   houseName: string;
//   areaName: string;
//   subArea: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: Array<{
//     _id: string;
//     name: string;
//     subAreas: Array<{
//       _id: string;
//       name: string;
//     }>;
//   }>;
// }

// // Mock API functions - replace with your actual API calls
// const getAllPincodes = async (): Promise<{ data: PincodeData[] }> => {
//   // Mock data - replace with actual API call
//   return {
//     data: [
//       {
//         _id: '1',
//         code: '123456',
//         city: 'Sample City',
//         state: 'Sample State',
//         areas: [
//           {
//             _id: '1',
//             name: 'Area 1',
//             subAreas: [
//               { _id: '1', name: 'Sub Area 1' },
//               { _id: '2', name: 'Sub Area 2' },
//             ],
//           },
//         ],
//       },
//     ],
//   };
// };

// const userGetProfile = async (userId: string) => {
//   // Mock data - replace with actual API call
//   return {
//     result: {
//       username: 'John Doe',
//       phoneNumber: '1234567890',
//       buildingName: 'Sample Building',
//       areaName: 'Area 1',
//       subAreaName: 'Sub Area 1',
//       city: 'Sample City',
//       state: 'Sample State',
//       pincode: '123456',
//       profileImage: '',
//     },
//   };
// };

// const userEditProfile = async (data: any) => {
//   // Mock API call - replace with actual implementation
//   return {
//     success: true,
//     result: data,
//   };
// };

// const ProfileEditPage: React.FC = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
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

//   // Separate state for original data to prevent unwanted resets
//   const [originalData, setOriginalData] = useState<FormData>({
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
//   const [updating, setUpdating] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
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
//           const profileData: FormData = {
//             profileImage: userData.profileImage || '',
//             username: userData.username || '',
//             phoneNumber: userData.phoneNumber || '',
//             password: '',
//             confirmPassword: '',
//             houseName: userData.buildingName || '',
//             areaName: userData.areaName || '',
//             subArea: userData.subAreaName || '',
//             city: userData.city || '',
//             state: userData.state || '',
//             pincode: userData.pincode || '',
//           };

//           setFormData(profileData);
//           setOriginalData(profileData);
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

//   // Update area options when pincode changes
//   useEffect(() => {
//     if (formData.pincode && pincodeData.length > 0) {
//       const found = pincodeData.find((p) => p.code === formData.pincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);

//         // Auto-select city and state based on pincode
//         setFormData(prev => ({
//           ...prev,
//           city: found.city,
//           state: found.state,
//         }));
//       } else {
//         setAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//     }
//   }, [formData.pincode, pincodeData]);

//   // Update sub area options when area changes
//   useEffect(() => {
//     if (formData.areaName && areaOptions.length > 0) {
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

//   const handleChange = (name: keyof FormData, value: string) => {
//     setFormData((prev) => {
//       const newData = { ...prev, [name]: value };

//       // Clear area and subarea when pincode changes
//       if (name === 'pincode') {
//         newData.areaName = '';
//         newData.subArea = '';
//       }

//       // Clear subarea when area changes
//       if (name === 'areaName') {
//         newData.subArea = '';
//       }

//       return newData;
//     });

//     // Clear errors when user starts typing
//     if (error) setError(null);
//     if (success) setSuccess(null);
//   };

//   const pickImage = async () => {
//     try {
//       // Request permissions
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       setUploadingImage(true);

//       // Launch image picker
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//         base64: true, // Get base64 directly
//       });

//       if (!result.canceled && result.assets[0]) {
//         const asset = result.assets[0];

//         // Create data URL with proper format
//         const imageDataUrl = `data:image/jpeg;base64,${asset.base64}`;

//         // Update form data with the new image
//         setFormData(prev => ({ ...prev, profileImage: imageDataUrl }));
//         setSuccess('Profile image selected successfully!');

//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       setError('Failed to select image. Please try again.');
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     setSuccess(null);
//     setUpdating(true);

//     try {
//       // Validation
//       if (formData.password && formData.password !== formData.confirmPassword) {
//         setError('Passwords do not match');
//         return;
//       }

//       if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
//         setError('Password must be between 6 and 10 characters long');
//         return;
//       }

//       const userId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('jwt_token');
//       if (!userId || !token) {
//         setError('User ID or token not found. Please login again.');
//         return;
//       }

//       // Prepare data matching API expectations
//       const updateData = {
//         id: userId,
//         username: formData.username,
//         password: formData.password || undefined,
//         buildingName: formData.houseName,
//         areaName: formData.areaName,
//         subAreaName: formData.subArea,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         profileImage: formData.profileImage
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
//           subArea: userData.subAreaName,
//           pincode: userData.pincode,
//           state: userData.state,
//           city: userData.city,
//           profileImage: userData.profileImage || formData.profileImage,
//           token,
//         };

//         await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

//         setTimeout(() => {
//           router.back();
//         }, 2000);
//       } else {
//         setError(response?.message || 'Failed to update profile.');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to update profile. Please try again.');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={styles.container}
//       >
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0d9488" />
//           <Text style={styles.loadingText}>Loading profile data...</Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <LinearGradient
//         colors={['#d1fae5', '#e6fffa', '#cffafe']}
//         style={styles.gradientContainer}
//       >
//         <View style={styles.content}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Edit Profile</Text>
//           </View>

//           {/* Main Form Card */}
//           <LinearGradient
//             colors={['#10b981', '#14b8a6', '#06b6d4']}
//             style={styles.cardGradient}
//           >
//             <View style={styles.card}>
//               {/* Error/Success Messages */}
//               {error && (
//                 <View style={styles.errorContainer}>
//                   <Text style={styles.errorText}>{error}</Text>
//                 </View>
//               )}
//               {success && (
//                 <View style={styles.successContainer}>
//                   <Text style={styles.successText}>{success}</Text>
//                 </View>
//               )}

//               {/* Profile Image */}
//               <View style={styles.profileImageSection}>
//                 <Text style={styles.label}>Profile Image</Text>
//                 <View style={styles.profileImageContainer}>
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     style={styles.profileImageGradient}
//                   >
//                     <View style={styles.profileImageInner}>
//                       {formData.profileImage ? (
//                         <Image
//                           source={{ uri: formData.profileImage }}
//                           style={styles.profileImage}
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <User size={32} color="#9ca3af" />
//                       )}
//                     </View>
//                   </LinearGradient>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.imagePickerButton}
//                   onPress={pickImage}
//                   disabled={uploadingImage}
//                 >
//                   <LinearGradient
//                     colors={['#d1fae5', '#cffafe']}
//                     style={styles.imagePickerGradient}
//                   >
//                     {uploadingImage ? (
//                       <ActivityIndicator size="small" color="#0d9488" />
//                     ) : (
//                       <>
//                         <Camera size={16} color="#065f46" />
//                         <Text style={styles.imagePickerText}>Choose Image</Text>
//                       </>
//                     )}
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>

//               {/* Form Fields */}
//               <View style={styles.formContainer}>
//                 <View style={styles.row}>
//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Name</Text>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.username}
//                       onChangeText={(value) => handleChange('username', value)}
//                       placeholder="Enter your name"
//                       placeholderTextColor="#9ca3af"
//                     />
//                   </View>

//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Phone Number</Text>
//                     <View style={styles.disabledInputContainer}>
//                       <Phone size={16} color="#6b7280" />
//                       <TextInput
//                         style={styles.disabledInput}
//                         value={formData.phoneNumber}
//                         editable={false}
//                         placeholder="Enter phone number"
//                         placeholderTextColor="#9ca3af"
//                       />
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.row}>
//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>New Password</Text>
//                     <View style={styles.passwordContainer}>
//                       <Lock size={16} color="#6b7280" />
//                       <TextInput
//                         style={styles.passwordInput}
//                         value={formData.password}
//                         onChangeText={(value) => handleChange('password', value)}
//                         secureTextEntry={!showPassword}
//                         maxLength={10}
//                         placeholder="Enter new password"
//                         placeholderTextColor="#9ca3af"
//                         autoCapitalize="none"
//                         autoCorrect={false}
//                       />
//                       <TouchableOpacity
//                         style={styles.eyeButton}
//                         onPress={() => setShowPassword((prev) => !prev)}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={16} color="#6b7280" />
//                         ) : (
//                           <Eye size={16} color="#6b7280" />
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   </View>

//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Confirm Password</Text>
//                     <View style={styles.passwordContainer}>
//                       <Lock size={16} color="#6b7280" />
//                       <TextInput
//                         style={styles.passwordInput}
//                         value={formData.confirmPassword}
//                         onChangeText={(value) => handleChange('confirmPassword', value)}
//                         secureTextEntry={!showConfirmPassword}
//                         maxLength={10}
//                         placeholder="Confirm new password"
//                         placeholderTextColor="#9ca3af"
//                         autoCapitalize="none"
//                         autoCorrect={false}
//                       />
//                       <TouchableOpacity
//                         style={styles.eyeButton}
//                         onPress={() => setShowConfirmPassword((prev) => !prev)}
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff size={16} color="#6b7280" />
//                         ) : (
//                           <Eye size={16} color="#6b7280" />
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.row}>
//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>House/Building Name</Text>
//                     <View style={styles.inputWithIcon}>
//                       <Home size={16} color="#6b7280" />
//                       <TextInput
//                         style={styles.inputWithIconText}
//                         value={formData.houseName}
//                         onChangeText={(value) => handleChange('houseName', value)}
//                         placeholder="Enter house or building name"
//                         placeholderTextColor="#9ca3af"
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Pincode</Text>
//                     <View style={styles.pickerContainer}>
//                       <MapPin size={16} color="#6b7280" style={styles.pickerIcon} />
//                       <Picker
//                         selectedValue={formData.pincode}
//                         onValueChange={(value) => handleChange('pincode', value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select Pincode" value="" />
//                         {pincodeData
//                           .sort((a, b) => Number(a.code) - Number(b.code))
//                           .map((p) => (
//                             <Picker.Item key={p._id} label={p.code} value={p.code} />
//                           ))}
//                       </Picker>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.row}>
//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Area Name</Text>
//                     <View style={styles.pickerContainer}>
//                       <Picker
//                         selectedValue={formData.areaName}
//                         onValueChange={(value) => handleChange('areaName', value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select Area" value="" />
//                         {areaOptions.map((a: any) => (
//                           <Picker.Item key={a._id} label={a.name} value={a.name} />
//                         ))}
//                       </Picker>
//                     </View>
//                   </View>

//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>Sub Area</Text>
//                     <View style={styles.pickerContainer}>
//                       <Picker
//                         selectedValue={formData.subArea}
//                         onValueChange={(value) => handleChange('subArea', value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select Sub Area" value="" />
//                         {subAreaOptions.map((sa: any) => (
//                           <Picker.Item key={sa._id} label={sa.name} value={sa.name} />
//                         ))}
//                       </Picker>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.row}>
//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>City</Text>
//                     <View style={styles.pickerContainer}>
//                       <Picker
//                         selectedValue={formData.city}
//                         onValueChange={(value) => handleChange('city', value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select City" value="" />
//                         {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                           <Picker.Item
//                             label={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                             value={pincodeData.find((p) => p.code === formData.pincode)?.city}
//                           />
//                         ) : (
//                           pincodeData.map((p) => (
//                             <Picker.Item key={p._id} label={p.city} value={p.city} />
//                           ))
//                         )}
//                       </Picker>
//                     </View>
//                   </View>

//                   <View style={styles.halfWidth}>
//                     <Text style={styles.label}>State</Text>
//                     <View style={styles.pickerContainer}>
//                       <Picker
//                         selectedValue={formData.state}
//                         onValueChange={(value) => handleChange('state', value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select State" value="" />
//                         {formData.pincode && pincodeData.find((p) => p.code === formData.pincode) ? (
//                           <Picker.Item
//                             label={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                             value={pincodeData.find((p) => p.code === formData.pincode)?.state}
//                           />
//                         ) : (
//                           pincodeData.map((p) => (
//                             <Picker.Item key={p._id} label={p.state} value={p.state} />
//                           ))
//                         )}
//                       </Picker>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Action Buttons */}
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                   style={styles.updateButton}
//                   onPress={handleSubmit}
//                   disabled={updating}
//                 >
//                   <LinearGradient
//                     colors={['#10b981', '#14b8a6', '#06b6d4']}
//                     style={styles.updateButtonGradient}
//                   >
//                     {updating ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <>
//                         <Save size={16} color="#fff" />
//                         <Text style={styles.updateButtonText}>Update Profile</Text>
//                       </>
//                     )}
//                   </LinearGradient>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => router.back()}
//                   disabled={updating}
//                 >
//                   <X size={16} color="#fff" />
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </LinearGradient>
//         </View>
//       </LinearGradient>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradientContainer: {
//     minHeight: height,
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     margin: 20,
//     borderRadius: 16,
//     padding: 32,
//   },
//   loadingText: {
//     color: '#6b7280',
//     marginTop: 16,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   content: {
//     maxWidth: 768,
//     width: '100%',
//     alignSelf: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#059669',
//   },
//   cardGradient: {
//     borderRadius: 16,
//     padding: 2,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 14,
//     padding: 24,
//   },
//   errorContainer: {
//     backgroundColor: '#fef2f2',
//     borderLeftWidth: 4,
//     borderLeftColor: '#ef4444',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#dc2626',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   successContainer: {
//     backgroundColor: '#f0fdf4',
//     borderLeftWidth: 4,
//     borderLeftColor: '#22c55e',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   successText: {
//     color: '#16a34a',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   profileImageSection: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   profileImageContainer: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     marginBottom: 16,
//   },
//   profileImageGradient: {
//     padding: 4,
//     borderRadius: 48,
//   },
//   profileImageInner: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 44,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 44,
//   },
//   imagePickerButton: {
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   imagePickerGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   imagePickerText: {
//     color: '#065f46',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   formContainer: {
//     marginTop: 24,
//   },
//   row: {
//     flexDirection: width > 768 ? 'row' : 'column',
//     gap: 16,
//     marginBottom: 16,
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 12,
//     padding: 12,
//     color: '#374151',
//     fontSize: 16,
//     backgroundColor: 'white',
//   },
//   disabledInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     backgroundColor: '#f9fafb',
//     gap: 8,
//   },
//   disabledInput: {
//     flex: 1,
//     padding: 12,
//     color: '#6b7280',
//     fontSize: 16,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//     gap: 8,
//   },
//   inputWithIconText: {
//     flex: 1,
//     padding: 12,
//     color: '#374151',
//     fontSize: 16,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//     gap: 8,
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 12,
//     color: '#374151',
//     fontSize: 16,
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 12,
//     backgroundColor: 'white',
//     overflow: 'hidden',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pickerIcon: {
//     marginLeft: 12,
//   },
//   picker: {
//     flex: 1,
//     height: Platform.OS === 'ios' ? 50 : 50,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 16,
//     paddingTop: 24,
//   },
//   updateButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   updateButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     gap: 8,
//   },
//   updateButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: '#6b7280',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     gap: 8,
//   },
//   cancelButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default ProfileEditPage;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { getAllPincodes, userEditProfile, userGetProfile } from '@/src/api/apiMethods';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

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
//   const [uploadingImage, setUploadingImage] = useState(false);
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
//             profileImage: userData.profileImage || '', // Update this field based on actual API response
//             username: userData.username || '',
//             phoneNumber: userData.phoneNumber || '',
//             password: '',
//             confirmPassword: '',
//             houseName: userData.buildingName || '',
//             areaName: userData.areaName || '',
//             subArea: userData.subAreaName || '', // Note: API uses subAreaName
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

//   const pickImage = async () => {
//     try {
//       // Request permissions
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }

//       // Launch image picker
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setUploadingImage(true);

//         // Convert image to base64
//         const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         // Create data URL
//         const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

//         // Update form data with the new image
//         setFormData(prev => ({ ...prev, profileImage: imageDataUrl }));
//         setSuccess('Profile image selected successfully!');
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       setError('Failed to select image. Please try again.');
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setError(null);
//     setSuccess(null);

//     if (formData.password && formData.password !== formData.confirmPassword) {
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

//       // Prepare data matching API expectations
//       const updateData = {
//         id: userId,
//         username: formData.username,
//         password: formData.password || undefined, // Only send if changed
//         buildingName: formData.houseName,
//         areaName: formData.areaName,
//         subAreaName: formData.subArea, // Note: API expects subAreaName
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         profileImage: formData.profileImage
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
//           subArea: userData.subAreaName, // Map back to our local state naming
//           pincode: userData.pincode,
//           state: userData.state,
//           city: userData.city,
//           profileImage: userData.profileImage || formData.profileImage,
//           token,
//         };

//         await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

//         setTimeout(() => {
//           navigation.goBack(); // Go back to profile page
//         }, 2000);
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
//                   onPress={pickImage}
//                   disabled={uploadingImage}
//                 >
//                   <LinearGradient
//                     colors={['#d1fae5', '#cffafe']}
//                     className="py-2 px-4 rounded-full"
//                   >
//                     {uploadingImage ? (
//                       <ActivityIndicator size="small" color="#0d9488" />
//                     ) : (
//                       <Text className="text-emerald-700 font-semibold text-sm">Choose Image</Text>
//                     )}
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
//                   onPress={() => navigation.goBack()}
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
