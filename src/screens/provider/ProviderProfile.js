import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';
import { styles } from './ProviderProfile.styles';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProviderProfile = ({ onLogout }) => {

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
            <Text style={styles.userName}>Service Provider</Text>
            <Text style={styles.userEmail}>provider@quickfix.com</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="business-outline" title="Business Details" onPress={() => {}} />
          <MenuItem icon="settings-outline" title="Settings & Availability" onPress={() => {}} />
          <MenuItem icon="document-text-outline" title="Terms & Policies" onPress={() => {}} />
          
          <View style={styles.separator} />
          
          <MenuItem 
            icon="log-out-outline" 
            title="Logout Account" 
            color="#FF4D4D" 
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProviderProfile;