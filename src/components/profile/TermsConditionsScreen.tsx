
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const TermsConditionsScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Terms & Conditions
        </Text>

        <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Text className="text-sm text-gray-600 mb-6">
            <Text className="font-semibold">Last updated:</Text> February 07, 2023
          </Text>

          <Text className="text-base text-gray-700 leading-6 mb-6">
            Welcome to PRNV Services!
          </Text>

          <Text className="text-base text-gray-700 leading-6 mb-6">
            These terms and conditions outline the rules and regulations for using the PRNV Services Website, located at www.prnvservices.com. We assume that you accept these terms and conditions by accessing this website. Do not continue to use PRNV Services if you do not agree to take all of the terms and conditions stated on this page.
          </Text>

          <View className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mb-6">
            <Text className="text-base text-gray-700 leading-6">
              The following terminology applies to these Terms & Conditions and Disclaimer Notice and all Agreements: "Customer", "User", "You" and "Your" refers to you, the person who log on this Website and is compliant to the company's terms and conditions. "The Company", "Ourselves", "We" and "Our" refers to our company. "Professionals" (Technician/Service Providers) refers to all the technician's offering services. All terms refer to the offering, acceptance, and payment terms required to start the action of our assistance to you in the most effective manner to satisfy your demands for the provision of the company's stated services in line with and subject to the applicable law of India. Any usage of the terminology mentioned above or other words in the singular, plural, he/she, or they format is understood to be interchangeable and to be referring to the same. So, please read the terms and conditions carefully before availing of services or registering yourself as a professional (technician, service provider) on this Website.
            </Text>
          </View>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Changes
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The terms & conditions might change, modify, add, or remove from time to time without any notice. So, it is your responsibility to check for any changes in terms & conditions periodically to be aware of them and ensure that you follow them. By continuing to access or use our site, you agree to be bound by any such revisions and should, therefore, periodically visit this page to review the current Terms & Conditions for both customer & professional (technician/service provider).
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Cookies
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the choice of allowing or disallowing optional Cookies. For the proper operation of our Website, a few Cookies are required. Since they always function, these cookies don't need your permission. Please be aware that by allowing necessary Cookies, you also accept third-party Cookies that might be used in conjunction with third-party services that you use on our website, such as a video display window offered by third parties and integrated into our website.
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Terms for Customer:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            Your name, phone number, email address, and other personal information will be collected during the Account registration process and while using the PRNV Services website. We collect your login credentials for our website when you directly register yourself as a customer using your Gmail account. When you make a booking for the service on our website, you can provide us with your postal address, phone number, area code, and other contact information. This data will assist us in compiling and providing a list of professionals (technicians/service providers) in your area. We may collect this personal information when you post a comment or provide ratings and reviews on the professional (technician/service provider) profile. We also may collect any conversations you have with us through our blogs, chat boxes, or other message boards on the Website and any comments you make when resolving a dispute with another user of the Website or mobile application.
          </Text>

          <View className="bg-gray-50 p-6 rounded-lg mb-6">
            <Text className="font-semibold text-gray-800 mb-3">
              Note:
            </Text>
            <View className="ml-6 mb-3">
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                1. PRNV Services is not involved in any payment between the customer and professional (technician/service provider).
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                2. Customer should make payment to the professional (technician/service provider) after work is done.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                3. After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the service profile page. These details will be tracked for different processes like providing 1 week of work guarantee.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                4. The amount paid to a professional (technician/service provider) after work is not refundable.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                5. To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                6. Customers don't have to pay GST, as most professionals (technicians/service providers) are under the GST limit.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                7. Customers don't have to pay commissions to the company because PRNV Services follows the principle of No Middlemen – No Commissions.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                8. Customers can choose, contact and fix the date with the professional (technician/service provider).
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                9. Customers will get the lowest price in the market because of the offers & internal competition among professionals (technicians/service providers).
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                10. Customers have a weapon of rating & reviews. To achieve this, the professional (technician/service provider) will work politely and professionally by giving his 100% effort.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                11. Customers don't have to pay GST, as most professionals (technicians/service providers) are under the GST limit.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                12. Customers can hire the same professionals (technicians/service providers) several times.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                13. The company won't take any commission for any booking done through PRNV Services from the customer.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                14. For Guest booking, the customer has to provide their name, phone number, pin code, work list category, and other details as required.
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Professional (Technician/Service Provider):
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We will collect your business name, phone number, permanent and current address, pin code, a description of your services, first and last name during the Account registration process. You may also have to submit other information required to be provided to PRNV Services for this registration process. This registration form and document submission may change from time to time for the security and safety of the professional (technician/service provider) and PRNV Services. You can post a short description of your work, work photos, and more on your profile page. 
            PRNV Services will also keep track of your work earnings to help you improve your services.
          </Text>

          <Text className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Background Verification:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The professional (technician/service provider) acknowledges that the company may conduct background checks on the professional (technician/service provider) as part of the onboarding process in order to authenticate, among other things, the authenticity and competency of the professional (technician/service provider). They expressly agree to and acknowledge the following in light of those mentioned above:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The professional (technician/service provider) has no objections to PRNV Services sharing their personal information with the customer who is booking their services, including name, mobile number, and other details.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The professional (technician/service provider) acknowledges that the digital record of the proprietary information shall be accessible to PRNV Services.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The professional (technician/service provider) acknowledges that if they wish to edit and delete their digital record, they can do so under the guidance of PRNV Services. All this edited and old data will be stored as backup data with PRNV Services for future processes.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            PRNV Services reserves the right to, at its sole discretion, take appropriate action in response to the findings of the background investigation and verification.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We may also request and gather additional information from third parties if we determine it is necessary, in our sole and absolute discretion, such as information to verify any identification details you provide during registration or information about your credit from a credit bureau (to the extent permitted by law).
          </Text>

          <View className="bg-gray-50 p-6 rounded-lg mb-6">
            <Text className="font-semibold text-gray-800 mb-3">
              Note:
            </Text>
            <View className="ml-6 mb-3">
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                1. We don't guarantee to provide leads to any professional (technician/service provider), as PRNV Services is purely an advertisement company.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                2. We don't take any commission from the professional (technician/service provider) except for the monthly fee.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                3. PRNV Services will only advertise and boost your professional profile page.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                4. We won't be involved in the conversation between the professional (technician/service provider) & customer.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                5. The professional (technician/service provider) is entirely responsible for any damage during the work. PRNV Services do not take any responsibility for it. PRNV Services do not accept any responsibility for compensation.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                6. The professional (technician/service provider) should give a one-week work guarantee to the customer after the work is done.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                7. After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the professional (technician/service provider) page. These details will be tracked for different processes like providing 1 week of work guarantee.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                8. To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                9. Individual professionals (technicians/service providers) are responsible for GST according to the applicable government rules.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                10. The professional (technician/service provider) profile in the searched category will be displayed based on seniority, like first come, first serve. professionals (technicians/service providers) will lose the seniority benefits if they fail to renew on time.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                11. PRNV services will not provide work training to the professional (technician/service provider) in their related field. But PRNV will provide operational (computer) knowledge.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                12. The professional (technician/service provider) is responsible for submitting the government-verified documents and 2 mobile referral numbers for the authentication, including the team documents. That would be Aadhar Card, Pan Card, and others. The account will be activated within 24 hours.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                13. Professionals (Technicians/Service Providers) have to renew the plan in 30 days. On failing, the profile will not be accessible to the customers. And the next renewal amount may change according to the fares of that time.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                14. Professionals (Technicians/Service Providers) can change the plan only after the completion of an ongoing plan for 30 days. And the base fare may vary according to the new plan you choose.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                15. Professionals (Technicians/Service Providers) have full access to the profile page to make necessary changes.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                16. Professionals (Technicians/Service Providers) can change the pin code during the Time of renewal. He can't change the pincode in the ongoing plan.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                17. Professionals (Technicians/Service Providers) best work videos will be shown on our youtube channel to boost their business.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                18. Professionals (Technicians/Service Providers) have the freedom to discuss the work details with customers and fix the date of service.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                19. Professionals (Technicians/Service Providers) can offer better discounts than other professionals (technicians/service providers) to get the best business.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                20. Professionals (Technicians/Service Providers) can get the total work amount on the spot without any deductions. In other companies, the professional (technician/service provider) will get the payment for work done after 15 - 30 days with TDS & other deductions.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                21. Professionals (Technicians/Service Providers) can boost their profile by sharing with customers & people in their circle. With this, the professional (technician/service provider) will get their customers and people from other professionals (technicians/service providers) referrals too.
              </Text>
              <Text className="text-sm text-gray-700 leading-5 mb-2">
                22. The best work videos of professional (technician/service provider) will be shared on our Youtube channel.
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            License:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            Unless otherwise specified, the intellectual property rights of all of the content on PRNV Services belong to PRNV Services and/or its licensors. All rights to intellectual property are reserved. In accordance with the limitations set forth in these terms and conditions, you may access material from PRNV Services for personal use.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            You must not:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. Copy or republish PRNV Services materials.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. Sell, rent, or sub-license PRNV Services material.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. Reproduce, duplicate, or copy PRNV Services materials.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. Republish PRNV Services content.
            </Text>
          </View>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            This Agreement shall begin on the 7th of February, 2023. Certain sections of this Website allow users to post and exchange opinions and information. PRNV Services does not filter, edit, publish, or review comments before their presence on the Website. Comments do not reflect the views and opinions of PRNV Services, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, PRNV Services shall not be liable for the Comments or any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this Website.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            PRNV Services reserves the right to monitor all comments and remove any comments that can be considered inappropriate, offensive, or causes a breach of these Terms and Conditions.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            You warrant and represent that:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. You are entitled to post the comments on our website and have all necessary licenses and consents.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. The comments do not invade any intellectual property right, including, without limitation, copyright, patent, or trademark of any third party.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. The comments do not contain defamatory, libellous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.
            </Text>
          </View>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            You now grant PRNV Services a non-exclusive license to use, reproduce, edit, and authorize others to use, reproduce and edit any of your Comments in any form, format, or media.
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Hyperlinking to our Content:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The following organizations may link to our website without prior written approval:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. Government agencies;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. Search engines;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. News organizations;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. Online directory distributors may link to our website in the same manner as they hyperlink to the Websites of other listed businesses; and
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              5. System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups, which may not hyperlink to our Web site.
            </Text>
          </View>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            These organizations may link to our home page, to publications, or other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We may consider and approve other link requests from the following types of organizations:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. commonly-known consumer and/or business information sources;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. dot.com community sites;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. associations or other groups representing charities;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. online directory distributors;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              5. internet portals;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              6. accounting, law, and consulting firms; and
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              7. educational institutions and trade associations.
            </Text>
          </View>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavourably to ourselves or our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of PRNV Services; and (d) the link is in the context of general resource information.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to PRNV Services. Please include your name, your organization name, and contact information as well as the URL of your site, a list of any URLs from which you intend to link to our website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            Approved organizations may hyperlink to our website as follows:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. By use of our corporate name; or
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. By use of the uniform resource locator being linked to; or
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. Using any other description of our website being linked to that makes sense within the context and format of content on the linking party's site.
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. No use of PRNV Services' logo or other artwork will be allowed for linking absent a trademark license agreement.
            </Text>
          </View>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Content Liability:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libellous, obscene, or criminal or which infringes, otherwise violates, or advocates the infringement or other violation of any third-party rights.
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Reservation of Rights:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We reserve the right to request that you remove all links or any particular link to our website. You approve of immediately removing all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our website, you agree to be bound to and follow these linking terms and conditions.
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Removal of links from our website:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            If you find any link on our website offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to or so or to respond to you directly.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            We do not ensure that the information on this Website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the Website remains available or that the material on the Website is kept up to date.
          </Text>

          <Text className="text-2xl font-semibold text-blue-700 mt-8 mb-4">
            Disclaimer:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this Website. Nothing in this disclaimer will:
          </Text>
          <View className="ml-5 mb-6">
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              1. limit or exclude our or your liability for death or personal injury;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              2. limit or exclude our or your liability for fraud or fraudulent misrepresentation;
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              3. limit any of our or your liabilities in any way that is not permitted under applicable law; or
            </Text>
            <Text className="text-sm text-gray-700 leading-5 mb-2">
              4. exclude any of our or your liabilities that may not be excluded under applicable law.
            </Text>
          </View>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-6">
            As long as the Website and the information and services on the Website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;
