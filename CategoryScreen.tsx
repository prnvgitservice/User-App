import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const categories = [
  { name: 'Cleaning', icon: '🧹', color: '#f6f0ff' },
  { name: 'Repairing', icon: '🛠️', color: '#fff6e0' },
  { name: 'Painting', icon: '🖌️', color: '#f0f6ff' },
  { name: 'Laundry', icon: '🧺', color: '#fffbe0' },
  { name: 'Appliance', icon: '🔧', color: '#ffeaea' },
  { name: 'Plumbing', icon: '🔨', color: '#eaffea' },
  { name: 'Shifting', icon: '🚚', color: '#eaf6ff' },
  { name: 'Beauty', icon: '✂️', color: '#f6f0ff' },
  { name: 'AC Repair', icon: '🌀', color: '#eaffea' },
  { name: 'Vehicle', icon: '🚗', color: '#f0f6ff' },
  { name: 'Electronics', icon: '💻', color: '#fff6e0' },
  { name: 'Massage', icon: '💆‍♀️', color: '#ffeaea' },
];

const CategoryScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Full-width flat white header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideIcon}>
        <Ionicons name="arrow-back" size={28} color="#222" />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>All Services</Text>
        </View>
      </View>

      <FlatList
        data={categories}
        numColumns={4}
        keyExtractor={item => item.name}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.catItem}
            onPress={() => (navigation as any).navigate('HomeStack', { screen: 'SearchScreen', params: { category: item.name } })}
          >
            <View style={[styles.catIconBox, { backgroundColor: item.color }]}>
              <Text style={styles.catIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.catLabel}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 50, // for status bar area
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideIcon: {
    width: 40,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  moreIcon: {
    fontSize: 24,
    color: '#888',
  },
  catItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    marginVertical: 18,
  },
  catIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catIcon: {
    fontSize: 28,
  },
  catLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryScreen;
