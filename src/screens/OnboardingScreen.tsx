import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';



const pages = [
  { title: 'Welcome to our App!', subtitle: 'Your journey starts here' },
  { title: 'Discover features.', subtitle: 'Explore endless possibilities' },
  { title: 'Stay connected.', subtitle: 'Join our community' },
];

const images = [
  require('../../assets/1.jpg'),
  require('../../assets/f2.jpg'),
  require('../../assets/f3.jpg'),
];

const OnboardingScreen: React.FC = () => {
  const [page, setPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const navigation = useNavigation();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [page]);

  const handleNext = () => {
    if (page < pages.length - 1) {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      setPage(page + 1);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 justify-end items-center bg-black">
      <Image
        source={images[page]}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute w-full h-full bg-black/15" />
      <View className="w-full pb-12 items-center">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center px-6 mb-10"
        >
          <Text className="text-white text-2xl font-bold text-center shadow-md">
            {pages[page].title}
          </Text>
          <Text className="text-white text-lg font-medium text-center mt-2 opacity-80">
            {pages[page].subtitle}
          </Text>
        </Animated.View>
        <View className="flex-row mb-6">
          {pages.map((_, index) => (
            <Animated.View
              key={index}
              className={`w-2.5 h-2.5 rounded-full mx-1 ${
                index === page ? 'bg-purple-500' : 'bg-white/50'
              }`}
              style={
                index === page
                  ? {
                      transform: [
                        {
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.2],
                          }),
                        },
                      ],
                    }
                  : {}
              }
            />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] items-center">
          <TouchableOpacity
            className="bg-black py-4 px-6 rounded-lg"
            onPress={handleSkip}
          >
            <Text className="text-white text-lg font-medium">Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-purple-500 py-4 px-16 rounded-full shadow-lg"
            onPress={page < pages.length - 1 ? handleNext : handleGetStarted}
          >
            <Text className="text-white text-lg font-bold">
              {page < pages.length - 1 ? 'Next' : 'Get Started'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Onboarding: undefined;
//   Login: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// const pages = [
//   'Welcome to our App!',
//   'Discover features.',
//   'Stay connected.',
// ];

// const images = [
//   require('../../../assets/1.jpg'),
//   require('../../../assets/f2.jpg'),
//   require('../../../assets/f3.jpg'),
// ];

// const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
//   const [page, setPage] = useState(0);

//   const handleNext = () => {
//     if (page < pages.length - 1) {
//       setPage(page + 1);
//     }
//   };

//   const handleGetStarted = () => {
//     navigation.replace('Login');
//   };

//   const handleSkip = () => {
//     navigation.replace('Login');
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={images[page]}
//         style={styles.image}
//         resizeMode="cover"
//       />
//       <View style={styles.overlay} />
//       <View style={styles.contentContainer}>
//         <Text style={styles.text}>{pages[page]}</Text>
//         <View style={styles.dotsContainer}>
//           {pages.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.dot,
//                 index === page ? styles.activeDot : styles.inactiveDot,
//               ]}
//             />
//           ))}
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity className='bg-black w-full py-4 px-6 rounded-lg' onPress={handleSkip}>
//             <Text className='text-white text-lg font-medium relative '>Skip</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={page < pages.length - 1 ? handleNext : handleGetStarted}
//           >
//             <Text style={styles.buttonText}>
//               {page < pages.length - 1 ? 'Next' : 'Get Started'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   image: {
//     ...StyleSheet.absoluteFillObject,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.15)',
//   },
//   contentContainer: {
//     width: '100%',
//     paddingBottom: 48,
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginHorizontal: 24,
//     marginBottom: 40,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     backgroundColor: '#a259ff',
//   },
//   inactiveDot: {
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '90%',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#a259ff',
//     paddingVertical: 16,
//     paddingHorizontal: 64,
//     borderRadius: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   skipButton: {
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   skipButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//     textDecorationLine: 'underline',
//   },
// });

// export default OnboardingScreen;
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Onboarding: undefined;
//   Login: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// const pages = [
//   'Welcome to our App! This is page 1.',
//   'Discover features on page 2.',
//   'Stay connected on page 3.',
// ];

// const images = [
//   require('../../assets/1.jpg'),
//   require('../../assets/f2.jpg'),
//   require('../../assets/f3.jpg'),
// ];

// const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
//   const [page, setPage] = useState(0);

//   const handleNext = () => {
//     if (page < pages.length - 1) {
//       setPage(page + 1);
//     }
//   };

//   const handleGetStarted = () => {
//     navigation.replace('Login');
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={images[page]} style={styles.image} resizeMode="cover" />
//       <View style={styles.overlay} />
//       <View style={styles.buttonContainer}>
//         {page < pages.length - 1 ? (
//           <TouchableOpacity style={styles.button} onPress={handleNext}>
//             <Text style={styles.buttonText}>Next</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
//             <Text style={styles.buttonText}>Get Started</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   image: {
//     ...StyleSheet.absoluteFillObject,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.15)',
//   },
//   text: {
//     fontSize: 22,
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 48,
//     width: '100%',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#a259ff',
//     paddingVertical: 16,
//     paddingHorizontal: 64,
//     borderRadius: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default OnboardingScreen;
