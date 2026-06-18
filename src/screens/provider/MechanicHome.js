import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './MechanicHome.styles';

const MechanicHome = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* 1. TOP HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.topheader}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.mechanicName}>Expert Mechanic</Text>
        </View>
        <TouchableOpacity style={styles.profileContainer}>
          {/* Yahan image placeholder hai */}
          <Image 
            source={{ uri: 'https://via.placeholder.com/50' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. EMPTY STATE / SERVICE LISTING SECTION */}
        <View style={styles.emptyStateContainer}>
          <View style={styles.illustrationCircle}>
            <Icon name="construct-outline" size={80} color="#1E3A8A" />
          </View>
          <Text style={styles.emptyTitle}>No Services Listed Yet</Text>
          <Text style={styles.emptySub}>Tap the plus button below to add your first car service and start getting orders.</Text>
        </View>

      </ScrollView>

      {/* 3. CENTER PLUS BUTTON (Action) */}
      <TouchableOpacity style={styles.floatingAddButton} activeOpacity={0.9}>
        <Icon name="add" size={35} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 4. MOCK BOTTOM NAVIGATION */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={26} color="#1E3A8A" />
          <Text style={[styles.tabLabel, { color: '#1E3A8A' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="clipboard-outline" size={26} color="#94A3B8" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Icon name="person-outline" size={26} color="#94A3B8" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MechanicHome;