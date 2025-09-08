import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Photos from "./Photos";
import Services from "./Services";
import Reviews from "./Reviews";
import { Technician, TechnicianService, Rating } from "../../screens/TechnicianProfile";

interface AllFiltersProps {
  services: TechnicianService[];
  technician: Technician;
  technicianImages: string[];
  ratings: Rating[];
}

const AllFilters = ({ services, technicianImages, ratings, technician }: AllFiltersProps) => {
  const [activeTab, setActiveTab] = useState("Photos");

  const FILTERS = ["Photos", "Services", "Reviews"];

  const renderContent = () => {
    switch (activeTab) {
      case "Photos":
        return <Photos images={technicianImages} />;
      case "Services":
        return <Services services={services} technician={technician} />;
      case "Reviews":
        return <Reviews ratings={ratings} />;
      default:
        return null;
    }
  };

  return (
    <View className="mb-4 mt-8 flex-col gap-3 p-2">
      <View className="flex-1">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
          {FILTERS.map((item) => (
            <TouchableOpacity
              className={`border-2 rounded-xl py-1 px-6 text-md font-light shadow ${
                activeTab === item ? "bg-purple-500 text-white border-pink-800" : "border-gray-400"
              }`}
              key={item}
              onPress={() => setActiveTab(item)}
            >
              <Text className={`${activeTab === item ? "text-white" : "text-black"}`}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="my-5">{renderContent()}</View>
      </View>
    </View>
  );
};

export default AllFilters;