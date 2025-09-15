import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, User, Phone, MapPin, XCircle, Globe } from 'react-native-feather';

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
  service: {
    _id: string;
    serviceName: string;
    serviceImg: string;
    servicePrice: number;
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
}

interface CancelledCardProps {
  booking: BookingData;
  setCurrentStep: (step: string) => void;
}

const CancelledCard: React.FC<CancelledCardProps> = ({ booking, setCurrentStep }) => {
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
          <Text className="text-xl font-semibold text-gray-900 ml-4">Cancelled Booking Details</Text>
        </View>
      </View>
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500">
            Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
          </Text>
          <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center gap-1">
            <XCircle width={16} height={16} color="#DC2626" />
            <Text className="text-red-600 text-xs font-semibold">Cancelled</Text>
          </View>
        </View>
        <View className="flex-col gap-4">
          <View className="flex-row items-center space-x-3 gap-4">
            <User width={20} height={20} color="#3B82F6" />
            <Text className="text-gray-700 font-medium">{technician?.username}</Text>
          </View>
          <View className="flex-row items-center space-x-3 gap-4">
            <Globe width={20} height={20} color="#F97316" />
            <Text className="text-gray-700 font-medium">{service?.serviceName}</Text>
          </View>
          <View className="flex-row items-center space-x-3 gap-4">
            <Phone width={20} height={20} color="#16A34A" />
            <Text className="text-gray-700 font-medium">{technician?.phoneNumber}</Text>
          </View>
          <View className="flex-row items-center space-x-3 gap-4">
            <MapPin width={20} height={20} color="#DC2626" />
            <Text className="text-gray-700 text-sm">{formattedTechnicianAddress}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CancelledCard;
// import React from 'react';
// import { View, Text } from 'react-native';
// import { User, Wrench, Phone, MapPin, XCircle } from 'react-native-feather';

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

// interface CancelledCardProps {
//   booking: {
//     booking: BookingData;
//     technician: Technician;
//     service: Service;
//     user: User;
//   };
// }

// const CancelledCard: React.FC<CancelledCardProps> = ({ booking }) => {
//   const { booking: bookingData, technician, service } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

//   return (
//     <View className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
//       <View className="flex-row items-center justify-between mb-2">
//         <Text className="text-sm text-gray-500">
//           Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
//         </Text>
//         <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center gap-1">
//           <XCircle width={16} height={16} color="#DC2626" />
//           <Text className="text-red-600 text-xs font-semibold">Cancelled</Text>
//         </View>
//       </View>
//       <View className="flex-col gap-4">
//         <View className="flex-row items-center space-x-3">
//           <User width={20} height={20} color="#3B82F6" />
//           <Text className="text-gray-700 font-medium">{technician?.username}</Text>
//         </View>
//         <View className="flex-row items-center space-x-3">
//           <Wrench width={20} height={20} color="#F97316" />
//           <Text className="text-gray-700 font-medium">{service?.serviceName}</Text>
//         </View>
//         <View className="flex-row items-center space-x-3">
//           <Phone width={20} height={20} color="#16A34A" />
//           <Text className="text-gray-700 font-medium">{technician?.phoneNumber}</Text>
//         </View>
//         <View className="flex-row items-center space-x-3">
//           <MapPin width={20} height={20} color="#DC2626" />
//           <Text className="text-gray-700 text-sm">{formattedTechnicianAddress}</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default CancelledCard;