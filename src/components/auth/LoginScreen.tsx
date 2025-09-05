import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  CheckBox,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterScreen';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      {/* <TouchableOpacity style={styles.backArrow}>
        <Text style={{ fontSize: 28 }}>←</Text>
      </TouchableOpacity> */}

      {/* Logo */}
      <Image source={{ uri: 'https://img.icons8.com/color/96/000000/maintenance.png' }} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>✉️</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email or phone number"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.icon}>{showPassword ? '🙈' : '👁️'}</Text>
        </Pressable>
      </View>

      {/* Remember Me */}
      {/* <View style={styles.rememberMeContainer}>
        <Pressable
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
        </Pressable>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View> */}

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.replace('Main')}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot the password?</Text>
      </TouchableOpacity>

      {/* Or continue with */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.line} />
      </View>



      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backArrow: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#222',
    lineHeight: 44,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 56,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#a259ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#a259ff',
    borderColor: '#a259ff',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 16,
    color: '#222',
  },
  signInButton: {
    backgroundColor: '#a259ff',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#a259ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#a259ff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  orText: {
    marginHorizontal: 12,
    color: '#888',
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  socialIcon: {
    fontSize: 28,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#888',
    fontSize: 16,
  },
  signupLink: {
    color: '#a259ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    alignItems: 'center',
  },
  signupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a259ff',
    marginBottom: 18,
  },
});

export default LoginScreen; 