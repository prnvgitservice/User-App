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
  Keyboard,
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
  const [activeField, setActiveField] = useState<keyof FormData | null>(null);

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

  const handleFocus = useCallback((field: keyof FormData) => {
    setActiveField(field);
  }, []);

  const handleBlur = useCallback((field: keyof FormData) => {
    // Validate on blur for dynamic fields
    if (dynamicInputFields.find(f => f.id === field)) {
      const fieldConfig = dynamicInputFields.find(f => f.id === field);
      if (fieldConfig) {
        const error = fieldConfig.validation(formData[field]);
        if (error) {
          setErrors(prev => ({ ...prev, [field]: error }));
        }
      }
    }
    setActiveField(null);
  }, [formData]);

  // Handle keyboard dismiss on scroll
  const handleScroll = useCallback(() => {
    Keyboard.dismiss();
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
    Keyboard.dismiss(); // Dismiss keyboard before API call
    
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
            <View className={`flex-row items-center border rounded-md p-2 bg-white ${
              activeField === 'password' ? 'border-blue-500' : 'border-gray-300'
            }`}>
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
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
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
                    <Picker.Item key={p._id} label={p.city} value={p.city} />
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
                    <Picker.Item key={p._id} label={p.state} value={p.state} />
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
          <View className={`relative flex-row items-center border rounded-md p-2 bg-white ${
            activeField === id ? 'border-blue-500 shadow-md' : 'border-gray-300'
          }`}>
            <Text className="text-base mr-2">{fieldConfig?.emoji || '📝'}</Text>
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder={fieldConfig?.placeholder || label}
              value={value}
              onChangeText={onChange}
              keyboardType={fieldConfig?.keyboardType || 'default'}
              autoCapitalize={fieldConfig?.autoCapitalize || 'none'}
              editable={!loading}
              maxLength={fieldConfig?.maxLength}
              onFocus={() => handleFocus(id)}
              onBlur={() => handleBlur(id)}
              autoCorrect={false}
              returnKeyType={id === 'buildingName' ? 'next' : 'done'}
              onSubmitEditing={id === 'buildingName' ? () => {
                // Focus on next field or submit
                if (!loading) {
                  const nextField = document.getElementById('pincode-input');
                  if (nextField) {
                    (nextField as any).focus();
                  }
                }
              } : Keyboard.dismiss}
            />
            {activeField === id && (
              <View className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-md" />
            )}
          </View>
        )}
        
        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white py-10">
        <ScrollView 
          contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
    </SafeAreaView>
  );
};

export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from 'react';
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
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   getAllPincodes,
//   userRegister,
// } from '@/src/api/apiMethods';
// import { Feather } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   subAreaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   // Load pincodes data
//   useEffect(() => {
//     const loadPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (error) {
//         console.error('Failed to load pincodes:', error);
//       }
//     };
//     loadPincodes();
//   }, []);

//   // Handle pincode selection
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: found.city || '', 
//           state: found.state || '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: '', 
//           state: '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       }
//       setSubAreaOptions([]);
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ 
//         ...prev, 
//         city: '', 
//         state: '',
//         areaName: '',
//         subAreaName: '' 
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   // Handle area selection
//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Enter a valid 10-digit phone number';
//     if (formData.password.length < 6 || formData.password.length > 10) newErrors.password = 'Password must be 6-10 characters';
//     if (!formData.buildingName.trim()) newErrors.buildingName = 'Building name is required';
//     if (!formData.areaName) newErrors.areaName = 'Area is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

//     return newErrors;
//   }, [formData]);

//   const handleChange = useCallback((name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'pincode') {
//       setSelectedPincode(value);
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       Alert.alert('Validation Error', 'Please fix the errors in the form');
//       return;
//     }

//     setLoading(true);
//     setErrors({}); // Clear previous errors
    
//     try {
//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName || '-',
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       console.log('Registration payload:', basePayload);
      
//       const response = await userRegister(basePayload);
      
//       if (response.success) {
        
//         Alert.alert('Success', 'Registration completed! Redirecting to login...');
//         navigation.replace('Login');
//       } else {
//         throw new Error(response?.message || 'Registration failed');
//       }
//     } catch (err: any) {
//       const errorMsg = err?.data?.error?.[0] || err?.message || 'Registration failed. Please try again.';
//       setErrors({ ...errors, general: errorMsg });
//       Alert.alert('Registration Error', errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, validateForm, errors, navigation]);

