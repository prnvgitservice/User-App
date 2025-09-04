import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const TechnicianProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tech = route.params?.tech;

  if (!tech) {
    return (
      <View style={styles.container}>
        <Text>No technician data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Technician Profile</Text>
        <View style={{ width: 32 }} />
      </View>
      <Image source={{ uri: tech.image }} style={styles.image} />
      <Text style={styles.title}>{String(tech.name)}</Text>
      <Text style={styles.detail}>Category: {String(tech.category)}</Text>
      <Text style={styles.detail}>Pincode: {String(tech.pincode)}</Text>
      <Text style={styles.detail}>Area: {String(tech.area)}</Text>
      <Text style={styles.detail}>Place: {String(tech.place)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 16,
  },
  backArrow: { fontSize: 28, marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#222' },
  image: { width: 100, height: 100, borderRadius: 20, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  detail: { color: '#888', fontSize: 15, marginBottom: 2 },
});

export default TechnicianProfile; 