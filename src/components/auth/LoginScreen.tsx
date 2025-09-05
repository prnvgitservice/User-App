// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For eye icons; install expo-vector-icons if needed
import { Picker } from '@react-native-picker/picker';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Mock login function for demonstration
  const login = async (role, formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (formData.phoneNumber && formData.password) {
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await login(role, formData);
      if (role === 'technician') {
        navigation.replace('TechnicianDashboard');
      } else {
        navigation.replace('Main');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-10">
      {/* Logo */}
      <View className="w-65 h-12 mx-auto bg-blue-900 mb-6 px-4 py-2 rounded-lg flex items-center justify-center">
        <Image
          source={{ uri: 'https://prnvservices.com/uploads/logo/1695377568_logo-white.png' }}
          className="w-56 h-10"
        />
      </View>

      {/* Title */}
      <Text className="text-4xl font-bold text-center text-gray-800 mb-8">Sign In</Text>

      {/* Error Message */}
      {error && (
        <Text className="text-red-600 text-sm text-center mb-4">{error}</Text>
      )}

      {/* Role Selection */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Login As <Text className="text-red-500">*</Text>
        </Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            className="w-full p-2"
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Technician" value="technician" />
          </Picker>
        </View>
      </View>

      {/* Email/Phone Input */}
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-4">
        <Text className="text-xl mr-2">✉️</Text>
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Enter email or phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-4">
        <Text className="text-xl mr-2">🔒</Text>
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </Pressable>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text className="text-purple-600 text-sm text-center mb-6">
          Forgot the password?
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-purple-600 rounded-3xl py-4 mb-6 shadow-md"
      >
        <Text className="text-white text-lg font-bold text-center">Sign In</Text>
      </TouchableOpacity>

      {/* Or Continue With */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-3 text-gray-500 text-base">or continue with</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Social Buttons Placeholder */}
      <View className="flex-row justify-center mb-8">
        <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-2">
          <Text className="text-2xl">🌐</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-2">
          <Text className="text-2xl">📘</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500 text-base">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-purple-600 text-base font-bold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
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
//         <Text style={styles.icon}>🔒</Text>
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