//   const InputField = ({ 
//     id, 
//     label, 
//     type, 
//     value, 
//     onChange, 
//     error, 
//     required = true 
//   }: {
//     id: keyof FormData;
//     label: string;
//     type: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//   }) => {
//     // Emoji mapping for fields
//     const getEmojiForField = (fieldId: keyof FormData) => {
//       switch (fieldId) {
//         case 'name': return '👤';
//         case 'mobile': return '📞';
//         case 'password': return '🔒';
//         case 'buildingName': return '🏠';
//         case 'pincode': return '📍';
//         case 'city': return '🏙️';
//         case 'state': return '🌍';
//         case 'areaName': return '🗺️';
//         case 'subAreaName': return '📋';
//         default: return '📝';
//       }
//     };

//     return (
//       <View className="mb-4">
//         <Text className="text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <Text className="text-red-500">*</Text>}
//         </Text>
        
//         {id === 'password' ? (
//           <View className="relative">
//             <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <TextInput
//                 className="flex-1 text-base text-gray-800 pr-10"
//                 placeholder="Password (6-10 characters)"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry={!showPassword}
//                 editable={!loading}
//                 maxLength={10}
//               />
//               <Pressable
//                 onPress={() => !loading && setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2"
//                 disabled={loading}
//               >
//                 <Text className="text-lg">
//                   {showPassword ? '🙈' : '👁️'}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         ) : id === 'pincode' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Pincode" value="" style={{ fontSize: 11 }} />
//                 {pincodeData
//                   .sort((a, b) => parseInt(a.code) - parseInt(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} style={{ fontSize: 11 }} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'city' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select City" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.city} value={p.city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'state' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select State" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.state} value={p.state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'areaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Area" value="" style={{ fontSize: 11 }}  />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'subAreaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Sub Area" value="" style={{ fontSize: 11 }}  />
//                 {subAreaOptions
//                   .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                   .map((a) => (
//                     <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : (
//           <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//             <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//             <TextInput
//               className="flex-1 text-base text-gray-800"
//               placeholder={label}
//               value={value}
//               onChangeText={onChange}
//               keyboardType={type === 'tel' ? 'phone-pad' : 'default'}
//               autoCapitalize={type === 'text' ? 'words' : 'none'}
//               editable={!loading}
//               maxLength={type === 'tel' ? 10 : undefined}
//             />
//           </View>
//         )}
        
//         {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white py-10">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         <ScrollView 
//           contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Logo Header */}
//           <View className="flex justify-center mb-6">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center">
//               <Image
//                 source={require('../../../assets/prnv_logo.jpg')}
//                 className="h-14 w-72"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Form Container */}
//           <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
//             <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
//               Sign Up as User
//             </Text>

//             {/* General Error */}
//             {errors.general && (
//               <View className="bg-red-50 p-2 rounded mb-4">
//                 <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
//               </View>
//             )}

//             {/* Form Fields */}
//             <InputField
//               id="name"
//               label="Name"
//               type="text"
//               value={formData.name}
//               onChange={(value) => handleChange('name', value)}
//               error={errors.name}
//               required={true}
//             />
            
//             <InputField
//               id="mobile"
//               label="Phone Number"
//               type="tel"
//               value={formData.mobile}
//               onChange={(value) => handleChange('mobile', value)}
//               error={errors.mobile}
//               required={true}
//             />

//             <InputField
//               id="password"
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(value) => handleChange('password', value)}
//               error={errors.password}
//               required={true}
//             />

//             <InputField
//               id="buildingName"
//               label="House/Building Name"
//               type="text"
//               value={formData.buildingName}
//               onChange={(value) => handleChange('buildingName', value)}
//               error={errors.buildingName}
//               required={true}
//             />

//             <InputField
//               id="pincode"
//               label="Pincode"
//               type="text"
//               value={formData.pincode}
//               onChange={(value) => handleChange('pincode', value)}
//               error={errors.pincode}
//               required={true}
//             />

//             <InputField
//               id="areaName"
//               label="Area Name"
//               type="text"
//               value={formData.areaName}
//               onChange={(value) => handleChange('areaName', value)}
//               error={errors.areaName}
//               required={true}
//             />

//             <InputField
//               id="subAreaName"
//               label="Sub Area"
//               type="text"
//               value={formData.subAreaName}
//               onChange={(value) => handleChange('subAreaName', value)}
//               error={undefined}
//               required={false}
//             />

//             <InputField
//               id="city"
//               label="City"
//               type="text"
//               value={formData.city}
//               onChange={(value) => handleChange('city', value)}
//               error={errors.city}
//               required={true}
//             />

