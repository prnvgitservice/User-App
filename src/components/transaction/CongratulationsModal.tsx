import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'react-native-feather';

interface CongratulationsModalProps {
  setCurrentStep: (step: string) => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ setCurrentStep }) => {
  return (
    <View className="flex-1 bg-white rounded-lg border border-gray-200 justify-center items-center">
      <View className="max-w-md mx-auto p-8 items-center">
        <View className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 justify-center items-center">
          <Check width={40} height={40} color="#22C55E" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">Congratulations!</Text>
        <Text className="text-gray-600 mb-2 text-center">Work completed successfully</Text>
        <View className="bg-blue-50 rounded-2xl p-4 mb-8">
          <Text className="text-blue-800 font-medium text-center">You have 1 week work guarantee</Text>
        </View>
        <TouchableOpacity
          className="w-full bg-purple-500 py-2 px-3 rounded-2xl"
          onPress={() => setCurrentStep('bookings')}
        >
          <Text className="text-white font-semibold text-center">OKAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CongratulationsModal;
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Check } from 'react-native-feather';

// interface CongratulationsModalProps {
//   setCurrentStep: (step: string) => void;
// }

// const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ setCurrentStep }) => {
//   return (
//     <View className="flex-1 bg-white rounded-lg border border-gray-200 items-center justify-center">
//       <View className="text-center max-w-md mx-auto p-8">
//         <View className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 items-center justify-center">
//           <Check width={40} height={40} color="#22C55E" />
//         </View>
//         <Text className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</Text>
//         <Text className="text-gray-600 mb-2">Work completed successfully</Text>
//         <View className="bg-blue-50 rounded-2xl p-4 mb-8">
//           <Text className="text-blue-800 font-medium">You have 1 week work guarantee</Text>
//         </View>
//         <TouchableOpacity
//           className="w-full bg-purple-500 py-4 rounded-2xl"
//           onPress={() => setCurrentStep('bookings')}
//         >
//           <Text className="text-white font-semibold text-center">OK</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CongratulationsModal;