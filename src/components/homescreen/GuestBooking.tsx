import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CategoryContext } from '@/src/context/CategoryContext';
import { createGuestBooking } from '@/src/api/apiMethods';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const GuestBooking = () => {
  const { categories, loading, error: contextError } = useContext(CategoryContext);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    categoryId: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes dynamically
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate category selection
    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    setIsLoading(true);
    try {
      const response = await createGuestBooking(formData);
      if (response.success) {
        Alert.alert('Success', "Booking created successfully! We'll get back to you soon.");
        setFormData({ name: '', phoneNumber: '', categoryId: '' });
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred while creating the booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center px-4">
      <View className="bg-white rounded-2xl shadow-lg p-6 mx-auto w-full max-w-md">
        <Text className="text-xl font-semibold text-center mb-6">
          Guest <Text className="text-fuchsia-600">Booking</Text>
        </Text>

        {(error || contextError) && (
          <Text className="text-red-500 text-sm text-center mb-4">
            {error || contextError}
          </Text>
        )}

        {/* Name Input */}
        <View className="flex-row items-center border border-gray-400 rounded-lg px-3 py-3 mb-4 focus-within:border-fuchsia-600">
          <Ionicons name="person" size={20} color="#aaa" />
          <TextInput
            className="ml-2 flex-1 text-base"
            placeholder="Enter your Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            required
            aria-label="Name"
          />
        </View>

        {/* Phone Input */}
        <View className="flex-row items-center border border-gray-400 rounded-lg px-3 py-3 mb-4 focus-within:border-fuchsia-600">
          <Ionicons name="call" size={20} color="#aaa" />
          <TextInput
            className="ml-2 flex-1 text-base"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
            keyboardType="phone-pad"
            required
            aria-label="Phone number"
          />
        </View>

        {/* Category Picker */}
        <View className="flex-row items-center border border-gray-400 rounded-lg px-3 py-3 mb-4 focus-within:border-fuchsia-600">
          <MaterialIcons name="category" size={20} color="#aaa" />
          <Picker
            selectedValue={formData.categoryId}
            onValueChange={(value) => handleChange('categoryId', value)}
            style={{ flex: 1, marginLeft: 8 }}
            enabled={!loading}
            aria-label="Select category"
          >
            <Picker.Item label="Select a category" value="" enabled={false} />
            {categories
              ?.sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
              .map((item) => (
                <Picker.Item
                  key={item._id}
                  label={item.category_name}
                  value={item._id}
                />
              ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`bg-fuchsia-500 rounded-xl py-3 flex-row items-center justify-center ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          onPress={handleSubmit}
          disabled={isLoading || loading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text className="text-white text-lg font-semibold mr-2">
                Book Now
              </Text>
              <MaterialIcons name="double-arrow" size={30} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* Footer Text */}
        <Text className="text-gray-500 text-sm text-center mt-4">
          We will get back to you as soon as possible
        </Text>
      </View>
    </View>
  );
};

export default GuestBooking;