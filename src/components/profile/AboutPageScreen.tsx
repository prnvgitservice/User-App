import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  Users,
  TrendingUp,
  Award,
  Shield,
  Star,
  DollarSign,
  Calendar,
  MapPin,
  Video,
  RefreshCw,
  Target,
  Globe,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Clock,
  FileText,
  CreditCard,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react-native';
import { Linking } from 'react-native';

const AboutUsScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-blue-600 mb-4">About Us</Text>
          <Text className="text-base text-gray-600 mb-6 text-center">
            Connecting service providers directly with customers
          </Text>
          <View className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <Users size={16} color="#2563eb" />
            <Text className="text-sm font-medium">No Middlemen - No Commissions</Text>
          </View>
        </View>

        {/* Main Content */}
        <View className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              At PRNV Services, we believe in direct connections between service
              providers and customers. Our platform eliminates middlemen and
              hefty commissions, allowing professionals to maximize their
              earnings while customers get the best value for their money.
            </Text>
          </View>

          {/* Profile Building */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Star size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">Build a Profile Page as Powerful as a Website</Text>
            </View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              Showcase your skills, expertise, and service offerings with a
              captivating profile page that sets you apart from the competition.
              Our platform allows you to create a comprehensive digital presence
              that works like a full website.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              Grab attention and leave a lasting impression by showcasing your
              work through images and videos. Selected videos may even appear on
              our YouTube channel, giving you additional exposure and marketing
              opportunities.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              You can improve your position in the listings by leveraging your
              joining seniority, customer ratings, and volume of business.
              Additionally, our flexible Self-Billing Dashboard allows you to
              set your own prices and attract more customers with special
              offers.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              Enjoy the freedom to choose your work schedule with our intuitive
              ON/OFF feature. Our platform adapts to your needs, whether you
              prefer to work part-time or full-time, allowing you to maintain a
              healthy work-life balance.
            </Text>
          </View>

          {/* Key Features for Professionals */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <UserCheck size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">Key Features for Professionals</Text>
            </View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Professional Enrollment:</Text> Join our platform as a
              skilled technician or service provider in your respective field.
              We welcome professionals from all service industries who are
              committed to quality work and customer satisfaction.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Direct Connection Model:</Text> We uphold the motto of
              eliminating middlemen, fostering direct connections between you
              and your customers. No commissions are charged, ensuring you keep
              100% of your earnings.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Social Media Marketing:</Text> Your profile is promoted
              based on ratings, reviews, and teamwork performance. Share your
              profile URL across social media platforms to expand your reach and
              attract more customers.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Flexible Subscription Model:</Text> Renew your
              subscription after every 30 leads or Rs. 30,000 worth of
              work—whichever comes first.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Service Area Selection:</Text> Choose specific pin codes
              to define your working area.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Early Joiner Advantage:</Text> Be listed at the top of
              search results and get more visibility as an early adopter of our
              platform.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Video Showcase Feature:</Text> Upload videos to showcase
              your work and expertise.
            </Text>
            <Text className="text-sm italic text-gray-700 mb-4">
              <Text className="font-semibold">Please note:</Text> Refunds are not available on
              professional subscriptions.
            </Text>
          </View>

          {/* Key Features for Advertisers */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Briefcase size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">Key Features for Advertisers</Text>
            </View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Business Promotion:</Text> Join as an advertiser to
              promote your business through PRNV Services.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Targeted Advertising:</Text> Choose specific pin code
              areas within GHMC limits.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Comprehensive Business Profiles:</Text> Get a detailed
              business profile page.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Premium Placement Options:</Text> Ruby plan subscribers
              get homepage visibility.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Plan Management:</Text> All advertising plans have a
              30-day validity period.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Digital Marketing Support:</Text> Share your profile URL
              across social media.
            </Text>
            <Text className="text-sm italic text-gray-700 mb-4">
              <Text className="font-semibold">Please note:</Text> Refunds are not available for
              advertising subscriptions.
            </Text>
          </View>

          {/* Key Features for Customers */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Users size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">Key Features for Customers</Text>
            </View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Commission-Free Services:</Text> Avail services at the
              lowest possible cost.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Competitive Pricing:</Text> Internal competition ensures
              the best prices.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Quality Assurance:</Text> Share feedback to help others
              make informed decisions.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Work Guarantee:</Text> Damage cover and a 1-week work
              guarantee available.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">GST Benefits:</Text> Most providers are GST-exempt.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Convenient Rehiring:</Text> Easily rehire trusted
              providers anytime.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              <Text className="font-semibold">Choice and Negotiation:</Text> Negotiate directly with
              service providers.
            </Text>
            <Text className="text-sm italic text-gray-700 mb-4">
              <Text className="font-semibold">Please note:</Text> Refunds are not available for
              customer transactions.
            </Text>
          </View>

          {/* Platform Liability */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Shield size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">PRNV Services Liability and Compensation</Text>
            </View>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              PRNV Services operates as a platform and directory service—not as
              a middleman.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              Technicians and service providers are responsible for any damages
              caused.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4">
              Customers must provide documentation for compensation claims.
            </Text>
            <Text className="text-base text-gray-700 leading-6 mb-4 font-semibold">
              <Text className="font-semibold">Important Notice:</Text> PRNV Services will not pay
              direct damages.
            </Text>
          </View>

          {/* Contact Info */}
          <View className="bg-gray-100 p-6 rounded-lg">
            <View className="flex-row items-center gap-2 mb-4">
              <Phone size={24} color="#2563eb" />
              <Text className="text-xl font-semibold text-gray-800">Contact Information</Text>
            </View>
            <View className="flex-col gap-6">
              <View className="flex-row items-center justify-center gap-4">
                <Phone size={20} color="#2563eb" />
                <View className="items-center">
                  <Text className="text-sm font-medium text-center">Phone</Text>
                  <Text className="text-sm text-gray-600 text-center">+91 9059789177</Text>
                  <Text className="text-sm text-gray-600 text-center">+91 9603558369</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-center gap-4">
                <Mail size={20} color="#2563eb" />
                <View className="items-center">
                  <Text className="text-sm font-medium text-center">Email</Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:prnvserviceswork@gmail.com')}
                  >
                    <Text className="text-sm text-gray-600 text-center underline">prnvserviceswork@gmail.com</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row items-center justify-center gap-4">
                <MapPin size={20} color="#2563eb" />
                <View className="items-center">
                  <Text className="text-sm font-medium text-center">Service Area</Text>
                  <Text className="text-sm text-gray-600 text-center text-xs">PRNV SERVICES, Flat No. 301, Sai Manor Apartment, H.NO. 7-1-621/10, Near Umesh Chandra Statue, IAS Quarters Lane, SR Nagar, Hyderabad, Telangana, 500038</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Closing Statement */}
          <View className="items-center">
            <Text className="text-lg font-medium text-gray-800 mb-2 text-center">
              Join PRNV Services today and experience the difference of direct
              connections!
            </Text>
            <Text className="text-gray-600 text-center">
              Whether you're a service provider or a customer, our platform is
              built to serve your needs efficiently.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;

// import React from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const AboutUsScreen: React.FC = () => {
//   return (
//     <ScrollView
//       className="flex-1 bg-gray-50"
//       contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
//     >
//       {/* Header */}
//       <View className="items-center mb-10">
//         <Text
//           className="text-3xl font-bold text-gray-800 mb-3"
//           style={{ borderBottomWidth: 2, borderBottomColor: '#1e40af' }}
//         >
//           About Us
//         </Text>
//         <Text className="text-lg text-gray-600 mb-4 text-center leading-relaxed">
//           Connecting service providers directly with customers
//         </Text>
//         <View className="flex-row items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl shadow-sm">
//           <Ionicons name="people" size={18} color="#1e40af" />
//           <Text className="text-base font-medium text-blue-800">
//             No Middlemen - No Commissions
//           </Text>
//         </View>
//       </View>

//       {/* Main Content */}
//       <View className="space-y-8">
//         {/* Introduction */}
//         <View>
//           <Text className="text-lg text-gray-700 leading-relaxed">
//             At PRNV Services, we believe in direct connections between service providers and
//             customers. Our platform eliminates middlemen and hefty commissions, allowing
//             professionals to maximize their earnings while customers get the best value for their
//             money.
//           </Text>
//         </View>

//         {/* Profile Building */}
//         <View>
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="star" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">
//               Build a Profile Page as Powerful as a Website
//             </Text>
//           </View>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             Showcase your skills, expertise, and service offerings with a captivating profile page
//             that sets you apart from the competition. Our platform allows you to create a
//             comprehensive digital presence that works like a full website.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             Grab attention and leave a lasting impression by showcasing your work through images
//             and videos. Selected videos may even appear on our YouTube channel, giving you
//             additional exposure and marketing opportunities.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             You can improve your position in the listings by leveraging your joining seniority,
//             customer ratings, and volume of business. Additionally, our flexible Self-Billing
//             Dashboard allows you to set your own prices and attract more customers with special
//             offers.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed">
//             Enjoy the freedom to choose your work schedule with our intuitive ON/OFF feature. Our
//             platform adapts to your needs, whether you prefer to work part-time or full-time,
//             allowing you to maintain a healthy work-life balance.
//           </Text>
//         </View>

//         {/* Key Features for Professionals */}
//         <View>
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="person-circle" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">
//               Key Features for Professionals
//             </Text>
//           </View>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Professional Enrollment:</Text> Join our platform as
//             a skilled technician or service provider in your respective field. We welcome
//             professionals from all service industries who are committed to quality work and
//             customer satisfaction.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Direct Connection Model:</Text> We uphold the motto of
//             eliminating middlemen, fostering direct connections between you and your customers. No
//             commissions are charged, ensuring you keep 100% of your earnings.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Social Media Marketing:</Text> Your profile is
//             promoted based on ratings, reviews, and teamwork performance. Share your profile URL
//             across social media platforms to expand your reach and attract more customers.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Flexible Subscription Model:</Text> Renew your
//             subscription after every 30 leads or Rs. 30,000 worth of work—whichever comes first.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Service Area Selection:</Text> Choose specific pin
//             codes to define your working area.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Early Joiner Advantage:</Text> Be listed at the top of
//             search results and get more visibility as an early adopter of our platform.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Video Showcase Feature:</Text> Upload videos to
//             showcase your work and expertise.
//           </Text>
//           <Text className="text-base text-gray-600 italic">
//             <Text className="font-semibold">Please note:</Text> Refunds are not available on
//             professional subscriptions.
//           </Text>
//         </View>

//         {/* Key Features for Advertisers */}
//         <View>
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="briefcase" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">
//               Key Features for Advertisers
//             </Text>
//           </View>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Business Promotion:</Text> Join as an advertiser to
//             promote your business through PRNV Services.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Targeted Advertising:</Text> Choose specific pin code
//             areas within GHMC limits.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Comprehensive Business Profiles:</Text> Get a detailed
//             business profile page.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Premium Placement Options:</Text> Ruby plan
//             subscribers get homepage visibility.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Plan Management:</Text> All advertising plans have a
//             30-day validity period.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Digital Marketing Support:</Text> Share your profile
//             URL across social media.
//           </Text>
//           <Text className="text-base text-gray-600 italic">
//             <Text className="font-semibold">Please note:</Text> Refunds are not available for
//             advertising subscriptions.
//           </Text>
//         </View>

//         {/* Key Features for Customers */}
//         <View>
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="people" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">
//               Key Features for Customers
//             </Text>
//           </View>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Commission-Free Services:</Text> Avail services at the
//             lowest possible cost.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Competitive Pricing:</Text> Internal competition
//             ensures the best prices.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Quality Assurance:</Text> Share feedback to help others
//             make informed decisions.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Work Guarantee:</Text> Damage cover and a 1-week work
//             guarantee available.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">GST Benefits:</Text> Most providers are GST-exempt.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Convenient Rehiring:</Text> Easily rehire trusted
//             providers anytime.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             <Text className="font-semibold">Choice and Negotiation:</Text> Negotiate directly with
//             service providers.
//           </Text>
//           <Text className="text-base text-gray-600 italic">
//             <Text className="font-semibold">Please note:</Text> Refunds are not available for
//             customer transactions.
//           </Text>
//         </View>

//         {/* Platform Liability */}
//         <View>
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="shield-checkmark" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">
//               PRNV Services Liability and Compensation
//             </Text>
//           </View>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             PRNV Services operates as a platform and directory service—not as a middleman.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             Technicians and service providers are responsible for any damages caused.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed mb-4">
//             Customers must provide documentation for compensation claims.
//           </Text>
//           <Text className="text-lg text-gray-700 leading-relaxed">
//             <Text className="font-semibold">Important Notice:</Text> PRNV Services will not pay
//             direct damages.
//           </Text>
//         </View>

//         {/* Contact Info */}
//         <View className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200">
//           <View className="flex-row items-center gap-2 mb-4">
//             <Ionicons name="call" size={28} color="#1e40af" />
//             <Text className="text-xl font-bold text-gray-800">Contact Information</Text>
//           </View>
//           <View className="flex-col gap-6">
//             <View className="flex-row items-center gap-3">
//               <Ionicons name="call" size={24} color="#1e40af" />
//               <View>
//                 <Text className="text-base font-medium text-gray-700">Phone</Text>
//                 <Text className="text-base text-gray-600">+91 9603558369</Text>
//                 <Text className="text-base text-gray-600">+91 9059789177</Text>
//               </View>
//             </View>
//             <View className="flex-row items-center gap-3">
//               <Ionicons name="mail" size={24} color="#1e40af" />
//               <View>
//                 <Text className="text-base font-medium text-gray-700">Email</Text>
//                 <Text className="text-base text-gray-600">prnvserviceswork@gmail.com</Text>
//               </View>
//             </View>
//             <View className="flex-row items-center gap-3">
//               <Ionicons name="location" size={24} color="#1e40af" />
//               <View>
//                 <Text className="text-base font-medium text-gray-700">Service Area</Text>
//                 <Text className="text-base text-gray-600">GHMC Area, Hyderabad</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Closing Statement */}
//         <View className="items-center">
//           <Text className="text-lg font-bold text-gray-800 mb-2">
//             Join PRNV Services today and experience the difference of direct connections!
//           </Text>
//           <Text className="text-lg text-gray-600 text-center leading-relaxed">
//             Whether you're a service provider or a customer, our platform is built to serve your
//             needs efficiently.
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default AboutUsScreen;
