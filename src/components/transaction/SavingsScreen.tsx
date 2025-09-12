import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'react-native-feather';

interface Booking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  quantity: number;
  bookingDate: string;
  servicePrice: number;
  gst: number;
  totalPrice: number;
  status: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rating?: number;
  review?: string;
}

interface Technician {
  _id: string;
  userId: string;
  username: string;
  role: string;
  phoneNumber: string;
  category: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description?: string;
  profileImage?: string;
  service?: string;
}

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Service {
  _id: string;
  technicianId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BookingData {
  booking: Booking;
  technician: Technician;
  user: User;
  service: Service | null;
}

interface SavingsProps {
  setCurrentStep: (step: string, data?: any) => void;
  booking: BookingData;
}

const SavingsScreen: React.FC<SavingsProps> = ({ setCurrentStep, booking }) => {
  const { booking: bookingData, service } = booking;

  if (!service) {
    return <View className="flex-1 justify-center"><Text className="text-center py-8">Service details not available</Text></View>;
  }

  const baseAmount = bookingData.servicePrice * bookingData.quantity;
  const discount = 0;

  return (
    <View className="flex-1 bg-white rounded-lg border border-gray-200">
      <View className="border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => setCurrentStep('completed-details', { booking })}
            className="flex-row items-center space-x-2"
          >
            <ChevronLeft width={20} height={20} color="#4B5563" />
            <Text className="text-gray-600">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 ml-4">Payment Summary</Text>
        </View>
      </View>
      <View className="p-6">
        <View className="text-center mb-8">
          <View className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 items-center justify-center">
            <Text className="text-green-600 text-2xl">₹</Text>
          </View>
          <Text className="text-xl font-semibold text-gray-900">Payment for {service?.serviceName}</Text>
        </View>
        <View className="max-w-md mx-auto space-y-4 mb-8">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Base Amount</Text>
            <Text className="text-gray-900 font-medium">₹{baseAmount}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-green-600">Discount Applied</Text>
            <Text className="text-green-600 font-medium">-₹{discount}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">GST (18%)</Text>
            <Text className="text-gray-900 font-medium">₹{bookingData?.gst}</Text>
          </View>
          <View className="flex-row justify-between items-center py-4 border-t-2 border-gray-200">
            <Text className="text-gray-900 text-xl font-semibold">Total Amount</Text>
            <Text className="text-purple-600 text-xl font-bold">₹{bookingData?.totalPrice}</Text>
          </View>
        </View>
        <View className="max-w-md mx-auto space-y-4">
          <TouchableOpacity
            className="w-full bg-purple-500 py-4 rounded-2xl"
            onPress={() => setCurrentStep('final-rating', { booking })}
          >
            <Text className="text-white font-semibold text-center">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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