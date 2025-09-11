import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import {
  Users,
  Star,
  UserCheck,
  Briefcase,
  Shield,
  Phone,
  Mail,
  MapPin,
} from "lucide-react-native";

const AboutUs = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-blue-600 mb-4">About Us</Text>
        <Text className="text-lg text-gray-600 mb-6 text-center">
          Connecting service providers directly with customers
        </Text>
        <View className="flex-row items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
          <Users size={16} color="#1E40AF" />
          <Text className="text-blue-800 font-medium text-sm">
            No Middlemen - No Commissions
          </Text>
        </View>
      </View>

      {/* Introduction */}
      <View className="mb-8">
        <Text className="text-gray-700 leading-relaxed">
          At PRNV Services, we believe in direct connections between service
          providers and customers. Our platform eliminates middlemen and hefty
          commissions, allowing professionals to maximize their earnings while
          customers get the best value for their money.
        </Text>
      </View>

      {/* Profile Building */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Star size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            Build a Profile Page as Powerful as a Website
          </Text>
        </View>
        <Text className="mb-4 text-gray-700">
          Showcase your skills, expertise, and service offerings with a
          captivating profile page that sets you apart from the competition...
        </Text>
      </View>

      {/* Key Features for Professionals */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <UserCheck size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            Key Features for Professionals
          </Text>
        </View>
        <Text className="mb-4 text-gray-700">
          <Text className="font-bold">Professional Enrollment:</Text> Join our
          platform as a skilled technician...
        </Text>
      </View>

      {/* Key Features for Advertisers */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Briefcase size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            Key Features for Advertisers
          </Text>
        </View>
        <Text className="mb-4 text-gray-700">
          <Text className="font-bold">Business Promotion:</Text> Join as an
          advertiser to promote your business...
        </Text>
      </View>

      {/* Key Features for Customers */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Users size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            Key Features for Customers
          </Text>
        </View>
        <Text className="mb-4 text-gray-700">
          <Text className="font-bold">Commission-Free Services:</Text> Avail
          services at the lowest possible cost.
        </Text>
      </View>

      {/* Platform Liability */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Shield size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            PRNV Services Liability
          </Text>
        </View>
        <Text className="mb-4 text-gray-700">
          PRNV Services operates as a platform and directory service—not as a
          middleman.
        </Text>
      </View>

      {/* Contact Info */}
      <View className="bg-gray-100 p-6 rounded-lg mb-8">
        <View className="flex-row items-center mb-4">
          <Phone size={24} color="#1E40AF" />
          <Text className="ml-2 text-2xl font-semibold text-gray-800">
            Contact Information
          </Text>
        </View>

        <View className="items-center mb-4">
          <Phone size={20} color="#1E40AF" />
          <Text className="font-medium">Phone</Text>
          <TouchableOpacity onPress={() => Linking.openURL("tel:+919603558369")}>
            <Text className="text-gray-600">+91 9603558369</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-4">
          <Mail size={20} color="#1E40AF" />
          <Text className="font-medium">Email</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@prnvservices.com")}
          >
            <Text className="text-gray-600 underline">
              info@prnvservices.com
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <MapPin size={20} color="#1E40AF" />
          <Text className="font-medium">Service Area</Text>
          <Text className="text-gray-600 text-center">
            PRNV SERVICES, Flat No. 301, Sai Manor Apartment, H.NO. 7-1-621/10,
            SR Nagar, Hyderabad, Telangana, 500038
          </Text>
        </View>
      </View>

      {/* Closing */}
      <View className="items-center mb-12">
        <Text className="text-lg font-medium text-gray-800 mb-2 text-center">
          Join PRNV Services today and experience the difference of direct
          connections!
        </Text>
        <Text className="text-gray-600 text-center">
          Whether you're a service provider or a customer, our platform is built
          to serve your needs efficiently.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutUs;
