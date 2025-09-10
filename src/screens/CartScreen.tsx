// screens/CartScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Minus, Trash2, X } from "lucide-react-native";
import { GoPlus } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigation } from "@react-navigation/native";

// Dummy API methods (replace with real API integration)
const getCartItems = async (userId: string) => {
  return {
    success: true,
    result: {
      user: { _id: "1", username: "Soujanya" },
      cart: {
        _id: "cart1",
        userId,
        items: [
          {
            _id: "item1",
            serviceId: "srv1",
            serviceName: "AC Repair",
            serviceImg: "https://via.placeholder.com/64",
            servicePrice: 500,
            quantity: 1,
            technicianId: "tech1",
            bookingDate: "",
            isSelected: false,
          },
          {
            _id: "item2",
            serviceId: "srv2",
            serviceName: "Cleaning",
            serviceImg: "https://via.placeholder.com/64",
            servicePrice: 300,
            quantity: 2,
            technicianId: "tech2",
            bookingDate: "",
            isSelected: false,
          },
        ],
      },
    },
  };
};
const addToCart = async (payload: any) => console.log("addToCart", payload);
const removeFromCart = async (payload: any) =>
  console.log("removeFromCart", payload);
const createBookService = async (bookings: any) => {
  console.log("createBookService", bookings);
  return { success: true };
};

