import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const defaultTech = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@techpro.com',
  phone: '+91 98765 43210',
  category: 'AC Repair',
  image: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const UserProfile = () => {
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(defaultTech);
  const [image, setImage] = useState(profile.image);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      setProfile({ ...profile, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#f6f0ff', '#e0c3fc']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Profile</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Ionicons name={editMode ? 'close' : 'create-outline'} size={24} color="#a259ff" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBox}>
          <TouchableOpacity disabled={!editMode} onPress={pickImage} style={styles.avatarBox}>
            <Image source={{ uri: image }} style={styles.avatar} />
            {editMode && (
              <View style={styles.editAvatarOverlay}>
                <Ionicons name="camera" size={22} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={22} color="#a259ff" style={styles.icon} />
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={profile.name}
                  onChangeText={name => setProfile({ ...profile, name })}
                  placeholder="Name"
                />
              ) : (
                <Text style={styles.infoText}>{profile.name}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={22} color="#a259ff" style={styles.icon} />
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  onChangeText={email => setProfile({ ...profile, email })}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoText}>{profile.email}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={22} color="#a259ff" style={styles.icon} />
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={profile.phone}
                  onChangeText={phone => setProfile({ ...profile, phone })}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{profile.phone}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={22} color="#a259ff" style={styles.icon} />
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={profile.category}
                  onChangeText={category => setProfile({ ...profile, category })}
                  placeholder="Category"
                />
              ) : (
                <Text style={styles.infoText}>{profile.category}</Text>
              )}
            </View>
          </View>
          {editMode && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {editMode && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  cardBox: {
    backgroundColor: '#fff',
    borderRadius: 32,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarBox: { marginBottom: 18 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#a259ff' },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#a259ff',
    borderRadius: 16,
    padding: 8,
  },
  infoBox: { width: '100%', marginTop: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  icon: { marginRight: 14 },
  infoText: { fontSize: 18, color: '#222', fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#a259ff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 64,
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 4,
    shadowColor: '#a259ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff5252',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#ff5252',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  gradient: {
    flex: 1,
  },
});
