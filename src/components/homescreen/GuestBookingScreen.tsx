import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { getAllCategories, createGuestBooking } from "../api/apiMethods"; 

const GuestBookingScreen = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    categoryId: "",
  });

  const [error, setError] = useState<string | null>(null);

  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError("Invalid response format");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    setError(null);

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
      const response = await createGuestBooking(formData);
      if (response.success) {
        Alert.alert("Success", "Booking created successfully!");
        setFormData({ name: "", phoneNumber: "", categoryId: "" });
      } else {
        setError(response.message || "Failed to create booking");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while creating booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="bg-white border border-gray-300 rounded-2xl shadow-xl p-6">
        {/* Title */}
        <Text className="text-xl text-center font-semibold mb-6">
          Guest <Text className="text-fuchsia-600">Booking</Text>
        </Text>

        {/* Error */}
        {error && (
          <Text className="text-red-500 text-center text-sm mb-4">{error}</Text>
        )}

        {/* Name */}
        <View className="flex-row items-center border border-gray-400 rounded-lg px-3 py-3 mb-5">
          <TextInput
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            className="flex-1 ml-2 text-base"
          />
        </View>

        {/* Phone Number */}
        <View className="flex-row items-center border border-gray-400 rounded-lg px-3 py-3 mb-5">
          <TextInput
            placeholder="Enter your phone number"
            keyboardType="numeric"
            maxLength={10}
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, phoneNumber: text }))
            }
            className="flex-1 ml-2 text-base"
          />
        </View>

        {/* Category */}
        <View className="border border-gray-400 rounded-lg px-3 py-1 mb-5">
          <Picker
            selectedValue={formData.categoryId}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, categoryId: val }))
            }
          >
            <Picker.Item label="Select a category" value="" />
            {categories
              .sort((a, b) =>
                a.category_name.toLowerCase().localeCompare(
                  b.category_name.toLowerCase()
                )
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

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-3 rounded-xl flex-row items-center justify-center ${
            isLoading ? "bg-fuchsia-300" : "bg-fuchsia-500"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Book Now →</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <Text className="text-center text-sm text-gray-500 mt-4">
          We will get back to you as soon as possible
        </Text>
      </View>
    </ScrollView>
  );
};

export default GuestBookingScreen;
