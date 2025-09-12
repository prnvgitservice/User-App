import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { ChevronLeft, User, Phone, MapPin, Key, Globe } from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingCancleByUser } from '@/src/api/apiMethods';

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
  } | null;
}

interface BookingDetailsProps {
  booking: BookingData;
  setCurrentStep: (step: string, data?: any) => void;
  setActiveTab: (tab: string) => void;
  refetchBookings: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({
  booking,
  setCurrentStep,
  setActiveTab,
  refetchBookings,
}) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [bookingState, setBookingState] = useState(booking.booking);

  const { technician, service } = booking;
  const formattedTechnicianAddress = `${technician?.buildingName || ''}, ${
    technician?.areaName || ''
  }, ${technician?.city || ''}, ${technician?.state || ''} - ${
    technician?.pincode || ''
  }`.trim();

  const handleCancel = async () => {
    setIsCancelling(true);
    const data = {
      orderId: bookingState._id,
      userId: await AsyncStorage.getItem('userId'),
    };

    try {
      const response = await bookingCancleByUser(data);
      if (response?.success) {
        setActiveTab('cancelled');
        refetchBookings();
        setCurrentStep('bookings');
        Alert.alert('Success', 'Booking cancelled successfully');
      } else {
        Alert.alert('Error', response?.message || 'Failed to cancel booking');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while cancelling the booking');
    } finally {
      setIsCancelling(false);
    }
  };

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
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100, // Extra padding to ensure button visibility
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(width, height) => console.log('Content height:', height)} // Debug content height
      >
        {/* Status and Date */}
        <View className="flex-row items-center justify-between mb-6">
          <View
            className={`px-4 py-2 rounded-full shadow-sm ${
              bookingState.status === 'upcoming'
                ? 'bg-purple-100'
                : bookingState.status === 'accepted'
                ? 'bg-blue-100'
                : bookingState.status === 'started'
                ? 'bg-yellow-100'
                : 'bg-green-100'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                bookingState.status === 'upcoming'
                  ? 'text-purple-700'
                  : bookingState.status === 'accepted'
                  ? 'text-blue-700'
                  : bookingState.status === 'started'
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}
            >
              {bookingState.status
                ? bookingState.status.charAt(0).toUpperCase() + bookingState.status.slice(1)
                : 'Unknown'}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm font-medium">
            Date: {new Date(bookingState.bookingDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Service Image */}
        <View
          className="w-48 h-48 bg-gray-200 rounded-2xl mb-6 overflow-hidden shadow-md self-center"
          // style={{ height: SCREEN_HEIGHT * 0.35 }} // Dynamic height based on screen
        >
          {service?.serviceImg ? (
            <>
              {isImageLoading && (
                <View className="w-full h-full bg-gray-200 items-center justify-center">
                  <ActivityIndicator size="large" color="#374151" />
                </View>
              )}
              <Image
                source={{ uri: service.serviceImg }}
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
          {/* Technician Name */}
          <View className="flex-row items-center space-x-4 mb-4 gap-5">
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

          {/* Service */}
          <View className="flex-row items-center space-x-4 mb-4 gap-5">
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

          {/* Contact */}
          <View className="flex-row items-center space-x-4 mb-4 gap-5">
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

          {/* Address */}
          <View className="flex-row items-start space-x-4 mb-4 gap-5">
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

          {/* Total Price */}
          <View className="flex-row items-center space-x-4 mb-4 gap-5">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-700 text-xl font-bold">₹</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">Total Price</Text>
              <Text className="text-gray-900 text-base font-semibold">
                ₹{bookingState?.totalPrice || 0}
              </Text>
            </View>
          </View>

          {/* OTP */}
          <View className="flex-row items-center space-x-4 gap-5">
            <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
              <Key width={20} height={20} color="#FBBF24" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">OTP</Text>
              <Text className="bg-purple-600 text-white rounded-xl py-2 px-4 text-base font-semibold">
                {bookingState?.otp || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {bookingState?.status === 'upcoming' ? (
          <TouchableOpacity
            accessibilityLabel="Cancel booking"
            accessibilityRole="button"
            className={`py-3 px-6 bg-red-600 rounded-xl shadow-md mx-4 ${
              isCancelling ? 'opacity-60' : ''
            }`}
            onPress={handleCancel}
            disabled={isCancelling}
          >
            <Text className="text-white font-semibold text-center text-base">
              {isCancelling ? 'Cancelling...' : 'Cancel Service'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 text-sm text-center mx-4">
            {bookingState?.status
              ? `Cannot cancel: Booking is ${bookingState.status}`
              : 'Status unavailable'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default BookingDetailsScreen;
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { ChevronLeft, User, Phone, MapPin, Key } from 'react-native-feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { bookingCancleByUser } from '@/src/api/apiMethods';

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
//   } | null;
// }

// interface BookingDetailsProps {
//   booking: BookingData;
//   setCurrentStep: (step: string, data?: any) => void;
//   setActiveTab: (tab: string) => void;
//   refetchBookings: () => void;
// }

// const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({
//   booking,
//   setCurrentStep,
//   setActiveTab,
//   refetchBookings,
// }) => {
//   const [isCancelling, setIsCancelling] = useState<boolean>(false);
//   const [bookingState, setBookingState] = useState(booking.booking);

//   const { technician, service } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     const data = {
//       orderId: bookingState._id,
//       userId: await AsyncStorage.getItem('userId'),
//     };

//     try {
//       const response = await bookingCancleByUser(data);
//       if (response?.success) {
//         setActiveTab('cancelled');
//         refetchBookings();
//         setCurrentStep('bookings');
//       } else {
//         console.error('Failed to cancel booking:', response?.message);
//       }
//     } catch (error) {
//       console.error('Error cancelling booking:', error);
//     } finally {
//       setIsCancelling(false);
//     }
//   };

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
//           <View
//             className={`px-4 py-2 rounded-full ${
//               bookingState.status === 'upcoming'
//                 ? 'bg-purple-100'
//                 : bookingState.status === 'accepted'
//                 ? 'bg-blue-100'
//                 : bookingState.status === 'started'
//                 ? 'bg-yellow-100'
//                 : 'bg-green-100'
//             }`}
//           >
//             <Text
//               className={`text-sm font-medium ${
//                 bookingState.status === 'upcoming'
//                   ? 'text-purple-600'
//                   : bookingState.status === 'accepted'
//                   ? 'text-blue-600'
//                   : bookingState.status === 'started'
//                   ? 'text-yellow-600'
//                   : 'text-green-600'
//               }`}
//             >
//               {bookingState.status.charAt(0).toUpperCase() + bookingState.status.slice(1)}
//             </Text>
//           </View>
//           <Text className="text-gray-400 text-sm">
//             Date: {new Date(bookingState.bookingDate).toLocaleDateString()}
//           </Text>
//         </View>
//         <View className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <Image
//             source={{ uri: service?.serviceImg || 'https://via.placeholder.com/300' }}
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
//               {/* <Wrench width={24} height={24} color="#F97316" /> */}
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
//               <Text className="text-gray-900 font-medium ml-2">₹{bookingState?.totalPrice}</Text>
//             </View>
//           </View>
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center">
//               <Key width={24} height={24} color="#FBBF24" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">OTP:</Text>
//               <Text className="bg-purple-500 text-white rounded-2xl py-2 px-3 font-medium ml-2">
//                 {bookingState?.otp}
//               </Text>
//             </View>
//           </View>
//         </View>
//         {bookingState?.status === 'upcoming' && (
//           <View className="flex-row justify-end space-x-4">
//             <TouchableOpacity
//               className={`py-2 px-4 bg-gray-50 border-2 border-red-600 rounded-2xl ${isCancelling ? 'opacity-70' : ''}`}
//               onPress={handleCancel}
//               disabled={isCancelling}
//             >
//               <Text className="text-red-600 font-semibold">
//                 {isCancelling ? 'Cancelling...' : 'Cancel Service'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default BookingDetailsScreen;
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import { ChevronLeft, User, Wrench, Phone, MapPin, Key } from 'react-native-feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';

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

// interface BookingDetailsProps {
//   booking: {
//     booking: BookingData;
//     technician: Technician;
//     user: User;
//     service: Service | null;
//   };
//   setCurrentStep: (step: string, data?: any) => void;
//   setActiveTab: (tab: string) => void;
// }

// const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({
//   booking,
//   setCurrentStep,
//   setActiveTab,
// }) => {
//   const [isCancelling, setIsCancelling] = useState<boolean>(false);
//   const [bookingState, setBookingState] = useState(booking.booking);

//   const { technician, service, user } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     const data = {
//       orderId: bookingState._id,
//       userId: await AsyncStorage.getItem('userId'),
//     };

//     try {
//       const response = await bookingCancelByUser(data);
//       if (response?.success) {
//         setActiveTab('cancelled');
//         setCurrentStep('bookings');
//       } else {
//         console.error('Failed to cancel booking:', response?.message);
//       }
//     } catch (error) {
//       console.error('Error cancelling booking:', error);
//     } finally {
//       setIsCancelling(false);
//     }
//   };

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
//           <View
//             className={`px-4 py-2 rounded-full ${
//               bookingState.status === 'upcoming'
//                 ? 'bg-purple-100'
//                 : bookingState.status === 'accepted'
//                 ? 'bg-blue-100'
//                 : bookingState.status === 'started'
//                 ? 'bg-yellow-100'
//                 : 'bg-green-100'
//             }`}
//           >
//             <Text
//               className={`text-sm font-medium ${
//                 bookingState.status === 'upcoming'
//                   ? 'text-purple-600'
//                   : bookingState.status === 'accepted'
//                   ? 'text-blue-600'
//                   : bookingState.status === 'started'
//                   ? 'text-yellow-600'
//                   : 'text-green-600'
//               }`}
//             >
//               {bookingState.status.charAt(0).toUpperCase() + bookingState.status.slice(1)}
//             </Text>
//           </View>
//           <Text className="text-gray-400 text-sm">
//             Date: {new Date(bookingState.bookingDate).toLocaleDateString()}
//           </Text>
//         </View>
//         <View className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <Image
//             source={{ uri: service?.serviceImg || 'https://via.placeholder.com/300' }}
//             className="w-full h-full"
//             resizeMode="cover"
//           />
//         </View>
//         <View className="flex-col gap-6 mb-6">
//           {/* Name */}
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
//               <User width={24} height={24} color="#2563EB" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Technician Name:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.username}</Text>
//             </View>
//           </View>
//           {/* Service */}
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
//               <Wrench width={24} height={24} color="#F97316" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Service:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{service?.serviceName}</Text>
//             </View>
//           </View>
//           {/* Contact */}
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
//               <Phone width={24} height={24} color="#16A34A" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Contact:</Text>
//               <Text className="text-gray-900 font-medium ml-2">{technician?.phoneNumber}</Text>
//             </View>
//           </View>
//           {/* Address */}
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
//           {/* Price */}
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
//               <Text className="text-purple-600 text-2xl">₹</Text>
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">Total Price:</Text>
//               <Text className="text-gray-900 font-medium ml-2">₹{bookingState?.totalPrice}</Text>
//             </View>
//           </View>
//           {/* OTP Section */}
//           <View className="flex-row items-center space-x-4">
//             <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center">
//               <Key width={24} height={24} color="#FBBF24" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600">OTP:</Text>
//               <Text className="bg-purple-500 text-white rounded-2xl py-2 px-3 font-medium ml-2">
//                 {bookingState?.otp}
//               </Text>
//             </View>
//           </View>
//         </View>
//         {bookingState?.status === 'upcoming' && (
//           <View className="flex-row justify-end space-x-4">
//             <TouchableOpacity
//               className={`py-2 px-4 bg-gray-50 border-2 border-red-600 rounded-2xl ${isCancelling ? 'opacity-70' : ''}`}
//               onPress={handleCancel}
//               disabled={isCancelling}
//             >
//               <Text className="text-red-600 font-semibold">
//                 {isCancelling ? 'Cancelling...' : 'Cancel Service'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default BookingDetailsScreen;
