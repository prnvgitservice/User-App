import { BookingData } from '@/src/screens/TransactionScreen';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, User, Phone, MapPin, XCircle, Globe } from 'react-native-feather';


interface CancelledCardProps {
  booking: BookingData;
  setCurrentStep: (step: string) => void;
}

const CancelledCard: React.FC<CancelledCardProps> = ({ booking, setCurrentStep }) => {
  const { booking: bookingData, technician, service } = booking;
  const formattedTechnicianAddress = `${technician?.buildingName || ''}, ${technician?.areaName || ''}, ${technician?.city || ''}, ${technician?.state || ''} - ${technician?.pincode || ''}`.trim();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            accessibilityLabel="Go back to bookings"
            accessibilityRole="button"
            onPress={() => setCurrentStep('bookings')}
            className="flex-row items-center gap-2"
          >
            <ChevronLeft width={24} height={24} color="#374151" />
            <Text className="text-gray-600 text-lg font-medium">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Cancelled Booking Details</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status and Date */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-gray-500 text-sm font-medium">
            Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
          </Text>
          <View className="bg-red-100 px-4 py-2 rounded-full shadow-sm flex-row items-center gap-1">
            <XCircle width={16} height={16} color="#DC2626" />
            <Text className="text-red-700 text-sm font-semibold">Cancelled</Text>
          </View>
        </View>

        {/* Details Card */}
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-md">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
              <User width={20} height={20} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Technician Name</Text>
              <Text className="text-gray-900 text-base font-semibold">
                {technician?.username || 'N/A'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
              <Globe width={20} height={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Service</Text>
              <Text className="text-gray-900 text-base font-semibold">
                {service?.serviceName || 'N/A'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
              <Phone width={20} height={20} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Contact</Text>
              <Text className="text-gray-900 text-base font-semibold">
                {technician?.phoneNumber || 'N/A'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-4 mb-4">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
              <MapPin width={20} height={20} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Address</Text>
              <Text className="text-gray-900 text-base font-semibold" numberOfLines={3}>
                {formattedTechnicianAddress || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CancelledCard;






// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { ChevronLeft, User, Phone, MapPin, XCircle, Globe } from 'react-native-feather';

// interface BookingData {
//   booking: {
//     _id: string;
//     userId: string;
//     technicianId: string;
//     serviceId: string;
//     quantity: number;
//     bookingDate: string;
//     servicePrice: number;
//     gst: number;
//     totalPrice: number;
//     status: string;
//     otp: number;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//     rating?: number;
//     review?: string;
//   };
//   technician: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     profileImage?: string;
//   };
//   service: {
//     _id: string;
//     serviceName: string;
//     serviceImg: string;
//     servicePrice: number;
//   };
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     profileImage?: string;
//   };
// }

// interface CancelledCardProps {
//   booking: BookingData;
//   setCurrentStep: (step: string) => void;
// }

// const CancelledCard: React.FC<CancelledCardProps> = ({ booking, setCurrentStep }) => {
//   const { booking: bookingData, technician, service } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200">
//       <View className="border-b border-gray-200 px-6 py-4">
//         <View className="flex-row items-center gap-3">
//           <TouchableOpacity
//             onPress={() => setCurrentStep('bookings')}
//             className="flex-row items-center gap-2"
//           >
//             <ChevronLeft width={20} height={20} color="#4B5563" />
//             <Text className="text-gray-600">Back</Text>
//           </TouchableOpacity>
//           <Text className="text-xl font-semibold text-gray-900 ml-4">Cancelled Booking Details</Text>
//         </View>
//       </View>
//       <View className="p-6">
//         <View className="flex-row items-center justify-between mb-2">
//           <Text className="text-sm text-gray-500">
//             Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
//           </Text>
//           <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center gap-1">
//             <XCircle width={16} height={16} color="#DC2626" />
//             <Text className="text-red-600 text-xs font-semibold">Cancelled</Text>
//           </View>
//         </View>
//         <View className="flex-col gap-4">
//           <View className="flex-row items-center gap-3 gap-4">
//             <User width={20} height={20} color="#3B82F6" />
//             <Text className="text-gray-700 font-medium">{technician?.username}</Text>
//           </View>
//           <View className="flex-row items-center gap-3 gap-4">
//             <Globe width={20} height={20} color="#F97316" />
//             <Text className="text-gray-700 font-medium">{service?.serviceName}</Text>
//           </View>
//           <View className="flex-row items-center gap-3 gap-4">
//             <Phone width={20} height={20} color="#16A34A" />
//             <Text className="text-gray-700 font-medium">{technician?.phoneNumber}</Text>
//           </View>
//           <View className="flex-row items-center gap-3 gap-4">
//             <MapPin width={20} height={20} color="#DC2626" />
//             <Text className="text-gray-700 text-sm">{formattedTechnicianAddress}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default CancelledCard;
