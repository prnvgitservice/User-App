
import React from 'react';
import { ScrollView, View, Text } from 'react-native';

const TermsConditionsScreen: React.FC = () => {
  const renderList = (items: string[]) => (
    <View className="ml-4 space-y-1">
      {items.map((item, index) => (
        <Text key={index} className="text-sm">• {item}</Text>
      ))}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">
          Terms & Conditions
        </Text>

        <View className="bg-white rounded-lg shadow p-6 border border-gray-200">

          {/* Last Updated */}
          <Text className="text-sm text-gray-600 mb-4">
            <Text className="font-bold">Last updated:</Text> February 07, 2023
          </Text>

          <Text className="mb-4">Welcome to PRNV Services!</Text>

          <Text className="mb-4">
            These terms and conditions outline the rules and regulations for using the PRNV Services Website, located at www.prnvservices.com. We assume that you accept these terms and conditions by accessing this website. Do not continue to use PRNV Services if you do not agree to take all of the terms and conditions stated on this page.
          </Text>

          {/* Terminology */}
          <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
            <Text className="text-base text-gray-700">
              The following terminology applies to these Terms & Conditions and Disclaimer Notice and all Agreements: "Customer", "User", "You" and "Your" refers to you, the person who log on this Website and is compliant to the company's terms and conditions. "The Company", "Ourselves", "We" and "Our" refers to our company. "Professionals" (Technician/Service Providers) refers to all the technician's offering services. All terms refer to the offering, acceptance, and payment terms required to start the action of our assistance to you in the most effective manner to satisfy your demands for the provision of the company's stated services in line with and subject to the applicable law of India. Any usage of the terminology mentioned above or other words in the singular, plural, he/she, or they format is understood to be interchangeable and to be referring to the same. So, please read the terms and conditions carefully before availing of services or registering yourself as a professional (technician, service provider) on this Website.
            </Text>
          </View>

          {/* Changes */}
          <Text className="text-2xl font-semibold text-blue-700 mb-2">Changes</Text>
          <Text className="mb-4">
            The terms & conditions might change, modify, add, or remove from time to time without any notice. So, it is your responsibility to check for any changes in terms & conditions periodically to be aware of them and ensure that you follow them. By continuing to access or use our site, you agree to be bound by any such revisions and should, therefore, periodically visit this page to review the current Terms & Conditions for both customer & professional (technician/service provider).
          </Text>

          {/* Cookies */}
          <Text className="text-2xl font-semibold text-blue-700 mb-2">Cookies</Text>
          <Text className="mb-4">
            We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the choice of allowing or disallowing optional Cookies. For the proper operation of our Website, a few Cookies are required. Since they always function, these cookies don't need your permission. Please be aware that by allowing necessary Cookies, you also accept third-party Cookies that might be used in conjunction with third-party services that you use on our website, such as a video display window offered by third parties and integrated into our website.
          </Text>

          {/* Terms for Customer */}
          <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Terms for Customer:</Text>
          <Text className="mb-4">
            Your name, phone number, email address, and other personal information will be collected during the Account registration process and while using the PRNV Services website. We collect your login credentials for our website when you directly register yourself as a customer using your Gmail account. When you make a booking for the service on our website, you can provide us with your postal address, phone number, area code, and other contact information. This data will assist us in compiling and providing a list of professionals (technicians/service providers) in your area. We may collect this personal information when you post a comment or provide ratings and reviews on the professional (technician/service provider) profile. We also may collect any conversations you have with us through our blogs, chat boxes, or other message boards on the Website and any comments you make when resolving a dispute with another user of the Website or mobile application.
          </Text>

          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="font-semibold text-gray-800 mb-2">Note:</Text>
            {renderList([
              'PRNV Services is not involved in any payment between the customer and professional (technician/service provider).',
              'Customer should make payment to the professional (technician/service provider) after work is done.',
              'After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the service profile page. These details will be tracked for different processes like providing 1 week of work guarantee.',
              'The amount paid to a professional (technician/service provider) after work is not refundable.',
              'To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.',
              'Customers don\'t have to pay GST, as most professionals (technicians/service providers) are under the GST limit.',
              'Customers don\'t have to pay commissions to the company because PRNV Services follows the principle of No Middlemen – No Commissions.',
              'Customers can choose, contact and fix the timing with the professional (technician/service provider).',
              'Customers will get the lowest price in the market because of the offers & internal competition among professionals (technicians/service providers).',
              'Customers have a weapon of rating & reviews. To achieve this, the professional (technician/service provider) will work politely and professionally by giving his 100% effort.',
              'Customers can hire the same professionals (technicians/service providers) several times.',
              'The company won\'t take any commission for any booking done through PRNV Services from the customer.',
              'For Guest booking, the customer has to provide their name, phone number, pin code, work list category, and other details as required.'
            ])}
          </View>

          {/* Professional Section */}
          <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Professional (Technician/Service Provider):</Text>
          <Text className="mb-4">
            We will collect your business name, phone number, permanent and current address, pin code, a description of your services, languages known, first and last name, and email address during the Account registration process. You may also have to submit other information required to be provided to PRNV Services for this registration process. This registration form and document submission may change from time to time for the security and safety of the professional (technician/service provider) and PRNV Services. You can post a short description of your work, work photos, and more on your profile page. We may also request payment information from you, such as credit/debit card, gpay, or other card information. PRNV Services will also keep track of your work earnings to help you improve your services.
          </Text>

          {/* Disclaimer */}
          <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Disclaimer:</Text>
          <Text className="mb-4">
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this Website. Nothing in this disclaimer will:
          </Text>
          {renderList([
            'limit or exclude our or your liability for death or personal injury;',
            'limit or exclude our or your liability for fraud or fraudulent misrepresentation;',
            'limit any of our or your liabilities in any way that is not permitted under applicable law; or',
            'exclude any of our or your liabilities that may not be excluded under applicable law.'
          ])}

          <Text className="mt-4 mb-4">
            The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
          </Text>

        </View>
      </View>
    </ScrollView>
  );
};

export default TermsConditionsScreen;
