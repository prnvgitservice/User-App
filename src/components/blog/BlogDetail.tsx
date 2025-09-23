import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const BlogDetailPage: React.FC = () => {
  const router = useRouter();
  const { blog: blogParam } = useLocalSearchParams();
  
  let blog: Blog | null = null;
  
  if (blogParam && typeof blogParam === 'string') {
    try {
      blog = JSON.parse(decodeURIComponent(blogParam));
    } catch (e) {
      console.error('Error parsing blog data:', e);
    }
  }

  if (!blog) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>📝</Text>
          <Text style={styles.errorTitle}>Blog Post Not Found</Text>
          <Text style={styles.errorDescription}>The blog post you're looking for doesn't exist.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleContactPress = () => {
    Linking.openURL('tel:+919603558369');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimatedReadTime = Math.ceil(blog.description.split(' ').length / 200);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={styles.backNavButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backNavText}>Back to Blogs</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: blog.image || 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroMeta}>
                <LinearGradient
                  colors={['#2563eb', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryBadgeLarge}
                >
                  <Text style={styles.categoryTextLarge}>
                    {blog.name || 'Blog'}
                  </Text>
                </LinearGradient>
                <View style={styles.readTimeContainer}>
                  <Text style={styles.readTimeIcon}>🕒</Text>
                  <Text style={styles.readTimeText}>{estimatedReadTime} min read</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{blog.title}</Text>
              <Text style={styles.heroDescription}>
                {blog.description.substring(0, 150)}...
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.contentCard}>
            {/* Meta Information */}
            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>📅</Text>
                  <Text style={styles.metaText}>{formatDate(blog.createdAt)}</Text>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                  <Text style={styles.shareIcon}>📤</Text>
                  <Text style={styles.shareText}>Share Article</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsIcon}>🏷️</Text>
                <View style={styles.tagsWrapper}>
                  {blog.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>
                        #{tag.toLowerCase().replace(/\s+/g, '')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Article Content */}
            <View style={styles.articleContent}>
              <Text style={styles.articleText}>{blog.description}</Text>

              {/* Call to Action */}
              <View style={styles.ctaSection}>
                <LinearGradient
                  colors={['#1e40af', '#7c3aed', '#1e40af']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaCard}
                >
                  <Text style={styles.ctaTitle}>Ready to Get Professional Help?</Text>
                  <Text style={styles.ctaDescription}>
                    Don't let maintenance issues become major problems. Contact PRNV Services today for expert solutions that save you time and money.
                  </Text>
                  <View style={styles.ctaButtons}>
                    <TouchableOpacity 
                      style={styles.ctaPrimaryButton}
                      onPress={handleContactPress}
                    >
                      <Text style={styles.ctaPrimaryText}>Get Free Quote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.ctaSecondaryButton}
                      onPress={handleContactPress}
                    >
                      <Text style={styles.ctaSecondaryText}>Call Now: (555) 123-4567</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  errorDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  navigation: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
  },
  backNavText: {
    color: '#6b7280',
    fontSize: 16,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    marginBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 32,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  categoryBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryTextLarge: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeIcon: {
    marginRight: 8,
  },
  readTimeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    lineHeight: 34,
  },
  heroDescription: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  metaSection: {
    padding: 32,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  metaText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  shareText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  tagsIcon: {
    fontSize: 20,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '600',
  },
  articleContent: {
    padding: 32,
  },
  articleText: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaSection: {
    marginTop: 64,
    paddingTop: 48,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ctaCard: {
    padding: 32,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  ctaDescription: {
    color: '#bfdbfe',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButtons: {
    gap: 16,
  },
  ctaPrimaryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
  },
  ctaSecondaryButton: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BlogDetailPage;







// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
//   Dimensions,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import RenderHTML from "react-native-render-html";
// import { Ionicons } from "@expo/vector-icons";

// // Define the Blog interface
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

// // Define the route params interface
// interface RouteParams {
//   blog: Blog;
// }


// const BlogDetailPage: React.FC = () => {
//   const route = useRoute();
//   const params = route.params as RouteParams;
//   const blog = params?.blog;

//   if (!blog) {
//     return (
//       <View className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50 justify-center items-center">
//         <View className="items-center">
//           <Text className="text-3xl font-bold text-gray-900 mb-4">
//             Blog Post Not Found
//           </Text>
//           <Text className="text-gray-600 text-lg">
//             The blog post you're looking for doesn't exist.
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   const handleContactPress = () => {
//     // You can replace this with your actual contact logic
//     Linking.openURL("tel:+919603558369");
//   };

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Split description into paragraphs for better display
//   const contentParagraphs = blog.description
//     ? blog.description.split("\n").filter((p) => p.trim())
//     : [];

//   return (
//       <ScrollView className="flex-1 ">
//         {/* Hero Image Section */}
//         <View className="relative w-full h-80 mb-6">
//           <Image
//             source={{
//               uri: blog.image || "https://via.placeholder.com/800x500",
//             }}
//             className="w-full h-full"
//             resizeMode="cover"
//           />
//           <LinearGradient
//             colors={["transparent", "rgba(0,0,0,0.7)"]}
//             className="absolute inset-0 justify-end"
//           >
//             <View className="w-full p-6">
//               <View className="max-w-4xl mx-auto">
//                 <LinearGradient
//                   colors={["#2563eb", "#7c3aed"]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   className="self-start px-4 py-2 rounded-full mb-4"
//                 >
//                   <Text className="text-white text-sm font-semibold">
//                     {blog.name || "Blog"}
//                   </Text>
//                 </LinearGradient>
//                 <Text className="text-3xl font-bold text-white mb-4 leading-tight">
//                   {blog.title}
//                 </Text>
//               </View>
//             </View>
//           </LinearGradient>
//         </View>

//         {/* Content Section */}
//         <View className="max-w-4xl mx-auto px-4 pb-16">
//           <View className="bg-white rounded-2xl shadow-xl p-6">
//             {/* Meta Information */}
//             <View className="flex-row flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
//               <View className="flex-row items-center">
//                 <Ionicons
//                   name="calendar-outline"
//                   size={20}
//                   color="#4b5563"
//                   className="mr-2"
//                 />
//                 <Text className="text-gray-600 font-semibold text-base">
//                   {formatDate(blog.createdAt)}
//                 </Text>
//               </View>
//               <View className="flex-row items-center flex-wrap">
//                 <Ionicons
//                   name="pricetag-outline"
//                   size={20}
//                   color="#4b5563"
//                   className="mr-2"
//                 />
//                 <View className="flex-row flex-wrap gap-2">
//                   {blog.tags.map((tag, index) => (
//                     <View
//                       key={index}
//                       className="bg-blue-100 px-3 py-1 rounded-full"
//                     >
//                       <Text className="text-blue-800 text-sm font-semibold">
//                         {tag}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             </View>

//             <RenderHTML  source={{ html: blog.description }} />

//             {/* Article Content */}
//             {/* <View className="space-y-6">
//               {
//                 <Text className="text-gray-700 leading-relaxed text-base">
//                   {blog.description}
//                 </Text>
//               }
//             </View> */}
//             {/* Article Content */}

//             {/* Call to Action */}
//             <View className="mt-12 pt-8 border-t border-gray-200">
//               <LinearGradient
//                 colors={["#dbeafe", "#ede9fe", "#dbeafe"]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 className="p-6 rounded-2xl"
//               >
//                 <Text className="text-2xl font-bold text-gray-900 mb-4">
//                   Need Professional Help?
//                 </Text>
//                 <Text className="text-gray-700 text-base mb-6 leading-relaxed">
//                   PRNV Services provides expert solutions for all your home
//                   maintenance needs. Contact our professional team for reliable
//                   and affordable services.
//                 </Text>
//                 <TouchableOpacity
//                   onPress={handleContactPress}
//                   className="py-4 rounded-xl items-center"
//                   activeOpacity={0.9}
//                 >
//                   <Text className="text-blue-600 font-semibold text-lg">
//                     Contact PRNV Services
//                   </Text>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//   );
// };

// export default BlogDetailPage;
