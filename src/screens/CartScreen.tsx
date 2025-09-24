import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
  Dimensions,
  StyleSheet
} from "react-native";
import { useRouter } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown, 
  ZoomIn, 
  ZoomOut,
  BounceIn,
  BounceOut,
  RotateInDownLeft,
  FlipInXUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  withDelay
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface CartItem {
  _id: string;
  technicianId: string;
  serviceId: string;
  serviceName: string;
  serviceImg?: string;
  servicePrice?: number;
  price?: number;
  quantity: number;
  bookingDate: string;
  otp?: number;
  isSelected: boolean;
  ratings?: number;
  reviews?: number;
}

interface CartData {
  user: {
    _id: string;
    username: string;
    phoneNumber: string;
    role: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
  };
  cart: {
    _id: string;
    userId: string;
    items: CartItem[];
  };
}

interface SavingsData {
  prnvTotal: string;
  otherTotal: string;
  savings: string;
}

// Mock API functions - replace with your actual API calls
const getCartItems = async (userId: string) => {
  // Mock implementation
  return {
    success: true,
    result: {
      user: {
        _id: userId,
        username: 'John Doe',
        phoneNumber: '1234567890',
        role: 'user',
        buildingName: 'Sample Building',
        areaName: 'Sample Area',
        city: 'Sample City',
        state: 'Sample State',
        pincode: '123456'
      },
      cart: [
        {
          _id: '1',
          serviceId: 'service1',
          serviceName: 'House Cleaning',
          serviceImg: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg',
          servicePrice: 500,
          quantity: 1,
          technicianId: 'tech1',
          bookingDate: '',
          ratings: 4.5,
          reviews: 120
        },
        {
          _id: '2',
          serviceId: 'service2',
          serviceName: 'AC Repair',
          serviceImg: 'https://images.pexels.com/photos/8005394/pexels-photo-8005394.jpeg',
          servicePrice: 800,
          quantity: 2,
          technicianId: 'tech2',
          bookingDate: '',
          ratings: 4.8,
          reviews: 85
        }
      ]
    }
  };
};

const addToCart = async (payload: any) => {
  // Mock implementation
  return { success: true };
};

const removeFromCart = async (payload: any) => {
  // Mock implementation
  return { success: true };
};

const createBookService = async (bookings: any[]) => {
  // Mock implementation
  return { success: true, message: 'Booking created successfully' };
};

