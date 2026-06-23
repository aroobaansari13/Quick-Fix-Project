import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './CustomerProfile.styles';
import { COLORS } from '../../config/theme';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerProfile = ({ onLogout }) => {
  
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Do you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await auth().signOut();
              await AsyncStorage.removeItem('userRole');
              await AsyncStorage.removeItem('lastActive');
              if (onLogout) onLogout();
            } catch (error) {
              console.log("Logout Error:", error);
              Alert.alert("Error", "Logout failed. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Menu Item Reusable Component
  const MenuItem = ({ icon, title, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={22} color={color === '#FF4D4D' ? '#FF4D4D' : COLORS.primary} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Header & Profile Image Section */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/150' }} 
                style={styles.profileImage} 
              />
              <TouchableOpacity style={styles.editBadge} activeOpacity={0.9}>
                <Icon name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>Arooba</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>

        {/* 2. Menu Options List */}
        <View style={styles.menuSection}>
          <MenuItem icon="person-outline" title="Manage Profile" onPress={() => {}} />
          <MenuItem icon="settings-outline" title="Account Settings" onPress={() => {}} />
          <MenuItem icon="document-text-outline" title="Terms & Policies" onPress={() => {}} />
          
          <View style={styles.separator} />
          
          <MenuItem 
            icon="log-out-outline" 
            title="Logout" 
            color="#FF4D4D" 
            onPress={handleLogout} // ✅ Connected
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerProfile;