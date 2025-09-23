import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    success: true,
    data: [
      {
        _id: '1',
        name: 'Home Tips',
        image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
        title: '10 Essential Home Maintenance Tips',
        description: 'Keep your home in perfect condition with these expert maintenance tips.',
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
        description: 'Transform your outdoor space with these stunning garden design concepts.',
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
        description: 'Organize your kitchen like a pro with these modern organization techniques.',
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
        description: 'Learn the secrets that professional cleaners use to achieve spotless results.',
        tags: ['cleaning', 'tips'],
        createdAt: '2024-01-12T07:00:00Z',
        updatedAt: '2024-01-12T07:00:00Z',
        __v: 0,
      },
    ],
  };
};

const AllBlogs: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response: ApiResponse = await getAllBlogs();
        if (response.success) {
          setBlogs(response.data);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError('An error occurred while fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    // Re-fetch logic here
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading amazing blogs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={retryFetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Blog }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => router.push(`/blogs/${item._id}?blog=${encodeURIComponent(JSON.stringify(item))}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: item.image || 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=400' 
          }}
          style={styles.blogImage}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.blogContent}>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.blogDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.blogFooter}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Blogs</Text>
        <Text style={styles.headerSubtitle}>
          Discover our latest insights, tips, and expert advice on home maintenance and services
        </Text>
      </View>
      
      <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {blogs.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No blogs available at the moment.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    color: '#6b7280',
    marginTop: 16,
    fontSize: 18,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 320,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    margin: 8,
    flex: 1,
    maxWidth: (width - 48) / 2,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  blogImage: {
    height: 160,
    width: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  blogContent: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 22,
  },
  blogDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  blogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
  arrow: {
    color: '#2563eb',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 18,
  },
});

export default AllBlogs;










// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native"; // RN version of lucide-react
// import { getAllBlogs } from "../../api/apiMethods";

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

// interface ApiResponse {
//   success: boolean;
//   data: Blog[];
// }

// const AllBlogs: React.FC = () => {
//   const navigation = useNavigation();
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response: ApiResponse = await getAllBlogs();
//         if (response.success) {
//           setBlogs(response.data);
//         } else {
//           setError("Failed to fetch blogs");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching blogs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   if (loading) {
//     return (
//         <View className="flex-1 justify-center items-center bg-gray-50">
//           <ActivityIndicator size="large" color="#2563eb" />
//           <Text className="text-gray-600 mt-2">Loading...</Text>
//         </View>
//     );
//   }

//   if (error) {
//     return (
//         <View className="flex-1 justify-center items-center bg-gray-50">
//           <Text className="text-red-600">{error}</Text>
//         </View>
//     );
//   }

//   const renderItem = ({ item }: { item: Blog }) => (
//     <View className="bg-white rounded-xl shadow-md overflow-hidden m-2 flex-1">
//       {/* Blog Image */}
//       <Image
//         source={{ uri: item.image || "https://via.placeholder.com/400x200" }}
//         className="h-40 w-full"
//         resizeMode="cover"
//       />

//       {/* Blog Details */}
//       <View className="p-4">
//         <Text className="text-lg font-semibold text-gray-800" numberOfLines={2}>
//           {item.title}
//         </Text>

//         {/* Date + Button Row */}
//         <View className="flex-row w-full gap-3 justify-between items-center mt-3">
//           <View className="flex-row items-center gap-2">
//             {/* <Calendar size={16} color="#6b7280" className="mr-2" /> */}
//             {/* <Ionicons name="calendar-outline" color="#000" size={16} /> */}
//             <Text className="text-sm text-gray-500">
//               {new Date(item.createdAt).toLocaleDateString()}
//             </Text>
//           </View>

//           <TouchableOpacity
//             onPress={() => navigation.navigate("BlogDetail", { blog: item })}
//             className="px-2 py-1 rounded-lg bg-red-100"
//           >
//             <Text className="text-red-600 font-semibold text-sm">
//               Read More →
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//       <View className="flex-1 bg-gray-50 p-3">
//         <FlatList
//           data={blogs}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//   );
// };

// export default AllBlogs;