const CartScreen = () => {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
  const [isBooking, setIsBooking] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsData, setSavingsData] = useState<SavingsData | null>(null);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId") || "user123";
      const response = await getCartItems(userId);
      if (response.success && response.result.cart) {
        const formattedItems = response.result.cart.map((item: any) => ({
          _id: item?._id,
          serviceId: item?.serviceId,
          serviceName: item?.serviceName,
          serviceImg: item?.serviceImg,
          servicePrice: item?.servicePrice,
          quantity: item.quantity,
          technicianId: item.technicianId,
          bookingDate: item.bookingDate || "",
          isSelected: false,
          ratings: item?.ratings,
          reviews: item?.reviews,
        }));
        setCartData({
          user: response.result.user,
          cart: { _id: 'cart1', userId, items: formattedItems },
        });
      } else {
        setError("Failed to fetch cart data");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch cart data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    
    // Only set the date if user actually selected a date (not dismissed)
    if (event.type === 'set' && selectedDate && currentItemId) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setCartData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.map((item) =>
              item._id === currentItemId ? { ...item, bookingDate: dateString } : item
            ),
          },
        };
      });
    }
    // If user dismissed (event.type === 'dismissed'), don't set any date
  };

  const showDatePickerForItem = (itemId: string) => {
    setCurrentItemId(itemId);
    setShowDatePicker(true);
  };

  const handleClearDate = (itemId: string) => {
    setCartData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map((item) =>
            item._id === itemId ? { ...item, bookingDate: "" } : item
          ),
        },
      };
    });
  };

  const handleQuantityChange = async (itemId: string, delta: number) => {
    try {
      setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
      const userId = await AsyncStorage.getItem("userId") || "user123";
      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;
      const newQuantity = Math.max(1, item.quantity + delta);
      setCartData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.map((cartItem) =>
              cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
            ),
          },
        };
      });
      const payload = {
        userId,
        serviceId: item.serviceId,
        technicianId: item.technicianId,
        quantity: newQuantity,
      };
      await addToCart(payload);
    } catch (err: any) {
      setError("Failed to update quantity");
      await fetchCartData();
    } finally {
      setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
      const userId = await AsyncStorage.getItem("userId") || "user123";
      const item = cartData?.cart.items.find((item) => item._id === itemId);
      if (!item) return;
      setCartData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cart: {
            ...prev.cart,
            items: prev.cart.items.filter((cartItem) => cartItem._id !== itemId),
          },
        };
      });
      await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
    } catch (err: any) {
      setError("Failed to remove item");
      await fetchCartData();
    } finally {
      setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckboxChange = (itemId: string) => {
    setCartData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: prev.cart.items.map((item) =>
            item._id === itemId ? { ...item, isSelected: !item.isSelected } : item
          ),
        },
      };
    });
  };

  const handleBookNow = async () => {
    try {
      setIsBooking(true);
      const userId = await AsyncStorage.getItem("userId") || "user123";
      const selectedItems = cartData?.cart.items.filter((item) => item.isSelected) || [];
      if (selectedItems.length === 0) {
        setError("No items selected for booking");
        return;
      }
      if (selectedItems.some((item) => !item.bookingDate)) {
        setError("Please select dates for all selected items");
        return;
      }
      const bookings = selectedItems.map((item) => {
        const subtotal = (item.servicePrice || item.price || 0) * item.quantity;
        return {
          userId,
          serviceId: item.serviceId,
          technicianId: item.technicianId,
          quantity: item.quantity.toString(),
          bookingDate: item.bookingDate,
          servicePrice: subtotal.toString(),
          gst: "0",
          totalPrice: subtotal.toString(),
        };
      });
      const response = await createBookService(bookings);
      if (response.success) {
        const grandTotal = selectedItems.reduce((sum, item) => sum + (item.servicePrice || item.price || 0) * item.quantity, 0);
        const otherTotal = Math.round(grandTotal * 1.3 * 1.18); // 30% higher + 18% GST
        const savings = otherTotal - grandTotal;
        
        // Set savings data for modal
        setSavingsData({
          prnvTotal: `₹${grandTotal}`,
          otherTotal: `₹${otherTotal}`,
          savings: savings.toString()
        });
        
        // Show the savings modal
        setShowSavingsModal(true);
        
        // Refresh cart data
        await fetchCartData();
      } else {
        setError(response.message || "Booking failed");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => new Date();
  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 7);
    return max;
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.servicePrice || item.price || 0;
    const subtotal = price * item.quantity;
    const gst = 0;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  // Floating Emoji Component
  const FloatingEmoji = ({ emoji, index }: { emoji: string; index: number }) => {
    const translateY = useSharedValue(100);
    const opacity = useSharedValue(0);
    const rotate = useSharedValue(Math.random() * 360);

    useEffect(() => {
      translateY.value = withDelay(
        index * 300,
        withRepeat(
          withSequence(
            withTiming(-100, { duration: 2000 + Math.random() * 2000 }),
            withTiming(100, { duration: 0 })
          ),
          -1
        )
      );
      
      opacity.value = withDelay(
        index * 300,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1000 }),
            withTiming(0, { duration: 1000 + Math.random() * 1000 })
          ),
          -1
        )
      );
      
      rotate.value = withDelay(
        index * 300,
        withRepeat(
          withTiming(rotate.value + 180 + Math.random() * 180, { duration: 2000 + Math.random() * 2000 }),
          -1
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
      };
    });

    return (
      <Animated.View 
        style={[
          { position: 'absolute', left: `${20 + index * 15}%` },
          animatedStyle
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.errorButtonContainer}>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              setError(null);
              fetchCartData();
            }}
            accessibilityLabel="Retry loading cart"
          >
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/(tabs)/')}
          accessibilityLabel="Browse services"
        >
          <Text style={styles.browseButtonText}>Browse Services</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedItems = cartData.cart.items.filter((item) => item.isSelected);
  const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Your Cart</Text>

        {cartData.cart.items.map((item) => {
          const isProcessing = processingItems[item._id];
          const { subtotal } = calculateItemTotal(item);
          return (
            <View
              key={item._id}
              style={[styles.cartItem, isProcessing && styles.processingItem]}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleCheckboxChange(item._id)}
                disabled={isProcessing}
                accessibilityLabel={`Select ${item.serviceName}`}
              >
                <Ionicons
                  name={item.isSelected ? "checkbox" : "square-outline"}
                  size={26}
                  color="#8b5cf6"
                />
              </TouchableOpacity>
              <Image
                source={{ uri: item?.serviceImg || "https://via.placeholder.com/64" }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text style={styles.servicePrice}>
                  ₹ <Text style={styles.priceHighlight}>{item.servicePrice}</Text> per unit
                </Text>
                {item.ratings && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingText}>{item.ratings}</Text>
                    <Text style={styles.reviewText}>({item.reviews} reviews)</Text>
                  </View>
                )}
              </View>
              <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                  {item.quantity === 1 ? (
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => !isProcessing && handleRemove(item._id)}
                      disabled={isProcessing}
                      accessibilityLabel={`Remove ${item.serviceName}`}
                    >
                      <MaterialIcons name="delete" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
                      disabled={isProcessing}
                      accessibilityLabel={`Decrease quantity of ${item.serviceName}`}
                    >
                      <Ionicons name="remove" size={18} color="#8b5cf6" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.quantityText}>
                    {isProcessing ? "..." : item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
                    disabled={isProcessing}
                    accessibilityLabel={`Increase quantity of ${item.serviceName}`}
                  >
                    <Ionicons name="add" size={18} color="#8b5cf6" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtotal}>₹ {subtotal}</Text>
                <View style={styles.dateContainer}>
                  {item.bookingDate ? (
                    <>
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => showDatePickerForItem(item._id)}
                        accessibilityLabel={`Change booking date for ${item.serviceName}`}
                      >
                        <FontAwesome5 name="calendar-alt" size={20} color="#3b82f6" />
                        <Text style={styles.dateText}>{item.bookingDate}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.clearDateButton}
                        onPress={() => handleClearDate(item._id)}
                        accessibilityLabel={`Clear booking date for ${item.serviceName}`}
                      >
                        <Ionicons name="close" size={18} color="#6b7280" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => showDatePickerForItem(item._id)}
                      accessibilityLabel={`Set booking date for ${item.serviceName}`}
                    >
                      <Text style={styles.calendarEmoji}>📅</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {selectedItems.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            {selectedItems.map((item) => {
              const { subtotal, gst, total } = calculateItemTotal(item);
              return (
                <View key={item._id} style={styles.summaryItem}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryItemName}>{item.serviceName} (x{item.quantity})</Text>
                    <Text style={styles.summaryItemPrice}>₹{subtotal}</Text>
                  </View>
                  <View style={styles.summaryDetailRow}>
                    <Text style={styles.summaryDetailText}>Booking Date</Text>
                    <Text style={styles.summaryDetailText}>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</Text>
                  </View>
                  <View style={styles.summaryDetailRow}>
                    <Text style={styles.summaryDetailText}>GST (0%)</Text>
                    <Text style={styles.summaryDetailText}>₹{gst}</Text>
                  </View>
                  <View style={styles.summaryTotalRow}>
                    <Text style={styles.summaryTotalText}>Total</Text>
                    <Text style={styles.summaryTotalText}>₹{total}</Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalText}>Grand Total</Text>
              <Text style={styles.grandTotalText}>
                ₹{selectedItems.reduce((sum, item) => sum + calculateItemTotal(item).total, 0)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.addMoreContainer}>
          <Text style={styles.addMoreText}>Need more services?</Text>
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => router.push('/(tabs)/')}
            accessibilityLabel="Add more items to cart"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addMoreButtonText}>Add Items</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bookButton, (isBookingDisabled || isBooking) && styles.bookButtonDisabled]}
          disabled={isBookingDisabled || isBooking}
          onPress={handleBookNow}
          accessibilityLabel="Book selected items"
        >
          <Text
            style={[styles.bookButtonText, (isBookingDisabled || isBooking) && styles.bookButtonTextDisabled]}
          >
            {isBooking
              ? "Processing..."
              : isBookingDisabled
              ? selectedItems.length === 0
                ? "Select at least one item"
                : "Select dates for all items"
              : `Book Now (${selectedItems.length} items)`}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="date"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={getMinDate()}
          maximumDate={getMaxDate()}
        />
      )}

      {/* Savings Modal */}
      <Modal
        visible={showSavingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSavingsModal(false)}
      >
        <Animated.View 
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={styles.modalOverlay}
        >
          <BlurView intensity={10} style={styles.blurView} />
          
          <Animated.View 
            entering={SlideInDown.springify().damping(15).mass(0.8)}
            exiting={SlideOutDown.duration(400)}
            style={styles.modalContent}
          >
            {/* Enhanced Celebration Animation */}
            <Animated.View 
              entering={ZoomIn.duration(300).delay(200)}
              style={styles.celebrationContainer}
            >
              <Animated.View 
                entering={BounceIn.duration(500).delay(300).springify()}
                style={styles.celebrationEmoji}
              >
                <Text style={styles.celebrationEmojiText}>🎉</Text>
              </Animated.View>
              <Animated.View 
                entering={FadeIn.duration(500).delay(400).springify()}
              >
                <Text style={styles.congratsTitle}>
                  Congratulations on Your Booking!
                </Text>
              </Animated.View>
              <Animated.View 
                entering={FadeIn.duration(500).delay(500).springify()}
              >
                <Text style={styles.congratsSubtitle}>
                  You've made a smart choice with PRNV
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Enhanced Savings Table */}
            <Animated.View 
              entering={FadeIn.duration(400).delay(300).springify()}
              style={styles.savingsTable}
            >
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Description</Text>
                <Text style={styles.tableHeaderText}>Amount (₹)</Text>
              </View>
              
              <Animated.View 
                entering={FadeIn.duration(300).delay(400).springify()}
                style={styles.tableRow}
              >
                <View style={styles.tableRowLeft}>
                  <Text style={styles.tableEmoji}>📦</Text>
                  <Text style={styles.tableRowText}>PRNV Service (No GST)</Text>
                </View>
                <Text style={styles.tableRowAmount}>{savingsData?.prnvTotal}</Text>
              </Animated.View>
              
              <Animated.View 
                entering={FadeIn.duration(300).delay(500).springify()}
                style={styles.tableRow}
              >
                <View style={styles.tableRowLeft}>
                  <Text style={styles.tableEmoji}>🏷️</Text>
                  <Text style={styles.tableRowText}>Other Services (30% higher + 18% GST)</Text>
                </View>
                <Text style={styles.tableRowAmount}>{savingsData?.otherTotal}</Text>
              </Animated.View>
              
              <Animated.View 
                entering={ZoomIn.duration(400).delay(600).springify()}
                style={styles.savingsRow}
              >
                <View style={styles.tableRowLeft}>
                  <Text style={styles.tableEmoji}>💰</Text>
                  <Text style={styles.savingsRowText}>Your Total Savings</Text>
                </View>
                <Text style={styles.savingsAmount}>₹{savingsData?.savings}</Text>
              </Animated.View>
            </Animated.View>

            {/* Enhanced Savings Explanation */}
            <Animated.View 
              entering={FadeIn.duration(400).delay(400).springify()}
              style={styles.explanationContainer}
            >
              <View style={styles.explanationContent}>
                <Animated.View
                  entering={RotateInDownLeft.duration(1000)}
                  style={styles.explanationIcon}
                >
                  <Text style={styles.explanationIconText}>💡</Text>
                </Animated.View>
                <Text style={styles.explanationText}>
                  Our PRNV service saves you money by offering competitive pricing at{' '}
                  <Text style={styles.explanationHighlight}>30% lower base rates</Text> than competitors and{' '}
                  <Text style={styles.explanationHighlight}>without applying GST</Text>.
                </Text>
              </View>
            </Animated.View>

            {/* Enhanced Action Button */}
            <Animated.View 
              entering={FadeIn.duration(400).delay(700).springify()}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowSavingsModal(false);
                  router.push('/(tabs)/');
                }}
                style={styles.transactionButton}
              >
                <Text style={styles.transactionButtonText}>View Transaction Details 🚀</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Floating Emojis Animation */}
            <View style={styles.floatingEmojisContainer}>
              {["💰", "🎯", "👍", "⭐"].map((emoji, index) => (
                <FloatingEmoji key={index} emoji={emoji} index={index} />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  errorButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  processingItem: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 16,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  servicePrice: {
    color: '#6b7280',
    fontSize: 14,
  },
  priceHighlight: {
    color: '#8b5cf6',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingStar: {
    fontSize: 14,
    color: '#fbbf24',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  reviewText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    color: '#111827',
    width: 40,
    textAlign: 'center',
  },
  subtotal: {
    fontWeight: '600',
    color: '#111827',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
  },
  clearDateButton: {
    marginLeft: 12,
  },
  calendarEmoji: {
    fontSize: 24,
  },
  summaryContainer: {
    marginTop: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItemName: {
    color: '#111827',
  },
  summaryItemPrice: {
    color: '#111827',
  },
  summaryDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  summaryDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryTotalText: {
    fontWeight: '600',
    color: '#111827',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  grandTotalText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
  },
  addMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 56,
  },
  addMoreText: {
    color: '#6b7280',
    fontSize: 16,
  },
  addMoreButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMoreButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bookButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  bookButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    color: 'white',
  },
  bookButtonTextDisabled: {
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: 16,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    maxWidth: 512,
    width: '100%',
    borderWidth: 1,
    borderColor: '#f3e8ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 128,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  celebrationEmoji: {
    marginBottom: 8,
  },
  celebrationEmojiText: {
    fontSize: 48,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 4,
    textAlign: 'center',
  },
  congratsSubtitle: {
    color: '#a855f7',
    textAlign: 'center',
  },
  savingsTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e879f9',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    textAlign: 'left',
    color: '#a855f7',
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  tableRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableEmoji: {
    fontSize: 16,
  },
  tableRowText: {
    marginLeft: 8,
  },
  tableRowAmount: {
    fontFamily: 'monospace',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fdf4ff',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  savingsRowText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  savingsAmount: {
    color: '#16a34a',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: '#fdf4ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  explanationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  explanationIcon: {
    transform: [{ rotate: '10deg' }],
  },
  explanationIconText: {
    color: '#a855f7',
    marginRight: 8,
    fontSize: 18,
  },
  explanationText: {
    color: '#a855f7',
    flex: 1,
  },
  explanationHighlight: {
    fontWeight: '600',
  },
  transactionButton: {
    width: '100%',
    backgroundColor: '#9333ea',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  transactionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  floatingEmojisContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  emojiText: {
    fontSize: 24,
  },
});

export default CartScreen;









// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Platform,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

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
//   otp?: number;
//   isSelected: boolean;
//   ratings?: number;
//   reviews?: number;
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
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [currentItemId, setCurrentItemId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to view your cart");
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
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate || "",
//           isSelected: false,
//           ratings: item?.ratings,
//           reviews: item?.reviews,
//         }));
//         setCartData({
//           user: response.result.user,
//           cart: { ...response.result.cart, items: formattedItems },
//         });
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate && currentItemId) {
//       const dateString = selectedDate.toISOString().split("T")[0];
//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((item) =>
//               item._id === currentItemId ? { ...item, bookingDate: dateString } : item
//             ),
//           },
//         };
//       });
//     }
//   };

//   const showDatePickerForItem = (itemId: string) => {
//     setCurrentItemId(itemId);
//     setShowDatePicker(true);
//   };

//   const handleClearDate = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           ),
//         },
//       };
//     });
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
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
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };
//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
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
//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, isSelected: !item.isSelected } : item
//           ),
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to proceed");
//         return;
//       }
//       const selectedItems = cartData?.cart.items.filter((item) => item.isSelected) || [];
//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }
//       if (selectedItems.some((item) => !item.bookingDate)) {
//         setError("Please select dates for all selected items");
//         return;
//       }
//       const bookings = selectedItems.map((item) => {
//         const subtotal = (item.servicePrice || item.price || 0) * item.quantity;
//         return {
//           userId,
//           serviceId: item.serviceId,
//           technicianId: item.technicianId,
//           quantity: item.quantity.toString(),
//           bookingDate: item.bookingDate,
//           servicePrice: subtotal.toString(),
//           gst: "0",
//           totalPrice: subtotal.toString(),
//         };
//       });
//       const response = await createBookService(bookings);
//       if (response.success) {
//         const grandTotal = selectedItems.reduce((sum, item) => sum + (item.servicePrice || item.price || 0) * item.quantity, 0);
//         const otherTotal = Math.round(grandTotal * 1.3);
//         const savings = otherTotal - grandTotal;
//         Alert.alert(
//           "Success",
//           `Booking confirmed!\n\nWith PRNV service, you paid ₹${grandTotal} (GST 0%).\nThis saves you money by avoiding extra charges.\nOther services would charge ₹${otherTotal} (30% more).\nYou saved ₹${savings}!`,
//           [{ text: "OK", onPress: () => navigation.navigate("Transactions") }]
//         );
//         await fetchCartData();
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMinDate = () => new Date();
//   const getMaxDate = () => {
//     const max = new Date();
//     max.setDate(max.getDate() + 7);
//     return max;
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const price = item.servicePrice || item.price || 0;
//     const subtotal = price * item.quantity;
//     const gst = 0;
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#8b5cf6" />
//         <Text className="mt-4 text-gray-600 text-lg">Loading your cart...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-red-600 text-lg text-center mb-6">{error}</Text>
//         <View className="flex-row gap-4">
//           {error.includes("log in") && (
//             <TouchableOpacity
//               className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//               onPress={() => navigation.navigate("Login")}
//               accessibilityLabel="Log in to continue"
//             >
//               <Text className="text-white font-semibold text-base">Log In</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//             onPress={() => {
//               setError(null);
//               fetchCartData();
//             }}
//             accessibilityLabel="Retry loading cart"
//           >
//             <Text className="text-white font-semibold text-base">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-gray-600 text-lg mb-6">Your cart is empty</Text>
//         <TouchableOpacity
//           className="bg-violet-600 px-8 py-4 rounded-full shadow-md"
//           onPress={() => navigation.navigate("Category")}
//           accessibilityLabel="Browse services"
//         >
//           <Text className="text-white font-semibold text-base">Browse Services</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const selectedItems = cartData.cart.items.filter((item) => item.isSelected);
//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <View className="flex-1 bg-gray-50">
//       <ScrollView className="px-4 py-6 pb-20">
//         <Text className="text-3xl font-bold text-gray-900 mb-6">Your Cart</Text>

//         {cartData.cart.items.map((item) => {
//           const isProcessing = processingItems[item._id];
//           const { subtotal } = calculateItemTotal(item);
//           return (
//             <View
//               key={item._id}
//               className={`flex-row items-center bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-200 ${isProcessing ? "opacity-60" : ""}`}
//             >
//               <TouchableOpacity
//                 className="mr-4"
//                 onPress={() => handleCheckboxChange(item._id)}
//                 disabled={isProcessing}
//                 accessibilityLabel={`Select ${item.serviceName}`}
//               >
//                 <Ionicons
//                   name={item.isSelected ? "checkbox" : "square-outline"}
//                   size={26}
//                   color="#8b5cf6"
//                 />
//               </TouchableOpacity>
//               <Image
//                 source={{ uri: item?.serviceImg || "https://via.placeholder.com/64" }}
//                 className="w-16 h-16 rounded-lg"
//                 resizeMode="cover"
//               />
//               <View className="flex-1 ml-4">
//                 <Text className="text-lg font-semibold text-gray-900">{item.serviceName}</Text>
//                 <Text className="text-gray-600 text-sm">
//                   ₹ <Text className="text-violet-600">{item.servicePrice}</Text> per unit
//                 </Text>
//                 {item.ratings && (
//                   <View className="flex-row items-center gap-1 mt-1">
//                     <Text className="text-sm text-yellow-500">★</Text>
//                     <Text className="text-sm text-gray-600">{item.ratings}</Text>
//                     <Text className="text-sm text-gray-500">({item.reviews} reviews)</Text>
//                   </View>
//                 )}
//               </View>
//               <View className="items-end">
//                 <View className="flex-row items-center bg-violet-50 rounded-lg px-1 py-1 border border-violet-200 mb-2">
//                   {item.quantity === 1 ? (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleRemove(item._id)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Remove ${item.serviceName}`}
//                     >
//                       <MaterialIcons name="delete" size={18} color="#ef4444" />
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Decrease quantity of ${item.serviceName}`}
//                     >
//                       <Ionicons name="remove" size={18} color="#8b5cf6" />
//                     </TouchableOpacity>
//                   )}
//                   <Text className="text-sm text-gray-900 w-10 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </Text>
//                   <TouchableOpacity
//                     className="p-2"
//                     onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     disabled={isProcessing}
//                     accessibilityLabel={`Increase quantity of ${item.serviceName}`}
//                   >
//                     <Ionicons name="add" size={18} color="#8b5cf6" />
//                   </TouchableOpacity>
//                 </View>
//                 <Text className="font-semibold text-gray-900">₹ {subtotal}</Text>
//                 <View className="flex-row items-center mt-2">
//                   {item.bookingDate ? (
//                     <>
//                       <TouchableOpacity
//                         className="flex-row items-center"
//                         onPress={() => showDatePickerForItem(item._id)}
//                         accessibilityLabel={`Change booking date for ${item.serviceName}`}
//                       >
//                         <FontAwesome5 name="calendar-alt" size={20} color="#3b82f6" />
//                         <Text className="text-sm text-blue-600 ml-2">{item.bookingDate}</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         className="ml-3"
//                         onPress={() => handleClearDate(item._id)}
//                         accessibilityLabel={`Clear booking date for ${item.serviceName}`}
//                       >
//                         <Ionicons name="close" size={18} color="#6b7280" />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       onPress={() => showDatePickerForItem(item._id)}
//                       accessibilityLabel={`Set booking date for ${item.serviceName}`}
//                     >
//                       <Text>📅</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             </View>
//           );
//         })}

//         {selectedItems.length > 0 && (
//           <View className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//             <Text className="text-xl font-semibold text-gray-900 mb-4">Order Summary</Text>
//             {selectedItems.map((item) => {
//               const { subtotal, gst, total } = calculateItemTotal(item);
//               return (
//                 <View key={item._id} className="mb-4 p-3 bg-gray-50 rounded-lg">
//                   <View className="flex-row justify-between">
//                     <Text className="text-gray-900">{item.serviceName} (x{item.quantity})</Text>
//                     <Text className="text-gray-900">₹{subtotal}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>Booking Date</Text>
//                     <Text>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>GST (0%)</Text>
//                     <Text>₹{gst}</Text>
//                   </View>
//                   <View className="flex-row justify-between font-semibold text-gray-900 mt-2">
//                     <Text>Total</Text>
//                     <Text>₹{total}</Text>
//                   </View>
//                 </View>
//               );
//             })}
//             <View className="flex-row justify-between font-bold text-lg text-gray-900 mt-4">
//               <Text>Grand Total</Text>
//               <Text>
//                 ₹{selectedItems.reduce((sum, item) => sum + calculateItemTotal(item).total, 0)}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View className="flex-row justify-between items-center mt-6 mb-14">
//           <Text className="text-gray-600 text-base">Need more services?</Text>
//           <TouchableOpacity
//             className="bg-red-500 flex-row items-center px-4 py-2 rounded-full shadow-md"
//             onPress={() => navigation.navigate("Category")}
//             accessibilityLabel="Add more items to cart"
//           >
//             <Ionicons name="add" size={20} color="white" />
//             <Text className="text-white font-semibold ml-2">Add Items</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View className="p-4 bg-white border-t border-gray-200">
//         <TouchableOpacity
//           className={`w-full py-4 rounded-xl shadow-md ${isBookingDisabled || isBooking ? "bg-gray-300" : "bg-violet-600"}`}
//           disabled={isBookingDisabled || isBooking}
//           onPress={handleBookNow}
//           accessibilityLabel="Book selected items"
//         >
//           <Text
//             className={`text-center font-semibold text-lg ${isBookingDisabled || isBooking ? "text-gray-500" : "text-white"}`}
//           >
//             {isBooking
//               ? "Processing..."
//               : isBookingDisabled
//               ? selectedItems.length === 0
//                 ? "Select at least one item"
//                 : "Select dates for all items"
//               : `Book Now (${selectedItems.length} items)`}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={new Date()}
//           mode="date"
//           is24Hour={true}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleDateChange}
//           minimumDate={getMinDate()}
//           maximumDate={getMaxDate()}
//         />
//       )}
//     </View>
//   );
// };

// export default CartScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Platform,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

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
//   otp?: number;
//   isSelected: boolean;
//   ratings?: number;
//   reviews?: number;
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
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [currentItemId, setCurrentItemId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to view your cart");
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
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate || "",
//           isSelected: false,
//           ratings: item?.ratings,
//           reviews: item?.reviews,
//         }));
//         setCartData({
//           user: response.result.user,
//           cart: { ...response.result.cart, items: formattedItems },
//         });
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate && currentItemId) {
//       const dateString = selectedDate.toISOString().split("T")[0];
//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((item) =>
//               item._id === currentItemId ? { ...item, bookingDate: dateString } : item
//             ),
//           },
//         };
//       });
//     }
//   };

//   const showDatePickerForItem = (itemId: string) => {
//     setCurrentItemId(itemId);
//     setShowDatePicker(true);
//   };

//   const handleClearDate = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           ),
//         },
//       };
//     });
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
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
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };
//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
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
//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, isSelected: !item.isSelected } : item
//           ),
//         },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to proceed");
//         return;
//       }
//       const selectedItems = cartData?.cart.items.filter((item) => item.isSelected) || [];
//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }
//       if (selectedItems.some((item) => !item.bookingDate)) {
//         setError("Please select dates for all selected items");
//         return;
//       }
//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: Math.round((item.servicePrice || item.price || 0) * item.quantity * 0.18).toString(),
//         totalPrice: Math.round((item.servicePrice || item.price || 0) * item.quantity * 1.18).toString(),
//       }));
//       const response = await createBookService(bookings);
//       if (response.success) {
//         Alert.alert("Success", "Booking confirmed!", [
//           { text: "OK", onPress: () => navigation.navigate("Transactions") },
//         ]);
//         await fetchCartData();
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMinDate = () => new Date();
//   const getMaxDate = () => {
//     const max = new Date();
//     max.setDate(max.getDate() + 7);
//     return max;
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
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#8b5cf6" />
//         <Text className="mt-4 text-gray-600 text-lg">Loading your cart...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-red-600 text-lg text-center mb-6">{error}</Text>
//         <View className="flex-row gap-4">
//           {error.includes("log in") && (
//             <TouchableOpacity
//               className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//               onPress={() => navigation.navigate("Login")}
//               accessibilityLabel="Log in to continue"
//             >
//               <Text className="text-white font-semibold text-base">Log In</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//             onPress={() => {
//               setError(null);
//               fetchCartData();
//             }}
//             accessibilityLabel="Retry loading cart"
//           >
//             <Text className="text-white font-semibold text-base">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-gray-600 text-lg mb-6">Your cart is empty</Text>
//         <TouchableOpacity
//           className="bg-violet-600 px-8 py-4 rounded-full shadow-md"
//           onPress={() => navigation.navigate("Category")}
//           accessibilityLabel="Browse services"
//         >
//           <Text className="text-white font-semibold text-base">Browse Services</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const selectedItems = cartData.cart.items.filter((item) => item.isSelected);
//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <View className="flex-1 bg-gray-50">
//       <ScrollView className="px-4 py-6 pb-20">
//         <Text className="text-3xl font-bold text-gray-900 mb-6">Your Cart</Text>

//         {cartData.cart.items.map((item) => {
//           const isProcessing = processingItems[item._id];
//           const { subtotal } = calculateItemTotal(item);
//           return (
//             <View
//               key={item._id}
//               className={`flex-row items-center bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-200 ${isProcessing ? "opacity-60" : ""}`}
//             >
//               <TouchableOpacity
//                 className="mr-4"
//                 onPress={() => handleCheckboxChange(item._id)}
//                 disabled={isProcessing}
//                 accessibilityLabel={`Select ${item.serviceName}`}
//               >
//                 <Ionicons
//                   name={item.isSelected ? "checkbox" : "square-outline"}
//                   size={26}
//                   color="#8b5cf6"
//                 />
//               </TouchableOpacity>
//               <Image
//                 source={{ uri: item?.serviceImg || "https://via.placeholder.com/64" }}
//                 className="w-16 h-16 rounded-lg"
//                 resizeMode="cover"
//               />
//               <View className="flex-1 ml-4">
//                 <Text className="text-lg font-semibold text-gray-900">{item.serviceName}</Text>
//                 <Text className="text-gray-600 text-sm">
//                   ₹ <Text className="text-violet-600">{item.servicePrice}</Text> per unit
//                 </Text>
//                 {item.ratings && (
//                   <View className="flex-row items-center gap-1 mt-1">
//                     <Text className="text-sm text-yellow-500">★</Text>
//                     <Text className="text-sm text-gray-600">{item.ratings}</Text>
//                     <Text className="text-sm text-gray-500">({item.reviews} reviews)</Text>
//                   </View>
//                 )}
//               </View>
//               <View className="items-end">
//                 <View className="flex-row items-center bg-violet-50 rounded-lg px-1 py-1 border border-violet-200 mb-2">
//                   {item.quantity === 1 ? (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleRemove(item._id)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Remove ${item.serviceName}`}
//                     >
//                       <MaterialIcons name="delete" size={18} color="#ef4444" />
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Decrease quantity of ${item.serviceName}`}
//                     >
//                       <Ionicons name="remove" size={18} color="#8b5cf6" />
//                     </TouchableOpacity>
//                   )}
//                   <Text className="text-sm text-gray-900 w-10 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </Text>
//                   <TouchableOpacity
//                     className="p-2"
//                     onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     disabled={isProcessing}
//                     accessibilityLabel={`Increase quantity of ${item.serviceName}`}
//                   >
//                     <Ionicons name="add" size={18} color="#8b5cf6" />
//                   </TouchableOpacity>
//                 </View>
//                 <Text className="font-semibold text-gray-900">₹ {subtotal}</Text>
//                 <View className="flex-row items-center mt-2">
//                   {item.bookingDate ? (
//                     <>
//                       <TouchableOpacity
//                         className="flex-row items-center"
//                         onPress={() => showDatePickerForItem(item._id)}
//                         accessibilityLabel={`Change booking date for ${item.serviceName}`}
//                       >
//                         <FontAwesome5 name="calendar-alt" size={20} color="#3b82f6" />
//                         <Text className="text-sm text-blue-600 ml-2">{item.bookingDate}</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         className="ml-3"
//                         onPress={() => handleClearDate(item._id)}
//                         accessibilityLabel={`Clear booking date for ${item.serviceName}`}
//                       >
//                         <Ionicons name="close" size={18} color="#6b7280" />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       onPress={() => showDatePickerForItem(item._id)}
//                       accessibilityLabel={`Set booking date for ${item.serviceName}`}
//                     >
//                       {/* <Text className="text-sm text-blue-600">Set Date</Text> */}
//                       <Text>📅</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             </View>
//           );
//         })}

//         {selectedItems.length > 0 && (
//           <View className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//             <Text className="text-xl font-semibold text-gray-900 mb-4">Order Summary</Text>
//             {selectedItems.map((item) => {
//               const { subtotal, gst, total } = calculateItemTotal(item);
//               return (
//                 <View key={item._id} className="mb-4 p-3 bg-gray-50 rounded-lg">
//                   <View className="flex-row justify-between">
//                     <Text className="text-gray-900">{item.serviceName} (x{item.quantity})</Text>
//                     <Text className="text-gray-900">₹{subtotal}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>Booking Date</Text>
//                     <Text>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>GST (18%)</Text>
//                     <Text>₹{gst}</Text>
//                   </View>
//                   <View className="flex-row justify-between font-semibold text-gray-900 mt-2">
//                     <Text>Total</Text>
//                     <Text>₹{total}</Text>
//                   </View>
//                 </View>
//               );
//             })}
//             <View className="flex-row justify-between font-bold text-lg text-gray-900 mt-4">
//               <Text>Grand Total</Text>
//               <Text>
//                 ₹{selectedItems.reduce((sum, item) => sum + calculateItemTotal(item).total, 0)}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View className="flex-row justify-between items-center mt-6 mb-14">
//           <Text className="text-gray-600 text-base">Need more services?</Text>
//           <TouchableOpacity
//             className="bg-red-500 flex-row items-center px-4 py-2 rounded-full shadow-md"
//             onPress={() => navigation.navigate("Category")}
//             accessibilityLabel="Add more items to cart"
//           >
//             <Ionicons name="add" size={20} color="white" />
//             <Text className="text-white font-semibold ml-2">Add Items</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View className="p-4 bg-white border-t border-gray-200">
//         <TouchableOpacity
//           className={`w-full py-4 rounded-xl shadow-md ${isBookingDisabled || isBooking ? "bg-gray-300" : "bg-violet-600"}`}
//           disabled={isBookingDisabled || isBooking}
//           onPress={handleBookNow}
//           accessibilityLabel="Book selected items"
//         >
//           <Text
//             className={`text-center font-semibold text-lg ${isBookingDisabled || isBooking ? "text-gray-500" : "text-white"}`}
//           >
//             {isBooking
//               ? "Processing..."
//               : isBookingDisabled
//               ? selectedItems.length === 0
//                 ? "Select at least one item"
//                 : "Select dates for all items"
//               : `Book Now (${selectedItems.length} items)`}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={new Date()}
//           mode="date"
//           is24Hour={true}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleDateChange}
//           minimumDate={getMinDate()}
//           maximumDate={getMaxDate()}
//         />
//       )}
//     </View>
//   );
// };

// export default CartScreen;
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Platform,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods";

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
//   otp?: number;
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
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [currentItemId, setCurrentItemId] = useState<string | null>(null);
//   const [tempDate, setTempDate] = useState(new Date());

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to view your cart");
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
//           technicianId: item.technicianId,
//           bookingDate: item.bookingDate,
//           isSelected: false,
//         }));
//         setCartData({
//           user: response.result.user,
//           cart: { ...response.result.cart, items: formattedItems },
//         });
//       } else {
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate && currentItemId) {
//       const dateString = selectedDate.toISOString().split("T")[0];
//       setCartData((prev) => {
//         if (!prev) return null;
//         const updatedItems = prev.cart.items.map((item) =>
//           item._id === currentItemId ? { ...item, bookingDate: dateString } : item
//         );
//         return {
//           ...prev,
//           cart: { ...prev.cart, items: updatedItems },
//         };
//       });
//     }
//   };

//   const showDatePickerForItem = (itemId: string, currentDate: string) => {
//     setCurrentItemId(itemId);
//     setTempDate(currentDate ? new Date(currentDate) : new Date());
//     setShowDatePicker(true);
//   };

//   const handleClearDate = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       const updatedItems = prev.cart.items.map((item) =>
//         item._id === itemId ? { ...item, bookingDate: "" } : item
//       );
//       return {
//         ...prev,
//         cart: { ...prev.cart, items: updatedItems },
//       };
//     });
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
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
//       const payload = {
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };
//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
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
//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       setError("Failed to remove item");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       const updatedItems = prev.cart.items.map((item) =>
//         item._id === itemId ? { ...item, isSelected: !item.isSelected } : item
//       );
//       return {
//         ...prev,
//         cart: { ...prev.cart, items: updatedItems },
//       };
//     });
//   };

//   const handleBookNow = async () => {
//     try {
//       setIsBooking(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("Please log in to proceed");
//         return;
//       }
//       const selectedItems = cartData?.cart.items.filter((item) => item.isSelected) || [];
//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }
//       if (selectedItems.some((item) => !item.bookingDate)) {
//         setError("Please select dates for all selected items");
//         return;
//       }
//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId,
//         technicianId: item.technicianId,
//         quantity: item.quantity.toString(),
//         bookingDate: item.bookingDate,
//         servicePrice: ((item.servicePrice || item.price || 0) * item.quantity).toString(),
//         gst: Math.round((item.servicePrice || item.price || 0) * item.quantity * 0.18).toString(),
//         totalPrice: Math.round((item.servicePrice || item.price || 0) * item.quantity * 1.18).toString(),
//       }));
//       const response = await createBookService(bookings);
//       if (response.success) {
//         Alert.alert("Success", "Booking confirmed!", [
//           { text: "OK", onPress: () => navigation.navigate("Transactions") },
//         ]);
//         await fetchCartData();
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMinDate = () => new Date();
//   const getMaxDate = () => {
//     const max = new Date();
//     max.setDate(max.getDate() + 7);
//     return max;
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
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#8b5cf6" />
//         <Text className="mt-4 text-gray-600 text-lg">Loading your cart...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-red-600 text-lg text-center mb-6">{error}</Text>
//         <View className="flex-row gap-4">
//           {error.includes("log in") && (
//             <TouchableOpacity
//               className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//               onPress={() => navigation.navigate("Login")}
//               accessibilityLabel="Log in to continue"
//             >
//               <Text className="text-white font-semibold text-base">Log In</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             className="bg-violet-600 px-6 py-3 rounded-full shadow-md"
//             onPress={() => {
//               setError(null);
//               fetchCartData();
//             }}
//             accessibilityLabel="Retry loading cart"
//           >
//             <Text className="text-white font-semibold text-base">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50 p-6">
//         <Text className="text-gray-600 text-lg mb-6">Your cart is empty</Text>
//         <TouchableOpacity
//           className="bg-violet-600 px-8 py-4 rounded-full shadow-md"
//           onPress={() => navigation.navigate("Category")}
//           accessibilityLabel="Browse services"
//         >
//           <Text className="text-white font-semibold text-base">Browse Services</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const selectedItems = cartData.cart.items.filter((item) => item.isSelected);
//   const isBookingDisabled = selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <View className="flex-1 bg-gray-50">
//       <ScrollView className="px-4 py-6 pb-20">
//         <Text className="text-3xl font-bold text-gray-900 mb-6">Your Cart</Text>

//         {cartData.cart.items.map((item) => {
//           const isProcessing = processingItems[item._id];
//           const { subtotal } = calculateItemTotal(item);
//           return (
//             <View
//               key={item._id}
//               className={`flex-row items-center bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-200 ${isProcessing ? "opacity-60" : ""}`}
//             >
//               <TouchableOpacity
//                 className="mr-4"
//                 onPress={() => handleCheckboxChange(item._id)}
//                 disabled={isProcessing}
//                 accessibilityLabel={`Select ${item.serviceName}`}
//               >
//                 <Ionicons
//                   name={item.isSelected ? "checkbox" : "square-outline"}
//                   size={26}
//                   color="#8b5cf6"
//                 />
//               </TouchableOpacity>
//               <Image
//                 source={{ uri: item?.serviceImg || "https://via.placeholder.com/64" }}
//                 className="w-16 h-16 rounded-lg"
//                 resizeMode="cover"
//               />
//               <View className="flex-1 ml-4">
//                 <Text className="text-lg font-semibold text-gray-900">{item.serviceName}</Text>
//                 <Text className="text-gray-600 text-sm">
//                   ₹ <Text className="text-violet-600">{item.servicePrice}</Text> per unit
//                 </Text>
//               </View>
//               <View className="items-end ml-1">
//                 <View className="flex-row items-center bg-violet-50 rounded-lg  py-1 border border-violet-200 mb-2 ">
//                   {item.quantity === 1 ? (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleRemove(item._id)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Remove ${item.serviceName}`}
//                     >
//                       <MaterialIcons name="delete" size={18} color="#ef4444" />
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       className="p-2"
//                       onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                       disabled={isProcessing}
//                       accessibilityLabel={`Decrease quantity of ${item.serviceName}`}
//                     >
//                       <Ionicons name="remove" size={18} color="#8b5cf6" />
//                     </TouchableOpacity>
//                   )}
//                   <Text className="text-sm text-gray-900 w-10 text-center">
//                     {isProcessing ? "..." : item.quantity}
//                   </Text>
//                   <TouchableOpacity
//                     className="p-2"
//                     onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                     disabled={isProcessing}
//                     accessibilityLabel={`Increase quantity of ${item.serviceName}`}
//                   >
//                     <Ionicons name="add" size={18} color="#8b5cf6" />
//                   </TouchableOpacity>
//                 </View>
//                 <Text className="font-semibold text-gray-900">₹ {subtotal}</Text>
//                 <View className="flex-row items-center mt-2">
//                   {item.bookingDate ? (
//                     <>
//                       <TouchableOpacity
//                         className="flex-row items-center"
//                         onPress={() => showDatePickerForItem(item._id, item.bookingDate)}
//                         accessibilityLabel={`Change booking date for ${item.serviceName}`}
//                       >
//                         <FontAwesome5 name="calendar-alt" size={20} color="#3b82f6" />
//                         <Text className="text-sm text-blue-600 ml-2">{item.bookingDate}</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         className="ml-3"
//                         onPress={() => handleClearDate(item._id)}
//                         accessibilityLabel={`Clear booking date for ${item.serviceName}`}
//                       >
//                         <Ionicons name="close" size={18} color="#6b7280" />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       onPress={() => showDatePickerForItem(item._id, "")}
//                       accessibilityLabel={`Set booking date for ${item.serviceName}`}
//                     >
//                       {/* <Text className="text-sm text-blue-600">Set Date</Text> */}
//                       <Text>📅</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             </View>
//           );
//         })}

