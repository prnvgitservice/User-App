import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { addToCart, removeFromCart, getCartItems } from "../../api/apiMethods";
import { TechnicianService, Technician } from "../../screens/TechnicianProfile";

type RootStackParamList = {
  Login: undefined;
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your cart.");
        return;
      }

      const response = await getCartItems(userId);
      if (response.success && response.result?.items) {
        const formattedItems = response.result.items.map((item: any) => ({
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
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items. Please try again.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleCartToggle = async (serviceId: string) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to manage your cart.");
        navigation.navigate("Login");
        return;
      }

      setLoading((prev) => ({ ...prev, [serviceId]: true }));
      const isInCart = cartItems.some((item) => item.serviceId === serviceId);

      if (isInCart) {
        const response = await removeFromCart({ userId, serviceId });
        if (response.success) {
          await fetchCartItems();
        } else {
          throw new Error(response.errors?.join(", ") || "Failed to remove item from cart.");
        }
      } else {
        const service = services.find((s) => s._id === serviceId);
        if (!service) {
          setError("Service is not available.");
          return;
        }

        const payload = {
          userId,
          serviceId,
          technicianId: technician._id,
          quantity: 1,
        };
        const response = await addToCart(payload);
        if (response.success) {
          await fetchCartItems();
        } else {
          throw new Error(response.errors?.join(", ") || "Failed to add item to cart.");
        }
      }
    } catch (error: any) {
      console.error("Error toggling cart item:", error);
      setError(error.message || "An error occurred while updating the cart.");
    } finally {
      setLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  return (
    <View className="border border-gray-200 shadow-md rounded-xl p-4 my-4 max-h-[80vh]">
      {error && <Text className="mb-3 text-red-600 text-sm">{error}</Text>}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-light">Services</Text>
        <TouchableOpacity className="flex-row text-sm items-center bg-green-600 text-white px-3 py-1 rounded">
          <MaterialCommunityIcons name="eye" size={18} color="white" className="mr-2" />
          <Text className="text-white">View Cart</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-col gap-4">
        {services.length > 0 ? (
          services.map((service) => {
            const isInCart = cartItems.some((item) => item.serviceId === service._id);
            const isLoading = loading[service._id];

            return (
              <View
                key={service._id}
                className="flex-row justify-between items-center border border-gray-300 rounded-xl py-4 px-6 shadow"
              >
                <View>
                  <Text className="text-md">{service.serviceName}</Text>
                  <Text className="text-sm text-gray-700">
                    ₹ <Text className="text-blue-600">{service.servicePrice}</Text> per Unit
                  </Text>
                </View>

                <View className="flex-col items-center gap-2">
                  <Image
                    source={{ uri: service.serviceImg || "https://via.placeholder.com/150" }}
                    className="w-28 h-28 object-cover rounded-md"
                  />
                  <TouchableOpacity
                    className={`rounded-md px-3 py-1 flex-row items-center justify-center text-sm font-medium ${
                      isInCart
                        ? "text-red-600 border border-red-600"
                        : "bg-red-600 text-white"
                    } ${isLoading ? "opacity-50" : ""}`}
                    onPress={() => !isLoading && handleCartToggle(service._id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
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
          })
        ) : (
          <Text className="text-gray-700">No services available</Text>
        )}
      </View>
    </View>
  );
};

export default Services;