import React from "react";
import { ScrollView, View, Text } from "react-native";

const PrivacyPolicyScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Title */}
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Privacy Policy
      </Text>

      {/* Last Updated */}
      <Text className="text-sm text-gray-600 mb-6">
        <Text className="font-bold">Last updated:</Text> February 07, 2023
      </Text>

      {/* Card */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        {/* Description */}
        <Text className="text-gray-700 text-base mb-4 leading-relaxed">
          This Privacy Policy describes our policies and procedures for collecting, using, and disclosing your information when you use our services or register as a professional (technician or service provider). It also informs you of your privacy rights and the legal safeguards that apply to you.
        </Text>

        <Text className="text-gray-700 text-base mb-4 leading-relaxed">
          <Text className="font-bold">PRNV Services</Text> use your personal data to provide and improve the service from both customer and professional (technician/service provider) end. By using the service, you agree to the collection and use of information in accordance with this privacy policy.
        </Text>

        {/* Heading Example */}
        <Text className="text-2xl font-semibold text-blue-700 mt-6 mb-4">
          Interpretation and Definitions
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Interpretation
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-relaxed">
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear singular or plural.
        </Text>

        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Definitions
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-relaxed">
          For the purposes of this Privacy Policy:
        </Text>

        {/* Definition List */}
        <View className="bg-gray-50 p-4 rounded-lg mb-4">
          <Text className="text-gray-700 text-sm mb-2">1. <Text className="font-bold">Account:</Text> Individual account created for you to access our service or to be a part of our service.</Text>
          <Text className="text-gray-700 text-sm mb-2">2. <Text className="font-bold">Company:</Text> Refers to PRNV Services, 6th floor, Swathi Plaza, Leelanagar, Ameerpet, Hyderabad.</Text>
          <Text className="text-gray-700 text-sm mb-2">3. <Text className="font-bold">Cookies:</Text> Small files placed on your device by a website containing browsing history.</Text>
          <Text className="text-gray-700 text-sm mb-2">4. <Text className="font-bold">Device:</Text> Any device that can access the service, e.g., computer, cellphone, or tablet.</Text>
          <Text className="text-gray-700 text-sm mb-2">5. <Text className="font-bold">Personal Data:</Text> Any information related to an identified or identifiable individual.</Text>
          <Text className="text-gray-700 text-sm mb-2">6. <Text className="font-bold">Third-party Social Media Service:</Text> Any website or social network allowing login or registration.</Text>
          <Text className="text-gray-700 text-sm mb-2">7. <Text className="font-bold">Usage Data:</Text> Data collected automatically, such as page visit duration.</Text>
          <Text className="text-gray-700 text-sm mb-2">8. <Text className="font-bold">Website:</Text> PRNV Services, accessible from https://www.prnvservices.com.</Text>
          <Text className="text-gray-700 text-sm mb-2">9. <Text className="font-bold">You:</Text> The individual accessing or using the Service.</Text>
        </View>

        {/* Example of Info Boxes */}
        <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-4">
          <Text className="text-blue-800 font-semibold mb-2">For Customers:</Text>
          <Text className="text-gray-700 text-sm mb-2">We may ask You to provide personally identifiable information like:</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Email address</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• First name and last name</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Phone number</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Address, City, State, ZIP code</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Usage Data</Text>
        </View>

        <View className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 mb-4">
          <Text className="text-green-800 font-semibold mb-2">For Professionals (Technician/Service Provider):</Text>
          <Text className="text-gray-700 text-sm mb-2">
            Professionals will provide personal info to identify and contact them, including:
          </Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Email address</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• First name and last name</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Phone number</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• 2 Referral Mobile Numbers</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Current & Permanent Address</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Aadhar, Voter Card, or Driving License</Text>
          <Text className="text-gray-700 text-sm ml-4 mb-1">• Passport size photo</Text>
          <Text className="text-gray-700 text-sm mt-2"><Text className="font-bold">Note:</Text> This personal data is unlimited and subject to change periodically.</Text>
        </View>

        {/* You can continue similarly for all sections like Usage Data, Cookies, Payment Policy, etc. */}
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;