//         {selectedItems.length > 0 && (
//           <View className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//             <Text className="text-xl font-semibold text-gray-900 mb-4">Order Summary</Text>
//             {selectedItems.map((item) => {
//               const { subtotal, gst, total } = calculateItemTotal(item);
//               return (
//                 <View key={item._id} className="mb-4 p-3 bg-gray-50 rounded-lg">
//                   <View className="flex-row justify-between">
//                     <Text className="text-gray-900">{item.serviceName} (x{item.quantity})</Text>
//                     <Text className="text-gray-900">₹{subtotal}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>Booking Date</Text>
//                     <Text>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</Text>
//                   </View>
//                   <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                     <Text>GST (18%)</Text>
//                     <Text>₹{gst}</Text>
//                   </View>
//                   <View className="flex-row justify-between font-semibold text-gray-900 mt-2">
//                     <Text>Total</Text>
//                     <Text>₹{total}</Text>
//                   </View>
//                 </View>
//               );
//             })}
//             <View className="flex-row justify-between font-bold text-lg text-gray-900 mt-4">
//               <Text>Grand Total</Text>
//               <Text>
//                 ₹{selectedItems.reduce((sum, item) => sum + calculateItemTotal(item).total, 0)}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View className="flex-row justify-between items-center mt-6 mb-14">
//           <Text className="text-gray-600 text-base">Need more services?</Text>
//           <TouchableOpacity
//             className="bg-red-500 flex-row items-center px-4 py-2 rounded-full shadow-md"
//             onPress={() => navigation.navigate("Category")}
//             accessibilityLabel="Add more items to cart"
//           >
//             <Ionicons name="add" size={20} color="white" />
//             <Text className="text-white font-semibold ml-2">Add Items</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View className="p-4 bg-white border-t border-gray-200 ">
//         <TouchableOpacity
//           className={`w-full py-4 rounded-xl shadow-md ${isBookingDisabled || isBooking ? "bg-gray-300" : "bg-violet-600"}`}
//           disabled={isBookingDisabled || isBooking}
//           onPress={handleBookNow}
//           accessibilityLabel="Book selected items"
//         >
//           <Text
//             className={`text-center font-semibold text-lg ${isBookingDisabled || isBooking ? "text-gray-500" : "text-white"}`}
//           >
//             {isBooking
//               ? "Processing..."
//               : isBookingDisabled
//               ? selectedItems.length === 0
//                 ? "Select at least one item"
//                 : "Select dates for all items"
//               : `Book Now (${selectedItems.length} items)`}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={tempDate}
//           mode="date"
//           is24Hour={true}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleDateChange}
//           minimumDate={getMinDate()}
//           maximumDate={getMaxDate()}
//         />
//       )}
//     </View>
//   );
// };

