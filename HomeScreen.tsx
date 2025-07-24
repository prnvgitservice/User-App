import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const profileImage = 'https://randomuser.me/api/portraits/men/32.jpg';
const offerImages = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=600',
];
const screenWidth = Dimensions.get('window').width;
const serviceIcons = [
  'https://img.icons8.com/color/96/000000/broom.png',
  'https://img.icons8.com/color/96/000000/maintenance.png',
  'https://img.icons8.com/color/96/000000/paint-brush.png',
  'https://img.icons8.com/color/96/000000/washing-machine.png',
  'https://img.icons8.com/?size=64&id=RjFNU63A1OeB&format=png',
  'https://img.icons8.com/?size=80&id=vmPNvJ0De3an&format=png',
  'https://img.icons8.com/?size=80&id=CWh28Ph9219F&format=png',
  'https://img.icons8.com/color/96/000000/more.png',
];
const serviceNames = [
  'Cleaning', 'Repairing', 'Painting', 'Laundry', 'Appliance', 'Plumbing', 'Shifting', 'More'
];
const popularServices = [
  {
    name: 'House Cleaning',
    price: 25,
    image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
    user: 'Kylee Danford',
    rating: 4.8,
    reviews: 8289,
    type: 'Cleaning',
  },
  {
    name: 'Floor Cleaning',
    price: 20,
    image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
    user: 'Alfonso Schuessler',
    rating: 4.9,
    reviews: 6182,
    type: 'Cleaning',
  },
  {
    name: 'Washing Clothes',
    price: 22,
    image: 'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
    user: 'Sanjuanita Ordonez',
    rating: 4.7,
    reviews: 7938,
    type: 'Laundry',
  },
  {
    name: 'Bathroom Cleaning',
    price: 24,
    image: 'https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600',
    user: 'Freida Varnes',
    rating: 4.9,
    reviews: 6182,
    type: 'Cleaning',
  },
  {
    name: 'Painting Room',
    price: 30,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600',
    user: 'Alex Painter',
    rating: 4.6,
    reviews: 5123,
    type: 'Painting',
  },
];

const categoriessearch = [
  { id: 1, name: 'Cleaning' },
  { id: 2, name: 'Plumbing' },
  { id: 3, name: 'Electrician' },
  { id: 4, name: 'Gardening' },
  { id: 5, name: 'Babysitting' },
  { id: 6, name: 'Car Repair' },
  { id: 7, name: 'Laundry' },
  { id: 8, name: 'Cooking' },
  { id: 9, name: 'Repairing' },
  { id: 10, name: 'Painting' },
];
const categories = ['All', ...categoriessearch.map(c => c.name)];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [offerIndex, setOfferIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const interval = setInterval(() => {
      setOfferIndex(prev => (prev + 1) % offerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredServices = selectedFilter === 'All'
    ? popularServices
    : popularServices.filter(s => s.type === selectedFilter);

  const handleChange = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = categoriessearch.filter((cat) =>
        cat.name.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredCategories([]);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setSelectedCategoryObj(item);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (selectedCategoryObj) {
      navigation.navigate('SearchScreen', { id: selectedCategoryObj.id });
    } else {
      alert('Please select a category from the suggestions.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { marginTop: 24 }]}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
          <Text style={styles.greeting}>Good Morning <Text style={{ fontSize: 18 }}>👋</Text></Text>
          <Text style={styles.userName}>Andrew Ainsley</Text>
        </View>
        {/* <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>🛎️</Text>
        </TouchableOpacity> */}
      </View>

      {/* Search Box */}
      <View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search category (e.g. Cleaning)"
            value={query}
            onChangeText={handleChange}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/54/54481.png' }}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        {showDropdown && filteredCategories.length > 0 && (
          <View style={styles.dropdown}>
            {filteredCategories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

        {/* Special Offers Carousel */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
        </View>
        <View style={[styles.offerCard, { width: screenWidth - 40, borderRadius: 20 }]}>
          <Image source={{ uri: offerImages[offerIndex] }} style={[styles.offerImage, { borderRadius: 0 }]} />
          <View style={styles.offerOverlay} />
          <View style={styles.offerContent}>
            <Text style={styles.offerPercent}>30%</Text>
            <Text style={styles.offerSpecial}>Today's Special!</Text>
            <Text style={styles.offerDesc}>Get discount for every order, only valid for today</Text>
          </View>
          <View style={styles.carouselDots}>
            {offerImages.map((_, idx) => (
              <Text key={idx} style={{ color: offerIndex === idx ? '#fff' : '#ccc', fontSize: 28, marginHorizontal: 2, opacity: 0.9 }}>
                –
              </Text>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.sectionRow }>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Category')}>
            <Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={styles.servicesRow}>
          {serviceIcons.map((icon, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.serviceItem}
              onPress={() => idx === serviceIcons.length - 1 ? navigation.navigate('Category') : navigation.navigate('Category')}
            >
              <Image source={{ uri: icon }} style={styles.serviceIcon} />
              <Text style={styles.serviceName}>{serviceNames[idx]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Most Popular Services */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Most Popular Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Category')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={styles.categoriesRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, selectedFilter === cat && styles.categoryBtnActive]}
              onPress={() => setSelectedFilter(cat)}
            >
              <Text style={[styles.categoryText, selectedFilter === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginBottom: 40 }}>
          {filteredServices.map((service, idx) => (
            <TouchableOpacity key={idx} style={styles.popularCard} onPress={() => navigation.navigate('MainTabs', { screen: 'HomeStack', params: { screen: 'TechProfile' } })}>
              <Image source={{ uri: service.image }} style={styles.popularImage} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.popularUser}>{service.user}</Text>
                <Text style={styles.popularTitle}>{service.name}</Text>
                <Text style={styles.popularPrice}>${service.price}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ color: '#FFD700', fontSize: 16 }}>★</Text>
                  <Text style={styles.popularRating}>{service.rating}</Text>
                  <Text style={styles.popularReviews}>| {service.reviews} reviews</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward-circle" size={28} color="#a259ff" style={{ marginLeft: 8, alignSelf: 'center' }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    color: '#888',
    fontSize: 16,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 5,
    paddingHorizontal: 16,
    height: 48,
    top:10
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    maxHeight: 150,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
    color: '#222',
  },
  searchIcon: {
    marginLeft: 8,
    fontSize: 18,
    color: '#a259ff',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  seeAll: {
    color: '#a259ff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  offerCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 3,
    marginTop: 10,
    height: 140,
    position: 'relative',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  offerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(162,89,255,0.7)',
  },
  offerContent: {
    position: 'absolute',
    left: 24,
    top: 24,
  },
  offerPercent: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 2,
  },
  offerSpecial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  offerDesc: {
    color: '#fff',
    fontSize: 13,
    width: 180,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginBottom: 5,
    top:10
  },
  serviceItem: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 20,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
  },
  categoriesRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 17,
    top:5
  },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f7f7f7',
    marginRight: 10,
  },
  categoryBtnActive: {
    backgroundColor: '#a259ff',
  },
  categoryText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#fff',
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  popularImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  popularUser: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  popularTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 2,
  },
  popularPrice: {
    color: '#a259ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  popularRating: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 15,
  },
  popularReviews: {
    color: '#888',
    fontSize: 13,
    marginLeft: 8,
  },
  serviceIconWrapper: {
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 3,
},
  carouselDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 