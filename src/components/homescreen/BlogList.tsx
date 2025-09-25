import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Blog {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: Blog[];
}

// Mock API function - replace with your actual API call
const getAllBlogs = async (): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      {
        _id: '1',
        name: 'Home Tips',
        image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
        title: '10 Essential Home Maintenance Tips',
        description: 'Keep your home in perfect condition with these expert maintenance tips that will save you money.',
        tags: ['home', 'maintenance'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        __v: 0,
      },
      {
        _id: '2',
        name: 'Garden Care',
        image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        title: 'Beautiful Garden Design Ideas',
        description: 'Transform your outdoor space with these stunning garden design concepts and creative solutions.',
        tags: ['garden', 'design'],
        createdAt: '2024-01-14T09:00:00Z',
        updatedAt: '2024-01-14T09:00:00Z',
        __v: 0,
      },
      {
        _id: '3',
        name: 'Kitchen Tips',
        image: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg',
        title: 'Modern Kitchen Organization',
        description: 'Organize your kitchen like a pro with these modern organization techniques and smart storage.',
        tags: ['kitchen', 'organization'],
        createdAt: '2024-01-13T08:00:00Z',
        updatedAt: '2024-01-13T08:00:00Z',
        __v: 0,
      },
      {
        _id: '4',
        name: 'Cleaning',
        image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg',
        title: 'Professional Cleaning Secrets',
        description: 'Learn the secrets that professional cleaners use to achieve spotless results in record time.',
        tags: ['cleaning', 'tips'],
        createdAt: '2024-01-12T07:00:00Z',
        updatedAt: '2024-01-12T07:00:00Z',
        __v: 0,
      },
      {
        _id: '5',
        name: 'Repairs',
        image: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg',
        title: 'DIY Home Repair Guide',
        description: 'Master basic home repairs with our comprehensive DIY guide for common household issues.',
        tags: ['repair', 'diy'],
        createdAt: '2024-01-11T07:00:00Z',
        updatedAt: '2024-01-11T07:00:00Z',
        __v: 0,
      },
      {
        _id: '6',
        name: 'Plumbing',
        image: 'https://images.pexels.com/photos/8486727/pexels-photo-8486727.jpeg',
        title: 'Plumbing Maintenance 101',
        description: 'Prevent costly plumbing emergencies with these essential maintenance tips and tricks.',
        tags: ['plumbing', 'maintenance'],
        createdAt: '2024-01-10T07:00:00Z',
        updatedAt: '2024-01-10T07:00:00Z',
        __v: 0,
      },
    ],
  };
};

const BlogListPage: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);
  const animationRef = useRef<number>();
  const cardWidth = width * 0.8;
  const cardSpacing = 16;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response: ApiResponse = await getAllBlogs();
        if (response.success && Array.isArray(response.data)) {
          // Triple the blogs for smooth infinite scroll
          const tripleBlogs = [...response.data, ...response.data, ...response.data];
          setBlogs(tripleBlogs);
        } else {
          setError('No blogs found');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fast continuous auto-scroll animation
  useEffect(() => {
    if (isPaused || !scrollViewRef.current || blogs.length === 0) return;

    const scrollSpeed = 2; // Increased speed (pixels per frame)
    const maxScroll = (cardWidth + cardSpacing) * (blogs.length / 3);

    const animate = () => {
      scrollX.current += scrollSpeed;
      
      // Reset to beginning when reaching the end of first set
      if (scrollX.current >= maxScroll) {
        scrollX.current = 0;
      }

      scrollViewRef.current?.scrollTo({ x: scrollX.current, animated: false });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, blogs, cardWidth, cardSpacing]);

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // Resume auto-scroll after user interaction
    setTimeout(() => setIsPaused(false), 2000);
  };

  const navigateToBlog = (blog: Blog) => {
    router.push(`/blogs/${blog._id}?blog=${encodeURIComponent(JSON.stringify(blog))}`);
  };

  const navigateToAllBlogs = () => {
    router.push('/blogs/all');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.loadingBar} />
            <View style={styles.loadingTitle} />
          </View>
          <View style={styles.loadingCardsContainer}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={[styles.loadingCard, { width: cardWidth }]}>
                <View style={styles.loadingImage} />
                <View style={styles.loadingContent}>
                  <View style={styles.loadingTextLine} />
                  <View style={[styles.loadingTextLine, { width: '60%' }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={() => {
              setLoading(true);
              setError(null);
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (blogs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.emptyText}>No blogs available at the moment.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.decorativeLine} />
            <View>
              <Text style={styles.headerTitle}>Latest Blogs</Text>
              <Text style={styles.headerSubtitle}>
                Discover expert tips and insights for your home
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={navigateToAllBlogs}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All Blogs</Text>
            <Text style={styles.viewAllArrow}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.scrollContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            contentContainerStyle={{
              paddingHorizontal: cardSpacing,
            }}
          >
            {blogs.map((blog, index) => (
              <TouchableOpacity
                key={`${blog._id}-${index}`}
                style={[styles.blogCard, { width: cardWidth }]}
                onPress={() => navigateToBlog(blog)}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: blog.image || 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=400',
                    }}
                    style={styles.blogImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                  <View style={styles.badgeContainer}>
                    <LinearGradient
                      colors={['#2563eb', '#7c3aed']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.categoryBadge}
                    >
                      <Text style={styles.categoryText}>
                        {blog.name}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.clockContainer}>
                    <View style={styles.clockBadge}>
                      <Text style={styles.clockIcon}>🕒</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.blogTitle} numberOfLines={2}>
                    {blog.title}
                  </Text>
                  
                  <Text style={styles.blogDescription} numberOfLines={3}>
                    {blog.description}
                  </Text>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateIcon}>📅</Text>
                      <Text style={styles.dateText}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagIcon}>🏷️</Text>
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>
                          {blog.tags[0] || 'General'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.readMoreContainer}>
                    <View style={styles.readMoreRow}>
                      <Text style={styles.readMoreLabel}>Read Article</Text>
                      <LinearGradient
                        colors={['#3b82f6', '#8b5cf6']}
                        style={styles.readMoreIcon}
                      >
                        <Text style={styles.readMoreArrow}>→</Text>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Edge gradients for smooth blending */}
          <LinearGradient
            colors={['rgba(248,250,252,0.9)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.leftGradient}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['transparent', 'rgba(248,250,252,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightGradient}
            pointerEvents="none"
          />
          
          {/* Status indicator */}
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isPaused ? '#fbbf24' : '#10b981' }]} />
            <Text style={styles.statusText}>
              {isPaused ? 'Paused' : 'Auto-scrolling'}
            </Text>
          </View>
        </View>

        {/* Pause message */}
        {isPaused && (
          <View style={styles.pauseMessage}>
            <View style={styles.pauseIndicator}>
              <View style={styles.pauseDot} />
              <Text style={styles.pauseText}>Touch ended - resuming soon...</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    paddingVertical: 64,
  },
  sectionContainer: {
    maxWidth: width - 32,
    marginHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  decorativeLine: {
    width: 4,
    height: 48,
    backgroundColor: '#ec4899',
    marginRight: 24,
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#6b7280',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  viewAllText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  viewAllArrow: {
    color: '#2563eb',
    fontSize: 18,
  },
  scrollContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: 'rgba(219,234,254,0.3)',
    padding: 32,
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    marginRight: 32,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  clockContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  clockBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  clockIcon: {
    fontSize: 16,
  },
  cardContent: {
    padding: 24,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 26,
  },
  blogDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tagBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  readMoreContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  readMoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readMoreLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  readMoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readMoreArrow: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    zIndex: 10,
  },
  rightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: '100%',
    zIndex: 10,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  pauseMessage: {
    alignItems: 'center',
    marginTop: 24,
  },
  pauseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pauseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
    marginRight: 8,
  },
  pauseText: {
    fontSize: 12,
    color: '#6b7280',
  },
  // Loading states
  loadingBar: {
    width: 4,
    height: 48,
    backgroundColor: '#e5e7eb',
    marginRight: 24,
    borderRadius: 2,
  },
  loadingTitle: {
    height: 32,
    width: 200,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  loadingCardsContainer: {
    flexDirection: 'row',
    gap: 24,
    overflow: 'hidden',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  loadingImage: {
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  loadingContent: {
    padding: 24,
  },
  loadingTextLine: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },
  // Error states
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default BlogListPage;







// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Dimensions,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import { getAllBlogs } from "../../api/apiMethods"; // Adjust path as needed

// // Define the Blog interface based on API response
// interface Blog {
//   _id: string;
//   name: string;
//   image: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // Define the API response interface
// interface ApiResponse {
//   success: boolean;
//   data: Blog[];
// }

// const BlogList: React.FC = () => {
//   const navigation = useNavigation();
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isPaused, setIsPaused] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const screenWidth = Dimensions.get("window").width;
//   const cardWidth = screenWidth * 0.8; // 80% of screen width
//   const cardSpacing = 16;
//   const scrollInterval = useRef<NodeJS.Timeout | null>(null);

//   // Fetch blogs on component mount
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response: ApiResponse = await getAllBlogs();
//         if (response.success && Array.isArray(response.data)) {
//           setBlogs(response.data);
//         } else {
//           setError("No blogs found");
//         }
//       } catch (err) {
//         console.error("Error fetching blogs:", err);
//         setError("Failed to load blogs. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   // Auto-scroll logic
//   useEffect(() => {
//     if (isPaused || blogs.length === 0) return;

//     const autoScroll = () => {
//       if (scrollViewRef.current) {
//         const currentOffset = scrollPosition;
//         const maxScroll = (cardWidth + cardSpacing) * (blogs.length - 1);

//         if (currentOffset >= maxScroll - 1) {
//           // Scroll back to the beginning
//           scrollViewRef.current.scrollTo({ x: 0, animated: true });
//           setScrollPosition(0);
//         } else {
//           // Scroll to the next card
//           const newOffset = currentOffset + cardWidth + cardSpacing;
//           scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
//           setScrollPosition(newOffset);
//         }
//       }
//     };

//     scrollInterval.current = setInterval(autoScroll, 1000);

//     return () => {
//       if (scrollInterval.current) {
//         clearInterval(scrollInterval.current);
//       }
//     };
//   }, [isPaused, blogs, scrollPosition]);

//   const [scrollPosition, setScrollPosition] = useState(0);

//   // Handle scroll events
//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     setScrollPosition(event.nativeEvent.contentOffset.x);
//   };

//   // Handle touch events for swipe
//   const handleTouchStart = () => {
//     setIsPaused(true);
//     // Resume auto-scroll after a delay when user stops interacting
//     setTimeout(() => setIsPaused(false), 3000);
//   };

//   // Calculate active indicator
//   const getActiveIndicator = () => {
//     return Math.floor(scrollPosition / (cardWidth + cardSpacing));
//   };

//   // Navigate to blog detail
//   const navigateToBlog = (blog: Blog) => {
//     navigation.navigate("BlogDetail", { blog });
//   };

//   // Navigate to all blogs
//   const navigateToAllBlogs = () => {
//     navigation.navigate("AllBlogs");
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-blue-50">
//         <Text className="text-gray-600">Loading blogs...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center bg-blue-50">
//         <Text className="text-red-600">{error}</Text>
//       </View>
//     );
//   }

//   if (blogs.length === 0) {
//     return (
//       <View className="flex-1 justify-center items-center bg-blue-50">
//         <Text className="text-gray-600">No blogs available at the moment.</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-blue-50 py-6" onTouchStart={handleTouchStart}>
//       <View className="px-4 mx-auto max-w-7xl">
//         {/* Header */}
//         <View className="flex-row justify-between items-center mb-6">
//           <View className="flex-row items-center">
//             <View className="w-1 h-12 bg-pink-500 mr-3 rounded-full" />
//             <Text className="text-3xl font-bold text-gray-900">Blogs</Text>
//           </View>
//           <TouchableOpacity onPress={navigateToAllBlogs}>
//             <Text className="text-lg font-semibold text-blue-600">
//               View All
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Blog Cards ScrollView */}
//         <ScrollView
//           ref={scrollViewRef}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           pagingEnabled={false}
//           snapToInterval={cardWidth + cardSpacing}
//           decelerationRate="fast"
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           contentContainerStyle={{
//             paddingHorizontal: (screenWidth - cardWidth) / 2 - cardSpacing,
//           }}
//           className="pb-8"
//         >
//           {blogs.map((blog) => (
//             <TouchableOpacity
//               key={blog._id}
//               className="bg-white rounded-xl shadow-md mx-2 overflow-hidden relative"
//               style={{ width: cardWidth }}
//               onPress={() => navigateToBlog(blog)}
//               activeOpacity={0.9}
//             >
//               <View className="relative">
//                 <Image
//                   source={{
//                     uri: blog.image || "https://via.placeholder.com/300x200",
//                   }}
//                   className="w-full h-48"
//                   resizeMode="cover"
//                 />
//                 <View className="p-4">
//                   <Text
//                     className="text-lg font-bold text-gray-900 mb-2"
//                     numberOfLines={2}
//                   >
//                     {blog.title}
//                   </Text>
//                   <View className="flex-row flex-wrap">
//                     <View style={{ marginRight: 4 }}>
//                       <Text style={{ fontSize: 18, color: "#2563EB" }}>🏷️</Text>
//                     </View>
//                     {blog.tags.slice(0, 2).map((tag, index) => (
//                       <View
//                         key={index}
//                         className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2"
//                       >
//                         <Text className="text-xs text-blue-800">{tag}</Text>
//                       </View>
//                     ))}
//                   </View>
//                   <View className="w-full flex flex-row justify-between items-center gap-2">

//                   <Text className="text-xs text-gray-500 mt-2">
//                     {new Date(blog.createdAt).toLocaleDateString()}
//                   </Text>
//                   <LinearGradient
//                     colors={["#2563EB", "#7C3AED"]} // from-blue-600 to-purple-600
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={{borderRadius:20, width: 'auto', paddingVertical: 10, paddingHorizontal: 20,}}
//                     className=""
//                   >
//                     <Text className="text-white text-xs font-semibold text-center">
//                       {blog.name}
//                     </Text>
//                   </LinearGradient>
//                   </View>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Indicators */}
//         <View className="flex-row justify-center mt-4">
//           {blogs.map((_, index) => (
//             <View
//               key={index}
//               className={`h-2 rounded-full mx-1 ${
//                 index === getActiveIndicator()
//                   ? "bg-blue-600 w-6"
//                   : "bg-gray-300 w-2"
//               }`}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default BlogList;
