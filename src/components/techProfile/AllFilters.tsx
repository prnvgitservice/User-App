import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Photos from "./Photos";
import Services from "./Services";
import Reviews from "./Reviews";
import {
  Technician,
  TechnicianService,
  Rating,
} from "../../screens/TechnicianProfile";

interface AllFiltersProps {
  services: TechnicianService[];
  technician: Technician;
  technicianImages: string[];
  ratings: Rating[];
}

type TabType = "Overview" | "Photos" | "Services" | "Reviews";

const FILTERS: TabType[] = ["Overview", "Photos", "Services", "Reviews"];

/** Tab Button Component */
const TabButton = React.memo(
  ({
    label,
    isActive,
    onPress,
  }: {
    label: TabType;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className={`border-2 rounded-xl py-2 px-5 mx-1 ${
        isActive ? "bg-purple-500 border-purple-600" : "border-gray-400"
      }`}
      onPress={onPress}
    >
      <Text className={isActive ? "text-white font-medium" : "text-black"}>
        {label}
      </Text>
    </TouchableOpacity>
  )
);

const AllFilters = ({
  services,
  technician,
  technicianImages,
  ratings,
}: AllFiltersProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  /** Render tab content memoized */
//   const content = useMemo(() => {
//     switch (activeTab) {
//       case "Overview":
//         return (
//  <ScrollView 
//       className="flex-col gap-4" 
//       showsVerticalScrollIndicator={true}
//     >
//       <Photos images={technicianImages} />
//       <Services services={services} technician={technician} />
//       <Reviews ratings={ratings} />
//     </ScrollView>

          
//         );
//       case "Photos":
//         return <Photos images={technicianImages} />;
//       case "Services":
//         return <Services services={services} technician={technician} />;
//       case "Reviews":
//         return <Reviews ratings={ratings} />;
//       default:
//         return null;
//     }
//   }, [activeTab, services, technician, technicianImages, ratings]);

const content = useMemo(() => {
  switch (activeTab) {
    case "Overview":
      return (
        <ScrollView
          className="flex-col gap-4" 
          showsVerticalScrollIndicator={true}
        >
          <Photos images={technicianImages} />
          <Services services={services} technician={technician} />
          <Reviews ratings={ratings} />
        </ScrollView>
      );
    case "Photos":
      return <Photos images={technicianImages} />;
    case "Services":
      return <Services services={services} technician={technician} />;
    case "Reviews":
      return <Reviews ratings={ratings} />;
    default:
      return null;
  }
}, [activeTab, services, technician, technicianImages, ratings]);


  /** Render Tab Buttons */
  const renderTab = useCallback(
    ({ item }: { item: TabType }) => (
      <TabButton
        label={item}
        isActive={activeTab === item}
        onPress={() => setActiveTab(item)}
      />
    ),
    [activeTab]
  );

  return (
    <View className=" mt-8  flex-col gap-1 p-2">
     
      <FlatList
        data={FILTERS}
        renderItem={renderTab}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />

      <View className="my-5">{content}</View>
    </View>
  );
};

export default AllFilters;


// import React, { act, useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import Photos from "./Photos";
// import Services from "./Services";
// import Reviews from "./Reviews";
// import { Technician, TechnicianService, Rating } from "../../screens/TechnicianProfile";

// interface AllFiltersProps {
//   services: TechnicianService[];
//   technician: Technician;
//   technicianImages: string[];
//   ratings: Rating[];
// }

// const AllFilters = ({ services, technicianImages, ratings, technician }: AllFiltersProps) => {
//   const [activeTab, setActiveTab] = useState("Overview");

//   const FILTERS = ["Overview", "Photos", "Services", "Reviews"];

//   const renderContent = () => {
//     if (activeTab === "Overview") {
//       return (
//           <View>    
//             <Photos images={technicianImages} />
//             <Services services={services} technician={technician} />
//             <Reviews ratings={ratings} />
//           </View>
//       );
//     }
//     switch (activeTab) {
//       case "Photos":
//         return <Photos images={technicianImages} />;
//       case "Services":
//         return <Services services={services} technician={technician} />;
//       case "Reviews":
//         return <Reviews ratings={ratings} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <View className="mb-3 mt-8 flex-col gap-3 p-2">
//       <View className="">
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
//           {FILTERS.map((item) => (
//             <TouchableOpacity
//               className={`border-2 rounded-xl py-1 px-5 text-md font-light ${
//                 activeTab === item ? "bg-purple-500 text-white border-purple-600" : "border-gray-400"
//               }`}
//               key={item}
//               onPress={() => setActiveTab(item)}
//             >
//               <Text className={`${activeTab === item ? "text-white" : "text-black"}`}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View className="my-5">{renderContent()}</View>
//       </View>
//     </View>
//   );
// };

// export default AllFilters;