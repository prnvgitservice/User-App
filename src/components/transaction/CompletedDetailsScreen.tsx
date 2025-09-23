import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
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
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(true);
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
            className="flex-row items-center space-x-2"
          >
            <ChevronLeft width={24} height={24} color="#374151" />
            <Text className="text-gray-600 text-lg font-medium">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Booking Details</Text>
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
          <View className="bg-green-100 px-4 py-2 rounded-full shadow-sm">
            <Text className="text-sm font-semibold text-green-700">Completed</Text>
          </View>
          <Text className="text-gray-500 text-sm font-medium">
            Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Service Image */}
        <View className="w-48 h-48 bg-gray-200 rounded-2xl mb-6 overflow-hidden shadow-md self-center">
          {service?.serviceImg ? (
            <>
              {isImageLoading && (
                <View className="w-full h-full bg-gray-200 items-center justify-center">
                  <ActivityIndicator size="large" color="#374151" />
                </View>
              )}
              <Image
                source={{ uri: service.serviceImg || 'https://via.placeholder.com/300' }}
                className="w-full h-full"
                resizeMode="cover"
                accessibilityLabel={`Image of ${service.serviceName}`}
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Text className="text-gray-500 text-base font-medium">No Image Available</Text>
            </View>
          )}
        </View>

        {/* Details Card */}
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-md">
          <View className="flex-row items-center space-x-4 mb-4">
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

          <View className="flex-row items-center space-x-4 mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
              <Star width={20} height={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Service</Text>
              <Text className="text-gray-900 text-base font-semibold">
                {service?.serviceName || 'N/A'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 mb-4">
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

          <View className="flex-row items-start space-x-4 mb-4">
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

          <View className="flex-row items-center space-x-4 mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-700 text-xl font-bold">₹</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Total Price</Text>
              <Text className="text-gray-900 text-base font-semibold">
                ₹{bookingData?.totalPrice || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* View Payment Details Button */}
        <TouchableOpacity
          accessibilityLabel="View payment details"
          accessibilityRole="button"
          className="py-3 px-6 bg-purple-600 rounded-xl shadow-md mx-4"
          onPress={() => setCurrentStep('savings', { booking })}
        >
          <Text className="text-white font-semibold text-center text-base">View Payment Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CompletedDetailsScreen;








// import React from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { ChevronLeft, User, Phone, MapPin, Star } from 'react-native-feather';

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
//   service: {
//     _id: string;
//     serviceName: string;
//     serviceImg: string;
//     servicePrice: number;
//   };
// }

// interface CompletedDetailsProps {
//   booking: BookingData;
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
//           <View className="flex-row items-center space-x-4 gap-5">
//             <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
//               <User width={24} height={24} color="#2563EB" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Technician Name:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.username}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4 gap-5">
//             <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
//               <Star width={24} height={24} color="#F97316" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Service:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{service?.serviceName}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4 gap-5">
//             <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
//               <Phone width={24} height={24} color="#16A34A" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Contact:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.phoneNumber}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4 gap-5">
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
//           <View className="flex-row items-center space-x-4 gap-5">
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
