import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";

interface PhotosProps {
  images: string[];
}

const Photos = ({ images }: PhotosProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleImages = showAll ? images : images?.slice(0, 6);

  const renderImage = ({ item }: { item: string }) => (
    <View className="relative">
      <Image
      // source="https://res.cloudinary.com/dkfjl3blf/image/upload/v1756877369/TechUploadedPhotos/zbqnyxnfil9eyc5rpn7i.jpg"
        source={{ uri: item || "https://res.cloudinary.com/dkfjl3blf/image/upload/v1756877369/TechUploadedPhotos/zbqnyxnfil9eyc5rpn7i.jpg" }}
        // className="w-full h-36 object-cover rounded-lg"
        style={{ width: 100, height: 100, borderRadius: 10 }}
         resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="border border-gray-300 shadow-xs rounded-xl p-4">
      <Text className="text-xl font-bold mb-4">Photos</Text>
      {visibleImages && visibleImages?.length > 0 ? (
       
        <FlatList
          data={visibleImages}
          renderItem={renderImage}
          keyExtractor={(item) => item}
          numColumns={3}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
        />
      ) : (
        <Text className="text-gray-500">No images available</Text>
      )}
      {images?.length > 6 && (
        <TouchableOpacity
          className="flex justify-center mt-4 text-blue-600 text-sm"
          onPress={() => setShowAll(!showAll)}
        >
          <Text className="text-center">{showAll ? "View Less" : "View More"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Photos;