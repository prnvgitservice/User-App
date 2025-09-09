import React, { act, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("Overview");

  const FILTERS = ["Overview", "Photos", "Services", "Reviews"];

  const renderContent = () => {
    if (activeTab === "Overview") {
      return (
        <View className="py-4">
          return (
          <View>    
            <Photos images={technicianImages} />
            <Services services={services} technician={technician} />
            <Reviews ratings={ratings} />
          </View>
          );
        </View>
      );
    }
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
    <View className="mb-3 mt-8 flex-col gap-3 p-2">
      <View className="">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
          {FILTERS.map((item) => (
            <TouchableOpacity
              className={`border-2 rounded-xl py-1 px-5 text-md font-light ${
                activeTab === item ? "bg-purple-500 text-white border-purple-600" : "border-gray-400"
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