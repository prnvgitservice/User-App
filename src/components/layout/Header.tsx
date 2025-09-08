import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ navigation }) {
  return (
    <View className="flex-row justify-between items-center p-4 bg-white">
      <Image source={require(`../../assets/prnv_logo.jpg`)} className="w-32 h-8 bg-blue-600" />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-circle" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}