// import React from 'react';
// import { ScrollView, View, Text } from 'react-native';

// const TermsConditionsScreen: React.FC = () => {
//   const renderList = (items: string[]) => (
//     <View className="ml-4 space-y-1">
//       {items.map((item, index) => (
//         <Text key={index} className="text-sm">• {item}</Text>
//       ))}
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="px-4 py-8">
//         <Text className="text-3xl font-bold text-gray-900 mb-8">
//           Terms & Conditions
//         </Text>

//         <View className="bg-white rounded-lg shadow p-6 border border-gray-200">

//           {/* Last Updated */}
//           <Text className="text-sm text-gray-600 mb-4">
//             <Text className="font-bold">Last updated:</Text> February 07, 2023
//           </Text>

//           <Text className="mb-4">Welcome to PRNV Services!</Text>

//           <Text className="mb-4">
//             These terms and conditions outline the rules and regulations for using the PRNV Services Website, located at www.prnvservices.com. We assume that you accept these terms and conditions by accessing this website. Do not continue to use PRNV Services if you do not agree to take all of the terms and conditions stated on this page.
//           </Text>

//           {/* Terminology */}
//           <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
//             <Text className="text-base text-gray-700">
//               The following terminology applies to these Terms & Conditions and Disclaimer Notice and all Agreements: "Customer", "User", "You" and "Your" refers to you, the person who log on this Website and is compliant to the company's terms and conditions. "The Company", "Ourselves", "We" and "Our" refers to our company. "Professionals" (Technician/Service Providers) refers to all the technician's offering services. All terms refer to the offering, acceptance, and payment terms required to start the action of our assistance to you in the most effective manner to satisfy your demands for the provision of the company's stated services in line with and subject to the applicable law of India. Any usage of the terminology mentioned above or other words in the singular, plural, he/she, or they format is understood to be interchangeable and to be referring to the same. So, please read the terms and conditions carefully before availing of services or registering yourself as a professional (technician, service provider) on this Website.
//             </Text>
//           </View>

