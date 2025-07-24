import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const products = [
  {
    id: '1',
    name: 'Cleaning Kit',
    price: 15,
    image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
  },
  {
    id: '2',
    name: 'Mop',
    price: 10,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=600',
  },
  {
    id: '3',
    name: 'Detergent',
    price: 8,
    image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
  },
  {
    id: '4',
    name: 'Brush',
    price: 5,
    image: 'https://images.pexels.com/photos/3617544/pexels-photo-3617544.jpeg?auto=compress&w=600',
  },
];

const BuyProductScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const total = selected.reduce((sum, id) => {
    const prod = products.find((p) => p.id === id);
    return sum + (prod ? prod.price : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Product</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productCard, selected.includes(item.id) && styles.productCardSelected]}
            onPress={() => toggleSelect(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            {selected.includes(item.id) && <Text style={styles.selectedMark}>✓</Text>}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, selected.length === 0 && { opacity: 0.5 }]}
          disabled={selected.length === 0}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buyBtnText}>{selected.length > 0 ? `Buy ($${total})` : 'Buy'}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successText}>Success!</Text>
            <Text style={styles.successDesc}>Your booking and product purchase was successful.</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => {
              setShowModal(false);
              navigation.navigate('Home');
            }}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productCardSelected: {
    borderColor: '#a259ff',
    backgroundColor: '#ede3ff',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 2,
  },
  productPrice: {
    color: '#a259ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedMark: {
    color: '#a259ff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  skipBtn: {
    backgroundColor: '#f7f7f7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  skipBtnText: {
    color: '#a259ff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  buyBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
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
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#a259ff',
    marginBottom: 8,
  },
  successDesc: {
    color: '#888',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default BuyProductScreen; 