interface CartItem {
  _id: string;
  technicianId: string;
  serviceId: string;
  serviceName: string;
  serviceImg?: string;
  servicePrice?: number;
  quantity: number;
  bookingDate: string;
  isSelected: boolean;
}

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    setLoading(true);
    const userId = "1"; // replace with real logged in user id
    const response = await getCartItems(userId);
    if (response.success) {
      setCartItems(response.result.cart.items);
    }
    setLoading(false);
  };

  const handleQuantityChange = async (itemId: string, delta: number) => {
    const updated = cartItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updated);
    const changedItem = updated.find((i) => i._id === itemId);
    if (changedItem) {
      await addToCart({
        userId: "1",
        serviceId: changedItem.serviceId,
        technicianId: changedItem.technicianId,
        quantity: changedItem.quantity,
      });
    }
  };

  const handleRemove = async (itemId: string) => {
    setCartItems(cartItems.filter((i) => i._id !== itemId));
    await removeFromCart({ userId: "1", serviceId: itemId });
  };

  const handleCheckboxChange = (itemId: string) => {
    const updated = cartItems.map((i) =>
      i._id === itemId ? { ...i, isSelected: !i.isSelected } : i
    );
    setCartItems(updated);
    setSelectedItems(updated.filter((i) => i.isSelected));
  };

  const handleDateChange = (itemId: string, date: string) => {
    const updated = cartItems.map((i) =>
      i._id === itemId ? { ...i, bookingDate: date } : i
    );
    setCartItems(updated);
    setSelectedItems(updated.filter((i) => i.isSelected));
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.servicePrice || 0;
    const subtotal = price * item.quantity;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleBookNow = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "No items selected");
      return;
    }
    setIsBooking(true);
    const bookings = selectedItems.map((item) => ({
      userId: "1",
      serviceId: item.serviceId,
      technicianId: item.technicianId,
      quantity: item.quantity.toString(),
      bookingDate: item.bookingDate,
      servicePrice: ((item.servicePrice || 0) * item.quantity).toString(),
    }));
    const res = await createBookService(bookings);
    setIsBooking(false);
    if (res.success) {
      Alert.alert("Success", "Booking confirmed!");
      navigation.navigate("Transactions");
    } else {
      Alert.alert("Error", "Booking failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Your Cart</Text>

      {cartItems.length === 0 ? (
        <View className="items-center mt-10">
          <Text className="text-gray-500 mb-3">Your cart is empty</Text>
          <TouchableOpacity
            className="bg-fuchsia-500 px-4 py-2 rounded-lg"
            onPress={() => navigation.navigate("Categories")}
          >
            <Text className="text-white font-semibold">Browse Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cartItems.map((item) => (
            <View
              key={item._id}
              className="flex-row justify-between items-center bg-white rounded-xl p-3 mb-3 shadow"
            >
              {/* Checkbox */}
              <TouchableOpacity
                onPress={() => handleCheckboxChange(item._id)}
                className={`w-5 h-5 border rounded mr-2 ${
                  item.isSelected ? "bg-fuchsia-500" : "bg-white"
                }`}
              />

              {/* Image */}
              <Image
                source={{ uri: item.serviceImg }}
                className="w-16 h-16 rounded-lg"
              />

              {/* Info */}
              <View className="flex-1 ml-3">
                <Text className="font-semibold">{item.serviceName}</Text>
                <Text className="text-gray-500">
                  ₹{item.servicePrice} per unit
                </Text>
              </View>

              {/* Quantity */}
              <View className="flex-row items-center space-x-2">
                {item.quantity === 1 ? (
                  <TouchableOpacity
                    onPress={() => handleRemove(item._id)}
                    className="p-1"
                  >
                    <Trash2 size={18} color="red" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item._id, -1)}
                    className="p-1"
                  >
                    <Minus size={18} />
                  </TouchableOpacity>
                )}
                <Text className="mx-2">{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item._id, 1)}
                  className="p-1"
                >
                  <Text className="text-lg font-bold text-fuchsia-600">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <View className="bg-white p-4 rounded-lg mt-4 shadow">
              <Text className="text-lg font-semibold mb-2">Summary</Text>
              {selectedItems.map((item) => {
                const { subtotal, gst, total } = calculateItemTotal(item);
                return (
                  <View key={item._id} className="mb-3">
                    <Text>
                      {item.serviceName} ({item.quantity}) - ₹{subtotal}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      GST: ₹{gst}, Total: ₹{total}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Book Now */}
          <TouchableOpacity
            disabled={isBooking || selectedItems.length === 0}
            onPress={handleBookNow}
            className={`mt-6 py-3 rounded-xl ${
              selectedItems.length === 0
                ? "bg-gray-300"
                : "bg-fuchsia-500 hover:bg-fuchsia-600"
            }`}
          >
            <Text className="text-center text-white font-semibold text-lg">
              {isBooking ? "Processing..." : "Book Now"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default CartScreen;







// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Platform } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { CheckBox } from 'react-native-elements';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Trash2, X } from 'react-native-feather';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { removeFromCart, addToCart, getCartItems, createBookService } from '../api/apiMethods';

// interface CartItem {
//   _id: string;
//   technicianId: string;
//   serviceId: string;
//   serviceName: string;
//   serviceImg?: string;
//   servicePrice?: number;
//   price?: number;
//   quantity: number;
//   bookingDate: string;
//   isSelected: boolean;
// }

// interface CartData {
//   user: {
//     _id: string;
//     username: string;
//     phoneNumber: string;
//     role: string;
//     buildingName: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
//   cart: {
//     _id: string;
//     userId: string;
//     items: CartItem[];
//   };
// }

// const CartScreen = () => {
//   const navigation = useNavigation();
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const dateInputRefs = useRef<{ [key: string]: string }>({});

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         setError('User not logged in');
//         return;
//       }
//       const response = await getCartItems(userId);
//       if (response.success && response.result.cart) {
//         const formattedItems = response.result.cart.map((item: any) => ({
//           _id: item?._id,
//           serviceId: item?.serviceId,
//           serviceName: item?.serviceName,
//           serviceImg: item?.serviceImg,
//           servicePrice: item?.servicePrice,
//           quantity: item.quantity,
//           technicianId: item.serviceId?.technicianId,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));
//         const updatedCartData = {
//           user: response.result.user,
//           cart: {
//             ...response.result.cart,
//             items: formattedItems,
//           },
//         };
//         setCartData(updatedCartData);
//         setSelectedItems([]);
//       } else {
//         setError('Failed to fetch cart data');
//       }
//     } catch (err: any) {
//       console.error('Error fetching cart:', err);
//       setError(err?.message || 'Failed to fetch cart data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCalendarClick = (itemId: string) => {
//     setShowDatePicker((prev) => ({ ...prev, [itemId]: true }));
//   };

//   const handleDateChange = (event: any, selectedDate: Date | undefined, itemId: string) => {
//     setShowDatePicker((prev) => ({ ...prev, [itemId]: false }));
//     if (selectedDate) {
//       const formattedDate = selectedDate.toISOString().split('T')[0];
//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items?.map((item) =>
//               item._id === itemId ? { ...item, bookingDate: formattedDate } : item
//             ),
//           },
//         };
//       });
//       setSelectedItems((prev) =>
//         prev.map((item) =>
//           item._id === itemId ? { ...item, bookingDate: formattedDate } : item
//         )
//       );
//     }
//   };

//   const handleClearDate = async (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: '' } : item
//           ),
//         },
//       };
//     });
//     setSelectedItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId ? { ...item, bookingDate: '' } : item
//       )
//     );
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       const newQuantity = Math.max(1, item.quantity + delta);

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((cartItem) =>
//               cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
//             ),
//           },
//         };
//       });

//       setSelectedItems((prev) =>
//         prev.map((item) =>
//           item._id === itemId ? { ...item, quantity: newQuantity } : item
//         )
//       );

//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         quantity: newQuantity,
//       };

//       await addToCart(payload);
//     } catch (err: any) {
//       console.error('Error changing quantity:', err);
//       setError('Failed to update quantity');
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) return;

//       const item = cartData?.cart.items.find((item) => item._id === itemId);
//       if (!item) return;

//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.filter((cartItem) => cartItem._id !== itemId),
//           },
//         };
//       });

//       setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));

//       await removeFromCart({ userId, serviceId: item.serviceId });
//     } catch (err: any) {
//       console.error('Error removing item:', err);
//       setError('Failed to remove item');
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;

//       const updatedItems = prev.cart.items.map((item) => {
//         if (item._id === itemId) {
//           const newSelectedState = !item.isSelected;
//           setSelectedItems((prev) => {
//             const exists = prev.some((selected) => selected._id === itemId);
//             if (newSelectedState && !exists) {
//               return [...prev, { ...item, isSelected: true }];
//             } else if (!newSelectedState) {
//               return prev.filter((selected) => selected._id !== itemId);
//             }
//             return prev;
//           });
//           return { ...item, isSelected: newSelectedState };
//         }
//         return item;
//       });

//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: updatedItems,
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         setError('User not logged in');
//         return;
//       }

//       if (selectedItems.length === 0) {
//         setError('No items selected for booking');
//         return;
//       }

//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item._id,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: Math.round((item.servicePrice || item.price || 0) * item.quantity * 0.18).toString(),
//         totalPrice: Math.round((item.servicePrice || item.price || 0) * item.quantity * 1.18).toString(),
//       }));

//       const response = await createBookService(bookings);

//       if (response.success) {
//         await fetchCartData();
//         navigation.navigate('Transactions');
//       } else {
//         setError(response.message || 'Booking failed');
//       }
//     } catch (err: any) {
//       console.error('Error creating bookings:', err);
//       setError(err?.message || 'Failed to create bookings');
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMaxDate = () => {
//     const today = new Date();
//     const maxDate = new Date();
//     maxDate.setDate(today.getDate() + 7);
//     return maxDate;
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.servicePrice || item.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#d946ef" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center px-4">
//         <Text className="text-red-500 text-center text-lg">{error}</Text>
//         <View className="flex-row justify-center gap-4 mt-4">
//           {error.includes('log in') && (
//             <TouchableOpacity
//               className="bg-fuchsia-500 px-4 py-2 rounded-lg"
//               onPress={() => navigation.navigate('Login')}
//             >
//               <Text className="text-white text-base">Log In</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             className="bg-fuchsia-500 px-4 py-2 rounded-lg"
//             onPress={() => setError(null)}
//           >
//             <Text className="text-white text-base">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center px-4">
//         <Text className="text-gray-500 text-lg">Your cart is empty</Text>
//         <TouchableOpacity
//           className="bg-fuchsia-500 px-4 py-2 rounded-lg mt-4"
//           onPress={() => navigation.navigate('Category')}
//         >
//           <Text className="text-white text-base">Browse Services</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const isBookingDisabled =
//     selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <ScrollView className="flex-1 px-4 py-6">
//       <Text className="text-2xl font-bold text-gray-800 mb-6">Your Cart</Text>
//       {cartData.cart?.items?.map((item) => {
//         const isProcessing = processingItems[item._id];
//         return (
//           <View
//             key={item._id}
//             className={`flex-row items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-md mb-4 ${
//               isProcessing ? 'opacity-70' : ''
//             }`}
//           >
//             <View className="flex-row items-center">
//               <CheckBox
//                 checked={item.isSelected}
//                 onPress={() => handleCheckboxChange(item._id)}
//                 checkedColor="#d946ef"
//                 containerStyle={{ marginRight: 12, padding: 0 }}
//                 disabled={isProcessing}
//               />
//               <Image
//                 source={{ uri: item?.serviceImg || 'https://via.placeholder.com/64' }}
//                 className="w-16 h-16 rounded-xl"
//               />
//               <View className="ml-4">
//                 <Text className="text-lg font-semibold">{item?.serviceName}</Text>
//                 <Text className="text-gray-600">
//                   ₹ <Text className="text-fuchsia-500">{item?.servicePrice}</Text> per unit
//                 </Text>
//               </View>
//             </View>
//             <View className="flex-row items-center space-x-4">
//               <View className="flex-row items-center bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400">
//                 {item.quantity === 1 ? (
//                   <TouchableOpacity
//                     onPress={() => !isProcessing && handleRemove(item._id)}
//                     className="p-1 rounded-full"
//                     disabled={isProcessing}
//                   >
//                     <Trash2 width={16} height={16} color="#ef4444" />
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                     className="p-1 rounded-full"
//                     disabled={isProcessing}
//                   >
//                     <Icon name="minus" size={12} color="#9333ea" />
//                   </TouchableOpacity>
//                 )}
//                 <Text className="text-sm text-black w-8 text-center">
//                   {isProcessing ? '...' : item.quantity}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                   className="p-1 rounded-full"
//                   disabled={isProcessing}
//                 >
//                   <Icon name="plus" size={16} color="#9333ea" />
//                 </TouchableOpacity>
//               </View>
//               <Text className="font-semibold text-gray-800">
//                 ₹{(item?.servicePrice || 0) * item.quantity}
//               </Text>
//               <View className="flex-row items-center space-x-2">
//                 {item.bookingDate ? (
//                   <View className="flex-row items-center space-x-2">
//                     <TouchableOpacity onPress={() => handleCalendarClick(item._id)}>
//                       <Text className="text-sm text-blue-600">{item.bookingDate}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={() => handleClearDate(item._id)}
//                       className="p-1 rounded-full"
//                     >
//                       <X width={16} height={16} color="#6b7280" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <TouchableOpacity onPress={() => handleCalendarClick(item._id)}>
//                     <Icon name="calendar" size={20} color="#2563eb" />
//                   </TouchableOpacity>
//                 )}
//                 {showDatePicker[item._id] && (
//                   <DateTimePicker
//                     value={item.bookingDate ? new Date(item.bookingDate) : new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'inline' : 'default'}
//                     minimumDate={new Date()}
//                     maximumDate={getMaxDate()}
//                     onChange={(event, date) => handleDateChange(event, date, item._id)}
//                   />
//                 )}
//               </View>
//             </View>
//           </View>
//         );
//       })}
//       {selectedItems.length > 0 && (
//         <View className="mt-6 border-t border-gray-300 pt-4">
//           <Text className="text-lg font-semibold mb-4">Selected Items</Text>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <View key={item._id} className="mb-4 px-4 py-3 border rounded-lg space-y-1">
//                 <View className="flex-row justify-between">
//                   <Text>
//                     {item.serviceName} ({item.quantity})
//                   </Text>
//                   <Text>₹{subtotal}</Text>
//                 </View>
//                 <View className="flex-row justify-between text-sm text-gray-600">
//                   <Text>Booking Date</Text>
//                   <Text>
//                     {item.bookingDate
//                       ? new Date(item.bookingDate).toLocaleDateString()
//                       : 'Not set'}
//                   </Text>
//                 </View>
//                 <View className="flex-row justify-between text-sm text-gray-600">
//                   <Text>GST (18%)</Text>
//                   <Text>₹{gst}</Text>
//                 </View>
//                 <View className="flex-row justify-between font-semibold">
//                   <Text>Total</Text>
//                   <Text>₹{total}</Text>
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       )}
//       <View className="flex-row justify-between items-center mt-6">
//         <Text className="text-gray-800 text-base">Missed Something?</Text>
//         <TouchableOpacity
//           className="bg-red-600 flex-row items-center px-3 py-1.5 rounded-lg"
//           onPress={() => navigation.navigate('Categories')}
//         >
//           <Icon name="plus" size={23} color="#fff" style={{ marginRight: 4 }} />
//           <Text className="text-white text-base">Add More Items</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity
//         className={`mt-6 py-3 rounded-xl ${
//           isBookingDisabled || isBooking ? 'bg-gray-200' : 'bg-fuchsia-500'
//         }`}
//         disabled={isBookingDisabled || isBooking}
//         onPress={handleBookNow}
//       >
//         <Text
//           className={`text-center text-lg font-semibold ${
//             isBookingDisabled || isBooking ? 'text-gray-500' : 'text-white'
//           }`}
//         >
//           {isBooking
//             ? 'Processing...'
//             : isBookingDisabled
//             ? selectedItems.length === 0
//               ? 'Select at least one item'
//               : 'Select dates for all selected items'
//             : 'Book Now'}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default CartScreen;