import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CategoryContext } from '@/src/context/CategoryContext';
import { createGetInTouch } from '@/src/api/apiMethods';

const ContactUs = () => {
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
      const response = await createGetInTouch(formData);
      if (response.success) {
        Alert.alert('Success', "Contacted successfully ! We'll get back to you soon.");
        setFormData({ name: '', phoneNumber: '', categoryId: '' });
      } else {
        setError(response.message || 'Failed to create Contacting');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred while creating the Contacting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center px-4">
      <View className="bg-white rounded-2xl shadow-lg p-6 mx-auto w-full max-w-md">
        <Text className="text-xl font-semibold text-center mb-6">
          Contact <Text className="text-fuchsia-600">US</Text>
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
            onChangeText={(text) => {
              // Only allow numbers and limit length to 10
              const cleanedText = text.replace(/[^0-9]/g, '');
              if (cleanedText.length <= 10) {
                handleChange('phoneNumber', cleanedText);
              }
            }}
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
                Get In Touch
              </Text>
              <MaterialIcons name="double-arrow" size={20} color="#fff" />
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

export default ContactUs;




// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { getAllCategories } from "@/src/api/apiMethods";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import { getAllCategories, createGuestBooking } from "../api/apiMethods"; 

// const ContactUs: React.FC = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     categoryId: "",
//   });

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (response.success === true && Array.isArray(response.data)) {
//         setCategories(response.data);
//       } else {
//         setError("Invalid response format");
//       }
//     } catch (err) {
//       setError(err?.message || "Failed to fetch categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleChange = (key: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//     setError(null);
//   };

//   const handleSubmit = async () => {
//     setError(null);

//     if (!formData.name.trim()) {
//       setError("Please enter your name");
//       return;
//     }

//     if (!/^\d{10}$/.test(formData.phoneNumber)) {
//       setError("Please enter a valid 10-digit phone number");
//       return;
//     }

//     if (!formData.categoryId) {
//       setError("Please select a category");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await createGuestBooking(formData); // Rename API if needed
//       if (response.success) {
//         Alert.alert("Success", "Your contact request has been submitted successfully!");
//         setFormData({ name: "", phoneNumber: "", categoryId: "" });
//       } else {
//         setError(response.message || "Failed to submit contact request");
//       }
//     } catch (err) {
//       setError(err?.message || "An error occurred while submitting the form");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-50 py-8">
//       <View className="max-w-md mx-auto px-4">
//         <View className="bg-white border border-gray-300 rounded-xl shadow-xl p-6">
//           <Text className="text-lg md:text-xl text-center mb-6 font-semibold">
//             Contact <Text className="text-fuchsia-600">Us</Text>
//           </Text>

//           {error && (
//             <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
//           )}

//           {/* Name Input */}
//           <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
//             {/* <Ionicons name="person" size={20} color="#aaa" /> */}
//             <TextInput
//               value={formData.name}
//               onChangeText={(text) => handleChange("name", text)}
//               placeholder="Enter your Name"
//               className="text-sm md:text-base ms-2 flex-1"
//             />
//           </View>

//           {/* Phone Input */}
//           <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
//             {/* <Ionicons name="call" size={20} color="#aaa" /> */}
//             <TextInput
//               value={formData.phoneNumber}
//               onChangeText={(text) => handleChange("phoneNumber", text)}
//               placeholder="Enter your phone number"
//               keyboardType="number-pad"
//               maxLength={10}
//               className="text-sm md:text-base ms-2 flex-1"
//             />
//           </View>

//           {/* Category Picker */}
//           <View className="flex-row items-center px-3 py-3 border border-gray-400 rounded-lg mb-4">
//             {/* <MaterialIcons name="category" size={20} color="#aaa" /> */}
//             <Picker
//               selectedValue={formData.categoryId}
//               onValueChange={(value) => handleChange("categoryId", value)}
//               style={{ flex: 1, marginLeft: 8 }}
//             >
//               <Picker.Item label="Select a category" value="" />
//               {categories
//                 .sort((a, b) =>
//                   a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())
//                 )
//                 .map((item) => (
//                   <Picker.Item
//                     key={item._id}
//                     label={item.category_name}
//                     value={item._id}
//                   />
//                 ))}
//             </Picker>
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity
//             onPress={handleSubmit}
//             className="bg-fuchsia-500 py-3 rounded-xl flex-row justify-center items-center"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="white" size="small" />
//             ) : (
//               <>
//                 <Text className="text-white font-semibold text-base me-2">
//                   Submit
//                 </Text>
//                 {/* <MaterialIcons name="keyboard-double-arrow-right" size={24} color="white" /> */}
//               </>
//             )}
//           </TouchableOpacity>

//           <Text className="text-sm text-gray-500 text-center mt-4">
//             We will get back to you as soon as possible
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default ContactUs;
