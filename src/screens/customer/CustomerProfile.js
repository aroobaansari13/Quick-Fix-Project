import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './CustomerProfile.styles';
import { COLORS } from '../../config/theme';

const CustomerProfile = () => {
  
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
          {/* <Text style={styles.headerTitle}>Profile</Text> */}
          
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              {/* Default Placeholder Image */}
              <Image 
                source={{ uri: 'https://via.placeholder.com/150' }} 
                style={styles.profileImage} 
              />
              {/* Edit Icon Overlay */}
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
            onPress={() => {}} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerProfile;