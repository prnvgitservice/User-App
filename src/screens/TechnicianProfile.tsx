import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getAllTechnicianDetails } from "../api/apiMethods";
import ProfileCard from "../components/techProfile/ProfileCard";
import AllFilters from "../components/techProfile/AllFilters";

export interface Technician {
  _id: string;
  username: string;
  phoneNumber: string;
  service?: string;
  city: string;
  state: string;
  pincode: string;
  profileImage: string;
  description?: string;
  areaName?: string;
  buildingName?: string;
}

export interface CategoryService {
  _id: string;
  categoryId: string;
  status: boolean;
  details: TechnicianService;
}

export interface TechnicianService {
  _id: string;
  categoryId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TechnicianImages {
  _id: string;
  technicianId: string;
  imageUrl: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Rating {
  _id: string;
  userId: string;
  serviceId: string;
  review: string;
  rating: number;
  createdAt: string;
  name?: string;
  image?: string;
}

export interface TechnicianDetailsResponse {
  technician: Technician;
  categoryServices?: CategoryService[];
  services: TechnicianService[];
  technicianImages: TechnicianImages | null;
  ratings: Rating[] | null;
}

const TechnicianProfile = () => {
  const route = useRoute();
  const { technicianId } = (route.params as { technicianId?: string }) || {};
  const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetailsResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTechAllDetails = async () => {
      if (!technicianId) {
        setError("Technician ID is missing. Please try again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAllTechnicianDetails(technicianId);
        if (response?.success && response.result) {
          setTechnicianDetails(response.result);
          setError("");
        } else {
          setError("Failed to load technician details. Invalid response format.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching technician details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechAllDetails();
  }, [technicianId]);

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-center text-lg mt-4 text-blue-600">Loading...</Text>
        </View>
      ) : error || !technicianDetails ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-600 text-center text-lg">{error || "No technician details available."}</Text>
        </View>
      ) : (
        <View className="bg-gray-100 px-4 pt-4 flex-1">
          <ProfileCard
            technician={technicianDetails.technician}
            ratings={technicianDetails.ratings || []}
          />
          <AllFilters
            services={technicianDetails.services}
            technician={technicianDetails.technician}
            technicianImages={technicianDetails.technicianImages?.imageUrl || []}
            ratings={technicianDetails.ratings || []}
          />
        </View>
      )}
    </View>
  );
};
// const TechnicianProfile = () => {
//   const route = useRoute();
//   const { technicianId } = (route.params as { technicianId?: string }) || {};
//   const [technicianDetails, setTechnicianDetails] =
//     useState<TechnicianDetailsResponse | null>(null);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchTechAllDetails = async () => {
//       if (!technicianId) {
//         setError("Technician ID is missing. Please try again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await getAllTechnicianDetails(technicianId);
//         if (response?.success && response.result) {
//           setTechnicianDetails(response.result);
//           setError("");
//         } else {
//           setError("Failed to load technician details. Invalid response format.");
//         }
//       } catch (err: any) {
//         setError(
//           err.message || "An error occurred while fetching technician details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTechAllDetails();
//   }, [technicianId]);

//   return (
//     <View className="flex-1 bg-white">
//       {loading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text className="text-center text-lg mt-4 text-blue-600">
//             Loading...
//           </Text>
//         </View>
//       ) : error || !technicianDetails ? (
//         <View className="flex-1 justify-center items-center">
//           <Text className="text-red-600 text-center text-lg">
//             {error || "No technician details available."}
//           </Text>
//         </View>
//       ) : (
//         <View className=" bg-gray-100 px-4 pt-4 flex-1">
//           <ProfileCard
//             technician={technicianDetails.technician}
//             ratings={technicianDetails.ratings || []}
//           />
//           <AllFilters
//             services={technicianDetails.services}
//             technician={technicianDetails.technician}
//             technicianImages={technicianDetails.technicianImages?.imageUrl || []}
//             ratings={technicianDetails.ratings || []}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

export default TechnicianProfile;

// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { getAllTechnicianDetails } from "../api/apiMethods";
// import ProfileCard from "../components/techProfile/ProfileCard";
// import AllFilters from "../components/techProfile/AllFilters";

// export interface Technician {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   service?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage: string;
//   description?: string;
//   areaName?: string;
//   buildingName?: string;
// }

// export interface CategoryService {
//   _id: string;
//   categoryId: string;
//   status: boolean;
//   details: TechnicianService;
// }

// export interface TechnicianService {
//   _id: string;
//   categoryId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface TechnicianImages {
//   _id: string;
//   technicianId: string;
//   imageUrl: string[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface Rating {
//   _id: string;
//   userId: string;
//   serviceId: string;
//   review: string;
//   rating: number;
//   createdAt: string;
//   name?: string;
//   image?: string;
// }

// export interface TechnicianDetailsResponse {
//   technician: Technician;
//   categoryServices?: CategoryService[];
//   services: TechnicianService[];
//   technicianImages: TechnicianImages | null;
//   ratings: Rating | Rating[] | null;
// }

// const TechnicianProfile = () => {
//   const route = useRoute();
//   const { technicianId } = (route.params as { technicianId?: string }) || {};
//   const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetailsResponse | null>(null);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchTechAllDetails = async () => {
//       if (!technicianId) {
//         setError("Technician ID is missing. Please try again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await getAllTechnicianDetails(technicianId);
//         console.log("Technician Details Response:", response);
//         if (response?.success && response.result) {
//           const result = response.result;
//           // const derivedServices = result.services?.length > 0
//           //   ? result.services
//           //   : (result.technician?.categoryServices || [])
//           //       .filter((c: CategoryService) => c.status && c.details)
//           //       .map((c: CategoryService) => ({
//           //         ...c.details,
//           //         _id: c.details._id || c.categoryServiceId, // Ensure _id is present
//           //       }));
          
//           setTechnicianDetails(result);
//           setError("");
//         } else {
//           setError("Failed to load technician details. Invalid response format.");
//         }
//       } catch (err: any) {
//         setError(err.message || "An error occurred while fetching technician details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTechAllDetails();
//   }, [technicianId]);

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text className="text-center text-lg mt-4 text-blue-600">Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (error || !technicianDetails) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-white">
//         <Text className="text-red-600 text-center text-lg">
//           {error || "No technician details available."}
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 ">
//       <View className="flex-1 bg-gray-100 px-4 pt-4">
//         <ProfileCard technician={technicianDetails.technician} ratings={technicianDetails.ratings} />
//         <AllFilters
//           services={technicianDetails.services}
//           technician={technicianDetails.technician}
//           technicianImages={technicianDetails.technicianImages?.imageUrl || []}
//           ratings={technicianDetails.ratings}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default TechnicianProfile;

// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { getAllTechnicianDetails } from '../api/apiMethods';
// import ProfileCard from '../components/techProfile/ProfileCard';
// import AllFilters from '../components/techProfile/AllFilters';

// export interface Technician {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   service: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage: string;
//   description?: string;
//   areaName?: string;
//   buildingName?: string;
// }

// export interface TechnicianService {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
// }

// export interface TechnicianImages {
//   imageUrl: string[];
// }

// export interface Rating {
//   _id: string;
//   userId: string;
//   serviceId: string;
//   review: string;
//   rating: number;
//   createdAt: string;
//   name?: string; // Added based on usage in Reviews
//   image?: string; // Added based on usage in Reviews
// }

// export interface TechnicianDetailsResponse {
//   technician: Technician;
//   services: TechnicianService[];
//   technicianImages: TechnicianImages;
//   ratings: Rating | Rating[]; // Updated to match props in AllFilters
// }

// const TechnicianProfile = () => {
//   const route = useRoute();
//   const { technicianId } = route.params as { technicianId: string };
//   const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetailsResponse | null>(null);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     const fetchTechAllDetails = async () => {
//       try {
//         const response = await getAllTechnicianDetails(technicianId);
//         if (response?.success === true) {
//           setTechnicianDetails(response.result);
//         } else {
//           setError('Invalid response format');
//         }
//       } catch (err: any) {
//         setError(err.message || 'Failed to fetch technician details');
//       }
//     };

//     if (technicianId) fetchTechAllDetails();
//   }, [technicianId]);

//   if (error) return (
//     <View className="flex-1 justify-center items-center">
//       <Text className="text-red-500 text-center text-lg">{error}</Text>
//     </View>
//   );

//   if (!technicianDetails) return (
//     <View className="flex-1 justify-center items-center">
//       <ActivityIndicator size="large" color="#0000ff" />
//       <Text className="text-center text-lg mt-4">Loading...</Text>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-gray-100 px-4 pt-4">
//       <ProfileCard technician={technicianDetails.technician} />
//       <AllFilters
//         services={technicianDetails.services}
//         technician={technicianDetails.technician}
//         technicianImages={technicianDetails.technicianImages.imageUrl}
//         ratings={technicianDetails.ratings}
//       />
//     </View>
//   );
// };

// export default TechnicianProfile;
// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const TechnicianProfile = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const tech = route.params?.tech;

//   if (!tech) {
//     return (
//       <View style={styles.container}>
//         <Text>No technician data found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backArrow}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Technician Profile</Text>
//         <View style={{ width: 32 }} />
//       </View>
//       <Image source={{ uri: tech.image }} style={styles.image} />
//       <Text style={styles.title}>{String(tech.name)}</Text>
//       <Text style={styles.detail}>Category: {String(tech.category)}</Text>
//       <Text style={styles.detail}>Pincode: {String(tech.pincode)}</Text>
//       <Text style={styles.detail}>Area: {String(tech.area)}</Text>
//       <Text style={styles.detail}>Place: {String(tech.place)}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     marginTop: 40,
//     marginBottom: 16,
//   },
//   backArrow: { fontSize: 28, marginRight: 12 },
//   headerTitle: { flex: 1, fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#222' },
//   image: { width: 100, height: 100, borderRadius: 20, marginBottom: 12 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
//   detail: { color: '#888', fontSize: 15, marginBottom: 2 },
// });

// export default TechnicianProfile;
