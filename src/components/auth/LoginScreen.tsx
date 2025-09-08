import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAllPincodes,
  userRegister,
} from '@/src/api/apiMethods';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface PincodeArea {
  _id: string;
  name: string;
  subAreas: { _id: string; name: string }[];
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: PincodeArea[];
}

interface FormData {
  name: string;
  mobile: string;
  password: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  password?: string;
  buildingName?: string;
  areaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  general?: string;
}

const initialFormState: FormData = {
  name: '',
  mobile: '',
  password: '',
  buildingName: '',
  areaName: '',
  subAreaName: '',
  city: '',
  state: '',
  pincode: '',
};

// Dynamic input fields configuration
const dynamicInputFields = [
  {
    id: 'name' as keyof FormData,
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your full name',
    keyboardType: 'default' as const,
    autoCapitalize: 'words' as const,
    maxLength: undefined,
    required: true,
    emoji: '👤',
    validation: (value: string) => !value.trim() ? 'Name is required' : '',
  },
  {
    id: 'mobile' as keyof FormData,
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter 10-digit phone number',
    keyboardType: 'phone-pad' as const,
    autoCapitalize: 'none' as const,
    maxLength: 10,
    required: true,
    emoji: '📞',
    validation: (value: string) => !value.match(/^[0-9]{10}$/) ? 'Enter a valid 10-digit phone number' : '',
  },
  {
    id: 'password' as keyof FormData,
    label: 'Password',
    type: 'password',
    placeholder: 'Password (6-10 characters)',
    keyboardType: 'default' as const,
    autoCapitalize: 'none' as const,
    maxLength: 10,
    required: true,
    emoji: '🔒',
    validation: (value: string) => value.length < 6 || value.length > 10 ? 'Password must be 6-10 characters' : '',
  },
  {
    id: 'buildingName' as keyof FormData,
    label: 'House/Building Name',
    type: 'text',
    placeholder: 'Enter house or building name',
    keyboardType: 'default' as const,
    autoCapitalize: 'words' as const,
    maxLength: undefined,
    required: true,
    emoji: '🏠',
    validation: (value: string) => !value.trim() ? 'Building name is required' : '',
  }
];

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>('');
  const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Load pincodes data
  useEffect(() => {
    const loadPincodes = async () => {
      try {
        const response = await getAllPincodes();
        if (Array.isArray(response?.data)) {
          setPincodeData(response.data);
        }
      } catch (error) {
        console.error('Failed to load pincodes:', error);
      }
    };
    loadPincodes();
  }, []);

  // Handle pincode selection
  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
        setFormData((prev) => ({ 
          ...prev, 
          city: found.city || '', 
          state: found.state || '',
          areaName: '',
          subAreaName: '' 
        }));
      } else {
        setAreaOptions([]);
        setFormData((prev) => ({ 
          ...prev, 
          city: '', 
          state: '',
          areaName: '',
          subAreaName: '' 
        }));
      }
      setSubAreaOptions([]);
    } else {
      setAreaOptions([]);
      setSubAreaOptions([]);
      setFormData((prev) => ({ 
        ...prev, 
        city: '', 
        state: '',
        areaName: '',
        subAreaName: '' 
      }));
    }
  }, [selectedPincode, pincodeData]);

  // Handle area selection
  useEffect(() => {
    if (formData.areaName) {
      const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
      if (selectedArea && selectedArea.subAreas) {
        setSubAreaOptions(selectedArea.subAreas);
      } else {
        setSubAreaOptions([]);
      }
      setFormData((prev) => ({ ...prev, subAreaName: '' }));
    } else {
      setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, subAreaName: '' }));
    }
  }, [formData.areaName, areaOptions]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // Validate dynamic fields
    dynamicInputFields.forEach(field => {
      const error = field.validation(formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    // Validate other fields
    if (!formData.areaName) newErrors.areaName = 'Area is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

    return newErrors;
  }, [formData]);

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'pincode') {
      setSelectedPincode(value);
    }
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const basePayload = {
        username: formData.name,
        phoneNumber: formData.mobile,
        password: formData.password,
        buildingName: formData.buildingName,
        areaName: formData.areaName,
        subAreaName: formData.subAreaName || '-',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      console.log('Registration payload:', basePayload);
      
      const response = await userRegister(basePayload);
      
      if (response.success) {
        Alert.alert('Success', 'Registration completed! Redirecting to login...');
        navigation.replace('Login');
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMsg = err?.data?.error?.[0] || err?.message || 'Registration failed. Please try again.';
      setErrors({ ...errors, general: errorMsg });
      Alert.alert('Registration Error', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, errors, navigation]);

  const InputField = ({ 
    id, 
    label, 
    type, 
    value, 
    onChange, 
    error, 
    required = true 
  }: {
    id: keyof FormData;
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
  }) => {
    // Get field configuration for dynamic fields
    const fieldConfig = dynamicInputFields.find(f => f.id === id);
    const isDynamicField = !!fieldConfig;

    return (
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        
        {id === 'password' ? (
          <View className="relative">
            <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
              <Text className="text-base mr-2">{fieldConfig?.emoji || '🔒'}</Text>
              <TextInput
                className="flex-1 text-base text-gray-800 pr-10"
                placeholder={fieldConfig?.placeholder || "Password (6-10 characters)"}
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                editable={!loading}
                maxLength={10}
                keyboardType={fieldConfig?.keyboardType || 'default'}
                autoCapitalize={fieldConfig?.autoCapitalize || 'none'}
                autoCorrect={false}
              />
              <Pressable
                onPress={() => !loading && setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={loading}
              >
                <Text className="text-lg">
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : id === 'pincode' ? (
          <View className="border border-gray-300 rounded-md">
            <View className="flex-row items-center p-2">
              <Text className="text-base mr-2">📍</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                enabled={!loading}
                style={{ flex: 1, height: 44 }}
                dropdownIconColor="#6b7280"
                mode="dropdown"
              >
                <Picker.Item label="Select Pincode" value="" style={{ fontSize: 11 }} />
                {pincodeData
                  .sort((a, b) => parseInt(a.code) - parseInt(b.code))
                  .map((p) => (
                    <Picker.Item key={p._id} label={p.code} value={p.code} style={{ fontSize: 11 }} />
                  ))}
              </Picker>
            </View>
          </View>
        ) : id === 'city' ? (
          <View className="border border-gray-300 rounded-md">
            <View className="flex-row items-center p-2">
              <Text className="text-base mr-2">🏙️</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                enabled={!loading}
                style={{ flex: 1, height: 44 }}
                dropdownIconColor="#6b7280"
                mode="dropdown"
              >
                <Picker.Item label="Select City" value="" style={{ fontSize: 11 }}  />
                {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                  <Picker.Item
                    label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
                    value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
                    style={{ fontSize: 11 }} 
                  />
                ) : (
                  pincodeData.map((p) => (
                    <Picker.Item key={p._id} label={p.city} value={p.city} style={{ fontSize: 11 }} />
                  ))
                )}
              </Picker>
            </View>
          </View>
        ) : id === 'state' ? (
          <View className="border border-gray-300 rounded-md">
            <View className="flex-row items-center p-2">
              <Text className="text-base mr-2">🌍</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                enabled={!loading}
                style={{ flex: 1, height: 44 }}
                dropdownIconColor="#6b7280"
                mode="dropdown"
              >
                <Picker.Item label="Select State" value="" style={{ fontSize: 11 }}  />
                {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                  <Picker.Item
                    label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
                    value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
                    style={{ fontSize: 11 }} 
                  />
                ) : (
                  pincodeData.map((p) => (
                    <Picker.Item key={p._id} label={p.state} value={p.state} style={{ fontSize: 11 }} />
                  ))
                )}
              </Picker>
            </View>
          </View>
        ) : id === 'areaName' ? (
          <View className="border border-gray-300 rounded-md">
            <View className="flex-row items-center p-2">
              <Text className="text-base mr-2">🗺️</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                enabled={!loading}
                style={{ flex: 1, height: 44 }}
                dropdownIconColor="#6b7280"
                mode="dropdown"
              >
                <Picker.Item label="Select Area" value="" style={{ fontSize: 11 }}  />
                {areaOptions.map((a) => (
                  <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
                ))}
              </Picker>
            </View>
          </View>
        ) : id === 'subAreaName' ? (
          <View className="border border-gray-300 rounded-md">
            <View className="flex-row items-center p-2">
              <Text className="text-base mr-2">📋</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                enabled={!loading}
                style={{ flex: 1, height: 44 }}
                dropdownIconColor="#6b7280"
                mode="dropdown"
              >
                <Picker.Item label="Select Sub Area" value="" style={{ fontSize: 11 }}  />
                {subAreaOptions
                  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                  .map((a) => (
                    <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
                  ))}
              </Picker>
            </View>
          </View>
        ) : (
          // Dynamic text input fields
          <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
            <Text className="text-base mr-2">{fieldConfig?.emoji || '📝'}</Text>
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder={fieldConfig?.placeholder || label}
              placeholderTextColor="#9ca3af"
              value={value}
              onChangeText={onChange}
              keyboardType={fieldConfig?.keyboardType || 'default'}
              autoCapitalize={fieldConfig?.autoCapitalize || 'none'}
              editable={!loading}
              maxLength={fieldConfig?.maxLength}
              autoCorrect={false}
            />
          </View>
        )}
        
        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white py-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo Header */}
          <View className="flex justify-center mb-6">
            <View className="bg-blue-900 rounded px-1 py-1 self-center">
              <Image
                source={require('../../../assets/prnv_logo.jpg')}
                className="h-14 w-72"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Form Container */}
          <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
            <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
              Sign Up as User
            </Text>

            {/* General Error */}
            {errors.general && (
              <View className="bg-red-50 p-2 rounded mb-4">
                <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
              </View>
            )}

            {/* Dynamic Form Fields */}
            {dynamicInputFields.map((field) => (
              <InputField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={formData[field.id]}
                onChange={(value) => handleChange(field.id, value)}
                error={errors[field.id]}
                required={field.required}
              />
            ))}

            {/* Static Form Fields */}
            <InputField
              id="pincode"
              label="Pincode"
              type="text"
              value={formData.pincode}
              onChange={(value) => handleChange('pincode', value)}
              error={errors.pincode}
              required={true}
            />

            <InputField
              id="areaName"
              label="Area Name"
              type="text"
              value={formData.areaName}
              onChange={(value) => handleChange('areaName', value)}
              error={errors.areaName}
              required={true}
            />

            <InputField
              id="subAreaName"
              label="Sub Area"
              type="text"
              value={formData.subAreaName}
              onChange={(value) => handleChange('subAreaName', value)}
              error={undefined}
              required={false}
            />

            <InputField
              id="city"
              label="City"
              type="text"
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
              error={errors.city}
              required={true}
            />

            <InputField
              id="state"
              label="State"
              type="text"
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
              error={errors.state}
              required={true}
            />

            {/* Submit Button */}
            <View className="pt-4">
              <TouchableOpacity
                className={`w-full py-2 rounded-md items-center ${
                  loading 
                    ? 'bg-gray-400' 
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }`}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-base">
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Link */}
          <View className="mt-2 text-center">
            <Text className="text-gray-600 text-sm">
              Already Sign up?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text className="text-blue-600 font-medium">Sign In</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { userLogin } from "@/src/api/apiMethods";

