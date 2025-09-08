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
  const [pincodeLoading, setPincodeLoading] = useState<boolean>(false);

  // Load pincodes data
  useEffect(() => {
    const loadPincodes = async () => {
      setPincodeLoading(true);
      try {
        const response = await getAllPincodes();
        if (Array.isArray(response?.data)) {
          setPincodeData(response.data);
        }
      } catch (error) {
        console.error('Failed to load pincodes:', error);
      } finally {
        setPincodeLoading(false);
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
        // Auto-populate city and state
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Enter a valid 10-digit phone number';
    if (formData.password.length < 6 || formData.password.length > 10) newErrors.password = 'Password must be 6-10 characters';
    if (!formData.buildingName.trim()) newErrors.buildingName = 'Building name is required';
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
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // UI-only - no actual submission
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      // For demo purposes, simulate success
      await AsyncStorage.setItem('userRegistration', JSON.stringify(basePayload));
      
      Alert.alert('Success', 'Registration completed! Redirecting to login...');
      navigation.replace('Login');
    } catch (err: any) {
      const errorMsg = err?.data?.error?.[0] || 'Registration failed. Please try again.';
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
    required = true, 
    options = [] 
  }: {
    id: keyof FormData;
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    options?: { _id: string; name: string }[] | PincodeArea[];
  }) => {
    // Determine if this field should use Picker
    const isPickerField = id === 'pincode' || id === 'areaName' || id === 'subAreaName' || 
                         (options && options.length > 0);
    const isCityStateAuto = (id === 'city' || id === 'state') && selectedPincode;

    if (isPickerField || isCityStateAuto) {
      // For Picker fields
      let pickerItems = [];
      
      if (id === 'pincode') {
        pickerItems = pincodeData
          .sort((a, b) => parseInt(a.code) - parseInt(b.code))
          .map((p) => ({ label: p.code, value: p.code, key: p._id }));
      } else if (id === 'areaName') {
        pickerItems = areaOptions.map((a) => ({ label: a.name, value: a.name, key: a._id }));
      } else if (id === 'subAreaName') {
        pickerItems = subAreaOptions
          .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          .map((a) => ({ label: a.name, value: a.name, key: a._id }));
      } else if (options && options.length > 0) {
        pickerItems = options.map((opt) => ({ 
          label: 'name' in opt ? opt.name : opt, 
          value: 'name' in opt ? opt.name : opt,
          key: 'name' in opt ? opt._id : opt 
        }));
      } else if (isCityStateAuto && selectedPincode) {
        const foundPincode = pincodeData.find((p) => p.code === selectedPincode);
        if (foundPincode) {
          pickerItems = [{ label: id === 'city' ? foundPincode.city : foundPincode.state, 
                          value: id === 'city' ? foundPincode.city : foundPincode.state, 
                          key: `auto-${id}` }];
        }
      }

      return (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            {label} {required && <Text className="text-red-500">*</Text>}
          </Text>
          <View className="border border-gray-300 rounded-md bg-white">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              enabled={!loading}
              style={{ height: 44, justifyContent: 'center' }}
              dropdownIconColor="#6b7280"
            >
              <Picker.Item 
                label={pincodeLoading ? 'Loading...' : `Select ${label}`} 
                value="" 
                enabled={false}
              />
              {pickerItems.map((item) => (
                <Picker.Item 
                  key={item.key} 
                  label={item.label} 
                  value={item.value} 
                />
              ))}
            </Picker>
          </View>
          {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
      );
    }

    // For regular TextInput fields
    return (
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        
        {id === 'password' ? (
          <View className="relative">
            <TextInput
              className="w-full border border-gray-300 rounded-md p-3 pr-10 text-base"
              placeholder={`Enter ${label.toLowerCase()} (6-10 characters)`}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              editable={!loading}
              maxLength={10}
            />
            <Pressable
              onPress={() => !loading && setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              disabled={loading}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#6b7280"
              />
            </Pressable>
          </View>
        ) : (
          <TextInput
            className="w-full border border-gray-300 rounded-md p-3 text-base"
            placeholder={`Enter ${label.toLowerCase()}`}
            value={value}
            onChangeText={onChange}
            keyboardType={type === 'tel' ? 'phone-pad' : 'default'}
            autoCapitalize={type === 'text' ? 'words' : 'none'}
            editable={!loading}
            maxLength={type === 'tel' ? 10 : undefined}
          />
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
      >
        <ScrollView 
          contentContainerClassName="px-4 pt-8 pb-8" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View className="items-center mb-6">
            <View className="bg-blue-900 rounded-lg px-2 py-1">
              <Image
                source={require('../../../assets/prnv_logo.jpg')}
                className="h-8 w-64"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Form Container */}
          <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            <Text className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Sign Up as User
            </Text>

            {/* Error Message */}
            {errors.general && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <View className="flex-row items-center">
                  <Feather name="alert-circle" size={20} color="#ef4444" className="mr-2" />
                  <Text className="text-red-600 text-sm flex-1">{errors.general}</Text>
                </View>
              </View>
            )}

            {/* Form Fields */}
            <InputField
              id="name"
              label="Name"
              type="text"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              error={errors.name}
            />
            
            <InputField
              id="mobile"
              label="Phone Number"
              type="tel"
              value={formData.mobile}
              onChange={(value) => handleChange('mobile', value)}
              error={errors.mobile}
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
            />

            <InputField
              id="buildingName"
              label="House/Building Name"
              type="text"
              value={formData.buildingName}
              onChange={(value) => handleChange('buildingName', value)}
              error={errors.buildingName}
            />

            <InputField
              id="pincode"
              label="Pincode"
              type="text"
              value={formData.pincode}
              onChange={(value) => handleChange('pincode', value)}
              error={errors.pincode}
              options={[]}
            />

             <InputField
              id="areaName"
              label="Area Name"
              type="text"
              value={formData.areaName}
              onChange={(value) => handleChange('areaName', value)}
              error={errors.areaName}
              options={areaOptions}
            />

            <InputField
              id="subAreaName"
              label="Sub Area"
              type="text"
              value={formData.subAreaName}
              onChange={(value) => handleChange('subAreaName', value)}
              error={undefined}
              required={false}
              options={subAreaOptions}
            />

            <InputField
              id="city"
              label="City"
              type="text"
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
              error={errors.city}
              options={[]}
            />

            <InputField
              id="state"
              label="State"
              type="text"
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
              error={errors.state}
              options={[]}
            />

            {/* Submit Button */}
            <TouchableOpacity
              className={`w-full rounded-lg py-3 items-center shadow-md ${
                loading ? 'bg-green-400 opacity-70' : 'bg-green-600'
              }`}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Switch Role Link */}
            <View className="mt-4 items-center">
              <Text className="text-gray-600 text-sm text-center">
                Are you a technician?{' '}
                <TouchableOpacity 
                  onPress={() => navigation.navigate('TechnicianRegister' as never)}
                  disabled={loading}
                >
                  <Text className={`font-medium ${loading ? 'text-gray-400' : 'text-blue-600'}`}>
                    Sign Up here
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>

          {/* Back to Login */}
          <View className="mt-6 items-center">
            <Text className="text-gray-600 text-sm text-center">
              Already have an account?{' '}
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login' as never)}
                disabled={loading}
              >
                <Text className={`font-medium ${loading ? 'text-gray-400' : 'text-blue-600'}`}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
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