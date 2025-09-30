import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Add type for booking
interface Booking {
  id: string;
  service: string;
  user: string;
  image: string;
  status: string;
  review?: string;
  rating?: number;
}

const bookings: { [key: string]: Booking[] } = {
  Upcoming: [
    {
      id: '1',
      service: 'Home Cleaning',
      user: 'Maryland Winkles',
      image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
      status: 'Upcoming',
      review: '',
      rating: 5,
    },
  ],
  Completed: [
    {
      id: '2',
      service: 'Home Cleaning',
      user: 'Maryland Winkles',
      image: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&w=600',
      status: 'Completed',
      review: 'Great service, very professional!',
      rating: 5,
    },
    {
      id: '3',
      service: 'Laundry Services',
      user: 'Aileen Fullbright',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=600',
      status: 'Completed',
      review: 'Quick and clean.',
      rating: 4,
    },
    {
      id: '4',
      service: 'Painting the Walls',
      user: 'Alfonzo Schuessler',
      image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&w=600',
      status: 'Completed',
      review: 'Nice finish, will book again.',
      rating: 5,
    },
  ],
  Cancelled: [
    {
      id: '5',
      service: 'Bathroom Cleaning',
      user: 'Freida Varnes',
      image: 'https://images.pexels.com/photos/4239145/pexels-photo-4239145.jpeg?auto=compress&w=600',
      status: 'Cancelled',
      review: '',
      rating: 0,
    },
  ],
};

const tabs = ['Upcoming', 'Completed', 'Cancelled'];

const MyBookingScreen = () => {
  const [activeTab, setActiveTab] = useState('Completed');
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalTech, setModalTech] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const openDetails = (booking) => {
    setModalTech(booking);
    setShowModal(true);
  };

  const submitReview = () => {
    // Implement the logic to submit the review
    console.log('Review submitted:', { rating, review });
    setShowModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <View style={{ width: 32 }} /> {/* Spacer to keep title centered */}
      </View>
      <View style={styles.tabsRow}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tabBtn} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {bookings[activeTab].map((b: Booking) => (
          <View key={b.id} style={styles.card}>
            <Image source={{ uri: b.image }} style={styles.cardImage} />
            <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
              <Text style={styles.cardService}>{b.service}</Text>
              <Text style={styles.cardUser} numberOfLines={1} ellipsizeMode="tail">{b.user}</Text>
              <View style={styles.statusRow}>
                <Text style={[styles.status, b.status === 'Completed' && styles.statusCompleted, b.status === 'Upcoming' && styles.statusUpcoming, b.status === 'Cancelled' && styles.statusCancelled]}>{b.status}</Text>
                <Text style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>2024-06-10</Text>
              </View>
            </View>
            {(activeTab === 'Completed' || activeTab === 'Upcoming') ? (
              <TouchableOpacity
                style={styles.detailsIconBtn}
                onPress={() => (navigation as any).navigate('BookingDetails', { tech: b, status: b.status, review: b.review, rating: b.rating })}
              >
                <Ionicons name="chevron-forward-circle" size={28} color="#a259ff" />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalTech && (
              <>
                <Image source={{ uri: modalTech.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{modalTech.service}</Text>
                <Text style={styles.modalUser}>{modalTech.user}</Text>
                <Text style={styles.modalLabel}>Give your review</Text>
                <View style={styles.ratingRow}>
                  {[1,2,3,4,5].map(star => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Text style={{ fontSize: 28, color: rating >= star ? '#FFD700' : '#ccc' }}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write your review..."
                  value={review}
                  onChangeText={setReview}
                  multiline
                />
                <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
                  <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 8,
  },
  header: {
    height: 60,
    backgroundColor: '#6200EE',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backArrow: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabBtn: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  tabText: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#a259ff',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#a259ff',
    width: 40,
    borderRadius: 2,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    minHeight: 64,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  cardService: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 2,
  },
  cardUser: {
    color: '#888',
    fontSize: 15,
    marginBottom: 2,
    width: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
    color: '#fff',
  },
  statusCompleted: {
    backgroundColor: '#34c759',
    color: '#fff',
  },
  statusUpcoming: {
    backgroundColor: '#a259ff',
    color: '#fff',
  },
  statusCancelled: {
    backgroundColor: '#ff3b30',
    color: '#fff',
  },
  chatBtn: {
    backgroundColor: '#f6f0ff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chatIcon: {
    fontSize: 22,
    color: '#a259ff',
  },
  detailsIconBtn: {
    marginLeft: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  modalUser: {
    color: '#888',
    fontSize: 15,
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 20,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeBtn: {
    backgroundColor: '#ff3b30',
    borderRadius: 20,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MyBookingScreen; 