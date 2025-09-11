import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { getTechByCategorie } from '../api/apiMethods';

interface Technician {
  technician: {
    _id: string;
    username: string;
    profileImage?: string;
    service?: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    description?: string;
  };
  ratings?: {
    rating: number;
  };
  servicesDone?: number;
}

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
}

const ads = [
  'https://img.freepik.com/premium-photo/service-concept-person-hand-holding-service-icon-virtual-screen_1296497-175.jpg?semt=ais_hybrid&w=740',
  'https://www.shutterstock.com/image-photo/african-american-carpenter-man-look-600nw-2251298121.jpg',
  'https://media.istockphoto.com/id/1395783965/photo/plumbing-technician-checking-water-installation-with-notepad-ok-gesture.jpg?s=612x612&w=0&k=20&c=At0CYTgR0t5Uw2lf7jIOo4GAh6mUu2WNyDbV2u3bMRs=',
  'https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-600nw-2488702851.jpg',
];

export const AdvertisementBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-6">
      <Image
        source={{ uri: ads[currentIndex] }}
        className="w-full h-full object-cover"
        resizeMode="cover"
      />
    </View>
  );
};

export const ServiceFilters = ({ onFilterChange }: { onFilterChange: (filter: string) => void }) => (
  <View className="flex-row justify-around mb-4">
    <TouchableOpacity
      className="bg-blue-500 px-4 py-2 rounded-lg"
      onPress={() => onFilterChange('topRated')}
    >
      <Text className="text-white font-medium">Top Rated</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className="bg-blue-500 px-4 py-2 rounded-lg"
      onPress={() => onFilterChange('popular')}
    >
      <Text className="text-white font-medium">Popular</Text>
    </TouchableOpacity>
  </View>
);

const TechniciansScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId , category } = route.params as { categoryId: string , category: string};
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setError('No category ID provided');
      return;
    }

    const fetchTechByCategoryId = async () => {
      try {
        setIsDataLoading(true);
        const response = await getTechByCategorie(categoryId);
        const data = response?.result?.technicians || [];

        const mappedTechnicians: Technician[] = data.map((item: any) => ({
          technician: {
            _id: item.technician._id,
            username: item.technician.username,
            profileImage:
              item.technician.profileImage ||
              'https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg',
            service: item.services?.length > 0 ? item.services[0].serviceName : undefined,
            areaName: item.technician.areaName,
            city: item.technician.city,
            state: item.technician.state,
            pincode: item.technician.pincode,
            phoneNumber: item.technician.phoneNumber,
            description: item.technician.description,
          },
          ratings: item.ratings || null,
          servicesDone: item.techSubDetails?.subscriptions[0]?.ordersCount || 0,
        }));

        setTechnicians(mappedTechnicians);
        setFilteredTechnicians(mappedTechnicians);
      } catch (error: any) {
        setError(error?.message || 'Failed to fetch technicians');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchTechByCategoryId();
  }, [categoryId]);

  const openWhatsApp = (number: string, message: string) => {
    const url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => alert('WhatsApp is not installed'));
  };

  const handleFilterChange = (filter: string) => {
    let updatedTechnicians = [...technicians];
    if (filter === 'topRated') {
      updatedTechnicians = technicians.filter((tech) => (tech.ratings?.rating ?? 0) >= 3.0);
    } else if (filter === 'popular') {
      updatedTechnicians = technicians.sort((a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0));
    }
    setFilteredTechnicians(updatedTechnicians);
  };

  const renderTechnician = ({ item }: { item: Technician }) => (
    <TouchableOpacity
      className="border border-gray-300 rounded-2xl p-3 mb-3 flex-row items-center bg-white shadow-md"
      onPress={() => navigation.navigate('TechnicianProfile', { technicianId: item.technician._id })}
    >
      <Image
        source={{ uri: item.technician.profileImage }}
        className="w-24 h-24 rounded-2xl mr-3"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.technician.username}</Text>
        <View className="flex-row items-center mt-1">
          <View className="flex-row items-center border border-yellow-500 rounded-lg px-2">
            <Text className="font-bold">{item.ratings?.rating ?? '4'}</Text>
            <MaterialCommunityIcons name="star-outline" size={20} color="#ffc71b" className="ml-1" />
          </View>
          {item.ratings?.rating && (
            <Text className="text-gray-600 text-sm ml-2">{item.ratings.rating} Ratings</Text>
          )}
        </View>
        {item.technician?.service && (
          <View className="bg-pink-200 px-3 py-1 rounded-xl mt-1">
            <Text className="text-sm">{item.technician.service}</Text>
          </View>
        )}
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={20} color="red" />
          <Text className="text-sm font-light ml-2 flex-1">
            {item.technician.areaName}, {item.technician.city}, {item.technician.state}, {item.technician.pincode}
          </Text>
        </View>
        {item.technician?.description && (
          <View className="flex-row items-center mt-1">
            <FontAwesome name="thumbs-up" size={20} color="#00B800" />
            <Text className="text-sm font-light ml-2">{item.technician.description} years in Services</Text>
          </View>
        )}
        <TouchableOpacity
          className="bg-green-600 rounded px-2 py-1 mt-2 flex-row items-center w-32"
          onPress={() => openWhatsApp('919603558369', 'Hello, I am interested in your services')}
        >
          <MaterialCommunityIcons name="message-text-outline" size={20} color="white" className="mr-2" />
          <Text className="text-white text-sm">Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (

    <View className="flex-1 bg-gray-100 px-4">
      <AdvertisementBanner />
      <Text className="text-xl font-semibold mb-4">{category || 'Technicians'}</Text>
      <ServiceFilters onFilterChange={handleFilterChange} />
      {isDataLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
        ) : error ? (
            <Text className="text-red-500 text-center mt-4">{error}</Text>
        ) : filteredTechnicians.length > 0 ? (
            <FlatList
            data={filteredTechnicians}
            renderItem={renderTechnician}
            keyExtractor={(item) => item.technician._id}
            showsVerticalScrollIndicator={false}
            />
        ) : (
            <Text className="text-gray-500 text-center mt-4">No technicians found.</Text>
        )}
    </View>
    );
}

export default TechniciansScreen;