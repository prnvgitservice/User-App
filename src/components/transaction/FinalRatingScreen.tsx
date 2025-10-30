import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Star } from "react-native-feather";
import { BookingData } from "../../screens/TransactionScreen";
import { addReviewByUser } from "@/src/api/apiMethods";

interface FinalRatingProps {
  setCurrentStep: (step: string, data?: any) => void;
  booking: BookingData;
  refetchBookings: () => void;
}

interface FormData {
  serviceId: string;
  technicianId: string;
  userId: string;
  review: string;
  rating: number;
}

const FinalRatingScreen: React.FC<FinalRatingProps> = ({
  setCurrentStep,
  booking,
  refetchBookings,
}) => {
  const { booking: bookingData, service } = booking;

  if (!service) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Service details not available</Text>
      </View>
    );
  }

  const [formData, setFormData] = useState<FormData>({
    serviceId: bookingData.serviceId,
    technicianId: bookingData.technicianId,
    userId: bookingData.userId,
    review: "",
    rating: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.rating) {
      Alert.alert("Missing Rating", "Please select a star rating before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await addReviewByUser(formData);
      if (response?.success) {
        Alert.alert("Thank you!", "Your review was submitted successfully.");
        refetchBookings();
        setCurrentStep("congratulations");
      } else {
        Alert.alert("Notice", response?.message || "You already submitted a review.");
        setCurrentStep("bookings");
      }
    } catch (err) {
      Alert.alert("Review Error", "Something went wrong while submitting your review.");
      setCurrentStep("bookings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white items-center justify-center px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="max-w-md w-full items-center">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Rate Your Experience
        </Text>

        {/* Stars */}
        <View className="flex-row justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setFormData({ ...formData, rating: star })}
            >
              <Star
                width={48}
                height={48}
                color={star <= formData.rating ? "#FBBF24" : "#D1D5DB"}
                fill={star <= formData.rating ? "#FBBF24" : "none"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Review Input */}
        <TextInput
          className="border border-gray-300 rounded-lg w-full p-4 text-base mb-6"
          placeholder="Leave a comment..."
          multiline
          numberOfLines={4}
          value={formData.review}
          onChangeText={(text) => setFormData({ ...formData, review: text })}
        />

        {/* Submit */}
        <TouchableOpacity
          className={`w-full py-3 rounded-2xl ${
            submitting ? "bg-purple-300" : "bg-purple-600"
          }`}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text className="text-white font-semibold text-center text-base">
            {submitting ? "Submitting..." : "Submit Rating"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FinalRatingScreen;

// // import { addReviewByUser } from '@/src/api/apiMethods';
// import { addReviewByUser } from '@/src/api/apiMethods';
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { Star } from 'react-native-feather';

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   rating?: number;
//   review?: string;
// }

// interface Technician {
//   _id: string;
//   userId: string;
//   username: string;
//   role: string;
//   phoneNumber: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   description?: string;
//   profileImage?: string;
//   service?: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Service {
//   _id: string;
//   technicianId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   user: User;
//   service: Service | null;
// }

// interface FinalRatingProps {
//   setCurrentStep: (step: string, data?: any) => void;
//   booking: BookingData;
//   refetchBookings: () => void;
// }

// interface FormData {
//   serviceId: string;
//   technicianId: string;
//   userId: string;
//   review: string;
//   rating: number;
// }

// const FinalRatingScreen: React.FC<FinalRatingProps> = ({ setCurrentStep, booking, refetchBookings }) => {
//   const { booking: bookingData, service } = booking;

//   if (!service) {
//     return <View className="flex-1 justify-center"><Text className="text-center py-8">Service details not available</Text></View>;
//   }

//   const [formData, setFormData] = useState<FormData>({
//     serviceId: bookingData.serviceId,
//     technicianId: bookingData.technicianId,
//     userId: bookingData.userId,
//     review: '',
//     rating: 0,
//   });

//   const handleSubmit = async () => {
//     try {
//       const response = await addReviewByUser(formData);
//       if (response?.success && response?.result) {
//         alert('Review successfully submitted');
//         refetchBookings();
//         setCurrentStep('congratulations');
//       } else {
//         alert('You already submitted');
//         setCurrentStep('bookings');
//       }
//     } catch (err) {
      
//       Alert.alert('Review Error', 'You have already reviewed this service.');
//       setCurrentStep('congratulations');
//     }
//   };

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200 items-center justify-center">
//       <View className="text-center max-w-md mx-auto p-8 flex-col items-center gap-2">
//         <Text className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</Text>
//         <View className="flex-row justify-center gap-2 mb-8">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <TouchableOpacity
//               key={star}
//               onPress={() => setFormData({ ...formData, rating: star })}
//             >
//               <Star
//                 width={48}
//                 height={48}
//                 color={star <= formData.rating ? '#FBBF24' : '#D1D5DB'}
//                 fill={star <= formData.rating ? '#FBBF24' : 'none'}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//         <TextInput
//           className="border border-gray-300 rounded-lg w-full p-4"
//           placeholder="Leave a comment..."
//           value={formData.review}
//           onChangeText={(text) => setFormData({ ...formData, review: text })}
//         />
//         <TouchableOpacity
//           className="w-full bg-purple-500 py-2 px-4 rounded-2xl"
//           onPress={handleSubmit}
//         >
//           <Text className="text-white font-semibold text-center">Submit Rating</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default FinalRatingScreen;
// import { addReviewByUser } from '@/src/api/apiMethods';
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity } from 'react-native';
// import { Star } from 'react-native-feather';

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Technician {
//   _id: string;
//   userId: string;
//   username: string;
//   role: string;
//   phoneNumber: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   description?: string;
//   profileImage?: string;
//   service?: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Service {
//   _id: string;
//   technicianId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   user: User;
//   service: Service | null;
// }

// interface FinalRatingProps {
//   setCurrentStep: (step: string, data?: any) => void;
//   booking: BookingData;
// }

// interface FormData {
//   serviceId: string;
//   technicianId: string;
//   userId: string;
//   review: string;
//   rating: number;
// }

// const FinalRatingScreen: React.FC<FinalRatingProps> = ({ setCurrentStep, booking }) => {
//   const { booking: bookingData, service } = booking;

//   if (!service) {
//     return <View className="flex-1 justify-center"><Text className="text-center py-8">Service details not available</Text></View>;
//   }

//   const [formData, setFormData] = useState<FormData>({
//     serviceId: bookingData.serviceId,
//     technicianId: bookingData.technicianId,
//     userId: bookingData.userId,
//     review: '',
//     rating: 0,
//   });

//   const handleSubmit = async () => {
//     try {
//       const response = await addReviewByUser(formData);
//       if (response?.success && response?.result) {
//         alert('Review successfully submitted');
//       } else {
//         alert('You already submitted');
//         setCurrentStep('bookings');
//       }
//       setCurrentStep('congratulations');
//     } catch (err) {
//       console.log('user review err', err);
//       alert('You have already reviewed this service.');
//       setCurrentStep('bookings');
//     }
//   };

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200 items-center justify-center">
//       <View className="text-center max-w-md mx-auto p-8 flex-col items-center gap-2">
//         <Text className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</Text>
//         <View className="flex-row justify-center space-x-2 mb-8">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <TouchableOpacity
//               key={star}
//               onPress={() => setFormData({ ...formData, rating: star })}
//             >
//               <Star
//                 width={48}
//                 height={48}
//                 color={star <= formData.rating ? '#FBBF24' : '#D1D5DB'}
//                 fill={star <= formData.rating ? '#FBBF24' : 'none'}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//         <TextInput
//           className="border border-gray-300 rounded-lg p-2 w-full"
//           placeholder="Leave a comment..."
//           value={formData.review}
//           onChangeText={(text) => setFormData({ ...formData, review: text })}
//         />
//         <TouchableOpacity
//           className="w-full bg-purple-500 py-4 rounded-2xl"
//           onPress={handleSubmit}
//         >
//           <Text className="text-white font-semibold text-center">Submit Rating</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default FinalRatingScreen;