// export default CartScreen;
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   TextInput,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { removeFromCart, addToCart, getCartItems, createBookService } from "../api/apiMethods"; // Assume this is adapted for RN

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
//   otp?: number;
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
//   const [processingItems, setProcessingItems] = useState<{ [key: string]: boolean }>({});
//   const [isBooking, setIsBooking] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [currentItemId, setCurrentItemId] = useState<string | null>(null);
//   const [tempDate, setTempDate] = useState(new Date());

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
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
//           technicianId: item.technicianId,
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
//         setError("Failed to fetch cart data");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to fetch cart data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate && currentItemId) {
//       const dateString = selectedDate.toISOString().split("T")[0];
//       setCartData((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           cart: {
//             ...prev.cart,
//             items: prev.cart.items.map((item) =>
//               item._id === currentItemId ? { ...item, bookingDate: dateString } : item
//             ),
//           },
//         };
//       });
//       setSelectedItems((prev) =>
//         prev.map((item) =>
//           item._id === currentItemId ? { ...item, bookingDate: dateString } : item
//         )
//       );
//     }
//   };

//   const showDatePickerForItem = (itemId: string, currentDate: string) => {
//     setCurrentItemId(itemId);
//     setTempDate(currentDate ? new Date(currentDate) : new Date());
//     setShowDatePicker(true);
//   };

