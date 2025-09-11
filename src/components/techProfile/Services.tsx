import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { addToCart, removeFromCart, getCartItems } from "../../api/apiMethods";
import { TechnicianService, Technician } from "../../screens/TechnicianProfile";

type RootStackParamList = {
  Login: undefined;
  Cart: undefined;
  // Add other screens as needed
};

interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceImg: string;
  quantity: number;
  technicianId: string;
}

interface ServicesProps {
  services: TechnicianService[];
  technician: Technician;
}

const Services = ({ services, technician }: ServicesProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /** Fetch Cart Items */
  const fetchCartItems = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your cart.");
        return;
      }

      const response = await getCartItems(userId);
      if (response.success && response.result?.cart) {
        const formattedItems = response.result.cart.map((item: any) => ({
          id: item.serviceId,
          serviceId: item.serviceId,
          serviceName: item.serviceName || "Unknown Service",
          servicePrice: item.servicePrice || 0,
          serviceImg: item.serviceImg || "https://via.placeholder.com/150",
          quantity: item.quantity,
          technicianId: item.technicianId,
        }));
        setCartItems(formattedItems);
        setError(null);
      } else {
        setCartItems([]);
        setError("No cart items found.");
      }
    } catch (err: any) {
      console.error("Error fetching cart items:", err);
      setError("Failed to fetch cart items. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  /** Add or Remove from Cart */
  const handleCartToggle = async (categoryServiceId: string) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const technicianId = technician?._id;
      if (!userId) {
        setError("Please log in to manage your cart.");
        navigation.navigate("Login");
        return;
      }

      setLoading((prev) => ({ ...prev, [categoryServiceId]: true }));
      const isInCart = cartItems.some((item) => item.id === categoryServiceId);

      if (isInCart) {
        const response = await removeFromCart({ userId, serviceId: categoryServiceId });
        if (response.success) {
          setCartItems((prev) => prev.filter((item) => item.id !== categoryServiceId));
        } else {
          throw new Error(
            response.errors?.join(", ") || "Failed to remove item from cart."
          );
        }
      } else {
        const service = technician?.categoryServices?.find(
          (s) => s.categoryServiceId === categoryServiceId && s.status === true
        );
        if (!service) {
          setError("Service is not available.");
          return;
        }

        const payload = { technicianId, userId, serviceId: categoryServiceId, quantity: 1 };
        const response = await addToCart(payload);
        if (response.success) {
          setCartItems((prev) => [
            ...prev,
            {
              id: service.categoryServiceId,
              serviceId: service.categoryServiceId,
              serviceName: service.details.serviceName,
              servicePrice: service.details.servicePrice,
              serviceImg: service.details.serviceImg,
              quantity: 1,
              technicianId,
            },
          ]);
        } else {
          throw new Error(
            response.errors?.join(", ") || "Failed to add item to cart."
          );
        }
      }
    } catch (err: any) {
      console.error("Error toggling cart item:", err);
      setError(err.message || "An error occurred while updating the cart.");
    } finally {
      setLoading((prev) => ({ ...prev, [categoryServiceId]: false }));
    }
  };

  /** Handle Image Error */
  const handleImageError = (serviceId: string) => {
    setImageErrors((prev) => ({ ...prev, [serviceId]: true }));
  };

  /** Render each service */
  const renderService = ({ item }: { item: TechnicianService }) => {
    const isInCart = cartItems.some(
      (cartItem) => cartItem.id === item.categoryServiceId
    );
    const isLoading = loading[item.categoryServiceId];
    const imageUri = imageErrors[item.categoryServiceId]
      ? "https://via.placeholder.com/150"
      : item.details?.serviceImg || "https://via.placeholder.com/150";

    return (
      <View
        key={item.categoryServiceId}
        className="flex-1 border border-gray-300 rounded-xl p-4 m-2 shadow-sm"
      >
        <View className="flex-1">
          <Text className="text-md font-semibold">{item.details?.serviceName}</Text>
          <Text className="text-sm text-gray-700">
            ₹ <Text className="text-blue-600">{item.details?.servicePrice}</Text>{" "}
            per Unit
          </Text>
          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons name="star-outline" size={18} color="#ffc71b" />
            <Text className="text-sm text-gray-700 ml-1">
              4.5 <Text className="text-gray-400">(25 Reviews)</Text>
            </Text>
          </View>
        </View>
        <View className="flex-col items-center gap-2 mt-2">
          <Image
            source={{ uri: imageUri }}
            className="w-28 h-28 object-cover rounded-md"
            onError={() => handleImageError(item.categoryServiceId)}
          />
          <TouchableOpacity
            className={`rounded-md px-3 py-1 flex-row items-center justify-center text-sm font-medium ${
              isInCart
                ? "text-red-600 border border-red-600"
                : "bg-red-600 text-white"
            } ${isLoading ? "opacity-50" : ""}`}
            onPress={() =>
              !isLoading && handleCartToggle(item.categoryServiceId)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <Text className="text-white">Processing...</Text>
            ) : isInCart ? (
              <>
                <MaterialCommunityIcons name="cart-remove" size={16} color="red" />
                <Text className="ml-2 text-red-600">Remove</Text>
              </>
            ) : (
              <>
                <FontAwesome name="cart-plus" size={16} color="white" />
                <Text className="ml-2 text-white">Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="border border-gray-200 shadow-md rounded-xl p-4 my-4 max-h-[calc(100vh-220px)]">
      {error && (
        <View className="mb-3 flex-row items-center">
          <Text className="text-red-600 text-sm">{error}</Text>
          {error.includes("log in") && (
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="ml-2 text-blue-600 underline">Log in</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 p-2">
        <Text className="text-2xl font-semibold">Services</Text>
        <TouchableOpacity
          className="flex-row items-center bg-green-600 px-3 py-1 rounded"
          onPress={() => navigation.navigate("Cart")}
        >
          <MaterialCommunityIcons name="eye" size={18} color="white" />
          <Text className="text-white ml-2 text-sm">View Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Services List (grid) */}
      <FlatList
        data={technician?.categoryServices?.filter(
          (service) => service.status === true && service.details
        )}
        renderItem={renderService}
        keyExtractor={(item) => item.categoryServiceId}
        numColumns={2}
        ListEmptyComponent={
          <Text className="text-gray-700">No services available</Text>
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

export default Services;
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
// import { addToCart, removeFromCart, getCartItems } from "../../api/apiMethods";
// import { TechnicianService, Technician } from "../../screens/TechnicianProfile";

// type RootStackParamList = {
//   Login: undefined;
//   // Add other screens as needed
// };

// interface CartItem {
//   id: string;
//   serviceId: string;
//   serviceName: string;
//   servicePrice: number;
//   serviceImg: string;
//   quantity: number;
//   technicianId: string;
// }

// interface ServicesProps {
//   services: TechnicianService[];
//   technician: Technician;
// }

// const Services = ({ services, technician }: ServicesProps) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
//   const [error, setError] = useState<string | null>(null);

//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   /** Fetch Cart Items */
//   const fetchCartItems = useCallback(async () => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to view your cart.");
//         return;
//       }

//       const response = await getCartItems(userId);
//       if (response.success && response.result?.items) {
//         const formattedItems = response.result.items.map((item: any) => ({
//           id: item.serviceId,
//           serviceId: item.serviceId,
//           serviceName: item.serviceName || "Unknown Service",
//           servicePrice: item.servicePrice || 0,
//           serviceImg: item.serviceImg || "https://via.placeholder.com/150",
//           quantity: item.quantity,
//           technicianId: item.technicianId,
//         }));
//         setCartItems(formattedItems);
//         setError(null);
//       } else {
//         setCartItems([]);
//         setError("No cart items found.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching cart items:", err);
//       setError("Failed to fetch cart items. Please try again.");
//     }
//   }, []);

//   useEffect(() => {
//     fetchCartItems();
//   }, [fetchCartItems]);

//   /** Add or Remove from Cart */
//   const handleCartToggle = async (serviceId: string) => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to manage your cart.");
//         navigation.navigate("Login");
//         return;
//       }

//       setLoading((prev) => ({ ...prev, [serviceId]: true }));
//       const isInCart = cartItems.some((item) => item.serviceId === serviceId);

//       if (isInCart) {
//         const response = await removeFromCart({ userId, serviceId });
//         if (response.success) {
//           await fetchCartItems();
//         } else {
//           throw new Error(
//             response.errors?.join(", ") || "Failed to remove item from cart."
//           );
//         }
//       } else {
//         const service = services.find((s) => s._id === serviceId);
//         if (!service) {
//           setError("Service is not available.");
//           return;
//         }

//         const payload = {
//           userId,
//           serviceId,
//           technicianId: technician._id,
//           quantity: 1,
//         };
//         const response = await addToCart(payload);
//         if (response.success) {
//           await fetchCartItems();
//         } else {
//           throw new Error(
//             response.errors?.join(", ") || "Failed to add item to cart."
//           );
//         }
//       }
//     } catch (err: any) {
//       console.error("Error toggling cart item:", err);
//       setError(err.message || "An error occurred while updating the cart.");
//     } finally {
//       setLoading((prev) => ({ ...prev, [serviceId]: false }));
//     }
//   };

//   /** Render each service */
//   const renderService = ({ item }: { item: TechnicianService }) => {
//     const isInCart = cartItems.some(
//       (cartItem) => cartItem.id === item.categoryServiceId
//     );
//     const isLoading = loading[item.categoryServiceId];

//     return (
//       <View
//         key={item.categoryServiceId}
//         className="flex-row justify-between items-center border border-gray-300 rounded-xl p-4 mb-3"
//       >
//         <View className="flex-1 flex-col gap-2 pr-3">
//           <Text className="text-lg font-bold">
//             {item.details?.serviceName}
//           </Text>
//           <Text className="text-sm text-gray-700">
//             ₹ <Text className="text-blue-600">{item.details?.servicePrice}</Text>{" "}
//             per Unit
//           </Text>
//         </View>

//         <View className="flex-col items-center gap-2">
//           <Image
//             source={{
//               uri: item.details?.serviceImg || "https://via.placeholder.com/150",
//             }}
//             className="w-28 h-28 object-cover rounded-md"
//           />
//           <TouchableOpacity
//             className={`rounded-md px-2 py-1 flex-row items-center justify-center text-sm font-medium ${
//               isInCart
//                 ? "text-red-600 border border-red-600"
//                 : "bg-red-600 text-white"
//             } ${isLoading ? "opacity-50" : ""}`}
//             onPress={() =>
//               !isLoading && handleCartToggle(item.categoryServiceId)
//             }
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : isInCart ? (
//               <>
//                 <MaterialCommunityIcons name="cart-remove" size={16} color="red" />
//                 <Text className="ml-2 text-red-600">Remove</Text>
//               </>
//             ) : (
//               <>
//                 <FontAwesome name="cart-plus" size={16} color="white" />
//                 <Text className="ml-2 text-white">Add to Cart</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View className="border border-gray-300 shadow-xs rounded-xl p-4 max-h-[45vh]">
//       {/* {error && <Text className="mb-3 text-red-600 text-sm">{error}</Text>} */}

//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-4">
//         <Text className="text-xl font-bold">Services</Text>
//         <TouchableOpacity className="flex-row items-center bg-green-600 px-2 py-1 rounded">
//           <MaterialCommunityIcons name="eye" size={18} color="white" />
//           <Text className="text-white ml-2">View Cart</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Services List (scrollable) */}
//       <FlatList
//         data={technician?.categoryServices?.filter(
//           (service) => service.status === true
//         )}
//         renderItem={renderService}
//         keyExtractor={(item) => item.categoryServiceId}
//         ListEmptyComponent={
//           <Text className="text-gray-700">No services available</Text>
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default Services;


// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
// import { addToCart, removeFromCart, getCartItems } from "../../api/apiMethods";
// import { TechnicianService, Technician } from "../../screens/TechnicianProfile";

// type RootStackParamList = {
//   Login: undefined;
//   // Add other screens as needed
// };

// interface CartItem {
//   id: string;
//   serviceId: string;
//   serviceName: string;
//   servicePrice: number;
//   serviceImg: string;
//   quantity: number;
//   technicianId: string;
// }

// interface ServicesProps {
//   services: TechnicianService[];
//   technician: Technician;
// }

// const Services = ({ services, technician }: ServicesProps) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
//   const [error, setError] = useState<string | null>(null);
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const fetchCartItems = async () => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to view your cart.");
//         return;
//       }

//       const response = await getCartItems(userId);
//       if (response.success && response.result?.items) {
//         const formattedItems = response.result.items.map((item: any) => ({
//           id: item.serviceId,
//           serviceId: item.serviceId,
//           serviceName: item.serviceName || "Unknown Service",
//           servicePrice: item.servicePrice || 0,
//           serviceImg: item.serviceImg || "https://via.placeholder.com/150",
//           quantity: item.quantity,
//           technicianId: item.technicianId,
//         }));
//         setCartItems(formattedItems);
//         setError(null);
//       } else {
//         setCartItems([]);
//         setError("No cart items found.");
//       }
//     } catch (error: any) {
//       console.error("Error fetching cart items:", error);
//       setError("Failed to fetch cart items. Please try again.");
//     }
//   };
//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const handleCartToggle = async (serviceId: string) => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to manage your cart.");
//         navigation.navigate("Login");
//         return;
//       }

//       setLoading((prev) => ({ ...prev, [serviceId]: true }));
//       const isInCart = cartItems.some((item) => item.serviceId === serviceId);

//       if (isInCart) {
//         const response = await removeFromCart({ userId, serviceId });
//         if (response.success) {
//           await fetchCartItems();
//         } else {
//           throw new Error(response.errors?.join(", ") || "Failed to remove item from cart.");
//         }
//       } else {
//         const service = services.find((s) => s._id === serviceId);
//         if (!service) {
//           setError("Service is not available.");
//           return;
//         }

//         const payload = {
//           userId,
//           serviceId,
//           technicianId: technician._id,
//           quantity: 1,
//         };
//         const response = await addToCart(payload);
//         if (response.success) {
//           await fetchCartItems();
//         } else {
//           throw new Error(response.errors?.join(", ") || "Failed to add item to cart.");
//         }
//       }
//     } catch (error: any) {
//       console.error("Error toggling cart item:", error);
//       setError(error.message || "An error occurred while updating the cart.");
//     } finally {
//       setLoading((prev) => ({ ...prev, [serviceId]: false }));
//     }
//   };

//   return (
//     <View className="border border-gray-300 shadow-xs rounded-xl p-4 my-4 max-h-[80vh]">
//       {/* {error && <Text className="mb-3 text-red-600 text-sm">{error}</Text>} */}
//       <View className="flex-row justify-between items-center mb-4">
//         <Text className="text-xl font-bold ">Services</Text>
//         <TouchableOpacity className="flex-row text-sm items-center bg-green-600 text-white px-2 py-1 rounded">
//           <MaterialCommunityIcons name="eye" size={18} color="white" className="mr-2" />
//           <Text className="text-white">View Cart</Text>
//         </TouchableOpacity>
//       </View>

//       <View className="flex-col gap-3" >
//         {technician?.categoryServices?.filter((service) => service.status === true).length > 0 ? (
//            technician?.categoryServices
//             ?.filter((service) => service.status === true)
//             .map((service) => {
//             const isInCart = cartItems.some((item) => item.id === service.categoryServiceId);
//             const isLoading = loading[service.categoryServiceId];

//             return (
//               <View
//                 key={service.categoryServiceId}
//                 className="flex-row justify-between items-center border border-gray-300 rounded-xl p-4"
//               >
//                 <View className="flex-1 flex-col gap-2">
//                   <Text className="text-lg font-bold">{service.details?.serviceName}</Text>
//                   <Text className="text-sm text-gray-700">
//                     ₹ <Text className="text-blue-600">{service.details?.servicePrice}</Text> per Unit
//                   </Text>
//                 </View>

//                 <View className="flex-col items-center gap-2">
//                   <Image
//                     source={{ uri: service.details?.serviceImg || "https://via.placeholder.com/150" }}
//                     className="w-28 h-28 object-cover rounded-md"
//                   />
//                   <TouchableOpacity
//                     className={`rounded-md px-2 py-1 flex-row items-center justify-center text-sm font-medium ${
//                       isInCart
//                         ? "text-red-600 border border-red-600"
//                         : "bg-red-600 text-white"
//                     } ${isLoading ? "opacity-50" : ""}`}
//                     onPress={() => !isLoading && handleCartToggle(service.categoryServiceId)}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : isInCart ? (
//                       <>
//                         <MaterialCommunityIcons name="cart-remove" size={16} color="red" />
//                         <Text className="ml-2 text-red-600">Remove</Text>
//                       </>
//                     ) : (
//                       <>
//                         <FontAwesome name="cart-plus" size={16} color="white" />
//                         <Text className="ml-2 text-white">Add to Cart</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View> 
//               </View>
//             );
//           })
//         ) : (
//           <Text className="text-gray-700">No services available</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// export default Services;