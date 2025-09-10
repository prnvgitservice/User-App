import React from "react";
import { ScrollView, View, Text } from "react-native";

const RefundPolicyScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Title */}
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        PRNV Services Refund Policy
      </Text>

      {/* Main Card */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">

        {/* Warning Box */}
        <View className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
          <Text className="text-lg font-semibold text-yellow-800 flex flex-row items-start">
            <Text className="text-2xl mr-2">⚠️</Text>
            PRNV Services does NOT refund the subscription amount under any circumstances.
          </Text>
        </View>

        {/* Information Section */}
        <View className="mt-4">
          <Text className="text-base text-gray-700 leading-relaxed mb-2">
            If PRNV Services cannot provide the promised leads in a certain time, we will extend the subscription renewal period.
          </Text>
          <Text className="text-base text-gray-700 leading-relaxed">
            In any case, there will be no refund of the subscription amount.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RefundPolicyScreen;