//   const handleClearDate = (itemId: string) => {
//     setCartData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         cart: {
//           ...prev.cart,
//           items: prev.cart.items.map((item) =>
//             item._id === itemId ? { ...item, bookingDate: "" } : item
//           ),
//         },
//       };
//     });
//     setSelectedItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId ? { ...item, bookingDate: "" } : item
//       )
//     );
//   };

//   const handleQuantityChange = async (itemId: string, delta: number) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
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
//         technicianId: item.technicianId,
//         quantity: newQuantity,
//       };
//       await addToCart(payload);
//     } catch (err: any) {
//       setError("Failed to update quantity");
//       await fetchCartData();
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemove = async (itemId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [itemId]: true }));
//       const userId = await AsyncStorage.getItem("userId");
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
//       await removeFromCart({ userId, serviceId: item.serviceId, technicianId: item.technicianId });
//     } catch (err: any) {
//       setError("Failed to remove item");
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
//           setSelectedItems((prevSelected) => {
//             if (newSelectedState) {
//               return [...prevSelected, { ...item, isSelected: true }];
//             } else {
//               return prevSelected.filter((selected) => selected._id !== itemId);
//             }
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
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         setError("User not logged in");
//         return;
//       }
//       if (selectedItems.length === 0) {
//         setError("No items selected for booking");
//         return;
//       }
//       const bookings = selectedItems.map((item) => ({
//         userId,
//         serviceId: item.serviceId,
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
//         navigation.navigate("Transactions");
//       } else {
//         setError(response.message || "Booking failed");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to create bookings");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const getMinDate = () => new Date();
//   const getMaxDate = () => {
//     const max = new Date();
//     max.setDate(max.getDate() + 7);
//     return max;
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
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#d946ef" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white p-6">
//         <Text className="text-red-500 text-center mb-4">{error}</Text>
//         <View className="flex-row justify-center gap-4">
//           {error.includes("log in") && (
//             <TouchableOpacity
//               className="bg-fuchsia-500 px-4 py-2 rounded-lg"
//               onPress={() => navigation.navigate("Login")}
//             >
//               <Text className="text-white font-semibold">Log In</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             className="bg-fuchsia-500 px-4 py-2 rounded-lg"
//             onPress={() => {
//               setError(null);
//               fetchCartData();
//             }}
//           >
//             <Text className="text-white font-semibold">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (!cartData || !cartData.cart?.items || cartData.cart?.items?.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white p-6">
//         <Text className="text-gray-500 text-lg mb-4">Your cart is empty</Text>
//         <TouchableOpacity
//           className="bg-fuchsia-500 px-6 py-3 rounded-lg"
//           onPress={() => navigation.navigate("Category")}
//         >
//           <Text className="text-white font-semibold">Browse Services</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const isBookingDisabled =
//     selectedItems.length === 0 || selectedItems.some((item) => !item.bookingDate);

