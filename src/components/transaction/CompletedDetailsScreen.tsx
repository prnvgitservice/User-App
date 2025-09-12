import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft, User, Phone, MapPin, Star } from 'react-native-feather';

interface BookingData {
  booking: {
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
  };
  technician: {
    _id: string;
    username: string;
    phoneNumber: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    profileImage?: string;
  };
  user: {
    _id: string;
    username: string;
    phoneNumber: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    profileImage?: string;
  };
  service: {
    _id: string;
    serviceName: string;
    serviceImg: string;
    servicePrice: number;
  };
}

interface CompletedDetailsProps {
  booking: BookingData;
  setCurrentStep: (step: string, data?: any) => void;
}

const CompletedDetailsScreen: React.FC<CompletedDetailsProps> = ({ booking, setCurrentStep }) => {
  const { booking: bookingData, technician, service } = booking;
  const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

  return (
    <View className="flex-1 bg-white rounded-lg border border-gray-200">
      <View className="border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => setCurrentStep('bookings')}
            className="flex-row items-center space-x-2"
          >
            <ChevronLeft width={20} height={20} color="#4B5563" />
            <Text className="text-gray-600">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 ml-4">Booking Details</Text>
        </View>
      </View>
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="bg-green-100 px-4 py-2 rounded-full">
            <Text className="text-sm font-medium text-green-600">Completed</Text>
          </View>
          <Text className="text-gray-400 text-sm">
            Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
          <Image
            source={{ uri: service.serviceImg || 'https://via.placeholder.com/300' }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-col gap-6 mb-6">
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <User width={24} height={24} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Technician Name:</Text>
              <Text className="text-gray-900 font-medium ml-2">{technician?.username}</Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
              <Star width={24} height={24} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Service:</Text>
              <Text className="text-gray-900 font-medium ml-2">{service?.serviceName}</Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
              <Phone width={24} height={24} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Contact:</Text>
              <Text className="text-gray-900 font-medium ml-2">{technician?.phoneNumber}</Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
              <MapPin width={24} height={24} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Address:</Text>
              <Text className="text-gray-900 font-medium ml-2 text-sm">
                {formattedTechnicianAddress}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-600 text-2xl">₹</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Total Price:</Text>
              <Text className="text-gray-900 font-medium ml-2">₹{bookingData?.totalPrice}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="w-full bg-purple-500 py-4 rounded-2xl"
          onPress={() => setCurrentStep('savings', { booking })}
        >
          <Text className="text-white font-semibold text-center">View Payment Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CompletedDetailsScreen;
// import React from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { ChevronLeft, User, Wrench, Phone, MapPin } from 'react-native-feather';

// interface BookingData {
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
//   username: string;
//   phoneNumber: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// interface Service {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
// }

// interface CompletedDetailsProps {
//   booking: {
//     booking: BookingData;
//     technician: Technician;
//     user: User;
//     service: Service;
//   };
//   setCurrentStep: (step: string, data?: any) => void;
// }

// const CompletedDetailsScreen: React.FC<CompletedDetailsProps> = ({ booking, setCurrentStep }) => {
//   const { booking: bookingData, technician, service } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4">
//         <View className="flex-row items-center space-x-3">
//           <TouchableOpacity
//             onPress={() => setCurrentStep('bookings')}
//             className="flex-row items-center space-x-2"
//           >
//             <ChevronLeft width={20} height={20} color="#4B5563" />
//             <Text className="text-gray-600">Back</Text>
//           </TouchableOpacity>
//           <Text className="text-xl font-semibold text-gray-900 ml-4">Booking Details</Text>
//         </View>
//       </View>
//       <View className="p-6">
//         <View className="flex-row items-center justify-between mb-6">
//           <View className="bg-green-100 px-4 py-2 rounded-full">
//             <Text className="text-sm font-medium text-green-600">Completed</Text>
//           </View>
//           <Text className="text-gray-400 text-sm">
//             Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
//           </Text>
//         </View>
//         <View className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <Image
//             source={{ uri: service.serviceImg || 'https://via.placeholder.com/300' }}
//             className="w-full h-full"
//             resizeMode="cover"
//           />
//         </View>
//         <View className="flex-col gap-6 mb-6">
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
//               <User width={24} height={24} color="#2563EB" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Technician Name:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.username}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
//               <Wrench width={24} height={24} color="#F97316" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Service:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{service?.serviceName}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
//               <Phone width={24} height={24} color="#16A34A" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Contact:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.phoneNumber}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
//               <MapPin width={24} height={24} color="#DC2626" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Address:</Text>
//               <Text className="text-gray-900 font-medium ml-2 text-sm">
//                 {formattedTechnicianAddress}
//               </Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
//               <Text className="text-purple-600 text-2xl">₹</Text>
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Total Price:</Text>
//               <Text className="text-gray-900 font-medium ml-2">₹{bookingData?.totalPrice}</Text>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity
//           className="w-full bg-purple-500 py-4 rounded-2xl"
//           onPress={() => setCurrentStep('savings', { booking })}
//         >
//           <Text className="text-white font-semibold text-center">View Payment Details</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CompletedDetailsScreen;