//           {/* Changes */}
//           <Text className="text-2xl font-semibold text-blue-700 mb-2">Changes</Text>
//           <Text className="mb-4">
//             The terms & conditions might change, modify, add, or remove from time to time without any notice. So, it is your responsibility to check for any changes in terms & conditions periodically to be aware of them and ensure that you follow them. By continuing to access or use our site, you agree to be bound by any such revisions and should, therefore, periodically visit this page to review the current Terms & Conditions for both customer & professional (technician/service provider).
//           </Text>

//           {/* Cookies */}
//           <Text className="text-2xl font-semibold text-blue-700 mb-2">Cookies</Text>
//           <Text className="mb-4">
//             We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the choice of allowing or disallowing optional Cookies. For the proper operation of our Website, a few Cookies are required. Since they always function, these cookies don't need your permission. Please be aware that by allowing necessary Cookies, you also accept third-party Cookies that might be used in conjunction with third-party services that you use on our website, such as a video display window offered by third parties and integrated into our website.
//           </Text>

//           {/* Terms for Customer */}
//           <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Terms for Customer:</Text>
//           <Text className="mb-4">
//             Your name, phone number, email address, and other personal information will be collected during the Account registration process and while using the PRNV Services website. We collect your login credentials for our website when you directly register yourself as a customer using your Gmail account. When you make a booking for the service on our website, you can provide us with your postal address, phone number, area code, and other contact information. This data will assist us in compiling and providing a list of professionals (technicians/service providers) in your area. We may collect this personal information when you post a comment or provide ratings and reviews on the professional (technician/service provider) profile. We also may collect any conversations you have with us through our blogs, chat boxes, or other message boards on the Website and any comments you make when resolving a dispute with another user of the Website or mobile application.
//           </Text>

