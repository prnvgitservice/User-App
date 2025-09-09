import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

// Define the Blog interface
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

// Define the route params interface
interface RouteParams {
  blog: Blog;
}

interface HtmlRendererProps {
  html: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html }) => {
  const renderHtml = () => {
    if (!html) return null;
    
    // Simple HTML tag parsing (for basic HTML only)
    const elements = [];
    let currentText = '';
    let isInTag = false;
    let currentTag = '';
    
    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      
      if (char === '<') {
        // Push current text
        if (currentText.trim()) {
          elements.push(<Text key={i} className="text-gray-700 text-base">{currentText}</Text>);
          currentText = '';
        }
        isInTag = true;
        currentTag = '';
      } else if (char === '>') {
        isInTag = false;
        const tag = currentTag.toLowerCase();
        
        if (tag.startsWith('h1') || tag.startsWith('h2') || tag.startsWith('h3')) {
          elements.push(
            <Text key={i} className="text-2xl font-bold text-gray-900 my-4">
              {html.substring(i + 1, html.indexOf('</' + tag.split(' ')[0] + '>', i))}
            </Text>
          );
        } else if (tag.startsWith('p')) {
          elements.push(
            <Text key={i} className="text-gray-700 text-base mb-4">
              {html.substring(i + 1, html.indexOf('</p>', i))}
            </Text>
          );
        }
        // Skip ahead to closing tag
        i = html.indexOf('>', i);
      } else if (isInTag) {
        currentTag += char;
      } else {
        currentText += char;
      }
    }
    
    // Push any remaining text
    if (currentText.trim()) {
      elements.push(<Text key="final" className="text-gray-700 text-base">{currentText}</Text>);
    }
    
    return <View>{elements}</View>;
  };

  return <View className="space-y-4">{renderHtml()}</View>;
};

