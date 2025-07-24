import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert ,Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const slots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];
const PROMO = { code: 'Discount 30% Off', discount: 0.3 };
const BASE_PRICE = 50;
const HOUR_PRICE = 20;

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [hours, setHours] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [promo, setPromo] = useState(PROMO);
  const [showModal, setShowModal] = useState(false);
  // Get today's date in yyyy-mm-dd
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Filter slots for today
  let filteredSlots = slots;
  if (selectedDate === todayStr) {
    const now = today.getHours() * 60 + today.getMinutes();
    filteredSlots = slots.filter(slot => {
      // Convert slot to minutes
      const [time, meridian] = slot.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (meridian === 'PM' && h !== 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      const slotMins = h * 60 + m;
      return slotMins > now;
    });
  }

  // Render slots in 3-column grid
  const renderSlots = () => {
    const rows = [];
    for (let i = 0; i < filteredSlots.length; i += 3) {
      rows.push(filteredSlots.slice(i, i + 3));
    }
    return rows.map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        {row.map(slot => (
          <TouchableOpacity
            key={slot}
            style={[styles.slotBtn, selectedSlot === slot && styles.slotBtnActive, { flex: 1, marginHorizontal: 5 }]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive, { textAlign: 'center' }]}>{slot}</Text>
          </TouchableOpacity>
        ))}
        {/* Fill empty columns for alignment */}
        {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => <View key={i} style={{ flex: 1, marginHorizontal: 5 }} />)}
      </View>
    ));
  };

  // Calculate total
  let total = BASE_PRICE + (hours - 2) * HOUR_PRICE;
  if (promo) total = total * (1 - promo.discount);

  // Handle continue
  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert('Please select a date and slot');
      return;
    }
    navigation.navigate('BuyProduct', {
      date: selectedDate,
      hours,
      slot: selectedSlot,
      promo,
      total
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} accessible accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Technician Details</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Select Date</Text>
        <View style={styles.calendarBox}>
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#a259ff' } } : {}}
            minDate={todayStr}
            theme={{
              backgroundColor: '#f6f0ff',
              calendarBackground: '#f6f0ff',
              textSectionTitleColor: '#888',
              selectedDayBackgroundColor: '#a259ff',
              selectedDayTextColor: '#fff',
              todayTextColor: '#a259ff',
              dayTextColor: '#222',
              textDisabledColor: '#ccc',
              monthTextColor: '#222',
              arrowColor: '#a259ff',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={{ borderRadius: 24, overflow: 'hidden' }}
          />
        </View>
        <Text style={styles.label}>Choose Start Time</Text>
        <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
          {renderSlots()}
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
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
              navigation.navigate('MainTabs', { screen: 'HomeStack', params: { screen: 'Home' } });
            }}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#222' },
  moreIcon: {
    fontSize: 24,
    color: '#888',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginLeft: 24,
    marginTop: 18,
    marginBottom: 8,
  },
  calendarBox: {
    backgroundColor: '#f6f0ff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 8,
  },
  workingHoursBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  workingLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  workingDesc: {
    color: '#888',
    fontSize: 13,
  },
  hourBtn: {
    backgroundColor: '#f6f0ff',
    borderRadius: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  hourBtnText: {
    fontSize: 22,
    color: '#a259ff',
    fontWeight: 'bold',
  },
  hours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    minWidth: 24,
    textAlign: 'center',
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 18,
  },
  slotBtn: {
    borderWidth: 2,
    borderColor: '#a259ff',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  slotBtnActive: {
    backgroundColor: '#a259ff',
  },
  slotText: {
    color: '#a259ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  slotTextActive: {
    color: '#fff',
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 18,
  },
  promoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a259ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  promoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 8,
  },
  promoRemove: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoAdd: {
    backgroundColor: '#f6f0ff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoAddText: {
    color: '#a259ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  continueBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#a259ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default CalendarScreen; 