//           <View className="bg-gray-50 p-4 rounded-lg mb-4">
//             <Text className="font-semibold text-gray-800 mb-2">Note:</Text>
//             {renderList([
//               'PRNV Services is not involved in any payment between the customer and professional (technician/service provider).',
//               'Customer should make payment to the professional (technician/service provider) after work is done.',
//               'After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the service profile page. These details will be tracked for different processes like providing 1 week of work guarantee.',
//               'The amount paid to a professional (technician/service provider) after work is not refundable.',
//               'To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.',
//               'Customers don\'t have to pay GST, as most professionals (technicians/service providers) are under the GST limit.',
//               'Customers don\'t have to pay commissions to the company because PRNV Services follows the principle of No Middlemen – No Commissions.',
//               'Customers can choose, contact and fix the timing with the professional (technician/service provider).',
//               'Customers will get the lowest price in the market because of the offers & internal competition among professionals (technicians/service providers).',
//               'Customers have a weapon of rating & reviews. To achieve this, the professional (technician/service provider) will work politely and professionally by giving his 100% effort.',
//               'Customers can hire the same professionals (technicians/service providers) several times.',
//               'The company won\'t take any commission for any booking done through PRNV Services from the customer.',
//               'For Guest booking, the customer has to provide their name, phone number, pin code, work list category, and other details as required.'
//             ])}
//           </View>

//           {/* Professional Section */}
//           <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Professional (Technician/Service Provider):</Text>
//           <Text className="mb-4">
//             We will collect your business name, phone number, permanent and current address, pin code, a description of your services, languages known, first and last name, and email address during the Account registration process. You may also have to submit other information required to be provided to PRNV Services for this registration process. This registration form and document submission may change from time to time for the security and safety of the professional (technician/service provider) and PRNV Services. You can post a short description of your work, work photos, and more on your profile page. We may also request payment information from you, such as credit/debit card, gpay, or other card information. PRNV Services will also keep track of your work earnings to help you improve your services.
//           </Text>

//           {/* Disclaimer */}
//           <Text className="text-2xl font-semibold text-blue-700 mb-2 mt-4">Disclaimer:</Text>
//           <Text className="mb-4">
//             To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this Website. Nothing in this disclaimer will:
//           </Text>
//           {renderList([
//             'limit or exclude our or your liability for death or personal injury;',
//             'limit or exclude our or your liability for fraud or fraudulent misrepresentation;',
//             'limit any of our or your liabilities in any way that is not permitted under applicable law; or',
//             'exclude any of our or your liabilities that may not be excluded under applicable law.'
//           ])}

//           <Text className="mt-4 mb-4">
//             The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
//           </Text>

//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default TermsConditionsScreen;
