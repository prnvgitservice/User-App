import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Star } from 'lucide-react-native';
import { createCompanyReview } from '../../api/apiMethods';
import { useTailwind } from 'tailwind-rn';

interface AuthenticatedUser {
  id: string;
  role: 'user' | 'technician';
  name?: string;
}

interface ReviewData {
  [key: string]: string | number;
  role: string;
  rating: number;
  comment: string;
}

const CompanyReviewScreen: React.FC = () => {
  const tailwind = useTailwind();
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const user: AuthenticatedUser | null = JSON.parse(
    // For React Native, consider AsyncStorage for persistent user data
    '{"id":"123","role":"user","name":"Soujanya"}'
  );

  const handleReviewSubmit = async () => {
    if (!user?.id || !user.role) {
      Alert.alert('Error', 'User information is missing. Please log in.');
      return;
    }

    const reviewData: ReviewData = {
      [user.role === 'user' ? 'userId' : 'technicianId']: user.id,
      role: user.role,
      rating: selectedRating,
      comment: comment,
    };

    try {
      const response = await createCompanyReview(reviewData);
      if (response) {
        Alert.alert('Success', 'Review submitted successfully!');
        setSelectedRating(0);
        setComment('');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={tailwind('flex-1 bg-black bg-opacity-40 justify-center items-center')}>
        <ScrollView
          contentContainerStyle={tailwind('bg-white p-6 rounded-lg w-80')}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={tailwind('text-lg font-medium mb-4 text-gray-700 text-center')}>
            💥 Boom! Review Time!
          </Text>

          <Text style={tailwind('text-sm font-medium mb-2 text-gray-700')}>Name</Text>
          <TextInput
            style={tailwind('p-2 border border-gray-300 rounded-lg mb-4')}
            value={user?.name || 'Anonymous'}
            editable={false}
          />

          <Text style={tailwind('text-sm font-medium mb-2 text-gray-700')}>Rating</Text>
          <View style={tailwind('flex-row justify-center mb-8')}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                <Star
                  size={32}
                  color={star <= selectedRating ? '#FACC15' : '#D1D5DB'}
                  style={tailwind('mx-1')}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={tailwind('text-sm font-medium mb-2 text-gray-700')}>Comment</Text>
          <TextInput
            style={tailwind('border border-gray-300 p-2 rounded-lg mb-4 h-24')}
            placeholder="Write your review here..."
            value={comment}
            multiline
            onChangeText={setComment}
          />

          <View style={tailwind('flex-row justify-end')}>
            <TouchableOpacity
              style={tailwind('px-4 py-2 bg-blue-600 rounded-lg')}
              onPress={handleReviewSubmit}
            >
              <Text style={tailwind('text-white text-sm')}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CompanyReviewScreen;