//   return (
//     <ScrollView className="flex-1 bg-white px-4 py-6">
//       <Text className="text-2xl font-bold text-gray-800 mb-6">Your Cart</Text>

//       {cartData.cart?.items?.map((item) => {
//         const isProcessing = processingItems[item._id];
//         const { subtotal } = calculateItemTotal(item);
//         return (
//           <View
//             key={item._id}
//             className={`flex-row items-center justify-between border border-gray-300 p-4 rounded-xl bg-white shadow-md mb-4 ${isProcessing ? "opacity-70" : ""}`}
//           >
//             <TouchableOpacity
//               className="mr-3"
//               onPress={() => handleCheckboxChange(item._id)}
//               disabled={isProcessing}
//             >
//               <Ionicons
//                 name={item.isSelected ? "checkbox" : "square-outline"}
//                 size={24}
//                 color="#d946ef"
//               />
//             </TouchableOpacity>
//             <Image
//               source={{ uri: item?.serviceImg || "https://via.placeholder.com/64" }}
//               className="w-16 h-16 rounded-xl"
//               resizeMode="cover"
//             />
//             <View className="flex-1 ml-4">
//               <Text className="text-lg font-semibold">{item?.serviceName}</Text>
//               <Text className="text-gray-600">
//                 ₹ <Text className="text-blue-600">{item?.servicePrice}</Text> per unit
//               </Text>
//               {/* Assuming ratings and reviews are optional and not in interface */}
//             </View>
//             <View className="items-end">
//               <View className="flex-row items-center bg-fuchsia-100 rounded-lg px-2 border border-fuchsia-400 mb-2">
//                 {item.quantity === 1 ? (
//                   <TouchableOpacity
//                     className="p-1"
//                     onPress={() => !isProcessing && handleRemove(item._id)}
//                     disabled={isProcessing}
//                   >
//                     <MaterialIcons name="delete" size={16} color="red" />
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     className="p-1"
//                     onPress={() => !isProcessing && handleQuantityChange(item._id, -1)}
//                     disabled={isProcessing}
//                   >
//                     <Ionicons name="remove" size={16} color="#a21caf" />
//                   </TouchableOpacity>
//                 )}
//                 <Text className="text-sm text-black w-8 text-center">
//                   {isProcessing ? "..." : item.quantity}
//                 </Text>
//                 <TouchableOpacity
//                   className="p-1"
//                   onPress={() => !isProcessing && handleQuantityChange(item._id, 1)}
//                   disabled={isProcessing}
//                 >
//                   <Ionicons name="add" size={16} color="#a21caf" />
//                 </TouchableOpacity>
//               </View>
//               <Text className="font-semibold text-gray-800">₹ {subtotal}</Text>
//               <View className="flex-row items-center mt-2">
//                 {item.bookingDate ? (
//                   <>
//                     <TouchableOpacity
//                       className="flex-row items-center"
//                       onPress={() => showDatePickerForItem(item._id, item.bookingDate)}
//                     >
//                       <FontAwesome5 name="calendar-alt" size={20} color="blue" />
//                       <Text className="text-sm text-blue-600 ml-1">{item.bookingDate}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       className="ml-2"
//                       onPress={() => handleClearDate(item._id)}
//                     >
//                       <Ionicons name="close" size={16} color="gray" />
//                     </TouchableOpacity>
//                   </>
//                 ) : (
//                   <TouchableOpacity
//                     onPress={() => showDatePickerForItem(item._id, "")}
//                   >
//                     <FontAwesome5 name="calendar-alt" size={20} color="blue" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           </View>
//         );
//       })}

