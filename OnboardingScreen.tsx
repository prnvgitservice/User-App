import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const pages = [
  'Welcome to our App! This is page 1.',
  'Discover features on page 2.',
  'Stay connected on page 3.',
  'Ready to start? This is page 4.'
];

const images = [
  require('./assets/1.jpg'),
  require('./assets/f2.jpg'),
  require('./assets/f3.jpg'),
  require('./assets/f2.jpg'),
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [page, setPage] = useState(0);

  const handleNext = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    }
  };

  const handleGetStarted = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={images[page]} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.buttonContainer}>
        {page < pages.length - 1 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#a259ff',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
