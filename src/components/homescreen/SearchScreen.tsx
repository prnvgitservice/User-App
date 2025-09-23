import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore: No type definitions for react-native-vector-icons/Ionicons
// import Ionicons from 'react-native-vector-icons/Ionicons';

type Tech = {
  id: string;
  name: string;
  category: string;
  image: string;
  pincode: string;
  area: string;
  place: string;
  price: number;
  rating: string;
  reviews: number;
  user: string;
};

const allTechs: Tech[] = [
  // 40 sample technicians
  ...Array.from({ length: 40 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Tech ${i + 1}`,
    category: i % 4 === 0 ? 'Cleaning' : i % 4 === 1 ? 'Repairing' : i % 4 === 2 ? 'Painting' : 'Laundry',
    image: `https://randomuser.me/api/portraits/men/${(i % 50) + 1}.jpg`,
    pincode: ['123456', '654321', '110011', '400001', '560001', '700001'][i % 6],
    area: ['Downtown', 'Uptown', 'Central Park', 'Greenfield', 'Riverside', 'Hilltop'][i % 6],
    place: ['A', 'B', 'C', 'D', 'E', 'F'][i % 6],
    price: 20 + (i % 10),
    rating: (4 + (i % 10) * 0.1).toFixed(1),
    reviews: 1000 + i * 13,
    user: `User ${i + 1}`,
  })),
];

const pincodes = ['123456', '654321', '110011', '400001', '560001', '700001'];
const areas = ['Downtown', 'Uptown', 'Central Park', 'Greenfield', 'Riverside', 'Hilltop'];
const places = ['A', 'B', 'C', 'D', 'E', 'F'];

const SearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const category = route.params?.category || 'Cleaning';
  const [showFilter, setShowFilter] = useState(false);
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [place, setPlace] = useState('');
  const [filtered, setFiltered] = useState<Tech[] | null>(null);
  const [pincodeDropdown, setPincodeDropdown] = useState(false);
  const [areaDropdown, setAreaDropdown] = useState(false);
  const [placeDropdown, setPlaceDropdown] = useState(false);

  const techs: Tech[] = (filtered !== null ? filtered : allTechs).filter((t: Tech) => t.category === category);

  const handleSearch = () => {
    setFiltered(
      allTechs.filter((t: Tech) =>
        t.category === category &&
        (!pincode || t.pincode === pincode) &&
        (!area || t.area === area) &&
        (!place || t.place === place)
      )
    );
    setShowFilter(false);
  };

  const filterOptions = (input: string, options: string[]): string[] =>
    options.filter((opt: string) => opt.toLowerCase().includes(input.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.goBack()} accessible accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category} Technicians</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <Ionicons name="filter" size={26} color="#a259ff" />
        </TouchableOpacity>
      </View>
      <View style={styles.badgesRow}>
        {pincode ? <Text style={styles.badge}>{pincode}</Text> : null}
        {area ? <Text style={styles.badge}>{area}</Text> : null}
        {place ? <Text style={styles.badge}>{place}</Text> : null}
        {(pincode || area || place) && (
          <TouchableOpacity onPress={() => { setPincode(''); setArea(''); setPlace(''); setFiltered(null); }} style={{ marginLeft: 8 }}>
            <Ionicons name="close-circle" size={22} color="#a259ff" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={techs}
        keyExtractor={item => item.id}
        renderItem={({ item }: { item: Tech }) => (
          <TouchableOpacity style={styles.popularCard} onPress={() => (navigation as any).navigate('TechProfile', { tech: item })}>
            <Image source={{ uri: item.image }} style={styles.popularImage} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.popularUser}>{item.user || item.name}</Text>
              <Text style={styles.popularTitle}>{item.name}</Text>
              <Text style={styles.popularPrice}>${item.price}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: '#FFD700', fontSize: 16 }}>★</Text>
                <Text style={styles.popularRating}>{item.rating}</Text>
                <Text style={styles.popularReviews}>| {item.reviews} reviews</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-circle" size={28} color="#a259ff" style={{ marginLeft: 8, alignSelf: 'center' }} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
      <Modal visible={showFilter} animationType="slide" transparent onRequestClose={() => setShowFilter(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter</Text>
            {/* Pincode Autocomplete */}
            <View style={{ width: '100%', zIndex: 30, position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                value={pincode}
                onChangeText={text => {
                  setPincode(text);
                  setPincodeDropdown(true);
                }}
                onFocus={() => setPincodeDropdown(true)}
                onBlur={() => setTimeout(() => setPincodeDropdown(false), 200)}
              />
              {pincodeDropdown && filterOptions(pincode, pincodes).length > 0 && (
                <ScrollView style={[styles.dropdown, { position: 'absolute', top: 56, left: 0, right: 0, zIndex: 100 }]}> {/* 56 = input height + margin */}
                  {filterOptions(pincode, pincodes).map(opt => (
                    <TouchableOpacity key={opt} onPress={() => { setPincode(opt); setPincodeDropdown(false); }}>
                      <Text style={styles.dropdownItem}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            {/* Area Autocomplete */}
            <View style={{ width: '100%', zIndex: 20, position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="Area"
                value={area}
                onChangeText={text => {
                  setArea(text);
                  setAreaDropdown(true);
                }}
                onFocus={() => setAreaDropdown(true)}
                onBlur={() => setTimeout(() => setAreaDropdown(false), 200)}
              />
              {areaDropdown && filterOptions(area, areas).length > 0 && (
                <ScrollView style={[styles.dropdown, { position: 'absolute', top: 56, left: 0, right: 0, zIndex: 90 }]}> {/* 56 = input height + margin */}
                  {filterOptions(area, areas).map(opt => (
                    <TouchableOpacity key={opt} onPress={() => { setArea(opt); setAreaDropdown(false); }}>
                      <Text style={styles.dropdownItem}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            {/* Place Autocomplete */}
            <View style={{ width: '100%', zIndex: 10, position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="Place"
                value={place}
                onChangeText={text => {
                  setPlace(text);
                  setPlaceDropdown(true);
                }}
                onFocus={() => setPlaceDropdown(true)}
                onBlur={() => setTimeout(() => setPlaceDropdown(false), 200)}
              />
              {placeDropdown && filterOptions(place, places).length > 0 && (
                <ScrollView style={[styles.dropdown, { position: 'absolute', top: 56, left: 0, right: 0, zIndex: 80 }]}> {/* 56 = input height + margin */}
                  {filterOptions(place, places).map(opt => (
                    <TouchableOpacity key={opt} onPress={() => { setPlace(opt); setPlaceDropdown(false); }}>
                      <Text style={styles.dropdownItem}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}><Text style={styles.searchBtnText}>Search</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  filterIcon: {
    fontSize: 24,
    color: '#a259ff',
  },
  badgesRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#a259ff',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  dropdown: {
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    marginTop: -8,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    color: '#222',
  },
});

export default SearchScreen; 