//       {selectedItems.length > 0 && (
//         <View className="mt-6 border-t pt-4">
//           <Text className="text-lg font-semibold mb-4">Selected Items</Text>
//           {selectedItems.map((item) => {
//             const { subtotal, gst, total } = calculateItemTotal(item);
//             return (
//               <View key={item._id} className="mb-4 px-4 py-3 border rounded-lg bg-gray-50">
//                 <View className="flex-row justify-between">
//                   <Text>{item.serviceName} ({item.quantity})</Text>
//                   <Text>₹{subtotal}</Text>
//                 </View>
//                 <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                   <Text>Booking Date</Text>
//                   <Text>{item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "Not set"}</Text>
//                 </View>
//                 <View className="flex-row justify-between text-sm text-gray-600 mt-1">
//                   <Text>GST (18%)</Text>
//                   <Text>₹{gst}</Text>
//                 </View>
//                 <View className="flex-row justify-between font-semibold mt-2">
//                   <Text>Total</Text>
//                   <Text>₹{total}</Text>
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       )}

//       <View className="flex-row justify-between items-center mt-6">
//         <Text className="text-gray-800 font-medium">Missed Something?</Text>
//         <TouchableOpacity
//           className="bg-red-600 flex-row items-center text-white px-3 py-1.5 rounded-lg"
//           onPress={() => navigation.navigate("Category")}
//         >
//           <Ionicons name="add" size={20} color="white" className="mr-1" />
//           <Text className="text-white font-medium">Add More Items</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         className={`w-full mt-6 mb-10 py-4 rounded-xl ${isBookingDisabled ? "bg-gray-200" : "bg-fuchsia-500"} ${isBooking ? "opacity-70" : ""}`}
//         disabled={isBookingDisabled || isBooking}
//         onPress={handleBookNow}
//       >
//         <Text className={`text-center text-white font-semibold text-lg ${isBookingDisabled ? "text-gray-500" : ""}`}>
//           {isBooking ? "Processing..." :
//             isBookingDisabled
//               ? selectedItems.length === 0
//                 ? "Select at least one item"
//                 : "Select dates for all selected items"
//               : "Book Now"}
//         </Text>
//       </TouchableOpacity>

//       {showDatePicker && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={tempDate}
//           mode="date"
//           is24Hour={true}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleDateChange}
//           minimumDate={getMinDate()}
//           maximumDate={getMaxDate()}
//         />
//       )}
//     </ScrollView>
//   );
// };

// export default CartScreen;
// // screens/CartScreen.tsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Alert,
//   Modal,
//   Dimensions,
// } from "react-native";
// import { Minus, Plus, Trash2, X, ChevronDown, ChevronUp, Calendar } from "lucide-react-native";
// import { useNavigation } from "@react-navigation/native";

// interface CartItem {
//   _id: string;
//   serviceId: string;
//   serviceName: string;
//   serviceImg?: string;
//   servicePrice: number;
//   quantity: number;
//   isSelected: boolean;
//   bookingDate: string;
// }

// interface Day {
//   date: Date;
//   day: number;
//   month: string;
//   dayName: string;
//   isCurrentMonth: boolean;
//   isToday: boolean;
//   isSelected: boolean;
// }

// const CartScreen = () => {
//   const navigation = useNavigation<any>();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [datePickerItemId, setDatePickerItemId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
//   const [weekDays, setWeekDays] = useState<Day[]>([]);

//   // Generate week days
//   const generateWeekDays = (startDate: Date) => {
//     const days: Day[] = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startDate);
//       date.setDate(startDate.getDate() + i);
//       date.setHours(0, 0, 0, 0);
      
//       days.push({
//         date,
//         day: date.getDate(),
//         month: date.toLocaleString('default', { month: 'short' }),
//         dayName: date.toLocaleString('default', { weekday: 'short' }),
//         isCurrentMonth: true,
//         isToday: date.getTime() === today.getTime(),
//         isSelected: false,
//       });
//     }
    
//     return days;
//   };

//   // Initialize week days
//   useEffect(() => {
//     const startOfWeek = new Date(selectedWeek);
//     startOfWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay());
//     setWeekDays(generateWeekDays(startOfWeek));
//   }, [selectedWeek]);

//   // Sample data - replace with your actual data fetching logic
//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const fetchCartData = async () => {
//     // Simulate API call
//     setTimeout(() => {
//       const sampleItems: CartItem[] = [
//         {
//           _id: "1",
//           serviceId: "srv1",
//           serviceName: "Iohitha",
//           serviceImg: "https://via.placeholder.com/64",
//           servicePrice: 399,
//           quantity: 1,
//           isSelected: false,
//           bookingDate: "",
//         },
//         {
//           _id: "2",
//           serviceId: "srv2",
//           serviceName: "Foam-jet AC service (2 ACs) ₹500 per AC",
//           serviceImg: "https://via.placeholder.com/64",
//           servicePrice: 999,
//           quantity: 1,
//           isSelected: false,
//           bookingDate: "",
//         },
//         {
//           _id: "3",
//           serviceId: "srv3",
//           serviceName: "Foam-jet AC service (3 ACs)",
//           serviceImg: "https://via.placeholder.com/64",
//           servicePrice: 1498,
//           quantity: 1,
//           isSelected: false,
//           bookingDate: "",
//         },
//         {
//           _id: "4",
//           serviceId: "srv4",
//           serviceName: "Foam-jet AC service (4 ACs)",
//           serviceImg: "https://via.placeholder.com/64",
//           servicePrice: 1997,
//           quantity: 1,
//           isSelected: false,
//           bookingDate: "",
//         },
//         {
//           _id: "5",
//           serviceId: "srv5",
//           serviceName: "Foam-jet service (5 ACs)",
//           serviceImg: "https://via.placeholder.com/64",
//           servicePrice: 2496,
//           quantity: 1,
//           isSelected: false,
//           bookingDate: "",
//         },
//       ];

//       setCartItems(sampleItems);
//       setLoading(false);
//     }, 500);
//   };

