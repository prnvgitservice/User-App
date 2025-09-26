import React, { useState } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Rating } from "../../screens/TechnicianProfile";

interface ReviewsProps {
  ratings: Rating[];
}

const Reviews = ({ ratings }: ReviewsProps) => {
  const [visibleReviews, setVisibleReviews] = useState(ratings.slice(0, 4)); // Initially show 3-4 reviews
  const [page, setPage] = useState(1);
  const reviewsPerPage = 3;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadMoreReviews = () => {
    const nextPage = page + 1;
    const newReviews = ratings.slice(0, nextPage * reviewsPerPage);
    setVisibleReviews(newReviews);
    setPage(nextPage);
  };

  const renderReview = ({ item }: { item: Rating }) => (
    <View className="flex-col justify-between items-start border border-gray-300 rounded-xl p-4 mb-3">
      <View className="flex-row gap-3 items-center">
        <Image
          source={{
            uri:
              item.image ||
              "https://i.pinimg.com/736x/21/24/92/21249201424022cdd93cd144f099b056.jpg",
          }}
          className="w-14 h-14 object-cover rounded-full"
        />
        <View className="flex-col gap-1">
          <Text className="text-md font-semibold">{item.username}</Text>
          <Text className="text-sm text-gray-500">
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      <View className="flex-row ms-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <AntDesign
            name="star"
            key={i}
            size={20}
            color={i < item.rating ? "#ffc71b" : "#ddd"}
          />
        ))}
      </View>
      <Text className="my-3 text-sm font-light ml-2 text-gray-600">
        {item.review || "No review provided"}
      </Text>
    </View>
  );

  return (
    <View className="border border-gray-300 shadow-xs rounded-xl p-4 max-h-[45vh]">
      <Text className="text-xl font-bold mb-3">Reviews</Text>

      {ratings?.length === 0 ? (
        <Text className="text-gray-600">No reviews available</Text>
      ) : (
        <FlatList
          data={ratings}
          renderItem={renderReview}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text className="text-gray-700">No reviews available</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Reviews;
// import React from "react";
// import { View, Text, Image, FlatList } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import { Rating } from "../../screens/TechnicianProfile";

// interface ReviewsProps {
//   ratings: Rating[];
// }

// const Reviews = ({ ratings }: ReviewsProps) => {
//   console.log("Reviews component ratings:", ratings);
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const renderReview = ({ item }: { item: Rating }) => (
//     <View className="border border-gray-200 shadow rounded-xl p-3 flex-col">
//       <View className="flex-row gap-3 items-center">
//         <Image
//           source={{
//             uri:
//               item.image ||
//               "https://i.pinimg.com/736x/21/24/92/21249201424022cdd93cd144f099b056.jpg",
//           }}
//           className="w-14 h-14 object-cover rounded-full"
//         />
//         <View className="flex-col">
//           <Text className="text-md font-light">{item.username}</Text>
//           <Text className="text-sm text-gray-500">
//             {formatDate(item.createdAt)}
//           </Text>
//         </View>
//       </View>

//       <View className="flex-row ms-1 mt-2">
//         {[...Array(5)].map((_, i) => (
//           <AntDesign
//             name="star"
//             key={i}
//             size={20}
//             color={i < item.rating ? "#ffc71b" : "#ddd"}
//           />
//         ))}
//       </View>
//       <Text className="my-3 text-sm font-light ml-2 text-gray-600">
//         {item.review || "No review provided"}
//       </Text>
//     </View>
//   );

//   return (
//     <View className="border border-gray-300 shadow-xs rounded-xl p-4 max-h-[80vh]">
//       <Text className="text-xl font-bold">Reviews</Text>

//       {ratings?.length === 0 ? (
//         <Text className="text-gray-600">No reviews available</Text>
//       ) : (
//         <FlatList
//           data={ratings}
//           renderItem={renderReview}
//           keyExtractor={(item) => item._id}
//           numColumns={1}
//           contentContainerStyle={{ paddingBottom: 16 }}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// export default Reviews;
