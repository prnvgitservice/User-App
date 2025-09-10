import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { getAllCategories, createGuestBooking } from "../api/apiMethods"; 

const ContactUs: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    categoryId: "",
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success === true && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      setError(err?.message || "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createGuestBooking(formData); // Rename API if needed
      if (response.success) {
        Alert.alert("Success", "Your contact request has been submitted successfully!");
        setFormData({ name: "", phoneNumber: "", categoryId: "" });
      } else {
        setError(response.message || "Failed to submit contact request");
      }
    } catch (err) {
      setError(err?.message || "An error occurred while submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 py-8">
      <View className="max-w-md mx-auto px-4">
        <View className="bg-white border border-gray-300 rounded-xl shadow-xl p-6">
          <Text className="text-lg md:text-xl text-center mb-6 font-semibold">
            Contact <Text className="text-fuchsia-600">Us</Text>
          </Text>

          {error && (
            <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
          )}

          {/* Name Input */}
          <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
            <Ionicons name="person" size={20} color="#aaa" />
            <TextInput
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Enter your Name"
              className="text-sm md:text-base ms-2 flex-1"
            />
          </View>

          {/* Phone Input */}
          <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
            <Ionicons name="call" size={20} color="#aaa" />
            <TextInput
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              placeholder="Enter your phone number"
              keyboardType="number-pad"
              maxLength={10}
              className="text-sm md:text-base ms-2 flex-1"
            />
          </View>

          {/* Category Picker */}
          <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
            <MaterialIcons name="category" size={20} color="#aaa" />
            <Picker
              selectedValue={formData.categoryId}
              onValueChange={(value) => handleChange("categoryId", value)}
              style={{ flex: 1, marginLeft: 8 }}
            >
              <Picker.Item label="Select a category" value="" />
              {categories
                .sort((a, b) =>
                  a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())
                )
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
            onPress={handleSubmit}
            className="bg-fuchsia-500 py-3 rounded-xl flex-row justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text className="text-white font-semibold text-base me-2">
                  Submit
                </Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color="white" />
              </>
            )}
          </TouchableOpacity>

          <Text className="text-sm text-gray-500 text-center mt-4">
            We will get back to you as soon as possible
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ContactUs;