//   const handleQuantityChange = (itemId: string, delta: number) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item._id === itemId
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   const handleRemove = (itemId: string) => {
//     setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
//   };

//   const handleCheckboxChange = (itemId: string) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item._id === itemId ? { ...item, isSelected: !item.isSelected } : item
//       )
//     );
//   };

//   const handleDateSelect = (date: Date) => {
//     if (datePickerItemId) {
//       const formattedDate = date.toISOString().split('T')[0];
//       setCartItems(prevItems =>
//         prevItems.map(item =>
//           item._id === datePickerItemId
//             ? { ...item, bookingDate: formattedDate }
//             : item
//         )
//       );
//       setShowDatePicker(false);
//       setDatePickerItemId(null);
//     }
//   };

//   const openDatePicker = (itemId: string) => {
//     setDatePickerItemId(itemId);
//     setShowDatePicker(true);
//   };

//   const navigateWeek = (direction: 'prev' | 'next') => {
//     const newDate = new Date(selectedWeek);
//     newDate.setDate(selectedWeek.getDate() + (direction === 'next' ? 7 : -7));
//     setSelectedWeek(newDate);
//   };

//   const calculateItemTotal = (item: CartItem) => {
//     const subtotal = item.servicePrice * item.quantity;
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   const calculateCartTotal = () => {
//     const selectedItems = cartItems.filter(item => item.isSelected);
//     const subtotal = selectedItems.reduce(
//       (sum, item) => sum + item.servicePrice * item.quantity,
//       0
//     );
//     const gst = Math.round(subtotal * 0.18);
//     const total = subtotal + gst;
//     return { subtotal, gst, total };
//   };

//   const handleBookNow = () => {
//     const selectedItems = cartItems.filter(item => item.isSelected);
//     if (selectedItems.length === 0) {
//       Alert.alert("Error", "Please select at least one item to proceed");
//       return;
//     }
    
//     // Check if all selected items have a booking date
//     const itemsWithoutDate = selectedItems.filter(item => !item.bookingDate);
//     if (itemsWithoutDate.length > 0) {
//       Alert.alert("Error", "Please select a date for all selected services");
//       return;
//     }
    
//     // Proceed with booking
//     Alert.alert("Success", "Booking confirmed!");
//     navigation.navigate("Transactions");
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-100">
//       <View className="p-4 bg-white shadow-sm">
//         <Text className="text-2xl font-bold text-gray-800">Your Cart</Text>
//       </View>

//       {cartItems.length === 0 ? (
//         <View className="flex-1 items-center justify-center mt-10">
//           <Text className="text-gray-500 mb-3">Your cart is empty</Text>
//           <TouchableOpacity
//             className="bg-fuchsia-500 px-4 py-2 rounded-lg"
//             onPress={() => navigation.navigate("Categories")}
//           >
//             <Text className="text-white font-semibold">Browse Services</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <ScrollView className="flex-1 p-4">
//           {/* Display all cart items without categories */}
//           <View className="mb-4 bg-white rounded-xl shadow">
//             {cartItems.map((item, index) => (
//               <View
//                 key={item._id}
//                 className={`flex-row items-center p-4 ${index < cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}
//               >
//                 {/* Checkbox */}
//                 <TouchableOpacity
//                   onPress={() => handleCheckboxChange(item._id)}
//                   className={`w-5 h-5 rounded-md mr-3 border-2 ${
//                     item.isSelected
//                       ? "bg-fuchsia-500 border-fuchsia-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {item.isSelected && (
//                     <View className="w-full h-full items-center justify-center">
//                       <Text className="text-white text-xs">✓</Text>
//                     </View>
//                   )}
//                 </TouchableOpacity>

//                 {/* Image */}
//                 <Image
//                   source={{ uri: item.serviceImg }}
//                   className="w-16 h-16 rounded-lg"
//                 />

//                 {/* Info */}
//                 <View className="flex-1 ml-3">
//                   <Text className="font-semibold text-gray-800">
//                     {item.serviceName}
//                   </Text>
//                   <Text className="text-gray-500">
//                     ₹{item.servicePrice} per unit
//                   </Text>
                  
//                   {/* Date Picker */}
//                   <TouchableOpacity
//                     onPress={() => openDatePicker(item._id)}
//                     className="flex-row items-center mt-1"
//                   >
//                     <Calendar size={14} color="#6B7280" />
//                     <Text className="text-gray-600 ml-1 text-sm">
//                       {item.bookingDate || "Select date"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Quantity Controls */}
//                 <View className="flex-row items-center">
//                   {item.quantity === 1 ? (
//                     <TouchableOpacity
//                       onPress={() => handleRemove(item._id)}
//                       className="p-1"
//                     >
//                       <Trash2 size={18} color="#EF4444" />
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       onPress={() => handleQuantityChange(item._id, -1)}
//                       className="p-1"
//                     >
//                       <Minus size={18} color="#6B7280" />
//                     </TouchableOpacity>
//                   )}
//                   <Text className="mx-2 font-medium">{item.quantity}</Text>
//                   <TouchableOpacity
//                     onPress={() => handleQuantityChange(item._id, 1)}
//                     className="p-1"
//                   >
//                     <Plus size={18} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* Cart Summary */}
//           <View className="bg-white p-4 rounded-xl shadow mt-4">
//             <Text className="text-lg font-semibold mb-2">Order Summary</Text>
            
//             {cartItems
//               .filter(item => item.isSelected)
//               .map(item => {
//                 const { subtotal, gst, total } = calculateItemTotal(item);
//                 return (
//                   <View key={item._id} className="mb-3">
//                     <Text className="text-gray-800">
//                       {item.serviceName} ({item.quantity}) - ₹{subtotal}
//                     </Text>
//                     <Text className="text-sm text-gray-600">
//                       GST: ₹{gst}, Total: ₹{total}
//                     </Text>
//                     {item.bookingDate && (
//                       <Text className="text-sm text-gray-500 mt-1">
//                         Date: {item.bookingDate}
//                       </Text>
//                     )}
//                   </View>
//                 );
//               })}
            
//             {cartItems.filter(item => item.isSelected).length > 0 && (
//               <View className="border-t border-gray-200 pt-3 mt-2">
//                 <View className="flex-row justify-between mb-1">
//                   <Text className="font-medium">Subtotal:</Text>
//                   <Text>₹{calculateCartTotal().subtotal}</Text>
//                 </View>
//                 <View className="flex-row justify-between mb-1">
//                   <Text className="font-medium">GST (18%):</Text>
//                   <Text>₹{calculateCartTotal().gst}</Text>
//                 </View>
//                 <View className="flex-row justify-between mt-2">
//                   <Text className="font-bold">Total:</Text>
//                   <Text className="font-bold">₹{calculateCartTotal().total}</Text>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Book Now Button */}
//           <TouchableOpacity
//             onPress={handleBookNow}
//             className={`py-3 rounded-xl mt-6 mb-8 ${
//               cartItems.filter(item => item.isSelected).length === 0
//                 ? "bg-gray-300"
//                 : "bg-fuchsia-500"
//             }`}
//           >
//             <Text className="text-center text-white font-semibold text-lg">
//               Book Now
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}

//       {/* One Week Calendar Modal */}
//       <Modal
//         visible={showDatePicker}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowDatePicker(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50">
//           <View className="bg-white rounded-xl p-5 w-11/12">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold">Select Date</Text>
//               <TouchableOpacity onPress={() => setShowDatePicker(false)}>
//                 <X size={24} color="#4B5563" />
//               </TouchableOpacity>
//             </View>

//             {/* Week Navigation */}
//             <View className="flex-row justify-between items-center mb-4">
//               <TouchableOpacity 
//                 onPress={() => navigateWeek('prev')}
//                 className="p-2"
//               >
//                 <ChevronDown size={20} color="#4B5563" style={{ transform: [{ rotate: '90deg' }] }} />
//               </TouchableOpacity>
              
//               <Text className="text-lg font-semibold">
//                 {weekDays[0]?.month} {weekDays[0]?.day} - {weekDays[6]?.month} {weekDays[6]?.day}
//               </Text>
              
//               <TouchableOpacity 
//                 onPress={() => navigateWeek('next')}
//                 className="p-2"
//               >
//                 <ChevronDown size={20} color="#4B5563" style={{ transform: [{ rotate: '-90deg' }] }} />
//               </TouchableOpacity>
//             </View>

//             {/* Week Days */}
//             <View className="flex-row justify-between mb-4">
//               {weekDays.map((day, index) => {
//                 const isSelected = cartItems.find(item => 
//                   item._id === datePickerItemId && 
//                   item.bookingDate === day.date.toISOString().split('T')[0]
//                 );
                
//                 return (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => handleDateSelect(day.date)}
//                     className={`items-center justify-center p-2 rounded-full ${
//                       day.isToday ? "bg-fuchsia-100" : ""
//                     } ${isSelected ? "bg-fuchsia-500" : ""}`}
//                     style={{ width: Dimensions.get('window').width / 8 }}
//                   >
//                     <Text className={`text-xs ${isSelected ? "text-white" : "text-gray-500"}`}>
//                       {day.dayName}
//                     </Text>
//                     <Text className={`text-lg font-semibold ${isSelected ? "text-white" : day.isToday ? "text-fuchsia-600" : "text-gray-800"}`}>
//                       {day.day}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             <TouchableOpacity
//               onPress={() => setShowDatePicker(false)}
//               className="bg-fuchsia-500 py-3 rounded-xl mt-4"
//             >
//               <Text className="text-center text-white font-semibold">Confirm Date</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default CartScreen;







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