
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BookingDetailsRouteParams = {
  tech: {
    name: 'Vel';
    image: string;
    service?: string;
    category?: string;
  };
  status: string;
  review: string;
  rating: number;
};

const BookingDetails = () => {
  const route = useRoute<RouteProp<Record<string, BookingDetailsRouteParams>, string>>();
  const navigation = useNavigation();
  const { tech, status, review: initialReview, rating: initialRating } = (route.params || {}) as BookingDetailsRouteParams;
  const [review, setReview] = useState(initialReview || '');
  const [rating, setRating] = useState(initialRating || 5);
  const [otp, setOtp] = useState('123456');

  if (!tech) {
    return (
      <View style={styles.container}>
        <Text>No technician data found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
        <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: status === 'Upcoming' ? 120 : 40 }]} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: status === 'Upcoming' ? '#a259ff' : status === 'Completed' ? '#34c759' : '#888', backgroundColor: '#f6f0ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>{status}</Text>
          <Text style={{ color: '#888', fontSize: 13 }}>Date: 2024-06-10</Text>
        </View>
        <Image source={{ uri: tech.image }} style={styles.fullWidthImage} />
        <View style={styles.detailRow}><Text style={styles.icon}>👤</Text><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>Vel</Text></View>
        <View style={styles.detailRow}><Text style={styles.icon}>🛠️</Text><Text style={styles.detailLabel}>Service:</Text><Text style={styles.detailValue}>{String(tech.service || tech.category)}</Text></View>
        <View style={styles.detailRow}><Text style={styles.icon}>📞</Text><Text style={styles.detailLabel}>Contact:</Text><Text style={styles.detailValue}>9876543210</Text></View>
        <View style={styles.detailRow}><Text style={styles.icon}>📍</Text><Text style={styles.detailLabel}>Address:</Text><Text style={styles.detailValue}>123 Main Street, City</Text></View>
        <View style={[styles.detailRow, styles.otpRow]}>
          <Text style={styles.icon}>🔑</Text>
          <Text style={styles.detailLabel}>OTP:</Text>
          <View style={styles.otpBox}><Text style={styles.otpText}>{otp}</Text></View>
        </View>
        {(status === 'Upcoming' || status === 'Completed') && (
          <>
            <Text style={styles.section}>{status === 'Upcoming' ? 'Edit your review' : 'Your review'}</Text>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => status === 'Upcoming' && setRating(star)}>
                  <Text style={{ fontSize: 28, color: rating >= star ? '#FFD700' : '#ccc' }}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.reviewInput, status === 'Upcoming' ? { marginBottom: 24 } : {}]}
              placeholder="Write your review..."
              value={review}
              onChangeText={status === 'Upcoming' ? setReview : undefined}
              multiline
              editable={status === 'Upcoming'}
            />
            
             
            
            <View style={{ height: 24 }} />
          </>
        )}
        {status === 'Completed' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: '#888', fontSize: 14 }}>You rated: {rating} ★</Text>
            <Text style={{ color: '#888', fontSize: 14 }}>Review: {review || 'No review given.'}</Text>
          </View>
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
      {status === 'Upcoming' && (
        <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 },
  scrollContent: { padding: 24, paddingBottom: 0 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 16,
    minHeight: 48,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#222' },
  fullWidthImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 16,
    marginBottom: 18,
    alignSelf: 'center',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 22, marginRight: 8 },
  detailLabel: { fontWeight: 'bold', fontSize: 16, color: '#222', marginRight: 6 },
  detailValue: { fontSize: 16, color: '#444', flexShrink: 1 },
  otpRow: { backgroundColor: '#f6f0ff', borderRadius: 12, padding: 8, marginBottom: 10 },
  otpBox: { backgroundColor: '#a259ff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 4, marginLeft: 8 },
  otpText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 2 },
  section: { fontWeight: 'bold', fontSize: 16, marginTop: 18, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', marginBottom: 12 },
  reviewInput: { width: '100%', backgroundColor: '#f7f7f7', borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16, minHeight: 60 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 8 },
  submitBtn: { backgroundColor: '#a259ff', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 64 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});

export default BookingDetails; 