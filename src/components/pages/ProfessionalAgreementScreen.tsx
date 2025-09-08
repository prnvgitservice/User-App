import React from "react";
import { ScrollView, View, Text } from "react-native";
import { tw } from "nativewind";

const ProfessionalAgreementScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Professional Agreement Details
      </Text>

      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-base text-gray-700 mb-4">
          <Text className="font-bold">Memorandum of Understanding (MOU)</Text> is made on ______________ by and between:
        </Text>

        <Text className="text-gray-700 mb-2">
          <Text className="font-bold">1)</Text> PRNV SERVICES a Proprietorship based company, Proprietor Veeksith Kolanupaka S/O K. P. Rama Rao, R/O Hyderabad, Telangana State. Registered office at #301, Sai Manor Apartments, Near Umesh Chandra Statue, SR Nagar, Hyderabad - 500038 (herein after referred to as the "Company", which expression shall be deemed to mean and include its successors and permitted assigns),
        </Text>

        <Text className="text-gray-700 mb-2 font-bold">AND</Text>

        <Text className="text-gray-700 mb-2">
          <Text className="font-bold">2)</Text> _________________________________son/daughter/wife of ________________________________ residing at __________________________ (here in after referred to as the "Professional (Technician/Service Provider)" which expression shall be deemed to mean and include its successors and permitted assigns).
        </Text>

        <Text className="text-gray-700 mb-2">
          The Company and the Service Provider may also be individually referred to as the Party or Parties.
        </Text>
      </View>

      {/* RECITALS */}
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-blue-700 mb-3">RECITALS</Text>
        <Text className="text-gray-700 mb-2">
          Whereas the Company provides multiple services inter alia such as plumbing, electrical repair, home cleaning, appliance repairs, home beauty services, carpentry services, painting services, pest control, fitness services, laundry services, laptop repair and mobile repair and other convenience services, that is A to Z services to end customers (such customers called as the "Company Customers"). Whereas the Service Provider provides services to the customer through PRNV Services.
        </Text>
        <Text className="text-gray-700">
          5) Whereas the company has agreed to engage the services of the Service Provider and the Service Provider has agreed to provide the Services in accordance with the terms and conditions of this MOU set forth in Exhibit A.
        </Text>
      </View>

      {/* Required Details */}
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-blue-700 mb-3">Required Details Document of Service Provider:</Text>
        <View className="ml-4 space-y-1">
          <Text>1. Name/ organization</Text>
          <Text>2. Mobile Number</Text>
          <Text>3. Referral Numbers</Text>
          <Text>4. Adhar Card</Text>
          <Text>5. Pan Card / Voter Id / Driving License</Text>
          <Text>6. Permanent Address</Text>
          <Text>7. Current Address</Text>
          <Text>8. Bank details</Text>
        </View>
      </View>

      {/* EXHIBIT A */}
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-blue-700 mb-3">EXHIBIT A</Text>

        {/* EFFECTIVE DATE AND TERM */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">EFFECTIVE DATE AND TERM</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text><Text className="font-bold">1.1.</Text> The Parties hereby agree that the Effective date of the MOU shall be the date on which both parties execute this MOU.</Text>
          <Text><Text className="font-bold">1.2.</Text> This MOU shall be valid for the Term specified. This MOU may be renewed on the mutual agreement of the Parties on terms and conditions mutually agreeable to the Parties.</Text>
        </View>

        {/* SERVICES AND RESPONSIBILITIES */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">2. SERVICES AND RESPONSIBILITIES OF THE SERVICE PROVIDER</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text><Text className="font-bold">2.1.</Text> The Service Provider shall provide the Services to the Company Customers.</Text>
          <Text><Text className="font-bold">2.2.</Text> The Service Provider shall provide the Services in the timelines and at the cost agreed by the Parties.</Text>
          <Text><Text className="font-bold">2.3.</Text> Whenever the Company is required to engage the services of the Service Provider, the Company shall issue a job card...</Text>
          <Text><Text className="font-bold">2.4.</Text> The Service Provider shall ensure that it provides the Services with due care, and with superior quality standards...</Text>
          <Text><Text className="font-bold">2.5.</Text> Deliverables of Services shall be subject to acceptance by the Company and/or the Company Customer...</Text>
          <Text><Text className="font-bold">2.6.</Text> The Company shall appoint a representative who will coordinate with the Service Provider...</Text>
          <Text><Text className="font-bold">2.7.</Text> The Service Provider understands and acknowledges that it shall be the Service Provider for the Company Customers...</Text>
          <Text><Text className="font-bold">2.8.</Text> The Service Provider shall be responsible for completing Services assigned within the timeframe provided...</Text>
          <Text><Text className="font-bold">2.9.</Text> The Service Provider shall be responsible for being adequately equipped to receive through the customer mobile application or its website.</Text>
          <Text><Text className="font-bold">2.10.</Text> The Service Provider agrees to implement and adhere to the process changes of the Company...</Text>
          <Text><Text className="font-bold">2.11.</Text> The Company may not provide any equipment related to the work to be completed by the Service Provider...</Text>
        </View>

        {/* PAYMENT TERMS */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">PAYMENT TERMS, TAXES AND AUDIT</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text><Text className="font-bold">3.1.</Text> The Service Provider service fee chargeable by the Company shall be agreed as per a predetermined Subscription plan...</Text>
          <Text><Text className="font-bold">3.2.</Text> GST collected on services by service providers have to act independently and file GST...</Text>
          <Text><Text className="font-bold">3.3.</Text> Service Providers have to collect the amount from Customers once after the Job is done...</Text>
          <Text><Text className="font-bold">3.4.</Text> PRNV Services offer a Referral bonus for both service providers and normal users...</Text>
        </View>

        {/* NON-EXCLUSIVITY */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">NON-EXCLUSIVITY, NO MINIMUM GUARANTEE AND NON-COMPETE</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text><Text className="font-bold">4.1.</Text> The Company reserves the right to appoint any other Service Provider...</Text>
          <Text><Text className="font-bold">4.2.</Text> The Service Provider acknowledges there is no minimum revenue guarantee...</Text>
        </View>

        {/* CONFIDENTIALITY */}
        <Text className="text-xl font-semibold text-gray-800 mb-2">CONFIDENTIALITY AND PRIVACY</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text><Text className="font-bold">6.1.</Text> The Parties agree that information which is proprietary and confidential shall be kept confidential...</Text>
          <Text><Text className="font-bold">6.2.</Text> The Service Provider shall retain any Company Customer related information as confidential and private...</Text>
        </View>

        <Text className="text-center font-bold my-4">IN WITNESS WHEREOF the parties hereto have caused this MoU to be duly executed.</Text>

        <Text className="text-xl font-semibold text-gray-800 mb-2">Point to Ponder</Text>
        <View className="ml-4 space-y-1 mb-4">
          <Text>PRNV SERVICES is not providing employment...</Text>
          <Text>The Service Provider at PRNV SERVICES is an independent business...</Text>
          <Text>PRNV SERVICES is only supporting you through digital marketing.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfessionalAgreementScreen;