//             <InputField
//               id="state"
//               label="State"
//               type="text"
//               value={formData.state}
//               onChange={(value) => handleChange('state', value)}
//               error={errors.state}
//               required={true}
//             />

//             {/* Submit Button */}
//             <View className="pt-4">
//               <TouchableOpacity
//                 className={`w-full py-2 rounded-md items-center ${
//                   loading 
//                     ? 'bg-gray-400' 
//                     : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
//                 }`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 <Text className="text-white font-semibold text-base">
//                   {loading ? 'Signing Up...' : 'Sign Up'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Role Switch Link */}
//           {/* <View className="mt-4 text-center">
//             <Text className="text-gray-600 text-sm">
//               Are you a technician?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('TechnicianRegister')}>
//                 <Text className="text-blue-600 font-medium">Sign Up here</Text>
//               </TouchableOpacity>
//             </Text>
//           </View> */}

//           {/* Sign In Link */}
//           <View className="mt-2 text-center">
//             <Text className="text-gray-600 text-sm">
//               Already Sign up?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
//                 <Text className="text-blue-600 font-medium">Sign In</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from 'react';
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
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   getAllPincodes,
// } from '@/src/api/apiMethods';
// import { Feather } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   subAreaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   // Load pincodes data
//   useEffect(() => {
//     const loadPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (error) {
//         console.error('Failed to load pincodes:', error);
//       }
//     };
//     loadPincodes();
//   }, []);

//   // Handle pincode selection
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: found.city || '', 
//           state: found.state || '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: '', 
//           state: '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       }
//       setSubAreaOptions([]);
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ 
//         ...prev, 
//         city: '', 
//         state: '',
//         areaName: '',
//         subAreaName: '' 
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   // Handle area selection
//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Enter a valid 10-digit phone number';
//     if (formData.password.length < 6 || formData.password.length > 10) newErrors.password = 'Password must be 6-10 characters';
//     if (!formData.buildingName.trim()) newErrors.buildingName = 'Building name is required';
//     if (!formData.areaName) newErrors.areaName = 'Area is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

//     return newErrors;
//   }, [formData]);

//   const handleChange = useCallback((name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'pincode') {
//       setSelectedPincode(value);
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName || '-',
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       console.log('Registration payload:', basePayload);
      
//       // For demo purposes, simulate success
//       await AsyncStorage.setItem('userRegistration', JSON.stringify(basePayload));
      
//       Alert.alert('Success', 'Registration completed! Redirecting to login...');
//       navigation.replace('Login');
//     } catch (err: any) {
//       const errorMsg = err?.data?.error?.[0] || 'Registration failed. Please try again.';
//       setErrors({ ...errors, general: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, validateForm, errors, navigation]);

//   const InputField = ({ 
//     id, 
//     label, 
//     type, 
//     value, 
//     onChange, 
//     error, 
//     required = true 
//   }: {
//     id: keyof FormData;
//     label: string;
//     type: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//   }) => {
//     // Emoji mapping for fields
//     const getEmojiForField = (fieldId: keyof FormData) => {
//       switch (fieldId) {
//         case 'name': return '👤';
//         case 'mobile': return '📞';
//         case 'password': return '🔒';
//         case 'buildingName': return '🏠';
//         case 'pincode': return '📍';
//         case 'city': return '🏙️';
//         case 'state': return '🌍';
//         case 'areaName': return '🗺️';
//         case 'subAreaName': return '📋';
//         default: return '📝';
//       }
//     };

//     return (
//       <View className="mb-4">
//         <Text className="text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <Text className="text-red-500">*</Text>}
//         </Text>
        
//         {id === 'password' ? (
//           <View className="relative">
//             <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <TextInput
//                 className="flex-1 text-base text-gray-800 pr-10"
//                 placeholder="Password (6-10 characters)"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry={!showPassword}
//                 editable={!loading}
//                 maxLength={10}
//               />
//               <Pressable
//                 onPress={() => !loading && setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2"
//                 disabled={loading}
//               >
//                 <Text className="text-lg">
//                   {showPassword ? '🙈' : '👁️'}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         ) : id === 'pincode' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Pincode" value="" />
//                 {pincodeData
//                   .sort((a, b) => parseInt(a.code) - parseInt(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'city' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44  }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select City" value="" />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.city} value={p.city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'state' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.state} value={p.state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'areaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Area" value="" />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'subAreaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Sub Area" value="" />
//                 {subAreaOptions
//                   .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                   .map((a) => (
//                     <Picker.Item key={a._id} label={a.name} value={a.name} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : (
//           <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//             <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//             <TextInput
//               className="flex-1 text-base text-gray-800"
//               placeholder={label}
//               value={value}
//               onChangeText={onChange}
//               keyboardType={type === 'tel' ? 'phone-pad' : 'default'}
//               autoCapitalize={type === 'text' ? 'words' : 'none'}
//               editable={!loading}
//               maxLength={type === 'tel' ? 10 : undefined}
//             />
//           </View>
//         )}
        
//         {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         <ScrollView 
//           contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Logo Header */}
//           <View className="flex justify-center mb-6">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center w-fit">
//               <Image
//                 source={require('../../../assets/prnv_logo.jpg')}
//                 className="h-8 w-auto"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Form Container */}
//           <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
//             <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
//               Sign Up as User
//             </Text>

//             {/* General Error */}
//             {errors.general && (
//               <View className="bg-red-50 p-2 rounded mb-4">
//                 <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
//               </View>
//             )}

//             {/* Form Fields */}
//             <InputField
//               id="name"
//               label="Name"
//               type="text"
//               value={formData.name}
//               onChange={(value) => handleChange('name', value)}
//               error={errors.name}
//               required={true}
//             />
            
//             <InputField
//               id="mobile"
//               label="Phone Number"
//               type="tel"
//               value={formData.mobile}
//               onChange={(value) => handleChange('mobile', value)}
//               error={errors.mobile}
//               required={true}
//             />

//             <InputField
//               id="password"
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(value) => handleChange('password', value)}
//               error={errors.password}
//               required={true}
//             />

//             <InputField
//               id="buildingName"
//               label="House/Building Name"
//               type="text"
//               value={formData.buildingName}
//               onChange={(value) => handleChange('buildingName', value)}
//               error={errors.buildingName}
//               required={true}
//             />

//             <InputField
//               id="pincode"
//               label="Pincode"
//               type="text"
//               value={formData.pincode}
//               onChange={(value) => handleChange('pincode', value)}
//               error={errors.pincode}
//               required={true}
//             />

//             <InputField
//               id="areaName"
//               label="Area Name"
//               type="text"
//               value={formData.areaName}
//               onChange={(value) => handleChange('areaName', value)}
//               error={errors.areaName}
//               required={true}
//             />

//             <InputField
//               id="subAreaName"
//               label="Sub Area"
//               type="text"
//               value={formData.subAreaName}
//               onChange={(value) => handleChange('subAreaName', value)}
//               error={undefined}
//               required={false}
//             />

//             <InputField
//               id="city"
//               label="City"
//               type="text"
//               value={formData.city}
//               onChange={(value) => handleChange('city', value)}
//               error={errors.city}
//               required={true}
//             />

//             <InputField
//               id="state"
//               label="State"
//               type="text"
//               value={formData.state}
//               onChange={(value) => handleChange('state', value)}
//               error={errors.state}
//               required={true}
//             />

//             {/* Submit Button */}
//             <View className="pt-4">
//               <TouchableOpacity
//                 className={`w-full py-2 rounded-md items-center ${
//                   loading 
//                     ? 'bg-gray-400' 
//                     : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
//                 }`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 <Text className="text-white font-semibold text-base">
//                   {loading ? 'Signing Up...' : 'Sign Up'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Role Switch Link */}
//           <View className="mt-4 text-center">
//             <Text className="text-gray-600 text-sm">
//               Are you a technician?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('TechnicianRegister')}>
//                 <Text className="text-blue-600 font-medium">Sign Up here</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>

//           {/* Sign In Link */}
//           <View className="mt-2 text-center">
//             <Text className="text-gray-600 text-sm">
//               Already Sign up?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                 <Text className="text-blue-600 font-medium">Sign In</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: 'https://img.icons8.com/color/96/000000/maintenance.png' }} style={styles.logo} />
//       <Text style={styles.title}>Create Account</Text>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>👤</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>✉️</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>📞</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Phone"
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>🔒</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>
//       <TouchableOpacity
//         style={styles.signInButton}
//         onPress={() => navigation.replace('MainTabs')}
//       >
//         <Text style={styles.signInButtonText}>Register</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text style={styles.signupLink}>Back to Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 32,
//     color: '#a259ff',
//     textAlign: 'center',
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
//   signupLink: {
//     color: '#a259ff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: 'bold',
//   },
// }); 