const BlogDetailPage: React.FC = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const blog = params?.blog;

  if (!blog) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50 justify-center items-center">
        <View className="items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </Text>
          <Text className="text-gray-600 text-lg">
            The blog post you're looking for doesn't exist.
          </Text>
        </View>
      </View>
    );
  }

  const handleContactPress = () => {
    // You can replace this with your actual contact logic
    Linking.openURL("tel:+1234567890");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Split description into paragraphs for better display
  const contentParagraphs = blog.description
    ? blog.description.split("\n").filter((p) => p.trim())
    : [];

  return (
    <SafeAreaView className="flex-1 bg-white py-14">
      <ScrollView className="flex-1 ">
        {/* Hero Image Section */}
        <View className="relative w-full h-80 mb-6">
          <Image
            source={{
              uri: blog.image || "https://via.placeholder.com/800x500",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="absolute inset-0 justify-end"
          >
            <View className="w-full p-6">
              <View className="max-w-4xl mx-auto">
                <LinearGradient
                  colors={["#2563eb", "#7c3aed"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="self-start px-4 py-2 rounded-full mb-4"
                >
                  <Text className="text-white text-sm font-semibold">
                    {blog.name || "Blog"}
                  </Text>
                </LinearGradient>
                <Text className="text-3xl font-bold text-white mb-4 leading-tight">
                  {blog.title}
                </Text>
                <Text
                  className="text-xl text-white opacity-90 leading-relaxed"
                  numberOfLines={2}
                >
                  {blog.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Section */}
        <View className="max-w-4xl mx-auto px-4 pb-16">
          <View className="bg-white rounded-2xl shadow-xl p-6">
            {/* Meta Information */}
            <View className="flex-row flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#4b5563"
                  className="mr-2"
                />
                <Text className="text-gray-600 font-semibold text-base">
                  {formatDate(blog.createdAt)}
                </Text>
              </View>
              <View className="flex-row items-center flex-wrap">
                <Ionicons
                  name="pricetag-outline"
                  size={20}
                  color="#4b5563"
                  className="mr-2"
                />
                <View className="flex-row flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-blue-100 px-3 py-1 rounded-full"
                    >
                      <Text className="text-blue-800 text-sm font-semibold">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <HtmlRenderer html={blog.description} />

            {/* Article Content */}
            {/* <View className="space-y-6">
              {
                <Text className="text-gray-700 leading-relaxed text-base">
                  {blog.description}
                </Text>
              }
            </View> */}
            {/* Article Content */}
            {/* <View className="space-y-6">
              {blog.description ? (
                <RenderHtml
                  contentWidth={width - 48} // Adjust for padding (24px on each side)
                  source={{ html: blog.description }}
                  tagsStyles={{
                    body: { fontSize: 16, lineHeight: 24, color: "#374151" },
                    h1: {
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 16,
                      color: "#111827",
                      marginTop: 24,
                    },
                    h2: {
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 12,
                      color: "#111827",
                      marginTop: 20,
                    },
                    h3: {
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 8,
                      color: "#111827",
                      marginTop: 16,
                    },
                    p: {
                      fontSize: 16,
                      lineHeight: 24,
                      marginBottom: 16,
                      color: "#374151",
                    },
                    ul: { marginBottom: 16 },
                    ol: { marginBottom: 16 },
                    li: {
                      fontSize: 16,
                      lineHeight: 24,
                      color: "#374151",
                      marginBottom: 4,
                    },
                    strong: { fontWeight: "bold" },
                    em: { fontStyle: "italic" },
                    a: { color: "#2563eb", textDecorationLine: "underline" },
                    blockquote: {
                      backgroundColor: "#f3f4f6",
                      borderLeftWidth: 4,
                      borderLeftColor: "#2563eb",
                      paddingLeft: 16,
                      paddingVertical: 8,
                      marginBottom: 16,
                    },
                  }}
                  baseStyle={{
                    color: "#374151",
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                />
              ) : (
                <Text className="text-gray-700 leading-relaxed text-base">
                  No content available.
                </Text>
              )}
            </View> */}

            {/* Call to Action */}
            <View className="mt-12 pt-8 border-t border-gray-200">
              <LinearGradient
                colors={["#dbeafe", "#ede9fe", "#dbeafe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-6 rounded-2xl"
              >
                <Text className="text-2xl font-bold text-gray-900 mb-4">
                  Need Professional Help?
                </Text>
                <Text className="text-gray-700 text-base mb-6 leading-relaxed">
                  PRNV Services provides expert solutions for all your home
                  maintenance needs. Contact our professional team for reliable
                  and affordable services.
                </Text>
                <TouchableOpacity
                  onPress={handleContactPress}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl items-center"
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-semibold text-lg">
                    Contact PRNV Services
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetailPage;
// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
//   Dimensions,
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Mock data - replace with your actual data source
// const blogPosts = [
//   {
//     id: '1',
//     title: 'Sample Blog Post',
//     excerpt: 'This is a sample blog post excerpt',
//     heroImage: 'https://via.placeholder.com/800x500',
//     category: 'Technology',
//     date: 'October 15, 2023',
//     tags: ['Tech', 'React', 'Mobile'],
//     content: [
//       'Introduction:',
//       'This is the first paragraph of the blog post content.',
//       'Key Points:',
//       'This is another paragraph with more detailed information about the topic.',
//       'Conclusion:',
//       'Final thoughts and summary of the blog post content.'
//     ]
//   }
// ];

// const BlogDetailPage: React.FC = () => {
//   const route = useRoute();
//   const { id } = route.params || {};
//   const post = blogPosts.find(p => p.id === id);

//   if (!post) {
//     return (
//       <View className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50 justify-center items-center">
//         <View className="items-center">
//           <Text className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</Text>
//           <Text className="text-gray-600 text-lg">The blog post you're looking for doesn't exist.</Text>
//         </View>
//       </View>
//     );
//   }

//   const handleContactPress = () => {
//     // You can replace this with your actual contact logic
//     Linking.openURL('tel:+1234567890');
//   };

//   const screenWidth = Dimensions.get('window').width;

//   return (
//     <ScrollView className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50">
//       {/* Hero Image Section */}
//       <View className="relative w-full h-80 mb-6">
//         <Image
//           source={{ uri: post.heroImage }}
//           alt={post.title}
//           className="w-full h-full"
//           resizeMode="cover"
//         />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.7)']}
//           className="absolute inset-0 justify-end"
//         >
//           <View className="w-full p-6">
//             <View className="max-w-4xl mx-auto">
//               <LinearGradient
//                 colors={['#2563eb', '#7c3aed']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 className="self-start px-4 py-2 rounded-full mb-4"
//               >
//                 <Text className="text-white text-sm font-semibold">
//                   {post.category}
//                 </Text>
//               </LinearGradient>
//               <Text className="text-3xl font-bold text-white mb-4 leading-tight">
//                 {post.title}
//               </Text>
//               <Text className="text-xl text-white opacity-90 leading-relaxed">
//                 {post.excerpt}
//               </Text>
//             </View>
//           </View>
//         </LinearGradient>
//       </View>

//       {/* Content Section */}
//       <View className="max-w-4xl mx-auto px-4 pb-16">
//         <View className="bg-white rounded-2xl shadow-xl p-6">
//           {/* Meta Information */}
//           <View className="flex-row flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
//             <View className="flex-row items-center">
//               {/* <Calendar size={20} color="#4b5563" className="mr-2" /> */}
//             <Ionicons name="calendar-outline" color="#000" size={24} />

//               <Text className="text-gray-600 font-semibold text-base">{post.date}</Text>
//             </View>
//             <View className="flex-row items-center flex-wrap">
//               {/* <Tag size={20} color="#4b5563" className="mr-2" /> */}
//               <Ionicons name="pricetag-outline" color="#000" size={24} />
//               <View className="flex-row flex-wrap gap-2">
//                 {post.tags.map((tag, index) => (
//                   <View
//                     key={index}
//                     className="bg-blue-100 px-3 py-1 rounded-full"
//                   >
//                     <Text className="text-blue-800 text-sm font-semibold">
//                       {tag}
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </View>

//           {/* Article Content */}
//           <View className="space-y-6">
//             {post.content.map((paragraph, index) => (
//               <View key={index} className="mb-4">
//                 {paragraph.includes(':') && paragraph.length < 100 && !paragraph.includes('https://') ? (
//                   <View className="border-l-4 border-blue-500 pl-4 mb-4">
//                     <Text className="text-2xl font-bold text-gray-900">
//                       {paragraph}
//                     </Text>
//                   </View>
//                 ) : (
//                   <Text className="text-gray-700 leading-relaxed text-base">
//                     {paragraph}
//                   </Text>
//                 )}
//               </View>
//             ))}
//           </View>

//           {/* Call to Action */}
//           <View className="mt-12 pt-8 border-t border-gray-200">
//             <LinearGradient
//               colors={['#dbeafe', '#ede9fe', '#dbeafe']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               className="p-6 rounded-2xl"
//             >
//               <Text className="text-2xl font-bold text-gray-900 mb-4">
//                 Need Professional Help?
//               </Text>
//               <Text className="text-gray-700 text-base mb-6 leading-relaxed">
//                 PRNV Services provides expert solutions for all your home maintenance needs.
//                 Contact our professional team for reliable and affordable services.
//               </Text>
//               <TouchableOpacity
//                 onPress={handleContactPress}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl items-center"
//                 activeOpacity={0.9}
//               >
//                 <Text className="text-white font-semibold text-lg">
//                   Contact PRNV Services
//                 </Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default BlogDetailPage;
