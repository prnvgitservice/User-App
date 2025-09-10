import React from "react";
import { View, Text, ScrollView } from "react-native";

const KeyFeaturesScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Title */}
      <Text className="text-4xl font-bold text-center text-blue-600 mb-8">
        Key Features
      </Text>

      {/* Section 1 */}
      <View className="mb-10">
        <Text className="text-2xl font-semibold text-gray-900 mb-4">
          NO MIDDLEMEN - NO COMMISSIONS
        </Text>
        <Text className="mb-4 text-gray-700">
          At PRNV Services, we believe in direct connections between service
          providers and customers. Maximize your earnings by saying goodbye to
          middlemen and hefty commissions!
        </Text>

        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Build a Profile Page as Powerful as a Website:
        </Text>
        <View className="pl-4 mb-4">
          <Text className="text-gray-700">• Showcase your skills, expertise, and service offerings with a captivating profile page.</Text>
          <Text className="text-gray-700">• Show your work through images and videos.</Text>
          <Text className="text-gray-700">• Improve your position in listings by seniority, ratings, and volume of business.</Text>
          <Text className="text-gray-700">• Set your prices with the flexible Self-Billing Dashboard.</Text>
          <Text className="text-gray-700">• Flexible work schedule with intuitive ON/OFF feature.</Text>
        </View>
        <Text className="mb-2 text-gray-700">
          Our platform adapts to your needs, whether part-time or full-time, supporting work-life balance.
        </Text>
        <Text className="font-semibold text-gray-900 mb-4">
          YOU CAN DECIDE YOUR RATES AND ATTRACT MORE CUSTOMERS WITH SPECIAL OFFERS.
        </Text>
      </View>

      {/* Professionals */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          KEY FEATURES FOR PROFESSIONALS:
        </Text>
        <View className="pl-4 space-y-2">
          <Text className="text-gray-700">• <Text className="font-bold">Professional Enrollment</Text>: Join our platform as a skilled technician or service provider.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">No Middlemen No Commissions</Text>: Direct connections between professionals and customers without commissions.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Social Media Marketing</Text>: Promoted based on ratings, reviews, teamwork, seniority, pin codes served, and volume.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Subscription Renewal</Text>: Renew every 30 days to maintain benefits.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Service Area Selection</Text>: Select pin codes for targeted reach.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Early Joiner Advantage</Text>: Get listed on top for visibility.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Dedicated Profile Page</Text>: Profile page acts like a website with scheduling and billing features.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Video Feature</Text>: Highlight your work through videos, some may be shared on our YouTube channel.</Text>
        </View>
      </View>

      {/* Advertisers */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          KEY FEATURES FOR ADVERTISERS:
        </Text>
        <View className="pl-4 space-y-2">
          <Text className="text-gray-700">• <Text className="font-bold">Join as an Advertiser</Text>: Promote your business via PRNV Services.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Subscription Options</Text>: Advertise within chosen pin codes in GHMC limits.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Dedicated Profile Page</Text>: Full business info on your own profile page.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Featured Placement</Text>: Featured listings based on plan type.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Early Joiner Advantage</Text>: Get listed at the top.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Plan Validity and Renewal</Text>: 30-day plans, renewable.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Additional Digital Marketing</Text>: Share your profile for more visibility.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Refund policy</Text>: No refund applicable.</Text>
        </View>
        <View className="bg-yellow-100 p-4 mt-4 rounded-md">
          <Text className="text-yellow-800 font-medium">
            PLEASE NOTE: THE ABOVE FEATURES ARE SUBJECT TO OUR ADVERTISING POLICIES.
          </Text>
        </View>
      </View>

      {/* Customers */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          KEY FEATURES FOR CUSTOMERS:
        </Text>
        <View className="pl-4 space-y-2">
          <Text className="text-gray-700">• <Text className="font-bold">Commission-Free</Text>: No extra cost to customers.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Competitive Pricing</Text>: Enjoy lowest market rates.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Rating and Reviews</Text>: Help improve services via feedback.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Damage and Work Guarantee</Text>: One-week guarantee & damage coverage if customer details are submitted.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">GST Exemption</Text>: Most providers are GST-free.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Repeat Hiring</Text>: Hire the same professional again.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Choice and Bargaining</Text>: Freedom to choose and negotiate.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Refund Policy</Text>: Not applicable for Service Providers.</Text>
        </View>
      </View>

      {/* BDA */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Why Join as a Business Development Associate (BDA)?
        </Text>
        <Text className="mb-2 text-gray-700">
          <Text className="font-bold">'RECURRING INCOME'</Text> is one of the best advantages of the BDA plan...
        </Text>
        <Text className="mb-2 text-gray-700">
          <Text className="font-bold">Example:</Text> If a BDA introduces one technician under ₹3000 plan, they'll earn ₹300 on join + renewal.
        </Text>
        <Text className="mb-4 text-gray-700">
          Initially small, over time this becomes a great source of recurring income.
        </Text>
        <View className="bg-red-100 p-4 rounded-md">
          <Text className="text-red-800 font-medium">
            NOTE: BDA monthly fee is non-refundable.
          </Text>
        </View>
      </View>

      {/* Terms & Conditions */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          TERMS AND CONDITIONS:
        </Text>
        <View className="pl-4 space-y-2">
          <Text className="text-gray-700">• <Text className="font-bold">Commission</Text>: We charge only monthly plan fees.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Liability</Text>: Provider is responsible for any damages.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Work Guarantee</Text>: 1-week guarantee post work completion.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Customer Feedback</Text>: Ratings/reviews mandatory for claims.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Compensation</Text>: Provide full details to claim any work-related damage.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Seniority and Renewal</Text>: Displayed by seniority. Delays lose priority.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Training</Text>: Only computer support is provided, not field training.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Verification</Text>: Submit Aadhar, PAN, and referrals for activation.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">GST Compliance</Text>: Providers must follow applicable GST rules.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Renewal</Text>: Every 30 days. Inactive profiles won't show.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Plan Changes</Text>: Switch anytime. No refunds, only adjustments.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Profile Management</Text>: Full control of profile and content.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Pin Code Changes</Text>: Only during renewal.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">YouTube Exposure</Text>: Best videos get highlighted on YouTube.</Text>
          <Text className="text-gray-700">• <Text className="font-bold">Refund Policy</Text>: No refund under any condition.</Text>
        </View>
        <View className="bg-blue-100 p-4 mt-4 rounded-md">
          <Text className="text-blue-800 font-medium">
            Please read and understand these terms before proceeding. By subscribing, you agree to all terms of PRNV Services.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default KeyFeaturesScreen;
