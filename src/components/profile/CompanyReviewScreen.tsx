import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Star } from 'lucide-react-native';
import { createCompanyReview } from '../../api/apiMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewData {
  [key: string]: string | number;
  role: string;
  rating: number;
  comment: string;
}

interface AuthenticatedUser {
  id: string;
  role: 'user' | 'technician';
  name?: string;
  username?: string;
  token?: string;
  [key: string]: any; // For additional properties
}

const CompanyReviewScreen: React.FC = ({ navigation }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await AsyncStorage.getItem('user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setError(null);
        } else {
          setError('User not found. Please log in again.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleReviewSubmit = async () => {
    if (!user || !user.id || !user.role) {
      Alert.alert('Error', 'User information is missing. Please log in.');
      return;
    }

    if (selectedRating === 0) {
      Alert.alert('Error', 'Please select a rating.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    const reviewData: ReviewData = {
      [user.role === 'user' ? 'userId' : 'technicianId']: user.id,
      role: user.role,
      rating: selectedRating,
      comment: comment.trim(),
    };

    try {
      const response = await createCompanyReview(reviewData, user.token);
      
      if (response && response.success) {
        Alert.alert('Success', 'Review submitted successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        setSelectedRating(0);
        setComment('');
      } else {
        throw new Error(response?.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again later.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedRating(0);
    setComment('');
    setError(null);
    navigation.goBack();
  };

  // Show loading indicator while fetching user data
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  // Show error if user data couldn't be loaded
  if (error && !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-red-500 text-lg mb-4 text-center">{error}</Text>
        <TouchableOpacity
          className="px-5 py-3 bg-blue-600 rounded-lg"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-white font-medium">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center py-8">
        <Text className="text-lg font-medium mb-6 text-gray-700 text-center">
          💥 Boom! Review Time!
        </Text>
        
        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}
        
        <Text className="text-sm font-medium mb-2 text-gray-700">Name</Text>
        <View className="p-3 border border-gray-300 rounded-lg mb-6 bg-gray-50">
          <Text className="text-gray-800">
            {user?.username || user?.name || 'Anonymous'}
          </Text>
        </View>
        
        <Text className="text-sm font-medium mb-2 text-gray-700">Rating</Text>
        <View className="flex-row justify-between mb-8 px-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setSelectedRating(star)}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Star
                size={36}
                color={star <= selectedRating ? '#fbbf24' : '#d1d5db'}
                fill={star <= selectedRating ? '#fbbf24' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <Text className="text-sm font-medium mb-2 text-gray-700">Comment</Text>
        <TextInput
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 min-h-[120px] text-left align-top"
          multiline={true}
          numberOfLines={6}
          placeholder="Write your review here..."
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          editable={!isSubmitting}
        />
        
        <View className="flex-row justify-end space-x-3 gap-3">
          <TouchableOpacity
            className="px-5 py-3 border border-gray-300 rounded-lg"
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text className="text-gray-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-5 py-3 rounded-lg ${
              selectedRating === 0 || isSubmitting || !comment.trim()
                ? 'bg-gray-400' 
                : 'bg-blue-600'
            }`}
            onPress={handleReviewSubmit}
            disabled={selectedRating === 0 || isSubmitting || !comment.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CompanyReviewScreen;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Star } from 'lucide-react-native';
// import { createCompanyReview } from '../../api/apiMethods';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// interface ReviewData {
//   [key: string]: string | number;
//   role: string;
//   rating: number;
//   comment: string;
// }

// interface AuthenticatedUser {
//   id: string;
//   role: 'user' | 'technician';
//   name?: string;
//   username?: string;
// }

// const CompanyReviewScreen: React.FC = () => {
//   const [selectedRating, setSelectedRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>('');
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [user , setUser] = useState<Array || null>({})  

//   const AuthenticatedUser = async () =>{
//     try{
//       const authData = await AsyncStorage.getItem('user')
//       setUser(authData)

//     }else{
//       setUser(null)
//     }
//   }

//   const handleReviewSubmit = async () => {
//     if (!user || !user.id || !user.role) {
//       Alert.alert('Error', 'User information is missing. Please log in.');
//       return;
//     }

//     if (selectedRating === 0) {
//       Alert.alert('Error', 'Please select a rating.');
//       return;
//     }

//     setIsSubmitting(true);
    
//     const reviewData: ReviewData = {
//       [user.role === 'user' ? 'userId' : 'technicianId']: user.id,
//       role: user.role,
//       rating: selectedRating,
//       comment: comment,
//     };

//     try {
//       const response = await createCompanyReview(reviewData);
//       if (response) {
//         Alert.alert('Success', 'Review submitted successfully!');
//         setSelectedRating(0);
//         setComment('');
//         if (onSubmitSuccess) onSubmitSuccess();
//       } else {
//         Alert.alert('Error', 'Failed to submit review. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       Alert.alert('Error', 'An error occurred. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedRating(0);
//     setComment('');
//     if (onCancel) onCancel();
//   };

//   return (
//     <ScrollView className="flex-1 bg-white p-6">
//       <View className="flex-1 justify-center py-8">
//         <Text className="text-lg font-medium mb-6 text-gray-700 text-center">
//           💥 Boom! Review Time!
//         </Text>
        
//         <Text className="text-sm font-medium mb-2 text-gray-700">Name</Text>
//         <View className="p-3 border border-gray-300 rounded-lg mb-6 bg-gray-50">
//           <Text className="text-gray-800">
//             {user?.username || user?.name || 'Anonymous'}
//           </Text>
//         </View>
        
//         <Text className="text-sm font-medium mb-2 text-gray-700">Rating</Text>
//         <View className="flex-row justify-between mb-8 px-4">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <TouchableOpacity
//               key={star}
//               onPress={() => setSelectedRating(star)}
//               activeOpacity={0.7}
//             >
//               <Star
//                 size={36}
//                 color={star <= selectedRating ? '#fbbf24' : '#d1d5db'}
//                 fill={star <= selectedRating ? '#fbbf24' : 'transparent'}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
        
//         <Text className="text-sm font-medium mb-2 text-gray-700">Comment</Text>
//         <TextInput
//           className="w-full p-4 border border-gray-300 rounded-lg mb-6 min-h-[120px] text-left align-top"
//           multiline={true}
//           numberOfLines={6}
//           placeholder="Write your review here..."
//           value={comment}
//           onChangeText={setComment}
//           textAlignVertical="top"
//         />
        
//         <View className="flex-row justify-end space-x-3">
//           <TouchableOpacity
//             className="px-5 py-3 border border-gray-300 rounded-lg"
//             onPress={handleCancel}
//             disabled={isSubmitting}
//           >
//             <Text className="text-gray-700 font-medium">Cancel</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             className={`px-5 py-3 rounded-lg ${
//               selectedRating === 0 || isSubmitting 
//                 ? 'bg-gray-400' 
//                 : 'bg-blue-600'
//             }`}
//             onPress={handleReviewSubmit}
//             disabled={selectedRating === 0 || isSubmitting}
//           >
//             <Text className="text-white font-medium">
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default CompanyReviewScreen;
// import React, { useState, useRef } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
// import { Star } from 'lucide-react-native';
// import { createCompanyReview } from '../../api/apiMethods';

// interface AuthenticatedUser {
//   id: string;
//   role: 'user' | 'technician';
//   name?: string;
// }

// interface ReviewData {
//   [key: string]: string | number;
//   role: string;
//   rating: number;
//   comment: string;
// }

// const CompanyReviewScreen: React.FC = () => {
//   const [selectedRating, setSelectedRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState<boolean>(true);

//   const user: AuthenticatedUser | null = JSON.parse(
//     // For React Native, consider AsyncStorage for persistent user data
//     '{"id":"123","role":"user","name":"Soujanya"}'
//   );

//   const handleReviewSubmit = async () => {
//     if (!user?.id || !user.role) {
//       Alert.alert('Error', 'User information is missing. Please log in.');
//       return;
//     }

//     const reviewData: ReviewData = {
//       [user.role === 'user' ? 'userId' : 'technicianId']: user.id,
//       role: user.role,
//       rating: selectedRating,
//       comment: comment,
//     };

//     try {
//       const response = await createCompanyReview(reviewData);
//       if (response) {
//         Alert.alert('Success', 'Review submitted successfully!');
//         setSelectedRating(0);
//         setComment('');
//         setModalVisible(false);
//       } else {
//         Alert.alert('Error', 'Failed to submit review. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       Alert.alert('Error', 'An unexpected error occurred.');
//     }
//   };

//   return (
//     <Modal
//       visible={modalVisible}
//       animationType="fade"
//       transparent
//       onRequestClose={() => setModalVisible(false)}
//     >
//       <View className='flex-1 bg-black bg-opacity-40 justify-center items-center'>
//         <ScrollView
//            className='bg-white p-6 rounded-lg w-80'
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text className='text-lg font-medium mb-4 text-gray-700 text-center'>
//             💥 Boom! Review Time!
//           </Text>

//           <Text className='text-sm font-medium mb-2 text-gray-700'>Name</Text>
//           <TextInput
//             className='p-2 border border-gray-300 rounded-lg mb-4'
//             value={user?.name || 'Anonymous'}
//             editable={false}
//           />

//           <Text className='text-sm font-medium mb-2 text-gray-700'>Rating</Text>
//           <View className='flex-row justify-center mb-8'>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
//                 <Star
//                   size={32}
//                   color={star <= selectedRating ? '#FACC15' : '#D1D5DB'}
//                   className='mx-1'
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text className='text-sm font-medium mb-2 text-gray-700'>Comment</Text>
//           <TextInput
//             className='border border-gray-300 p-2 rounded-lg mb-4 h-24'
//             placeholder="Write your review here..."
//             value={comment}
//             multiline
//             onChangeText={setComment}
//           />

//           <View className='flex-row justify-end'>
//             <TouchableOpacity
//               className='px-4 py-2 bg-blue-600 rounded-lg'
//               onPress={handleReviewSubmit}
//             >
//               <Text className='text-white text-sm'>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// export default CompanyReviewScreen;
