import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { ChevronLeft, User, Phone, MapPin, Key, Globe, AlertCircle } from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingCancleByUser } from '@/src/api/apiMethods';
// import { bookingCancleByUser } from '@/src/api/apiMethods.tsx';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const { technician, service } = booking;
  const formattedTechnicianAddress = `${technician?.buildingName || ''}, ${technician?.areaName || ''}, ${technician?.city || ''}, ${technician?.state || ''} - ${technician?.pincode || ''}`.trim();

  const handleCancelPress = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmCancel = async () => {
    setShowConfirmationModal(false);
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

  const handleCancelModal = () => {
    setShowConfirmationModal(false);
  };

  const ConfirmationModal = () => (
    <Modal
      transparent
      visible={showConfirmationModal}
      animationType="fade"
      onRequestClose={handleCancelModal}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
          {/* Icon */}
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mx-auto mb-6">
            <AlertCircle width={32} height={32} color="#DC2626" />
          </View>
          
          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 text-center mb-4">
            Cancel Booking?
          </Text>
          
          {/* Message */}
          <Text className="text-gray-600 text-center mb-8 leading-6">
            Do you really want to cancel this booking? This action cannot be undone.
          </Text>
          
          {/* Buttons */}
          <View className="space-y-3">
            {/* Yes Button */}
            <TouchableOpacity
              className="bg-red-600 py-4 px-6 rounded-xl shadow-sm"
              onPress={handleConfirmCancel}
              disabled={isCancelling}
            >
              <Text className="text-white font-semibold text-center text-base">
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </Text>
            </TouchableOpacity>
            
            {/* No Button */}
            <TouchableOpacity
              className="bg-gray-100 py-4 px-6 rounded-xl border border-gray-200"
              onPress={handleCancelModal}
              disabled={isCancelling}
            >
              <Text className="text-gray-700 font-semibold text-center text-base">
                No, Keep Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">Booking Details</Text>
          <TouchableOpacity
            accessibilityLabel="Go back to bookings"
            accessibilityRole="button"
            onPress={() => setCurrentStep('bookings')}
            className="flex-row items-center gap-2"
          >
            <ChevronLeft width={24} height={24} color="#374151" />
            <Text className="text-gray-600 text-lg font-medium">Back</Text>
          </TouchableOpacity>
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
        <View className="w-48 h-48 bg-gray-200 rounded-2xl mb-6 overflow-hidden shadow-md self-center">
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

          <View className="flex-row items-center gap-4 mb-4">
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

          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
              <Key width={20} height={20} color="#FBBF24" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm font-medium">OTP</Text>
              <Text className="bg-purple-600 text-white rounded-xl text-center py-2 px-4 text-base font-semibold w-28">
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
            className={`py-3 px-6 bg-white border border-gray-200 rounded-xl shadow-md mx-4 ${isCancelling ? 'opacity-60' : ''}`}
            onPress={handleCancelPress}
            disabled={isCancelling}
          >
            <Text className="text-black font-semibold text-center text-base">
              Cancel Service
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

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </View>
  );
};

export default BookingDetailsScreen;








// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
// import { ChevronLeft, User, Phone, MapPin, Key, Globe } from 'react-native-feather';
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

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({
//   booking,
//   setCurrentStep,
//   setActiveTab,
//   refetchBookings,
// }) => {
//   const [isCancelling, setIsCancelling] = useState<boolean>(false);
//   const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
//   const [bookingState, setBookingState] = useState(booking.booking);

//   const { technician, service } = booking;
//   const formattedTechnicianAddress = `${technician?.buildingName || ''}, ${technician?.areaName || ''}, ${technician?.city || ''}, ${technician?.state || ''} - ${technician?.pincode || ''}`.trim();

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
//         Alert.alert('Success', 'Booking cancelled successfully');
//       } else {
//         Alert.alert('Error', response?.message || 'Failed to cancel booking');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while cancelling the booking');
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
//         <View className="flex-row items-center justify-between">
//           <TouchableOpacity
//             accessibilityLabel="Go back to bookings"
//             accessibilityRole="button"
//             onPress={() => setCurrentStep('bookings')}
//             className="flex-row items-center space-x-2"
//           >
//             <ChevronLeft width={24} height={24} color="#374151" />
//             <Text className="text-gray-600 text-lg font-medium">Back</Text>
//           </TouchableOpacity>
//           <Text className="text-xl font-bold text-gray-900">Booking Details</Text>
//           <View className="w-10" />
//         </View>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Status and Date */}
//         <View className="flex-row items-center justify-between mb-6">
//           <View
//             className={`px-4 py-2 rounded-full shadow-sm ${
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
//               className={`text-sm font-semibold ${
//                 bookingState.status === 'upcoming'
//                   ? 'text-purple-700'
//                   : bookingState.status === 'accepted'
//                   ? 'text-blue-700'
//                   : bookingState.status === 'started'
//                   ? 'text-yellow-700'
//                   : 'text-green-700'
//               }`}
//             >
//               {bookingState.status
//                 ? bookingState.status.charAt(0).toUpperCase() + bookingState.status.slice(1)
//                 : 'Unknown'}
//             </Text>
//           </View>
//           <Text className="text-gray-500 text-sm font-medium">
//             Date: {new Date(bookingState.bookingDate).toLocaleDateString()}
//           </Text>
//         </View>

//         {/* Service Image */}
//         <View className="w-48 h-48 bg-gray-200 rounded-2xl mb-6 overflow-hidden shadow-md self-center">
//           {service?.serviceImg ? (
//             <>
//               {isImageLoading && (
//                 <View className="w-full h-full bg-gray-200 items-center justify-center">
//                   <ActivityIndicator size="large" color="#374151" />
//                 </View>
//               )}
//               <Image
//                 source={{ uri: service.serviceImg }}
//                 className="w-full h-full"
//                 resizeMode="cover"
//                 accessibilityLabel={`Image of ${service.serviceName}`}
//                 onLoadStart={() => setIsImageLoading(true)}
//                 onLoadEnd={() => setIsImageLoading(false)}
//               />
//             </>
//           ) : (
//             <View className="w-full h-full bg-gray-200 items-center justify-center">
//               <Text className="text-gray-500 text-base font-medium">No Image Available</Text>
//             </View>
//           )}
//         </View>

//         {/* Details Card */}
//         <View className="bg-white rounded-2xl p-5 mb-6 shadow-md">
//           <View className="flex-row items-center space-x-4 mb-4">
//             <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
//               <User width={20} height={20} color="#2563EB" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">Technician Name</Text>
//               <Text className="text-gray-900 text-base font-semibold">
//                 {technician?.username || 'N/A'}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-4 mb-4">
//             <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
//               <Globe width={20} height={20} color="#F97316" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">Service</Text>
//               <Text className="text-gray-900 text-base font-semibold">
//                 {service?.serviceName || 'N/A'}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-4 mb-4">
//             <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
//               <Phone width={20} height={20} color="#16A34A" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">Contact</Text>
//               <Text className="text-gray-900 text-base font-semibold">
//                 {technician?.phoneNumber || 'N/A'}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row items-start space-x-4 mb-4">
//             <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
//               <MapPin width={20} height={20} color="#DC2626" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">Address</Text>
//               <Text className="text-gray-900 text-base font-semibold" numberOfLines={3}>
//                 {formattedTechnicianAddress || 'N/A'}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-4 mb-4">
//             <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
//               <Text className="text-purple-700 text-xl font-bold">₹</Text>
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">Total Price</Text>
//               <Text className="text-gray-900 text-base font-semibold">
//                 ₹{bookingState?.totalPrice || 0}
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row items-center space-x-4">
//             <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
//               <Key width={20} height={20} color="#FBBF24" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-gray-600 text-sm font-medium">OTP</Text>
//               <Text className="bg-purple-600 text-white rounded-xl text-center py-2 px-4 text-base font-semibold w-28">
//                 {bookingState?.otp || 'N/A'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Cancel Button */}
//         {bookingState?.status === 'upcoming' ? (
//           <TouchableOpacity
//             accessibilityLabel="Cancel booking"
//             accessibilityRole="button"
//             className={`py-3 px-6 bg-white border border-gray-200 rounded-xl shadow-md mx-4 ${isCancelling ? 'opacity-60' : ''}`}
//             onPress={handleCancel}
//             disabled={isCancelling}
//           >
//             <Text className="text-black font-semibold text-center text-base">
//               {isCancelling ? 'Cancelling...' : 'Cancel Service'}
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <Text className="text-gray-500 text-sm text-center mx-4">
//             {bookingState?.status
//               ? `Cannot cancel: Booking is ${bookingState.status}`
//               : 'Status unavailable'}
//           </Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default BookingDetailsScreen;







