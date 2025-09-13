import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Star } from 'react-native-feather';
import { getCompanyReviews } from '../../api/apiMethods';

// Define the Review interface
interface Review {
  _id: string;
  userId?: string;
  technicianId?: string;
  role: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  reviewer: {
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
  } | null;
}

const { width } = Dimensions.get('window');

const CustomerReviewCarousel: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const reviewsPerPage: number = 1; // Single review per screen for mobile
  const flatListRef = useRef<FlatList>(null);

  const fetchCompanyReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyReviews();
      if (response?.success && response.result?.length > 0) {
        setReviews(response.result);
      } else {
        setError('No reviews available at the moment.');
      }
    } catch (error) {
      setError((error as any)?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyReviews();
  }, []);

  const pageCount: number = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    if (pageCount <= 1 || isLoading || reviews.length === 0) return;

    const interval = setInterval(() => {
      setPage((prev) => {
        const nextPage = (prev + 1) % pageCount;
        // Ensure scrollToIndex is called only when FlatList is ready
        if (flatListRef.current) {
          try {
            flatListRef.current.scrollToIndex({
              index: nextPage,
              animated: true,
            });
          } catch (e) {
            console.warn('Scroll to index failed:', e);
          }
        }
        return nextPage;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [pageCount, isLoading, reviews.length]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / width);
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const renderReview = ({ item, index }: { item: Review; index: number }) => (
    <View
      key={`${item._id}-${index}`}
      className="shadow-md border-gray-300 border bg-white p-6 rounded-2xl mx-3 my-4 w-[90%] items-center"
      style={{ width: width * 0.9 }}
    >
      <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
        <Star className='w-5 h-5 text-yellow-500' />
      </View>
      <Text className="font-bold text-xl text-gray-900 text-center mb-2">
        {item.reviewer?.username || 'Anonymous'}
      </Text>
      <Text className="text-gray-500 text-sm text-center capitalize mb-4">
        {item.role}
      </Text>
      <View className="flex-row justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={24}
            fill={i < item.rating ? '#facc15' : 'none'}
            stroke={i < item.rating ? '#facc15' : '#d1d5db'}
            className="mx-1"
          />
        ))}
      </View>
      <Text
        className="text-gray-600 text-base text-center px-2"
        numberOfLines={5}
        ellipsizeMode="tail"
      >
        <Text className="text-gray-300">“</Text> {item.comment}{' '}
        <Text className="text-gray-300">”</Text>
      </Text>
    </View>
  );

  return (
    <View className="flex-1 justify-center items-center">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-red-50 p-6 rounded-lg shadow-md items-center">
            <Text className="text-lg font-semibold text-red-600 text-center mb-4">
              {error}
            </Text>
            <TouchableOpacity
              className="px-4 py-2 bg-blue-600 rounded-lg"
              onPress={fetchCompanyReviews}
            >
              <Text className="text-white text-center font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item._id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width}
            decelerationRate="fast"
            className="flex-1"
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            onScrollToIndexFailed={(info) => {
              // Fallback for scrollToIndex failure
              console.warn('Scroll to index failed, retrying:', info);
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              }, 100);
            }}
          />
          {pageCount > 1 && (
            <View className="flex-row justify-center mt-4 mb-8">
              {Array.from({ length: pageCount }).map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    idx === page ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                  }`}
                  onPress={() => {
                    setPage(idx);
                    flatListRef.current?.scrollToIndex({
                      index: idx,
                      animated: true,
                    });
                  }}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const CustomerReviews: React.FC = () => {
  return (
    <View className="py-8 bg-gradient-to-b from-gray-50 to-gray-100 flex-1">
      <View className="px-4">
        <Text className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          What Our Customers Say
        </Text>
        <CustomerReviewCarousel />
      </View>
    </View>
  );
};

export default CustomerReviews;
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
// import { getCompanyReviews } from '../../api/apiMethods';
// import { Feather, Star } from 'react-native-feather';

// // Define the Review interface
// interface Review {
//   _id: string;
//   userId?: string;
//   technicianId?: string;
//   role: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
//   reviewer: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     role: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     createdAt: string;
//     updatedAt: string;
//   } | null;
// }

// const { width } = Dimensions.get('window');

// const CustomerReviewCarousel: React.FC = () => {
//   const [page, setPage] = useState<number>(0);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const reviewsPerPage: number = 1; // Single review per screen for mobile

//   const fetchCompanyReviews = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await getCompanyReviews();
//       if (response?.success && response.result?.length > 0) {
//         setReviews(response.result);
//       } else {
//         setError('No reviews available at the moment.');
//       }
//     } catch (error) {
//       setError((error as any)?.message || 'An error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyReviews();
//   }, []);

//   const pageCount: number = Math.ceil(reviews.length / reviewsPerPage);

//   useEffect(() => {
//     if (pageCount <= 1) return;

//     const interval = setInterval(() => {
//       setPage((prev) => (prev + 1) % pageCount);
//     }, 6000);

//     return () => clearInterval(interval);
//   }, [pageCount]);

//   const renderReview = ({ item, index }: { item: Review; index: number }) => (
//     <View
//       key={`${item._id}-${index}`}
//       className="bg-white p-6 rounded-2xl shadow-md mx-4 my-2 w-[90%]"
//     >
//       <View className="flex items-center mb-4">
//         <View className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
//           <Star color="#000" size={24} />
//         </View>
//       </View>
//       <Text className="font-bold text-xl text-gray-900 text-center">
//         {item.reviewer?.username || 'Anonymous'}
//       </Text>
//       <Text className="text-gray-500 text-sm text-center capitalize mb-4">
//         {item.role}
//       </Text>
//       <View className="flex-row justify-center mb-4">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             size={22}
//             fill={i < item.rating ? '#facc15' : 'none'}
//             stroke={i < item.rating ? '#facc15' : '#d1d5db'}
//             className="mx-1"
//           />
//         ))}
//       </View>
//       <Text className="text-gray-600 text-base text-center">
//         <Text className="text-gray-300">“</Text> {item.comment}{' '}
//         <Text className="text-gray-300">”</Text>
//       </Text>
//     </View>
//   );

//   return (
//     <View className="flex-1 justify-center items-center">
//       {isLoading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#2563eb" />
//         </View>
//       ) : error ? (
//         <View className="flex-1 justify-center items-center">
//           <View className="bg-red-50 p-6 rounded-lg shadow-md">
//             <Text className="text-lg font-semibold text-red-600 text-center">
//               {error}
//             </Text>
//             {/* <TouchableOpacity
//               className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
//               onPress={fetchCompanyReviews}
//             >
//               <Text className="text-white text-center">Retry</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={reviews}
//             renderItem={renderReview}
//             keyExtractor={(item) => item._id}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onMomentumScrollEnd={(e) => {
//               const newPage = Math.floor(e.nativeEvent.contentOffset.x / width);
//               setPage(newPage);
//             }}
//             className="flex-1"
//           />
//           <View className="flex-row justify-center mt-4 mb-8">
//             {Array.from({ length: pageCount }).map((_, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 className={`w-3 h-3 rounded-full mx-1 ${
//                   idx === page ? 'bg-blue-600 scale-125' : 'bg-gray-300'
//                 }`}
//                 onPress={() => setPage(idx)}
//               />
//             ))}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const CustomerReviews: React.FC = () => {
//   return (
//     <View className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 flex-1">
//       <View className="px-4">
//         <Text className="text-3xl font-extrabold text-gray-900 text-center mb-6">
//           What Our Customers Say
//         </Text>
//         <CustomerReviewCarousel />
//       </View>
//     </View>
//   );
// };

// export default CustomerReviews;