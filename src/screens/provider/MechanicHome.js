import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './MechanicHome.styles';
import ProviderOrders from './ProviderOrders';
import ProviderProfile from './ProviderProfile';

const MechanicHome = () => {
  const [activeTab, setActiveTab] = useState('home');

  // 🟢 Dynamic content switcher function
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

      {/* 1. TOP HEADER SECTION (Sirf profile tab par hide hoga taake layout clean lage) */}
      {activeTab !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.topheader}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.mechanicName}>Expert Mechanic</Text>
          </View>
          <TouchableOpacity style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/50' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* 🟢 FIXED: Dynamic Content Render Section */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* 3. CENTER PLUS BUTTON (Action - Sirf home tab par dikhega) */}
      {activeTab === 'home' && (
        <TouchableOpacity style={styles.floatingAddButton} activeOpacity={0.9}>
          <Icon name="add" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* 🟢 FIXED: Functional Bottom Navigation Bar */}
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

export default MechanicHome;