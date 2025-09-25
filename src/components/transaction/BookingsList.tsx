import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface BookingData {
  booking: {
    _id: string;
    status: string;
    bookingDate: string;
    totalPrice: number;
    quantity: number;
    servicePrice: number;
  };
  technician: {
    username: string;
    profileImage?: string;
  };
  service: {
    serviceName: string;
    serviceImg: string;
  } | null;
  user?: {
    username: string;
  };
}

interface BookingsListProps {
  bookings: BookingData[];
  activeTab: 'upcoming' | 'completed' | 'cancelled';
  onBookingSelect: (booking: BookingData) => void;
}

const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  activeTab,
  onBookingSelect,
}) => {
  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return ['upcomming', 'upcoming', 'accepted', 'started'].includes(
        booking.booking.status.toLowerCase()
      );
    } else if (activeTab === 'completed') {
      return booking.booking.status.toLowerCase() === 'completed';
    } else if (activeTab === 'cancelled') {
      return ['cancelled', 'declined'].includes(
        booking.booking.status.toLowerCase()
      );
    }
    return false;
  });

  // Sort by newest date first for ALL sections (upcoming, completed, cancelled)
  const sortedBookings = [...filteredBookings].sort((a, b) => 
    new Date(b.booking.bookingDate).getTime() - new Date(a.booking.bookingDate).getTime()
  );
  
  // If no bookings found
  if (sortedBookings.length === 0) {
    return (
      <View className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
        <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
          <View
            className={`w-8 h-8 rounded-lg ${
              activeTab === 'upcoming'
                ? 'bg-purple-100'
                : activeTab === 'completed'
                ? 'bg-green-100'
                : 'bg-red-100'
            } justify-center items-center`}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={
                activeTab === 'upcoming'
                  ? '#7C3AED'
                  : activeTab === 'completed'
                  ? '#16A34A'
                  : '#DC2626'
              }
            />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mr-3">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Text>
        </View>
        <View className="p-6 flex-1 justify-center items-center">
          <Text className="text-gray-500 text-base">
            No {activeTab} bookings found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] mb-2">
      {/* Header */}
      <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
        <View
          className={`w-8 h-8 rounded-lg ${
            activeTab === 'upcoming'
              ? 'bg-purple-100'
              : activeTab === 'completed'
              ? 'bg-green-100'
              : 'bg-red-100'
          } justify-center items-center`}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={
              activeTab === 'upcoming'
                ? '#7C3AED'
                : activeTab === 'completed'
                ? '#16A34A'
                : '#DC2626'
              }
          />
        </View>
        <Text className="text-xl font-semibold text-gray-900 ml-2">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
      </View>

      {/* Bookings list */}
      <View className="p-6 space-y-4">
        {sortedBookings.map((bookingData) => {
          const isCancelled = ['cancelled', 'declined'].includes(
            bookingData.booking.status.toLowerCase()
          );

          return (
            <TouchableOpacity
              key={bookingData.booking._id}
              className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 ${
                isCancelled ? 'opacity-80' : ''
              } mb-2`}
              onPress={() => {
                if (!isCancelled) {
                  onBookingSelect(bookingData);
                }
              }}
              disabled={isCancelled}
            >
              <View className="flex-row items-center space-x-4 gap-2 ">
                {/* Service image */}
                <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                  <Image
                    source={{
                      uri:
                        bookingData.service?.serviceImg ||
                        bookingData.technician?.profileImage ||
                        'https://via.placeholder.com/64',
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Booking details */}
                <View className="flex-1 min-w-0">
                  <Text className="font-semibold text-gray-900 text-lg truncate">
                    {bookingData.service?.serviceName || 'Service not specified'}
                  </Text>
                  <Text className="text-gray-500 text-sm truncate">
                    User Name:{' '}
                    <Text className="text-gray-900">
                      {bookingData?.user?.username || 'Unknown User'}
                    </Text>
                  </Text>

                  {/* Status & Date */}
                  <View className="flex-row items-center justify-between mt-2">
                    <View
                      className={`px-3 py-1 rounded-full ${
                        activeTab === 'upcoming'
                          ? 'bg-purple-100'
                          : activeTab === 'completed'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          activeTab === 'upcoming'
                            ? 'text-purple-600'
                            : activeTab === 'completed'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {bookingData.booking.status.charAt(0).toUpperCase() +
                          bookingData.booking.status.slice(1).toLowerCase()}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xs">
                      {new Date(bookingData.booking.bookingDate).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Price & Quantity */}
                  <Text className="mt-2 text-sm text-gray-700">
                    ₹{' '}
                    <Text className="text-blue-500">
                      {bookingData.booking.totalPrice.toFixed(2)}
                    </Text>{' '}
                    • {bookingData.booking.quantity}{' '}
                    {bookingData.booking.quantity > 1 ? 'services' : 'service'}
                  </Text>
                </View>

                {/* Arrow only if clickable */}
                {!isCancelled && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#9CA3AF"
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default BookingsList;






// import { Ionicons } from '@expo/vector-icons';
// import React from 'react';
// import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// interface BookingData {
//   booking: {
//     _id: string;
//     status: string;
//     bookingDate: string;
//     totalPrice: number;
//     quantity: number;
//     servicePrice: number;
//   };
//   technician: {
//     username: string;
//     profileImage?: string;
//   };
//   service: {
//     serviceName: string;
//     serviceImg: string;
//   } | null;
//   user?: {
//     username: string;
//   };
// }

// interface BookingsListProps {
//   bookings: BookingData[];
//   activeTab: 'upcoming' | 'completed' | 'cancelled';
//   onBookingSelect: (booking: BookingData) => void;
// }


// const BookingsList: React.FC<BookingsListProps> = ({
//   bookings,
//   activeTab,
//   onBookingSelect,
// }) => {
//   // Filter bookings based on activeTab
//   const filteredBookings = bookings.filter(booking => {
//     if (activeTab === 'upcoming') {
//       return ['upcomming', 'upcoming', 'accepted', 'started'].includes(
//         booking.booking.status.toLowerCase()
//       );
//     } else if (activeTab === 'completed') {
//       return booking.booking.status.toLowerCase() === 'completed';
//     } else if (activeTab === 'cancelled') {
//       return ['cancelled', 'declined'].includes(
//         booking.booking.status.toLowerCase()
//       );
//     }
//     return false;
//   });

//   // Sort by newest date first only for completed bookings
//   const sortedBookings = activeTab === 'completed' 
//     ? [...filteredBookings].sort((a, b) => new Date(b.booking.bookingDate) - new Date(a.booking.bookingDate))
//     : filteredBookings;
  
//   // If no bookings found
//   if (sortedBookings.length === 0) {
//     return (
//       <View className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
//         <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//           <View
//             className={`w-8 h-8 rounded-lg ${
//               activeTab === 'upcoming'
//                 ? 'bg-purple-100'
//                 : activeTab === 'completed'
//                 ? 'bg-green-100'
//                 : 'bg-red-100'
//             } justify-center items-center`}
//           >
//             <Ionicons
//               name="chevron-forward"
//               size={16}
//               color={
//                 activeTab === 'upcoming'
//                   ? '#7C3AED'
//                   : activeTab === 'completed'
//                   ? '#16A34A'
//                   : '#DC2626'
//               }
//             />
//           </View>
//           <Text className="text-xl font-semibold text-gray-900 mr-3">
//             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//           </Text>
//         </View>
//         <View className="p-6 flex-1 justify-center items-center">
//           <Text className="text-gray-500 text-base">
//             No {activeTab} bookings found
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] mb-2">
//       {/* Header */}
//       <View className="border-b border-gray-200 px-6 py-4 flex-row items-center space-x-3">
//         <View
//           className={`w-8 h-8 rounded-lg ${
//             activeTab === 'upcoming'
//               ? 'bg-purple-100'
//               : activeTab === 'completed'
//               ? 'bg-green-100'
//               : 'bg-red-100'
//           } justify-center items-center`}
//         >
//           <Ionicons
//             name="chevron-forward"
//             size={16}
//             color={
//               activeTab === 'upcoming'
//                 ? '#7C3AED'
//                 : activeTab === 'completed'
//                 ? '#16A34A'
//                 : '#DC2626'
//               }
//           />
//         </View>
//         <Text className="text-xl font-semibold text-gray-900 ml-2">
//           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//         </Text>
//       </View>

//       {/* Bookings list */}
//       <View className="p-6 space-y-4">
//         {sortedBookings.map((bookingData) => {
//           const isCancelled = ['cancelled', 'declined'].includes(
//             bookingData.booking.status.toLowerCase()
//           );

//           return (
//             <TouchableOpacity
//               key={bookingData.booking._id}
//               className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 ${
//                 isCancelled ? 'opacity-80' : ''
//               } mb-2`}
//               onPress={() => {
//                 if (!isCancelled) {
//                   onBookingSelect(bookingData);
//                 }
//               }}
//               disabled={isCancelled}
//             >
//               <View className="flex-row items-center space-x-4 gap-2 ">
//                 {/* Service image */}
//                 <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
//                   <Image
//                     source={{
//                       uri:
//                         bookingData.service?.serviceImg ||
//                         bookingData.technician?.profileImage ||
//                         'https://via.placeholder.com/64',
//                     }}
//                     className="w-full h-full"
//                     resizeMode="cover"
//                   />
//                 </View>

//                 {/* Booking details */}
//                 <View className="flex-1 min-w-0">
//                   <Text className="font-semibold text-gray-900 text-lg truncate">
//                     {bookingData.service?.serviceName || 'Service not specified'}
//                   </Text>
//                   <Text className="text-gray-500 text-sm truncate">
//                     User Name:{' '}
//                     <Text className="text-gray-900">
//                       {bookingData?.user?.username || 'Unknown User'}
//                     </Text>
//                   </Text>

//                   {/* Status & Date */}
//                   <View className="flex-row items-center justify-between mt-2">
//                     <View
//                       className={`px-3 py-1 rounded-full ${
//                         activeTab === 'upcoming'
//                           ? 'bg-purple-100'
//                           : activeTab === 'completed'
//                           ? 'bg-green-100'
//                           : 'bg-red-100'
//                       }`}
//                     >
//                       <Text
//                         className={`text-xs font-medium ${
//                           activeTab === 'upcoming'
//                             ? 'text-purple-600'
//                             : activeTab === 'completed'
//                             ? 'text-green-600'
//                             : 'text-red-600'
//                         }`}
//                       >
//                         {bookingData.booking.status.charAt(0).toUpperCase() +
//                           bookingData.booking.status.slice(1).toLowerCase()}
//                       </Text>
//                     </View>
//                     <Text className="text-gray-400 text-xs">
//                       {new Date(bookingData.booking.bookingDate).toLocaleDateString()}
//                     </Text>
//                   </View>

//                   {/* Price & Quantity */}
//                   <Text className="mt-2 text-sm text-gray-700">
//                     ₹{' '}
//                     <Text className="text-blue-500">
//                       {bookingData.booking.totalPrice.toFixed(2)}
//                     </Text>{' '}
//                     • {bookingData.booking.quantity}{' '}
//                     {bookingData.booking.quantity > 1 ? 'services' : 'service'}
//                   </Text>
//                 </View>

//                 {/* Arrow only if clickable */}
//                 {!isCancelled && (
//                   <Ionicons
//                     name="chevron-forward"
//                     size={20}
//                     color="#9CA3AF"
//                   />
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// };

// export default BookingsList;