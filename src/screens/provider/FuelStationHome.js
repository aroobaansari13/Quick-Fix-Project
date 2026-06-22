import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './FuelStationHome.styles';
import ProviderOrders from './ProviderOrders';
import ProviderProfile from './ProviderProfile';
import { checkAndEnableLocation } from '../../services/locationService';

const FuelStationHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [locationActive, setLocationActive] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);

  useEffect(() => {
    const initLocationCheck = async () => {
      const isLocationOn = await checkAndEnableLocation();
      
      if (isLocationOn) {
        setLocationActive(true);
        // 🟢 Yahan aap apna map/coordinates fetch karne ka logic jo pehle se chal raha tha, chala sakti hain
        console.log("Location active! Loading app data...");
      } else {
        setLocationActive(false);
        // Agar user mana kar day to alert dikha sakte hain
        Alert.alert("Location Off", "Please turn on your location to see nearest providers.");
      }
      setCheckingLocation(false);
    };

    initLocationCheck();
  }, []);

  // 3. Jab tak check ho raha ho, tab tak full screen loading screen dikhayein
  if (checkingLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Checking location settings...</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <ProviderOrders />;
      case 'profile':
        return <ProviderProfile onLogout={() => alert('Logout Clicked')} />;
      case 'home':
      default:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* 2. EMPTY STATE / SERVICE LISTING SECTION */}
            <View style={styles.emptyStateContainer}>
              <View style={styles.illustrationCircle}>
                <Icon name="construct-outline" size={80} color="#1E3A8A" />
              </View>
              <Text style={styles.emptyTitle}>No Services Listed Yet</Text>
              <Text style={styles.emptySub}>
                Tap the plus button below to add your first car service and start getting orders.
              </Text>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* 1. TOP HEADER SECTION (Profile tab par hide hoga layout clean rakhne ke liye) */}
      {activeTab !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.topheader}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.mechanicName}>RZC Fuel Station</Text>
          </View>
          <TouchableOpacity style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/50' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* 🟢 Dynamic Content Area */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* 3. CENTER PLUS BUTTON (Action - Only visible on Home Tab) */}
      {activeTab === 'home' && (
        <TouchableOpacity style={styles.floatingAddButton} activeOpacity={0.9}>
          <Icon name="add" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* 🟢 Functional Bottom Navigation Bar */}
      <View style={styles.bottomTab}>
        {/* Home Tab */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Icon 
            name={activeTab === 'home' ? 'home' : 'home-outline'} 
            size={26} 
            color={activeTab === 'home' ? '#1E3A8A' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#1E3A8A' : '#94A3B8' }]}>
            Home
          </Text>
        </TouchableOpacity>
        
        {/* Orders Tab */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('orders')}>
          <Icon 
            name={activeTab === 'orders' ? 'clipboard' : 'clipboard-outline'} 
            size={26} 
            color={activeTab === 'orders' ? '#1E3A8A' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'orders' ? '#1E3A8A' : '#94A3B8' }]}>
            Orders
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Icon 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={26} 
            color={activeTab === 'profile' ? '#1E3A8A' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? '#1E3A8A' : '#94A3B8' }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FuelStationHome;