// interface LoginData {
//   phoneNumber: string;
//   password: string;
// }

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<LoginData>({
//     phoneNumber: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (name: keyof LoginData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError(null);
//   };

//   const handleSubmit = async () => {
//     if (!formData.phoneNumber || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await userLogin({ ...formData });
//       if (response?.result?.token) {
//         await AsyncStorage.setItem('jwt_token', response.result.token);
//         await AsyncStorage.setItem('user', JSON.stringify(response.result));
//         await AsyncStorage.setItem('userId', response.result.id.toString());
//         await AsyncStorage.setItem('role', response.result.role);
        
//         // For cart update event, you can use a global event emitter or context
//         // Here we'll just log it for now
//         console.log('Login successful - Cart updated event dispatched');
        
//         navigation.replace('Main');
//       } else {
//         throw new Error('Invalid credentials or server error');
//       }
//     } catch (err: any) {
//       const errorMsg = err?.message || 'Login failed. Please try again.';
//       setError(errorMsg);
//       Alert.alert('Login Error', errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white py-10">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView contentContainerClassName="flex-grow px-6 pt-8 pb-8 justify-center">
//           {/* Logo */}
//           <View className="items-center mb-6">
//             <View className="bg-blue-900 rounded-lg px-4 py-3">
//               <Image
//                 source={require("../../../assets/prnv_logo.jpg")}
//                 className="h-10 w-64"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Title */}
//           <Text className="text-4xl font-bold text-gray-800 text-center mb-10">
//             Sign In
//           </Text>

//           <View className="self-center rounded-full mb-8 w-full max-w-sm">
//             {/* Error Message */}
//             {error && (
//               <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                 <View className="flex-row items-center">
//                   <Text className="text-red-500 mr-2">⚠️</Text>
//                   <Text className="text-red-600 text-sm flex-1">{error}</Text>
//                 </View>
//               </View>
//             )}

//             {/* Phone Number Input */}
//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-1">
//                 Phone Number <Text className="text-red-500">*</Text>
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-lg px-3 h-12">
//                 <Text className="text-xl mr-2.5">✉️</Text>
//                 <TextInput
//                   className="flex-1 text-base text-gray-800"
//                   placeholder="Enter phone number"
//                   placeholderTextColor="#9ca3af"
//                   value={formData.phoneNumber}
//                   onChangeText={(text) => handleChange("phoneNumber", text)}
//                   keyboardType="phone-pad"
//                   autoCapitalize="none"
//                   editable={!isLoading}
//                 />
//               </View>
//             </View>

//             {/* Password Input */}
//             <View className="mb-6">
//               <Text className="text-sm font-medium text-gray-700 mb-1">
//                 Password <Text className="text-red-500">*</Text>
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-lg px-4 h-12 relative">
//                 <Text className="text-xl mr-2.5">🔒</Text>
//                 <TextInput
//                   className="flex-1 text-base text-gray-800"
//                   placeholder="Password"
//                   placeholderTextColor="#9ca3af"
//                   value={formData.password}
//                   onChangeText={(text) => handleChange("password", text)}
//                   secureTextEntry={!showPassword}
//                   editable={!isLoading}
//                 />
//                 <Pressable
//                   onPress={() => !isLoading && setShowPassword(!showPassword)}
//                   className="absolute right-3"
//                   disabled={isLoading}
//                 >
//                   <Text className="text-xl">{showPassword ? "🙈" : "👁️"}</Text>
//                 </Pressable>
//               </View>
//             </View>

//             {/* Sign In Button */}
//             <TouchableOpacity
//               className={`rounded-lg py-3 items-center shadow-md ${
//                 isLoading ? 'bg-blue-400' : 'bg-blue-600'
//               }`}
//               onPress={handleSubmit}
//               disabled={isLoading}
//             >
//               <Text className="text-white text-base font-semibold">
//                 {isLoading ? 'Signing In...' : 'Sign In'}
//               </Text>
//             </TouchableOpacity>

//             {/* Sign Up Link */}
//             <View className="flex-row justify-center mt-4">
//               <Text className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => !isLoading && navigation.navigate("Signup" as never)}
//                 disabled={isLoading}
//               >
//                 <Text className={`text-sm font-medium ${
//                   isLoading ? 'text-gray-400' : 'text-blue-600'
//                 }`}>
//                   Sign Up
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;
// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { userLogin } from "@/src/api/apiMethods";

// interface LoginData {
//   phoneNumber: string;
//   password: string;
// }

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<LoginData>({
//     phoneNumber: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (name: keyof LoginData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleSubmit = () => {
//   //   // Pure UI - log for demonstration
//   //   console.log("Login submitted:", { ...formData });
//   // };

//   const handleSubmit = async () => {
//     setError(null);

//     try {
//       const response = await userLogin({ ...formData });
//       if (response?.result?.token) {
//         await AsyncStorage.setItem('jwt_token', response.result.token);
//         await AsyncStorage.setItem('user', JSON.stringify(response.result));
//         await AsyncStorage.setItem('userId', response.result.id);
//         await AsyncStorage.setItem('role', response.result.role);
//         // Dispatch custom event for React Native (using an event emitter or similar)
//         // Note: React Native doesn't have window.dispatchEvent, so this is a placeholder
//         console.log('Cart updated event dispatched');
//         navigation.replace('Main' as never);
//       } else {
//         throw new Error('Invalid credentials or server error');
//       }
//     } catch (err: any) {
//       const errorMsg = err?.message || 'Login failed. Please try again.';
//       setError(errorMsg);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView contentContainerClassName="flex-grow px-6 pt-8 pb-8 justify-center">
//           {/* Logo */}
//           <View className="items-center mb-6">
//             <View className="bg-blue-900 rounded-lg px-4 py-3">
//               <Image
//                 source={require("../../../assets/prnv_logo.jpg")}
//                 className="h-10 w-60"
//               />
//             </View>
//           </View>

//           {/* Title */}
//           <Text className="text-4xl font-bold text-gray-800 text-center mb-10">
//             Sign In
//           </Text>

//           <View className="self-center rounded-full mb-8 w-full max-w-sm">
//             {/* Phone Number Input */}
//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-1">
//                 Phone Number <Text className="text-red-500">*</Text>
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-lg px-3 h-12">
//                 {/* <Feather
//                   name="phone"
//                   size={20}
//                   color="#6b7280"
//                   className="mr-2"
//                 /> */}
//                 <Text className="text-xl mr-2.5">✉️</Text>
//                 <TextInput
//                   className="flex-1 text-base text-gray-800"
//                   placeholder="Enter phone number"
//                   placeholderTextColor="#9ca3af"
//                   value={formData.phoneNumber}
//                   onChangeText={(text) => handleChange("phoneNumber", text)}
//                   keyboardType="phone-pad"
//                   autoCapitalize="none"
//                 />
//               </View>
//             </View>

//             {/* Password Input */}
//             <View className="mb-6">
//               <Text className="text-sm font-medium text-gray-700 mb-1">
//                 Password <Text className="text-red-500">*</Text>
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-lg px-4 h-12 relative">
//                 {/* <Feather
//                   name="lock"
//                   size={20}
//                   color="#6b7280"
//                   className="mr-2"
//                 /> */}
//                 <Text className="text-xl mr-2.5">🔒</Text>
//                 <TextInput
//                   className="flex-1 text-base text-gray-800"
//                   placeholder="Password"
//                   placeholderTextColor="#9ca3af"
//                   value={formData.password}
//                   onChangeText={(text) => handleChange("password", text)}
//                   secureTextEntry={!showPassword}
//                 />
//                 <Pressable
//                   onPress={() => setShowPassword(!showPassword)}
//                   className="absolute right-3"
//                 >
//                   <Text className="text-xl">{showPassword ? "🙈" : "👁️"}</Text>
//                   {/* <Feather
//                     name={showPassword ? "eye-off" : "eye"}
//                     size={20}
//                     color="#6b7280"
//                   /> */}
//                 </Pressable>
//               </View>
//             </View>

//             {/* Sign In Button */}
//             <TouchableOpacity
//               className="bg-blue-600 rounded-lg py-3 items-center shadow-md"
//               onPress={handleSubmit}
//             >
//               <Text className="text-white text-base font-semibold">
//                 Sign In
//               </Text>
//             </TouchableOpacity>

//             {/* Sign Up Link */}
//             <View className="flex-row justify-center mt-4">
//               <Text className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate("register" as never)}
//               >
//                 <Text className="text-blue-600 text-sm font-medium">
//                   Sign Up
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   Modal,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import RegisterScreen from "./RegisterScreen";

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [signupName, setSignupName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPhone, setSignupPhone] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");

//   return (
//     <SafeAreaView className="flex-1 bg-white pt-10">
//       <View className="flex-1 bg-white px-6 pt-10">
//         {/* Back Arrow */}
//         {/* <TouchableOpacity className="mb-5">
//         <Text className="text-3xl">←</Text>
//       </TouchableOpacity> */}

//         {/* Logo */}
//         <View className="items-center rounded-5 bg-blue-600 max-w-xs self-center py-2 rounded-md mb-10">
//           <Image
//             source={require("../../../assets/prnv_logo.jpg")}
//             className="max-w-xs h-14"
//           />
//         </View>

//         {/* Title */}
//         <Text className="text-5xl font-bold text-gray-800 self-center mb-10">
//           Sign In
//         </Text>

//         {/* Email Input */}
//         <View className="flex-row items-center bg-gray-100 rounded-4 px-4 mb-4.5 h-14">
//           <Text className="text-xl mr-2.5">✉️</Text>
//           <TextInput
//             className="flex-1 text-base text-gray-800"
//             placeholder="Enter email or phone number"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         {/* Password Input */}
//         <View className="flex-row items-center bg-gray-100 rounded-4 px-4 mb-7 h-14 relative">
// <Text className="text-xl mr-2.5">🔒</Text>
//           <TextInput
//             className="flex-1 text-base text-gray-800"
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//           />
//           <Pressable
//             onPress={() => setShowPassword(!showPassword)}
//             className="absolute right-4"
//           >
//             <Text className="text-xl">{showPassword ? "🙈" : "👁️"}</Text>
//           </Pressable>
//         </View>

//         {/* Remember Me */}
//         {/* <View className="flex-row items-center mb-7">
//         <Pressable
//         className="mr-2.5"
//         onPress={() => setRememberMe(!rememberMe)}
//         >
//           <View className={`w-6 h-6 rounded-2 border-2 border-purple-500 items-center justify-center bg-white ${rememberMe ? 'bg-purple-500 border-purple-500' : ''}`}>
//           {rememberMe && <Text className="text-white text-lg font-bold">✓</Text>}
//           </View>
//           </Pressable>
//         <Text className="text-base text-gray-800">Remember me</Text>
//       </View> */}

//         {/* Sign In Button */}
//         <TouchableOpacity
//           className="bg-purple-500 rounded-8 py-4.5 items-center mb-4.5 shadow-purple-500 shadow-md"
//           onPress={() => navigation.replace("Main")}
//         >
//           <Text className="text-white text-xl font-bold">Sign in</Text>
//         </TouchableOpacity>

//         {/* Forgot Password */}
//         <TouchableOpacity>
//           <Text className="text-purple-500 text-base text-center mb-7">
//             Forgot the password?
//           </Text>
//         </TouchableOpacity>

//         {/* Or continue with */}
//         <View className="flex-row items-center mb-6">
//           <View className="flex-1 h-0.5 bg-gray-200" />
//           <Text className="mx-3 text-gray-400 text-base">or continue with</Text>
//           <View className="flex-1 h-0.5 bg-gray-200" />
//         </View>

//         {/* Social Container (uncomment if needed) */}
//         {/* <View className="flex-row justify-center mb-8">
//         <TouchableOpacity className="w-15 h-15 rounded-4 bg-gray-100 items-center justify-center mx-2">
//         <Text className="text-3xl">📘</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="w-15 h-15 rounded-4 bg-gray-100 items-center justify-center mx-2">
//           <Text className="text-3xl">🔴</Text>
//           </TouchableOpacity>
//         <TouchableOpacity className="w-15 h-15 rounded-4 bg-gray-100 items-center justify-center mx-2">
//         <Text className="text-3xl">🐦</Text>
//         </TouchableOpacity>
//         </View> */}

//         {/* Sign Up Link */}
//         <View className="flex-row justify-center items-center">
//           <Text className="text-gray-400 text-base">
//             Don't have an account?{" "}
//           </Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//             <Text className="text-purple-500 text-base font-bold ml-1">
//               Sign up
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   CheckBox,
//   Platform,
//   Modal,
//   Image,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import RegisterScreen from './RegisterScreen';

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [signupName, setSignupName] = useState('');
//   const [signupEmail, setSignupEmail] = useState('');
//   const [signupPhone, setSignupPhone] = useState('');
//   const [signupPassword, setSignupPassword] = useState('');

//   return (
//     <View style={styles.container}>
//       {/* Back Arrow */}
//       {/* <TouchableOpacity style={styles.backArrow}>
//         <Text style={{ fontSize: 28 }}>←</Text>
//       </TouchableOpacity> */}

//       {/* Logo */}
//       <Image source={{ uri: 'https://img.icons8.com/color/96/000000/maintenance.png' }} style={styles.logo} />

//       {/* Title */}
//       <Text style={styles.title}>Login</Text>

//       {/* Email Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>✉️</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter email or phone number"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       {/* Password Input */}
//       <View style={styles.inputContainer}>
// <Text style={styles.icon}>🔒</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={!showPassword}
//         />
//         <Pressable onPress={() => setShowPassword(!showPassword)}>
//           <Text style={styles.icon}>{showPassword ? '🙈' : '👁️'}</Text>
//         </Pressable>
//       </View>

//       {/* Remember Me */}
//       {/* <View style={styles.rememberMeContainer}>
//         <Pressable
//           style={styles.checkbox}
//           onPress={() => setRememberMe(!rememberMe)}
//         >
//           <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]}>
//             {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
//           </View>
//         </Pressable>
//         <Text style={styles.rememberMeText}>Remember me</Text>
//       </View> */}

//       {/* Sign In Button */}
//       <TouchableOpacity style={styles.signInButton} onPress={() => navigation.replace('Main')}>
//         <Text style={styles.signInButtonText}>Sign in</Text>
//       </TouchableOpacity>

//       {/* Forgot Password */}
//       <TouchableOpacity>
//         <Text style={styles.forgotPassword}>Forgot the password?</Text>
//       </TouchableOpacity>

//       {/* Or continue with */}
//       <View style={styles.orContainer}>
//         <View style={styles.line} />
//         <Text style={styles.orText}>or continue with</Text>
//         <View style={styles.line} />
//       </View>

//       {/* Sign Up Link */}
//       <View style={styles.signupContainer}>
//         <Text style={styles.signupText}>Don't have an account? </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//           <Text style={styles.signupLink}>Sign up</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//   },
//   backArrow: {
//     marginBottom: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 38,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     color: '#222',
//     lineHeight: 44,
//     alignSelf: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     marginBottom: 18,
//     height: 56,
//   },
//   icon: {
//     fontSize: 20,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#222',
//   },
//   rememberMeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 28,
//   },
//   checkbox: {
//     marginRight: 10,
//   },
//   checkboxBox: {
//     width: 24,
//     height: 24,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#a259ff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#a259ff',
//     borderColor: '#a259ff',
//   },
//   checkboxTick: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   rememberMeText: {
//     fontSize: 16,
//     color: '#222',
//   },
//   signInButton: {
//     backgroundColor: '#a259ff',
//     borderRadius: 32,
//     paddingVertical: 18,
//     alignItems: 'center',
//     marginBottom: 18,
//     shadowColor: '#a259ff',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//     elevation: 4,
//   },
//   signInButtonText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   forgotPassword: {
//     color: '#a259ff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 28,
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#eee',
//   },
//   orText: {
//     marginHorizontal: 12,
//     color: '#888',
//     fontSize: 16,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 32,
//   },
//   socialButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 16,
//     backgroundColor: '#f7f7f7',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 8,
//   },
//   socialIcon: {
//     fontSize: 28,
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signupText: {
//     color: '#888',
//     fontSize: 16,
//   },
//   signupLink: {
//     color: '#a259ff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     padding: 28,
//     width: '90%',
//     alignItems: 'center',
//   },
//   signupTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#a259ff',
//     marginBottom: 18,
//   },
// });

// export default LoginScreen;
