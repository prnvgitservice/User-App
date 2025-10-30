import { BookingData } from "@/src/screens/TransactionScreen";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "react-native-feather";

interface SavingsProps {
  setCurrentStep: (step: string, data?: any) => void;
  booking: BookingData;
}

const SavingsScreen: React.FC<SavingsProps> = ({ setCurrentStep, booking }) => {
  const { booking: bookingData, service } = booking;

  if (!service) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-base">Service details not available</Text>
      </View>
    );
  }

  const baseAmount = bookingData.servicePrice * bookingData.quantity;
  const gst = bookingData.gst || 0;
  const totalPrice = bookingData.totalPrice || baseAmount + gst;

  // --- Discount Calculation Logic ---
  let increasedPrice = totalPrice;
  let discountPercent = 0;

  if (totalPrice >= 500 && totalPrice <= 999) {
    increasedPrice = totalPrice * 1.1; // +10%
    discountPercent = 10;
  } else if (totalPrice >= 1000) {
    increasedPrice = totalPrice * 1.2; // +20%
    discountPercent = 20;
  }

  const discountAmount = increasedPrice - totalPrice;

  return (
    <View className="flex-1 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <View className="border-b border-gray-200 px-6 py-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => setCurrentStep("completed-details", { booking })}
          className="flex-row items-center gap-2"
        >
          <ChevronLeft width={20} height={20} color="#4B5563" />
          <Text className="text-gray-600 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900 ml-4">
          Payment Summary
        </Text>
      </View>

      {/* Content */}
      <View className="p-6">
        <View className="text-center mb-8">
          <View className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 items-center justify-center">
            <Text className="text-green-600 text-2xl">₹</Text>
          </View>
          <Text className="text-xl font-semibold text-gray-900 text-center">
            Payment for
          </Text>
          <Text className="text-xl font-semibold text-gray-900 text-center">
            {service?.serviceName}
          </Text>
        </View>

        {/* Calculation Table */}
        <View className="max-w-md mx-auto space-y-4 mb-8">
          <Row
            label={`Orginal Price`}
            value={`₹${increasedPrice.toFixed(2)}`}
          />
          <Row label="Final Amount" value={`₹${baseAmount.toFixed(2)}`} />
          <Row label="GST (18%)" value={`₹${gst.toFixed(2)}`} />


          <Row
            label="Discount Amount"
            value={`₹${discountAmount.toFixed(2)} (${discountPercent}%)`}
            highlight
          />

          <View className="flex-row justify-between items-center py-4 border-t-2 border-gray-200">
            <Text className="text-gray-900 text-xl font-semibold">
              Final Total
            </Text>
            <Text className="text-purple-600 text-xl font-bold">
              ₹{totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Done Button */}
        <View className="max-w-md mx-auto space-y-4">
          <TouchableOpacity
            className="w-full bg-purple-600 py-3 px-4 rounded-2xl shadow-md"
            onPress={() => setCurrentStep("final-rating", { booking })}
          >
            <Text className="text-white font-semibold text-center text-base">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/** Small Row Component for cleaner layout */
interface RowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, highlight }) => (
  <View
    className={`flex-row justify-between items-center py-3 border-b border-gray-100 ${
      highlight ? "bg-yellow-50 rounded-lg px-2" : ""
    }`}
  >
    <Text
      className={`text-base ${
        highlight ? "text-green-700 font-semibold" : "text-gray-700"
      }`}
    >
      {label}
    </Text>
    <Text
      className={`text-base font-medium ${
        highlight ? "text-green-700" : "text-gray-900"
      }`}
    >
      {value}
    </Text>
  </View>
);

export default SavingsScreen;

// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { ChevronLeft } from 'react-native-feather';

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

// interface SavingsProps {
//   setCurrentStep: (step: string, data?: any) => void;
//   booking: BookingData;
// }

// const SavingsScreen: React.FC<SavingsProps> = ({ setCurrentStep, booking }) => {
//   const { booking: bookingData, service } = booking;

//   if (!service) {
//     return <View className="flex-1 justify-center"><Text className="text-center py-8">Service details not available</Text></View>;
//   }

//   const baseAmount = bookingData.servicePrice * bookingData.quantity;
//   const discount = 0;

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4">
//         <View className="flex-row items-center gap-3">
//           <TouchableOpacity
//             onPress={() => setCurrentStep('completed-details', { booking })}
//             className="flex-row items-center gap-2"
//           >
//             <ChevronLeft width={20} height={20} color="#4B5563" />
//             <Text className="text-gray-600">Back</Text>
//           </TouchableOpacity>
//           <Text className="text-xl font-semibold text-gray-900 ml-4">Payment Summary</Text>
//         </View>
//       </View>
//       <View className="p-6">
//         <View className="text-center mb-8">
//           <View className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 items-center justify-center">
//             <Text className="text-green-600 text-2xl">₹</Text>
//           </View>
//           <Text className="text-xl font-semibold text-gray-900 mx-auto">Payment for</Text>
//           <Text className="text-xl font-semibold text-gray-900 mx-auto">{service?.serviceName}</Text>
//         </View>
//         <View className="max-w-md mx-auto space-y-4 mb-8">
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-gray-600">Base Amount</Text>
//             <Text className="text-gray-900 font-medium">₹{baseAmount}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-green-600">Discount Applied</Text>
//             <Text className="text-green-600 font-medium">-₹{discount}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-gray-600">GST (18%)</Text>
//             <Text className="text-gray-900 font-medium">₹{bookingData?.gst}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-4 border-t-2 border-gray-200">
//             <Text className="text-gray-900 text-xl font-semibold ">Total Amount  </Text>
//             <Text className="text-purple-600 text-xl font-bold ml-2">₹{bookingData?.totalPrice}</Text>
//           </View>
//         </View>
//         <View className="max-w-md mx-auto space-y-4">
//           <TouchableOpacity
//             className="w-full bg-purple-500 py-2 px-4 rounded-2xl"
//             onPress={() => setCurrentStep('final-rating', { booking })}
//           >
//             <Text className="text-white font-semibold text-center">Done</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SavingsScreen;
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { ChevronLeft } from 'react-native-feather';

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

// interface SavingsProps {
//   setCurrentStep: (step: string, data?: any) => void;
//   booking: BookingData;
// }

// const SavingsScreen: React.FC<SavingsProps> = ({ setCurrentStep, booking }) => {
//   const { booking: bookingData, service } = booking;

//   if (!service) {
//     return <View className="flex-1 justify-center"><Text className="text-center py-8">Service details not available</Text></View>;
//   }

//   const baseAmount = bookingData.servicePrice * bookingData.quantity;
//   const discount = 0;

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4">
//         <View className="flex-row items-center space-x-3">
//           <TouchableOpacity
//             onPress={() => setCurrentStep('completed-details', { booking })}
//             className="flex-row items-center space-x-2"
//           >
//             <ChevronLeft width={20} height={20} color="#4B5563" />
//             <Text className="text-gray-600">Back</Text>
//           </TouchableOpacity>
//           <Text className="text-xl font-semibold text-gray-900 ml-4">Payment Summary</Text>
//         </View>
//       </View>
//       <View className="p-6">
//         <View className="text-center mb-8">
//           <View className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 items-center justify-center">
//             <Text className="text-green-600 text-2xl">₹</Text>
//           </View>
//           <Text className="text-xl font-semibold text-gray-900">Payment for {service?.serviceName}</Text>
//         </View>
//         <View className="max-w-md mx-auto space-y-4 mb-8">
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-gray-600">Base Amount</Text>
//             <Text className="text-gray-900 font-medium">₹{baseAmount}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-green-600">Discount Applied</Text>
//             <Text className="text-green-600 font-medium">-₹{discount}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
//             <Text className="text-gray-600">GST (18%)</Text>
//             <Text className="text-gray-900 font-medium">₹{bookingData?.gst}</Text>
//           </View>
//           <View className="flex-row justify-between items-center py-4 border-t-2 border-gray-200">
//             <Text className="text-gray-900 text-xl font-semibold">Total Amount</Text>
//             <Text className="text-purple-600 text-xl font-bold">₹{bookingData?.totalPrice}</Text>
//           </View>
//         </View>
//         <View className="max-w-md mx-auto space-y-4">
//           <TouchableOpacity
//             className="w-full bg-purple-500 py-4 rounded-2xl"
//             onPress={() => setCurrentStep('final-rating', { booking })}
//           >
//             <Text className="text-white font-semibold text-center">Done</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SavingsScreen;