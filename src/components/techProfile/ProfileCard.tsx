import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Technician, Rating } from "../../screens/TechnicianProfile";
import FinalRatingScreen from "../transaction/FinalRatingScreen";
import { Clipboard } from "react-native-feather";

interface ProfileCardProps {
  technician: Technician;
  ratings: Rating[];
}

const ProfileCard = ({ technician, ratings }: ProfileCardProps) => {
  const reviewCount = ratings.length || "3";
  const averageRating =
    ratings && ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : "4";

  const openWhatsApp = (number: number, message: string) => {
    const url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => alert("WhatsApp is not installed"));
  };

  const handleShare = async () => {
    const shareUrl = `https://prnvservices.com/technicianById/${technician._id}`;

    const shareText = `${technician.username} - Expert Technician
Rated ${averageRating} ★ | ${reviewCount} Reviews
Location: ${technician.city}, ${technician.state}
Check out the profile: ${shareUrl}`;

    try {
      // Try native share sheet
      const result = await Share.share({
        message: shareText,
        title: `${technician.username}'s Profile`,
        url: shareUrl, // iOS uses this
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          Alert.alert("Shared!", "Profile details shared successfully.");
        }
      } else if (result.action === Share.dismissedAction) {
        Alert.alert("Share dismissed", "You dismissed the share dialog.");
      }
    } catch (error) {
      // Fallback: copy to clipboard
      Clipboard.setString(shareText);
      Alert.alert(
        "Copied!",
        "Profile details copied to clipboard. Paste to share."
      );
    }
  };

  return (
    <View className="border border-gray-300 rounded-xl p-5 flex-col relative overflow-hidden">
      <View className="flex-col items-center mb-4 w-full">
        <Image
          source={{
            uri:
              technician.profileImage ||
              "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg",
          }}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </View>
      <View className="">
        <Text className="text-xl font-semibold truncate">
          {technician.username || "Unknown Technician"}
        </Text>
        <View className="flex-row items-center gap-4 my-3">
          <View className="flex-row items-center border border-yellow-500 rounded-lg px-2 py-1">
            <Text>{averageRating}</Text>
            <AntDesign name="star" size={15} color="#ffc71b" className="ml-1" />

          </View>
          <Text className="text-gray-600 text-sm font-light">
            {reviewCount} Ratings
          </Text>
        </View>
        {technician.service && (
          <View className="flex-row gap-2">
            <Text className="bg-pink-200 px-3 py-1 rounded-xl text-black text-sm font-light">
              {technician.service}
            </Text>
          </View>
        )}

        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={27} color="red" />
          <Text className="text-sm font-light ml-2">
            {[
              technician.buildingName,
              technician.areaName,
              technician.city,
              technician.state,
            ]
              .filter(Boolean)
              .join(", ") || "Location not available"}
          </Text>
        </View>
        {technician.description && (
          <View className="flex-row items-center">
            <FontAwesome name="thumbs-up" size={22} color="#00B800" />
            <Text className="text-sm font-light ml-2">
              {technician.description}
            </Text>
          </View>
        )}

        <View className="flex-row gap-4 mt-4">
          <TouchableOpacity
            className="flex-row items-center bg-green-600 rounded-xl text-white px-4 py-1"
            onPress={() =>
              openWhatsApp(
                +919603558369,
                "Hello, I am interested in your services"
              )
            }
          >
            <Ionicons
              name="logo-whatsapp"
              size={18}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-bold">WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center bg-blue-500 rounded-xl text-white px-4 py-1"
            onPress={handleShare}
          >
            <Ionicons
              name="share-social"
              size={18}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-bold">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;
