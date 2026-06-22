import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './CustomerHome.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';
import CustomerOrders from './CustomerOrders';
import CustomerProfile from './CustomerProfile'; 
import { checkAndEnableLocation } from '../../services/locationService';

const CustomerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [locationActive, setLocationActive] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);

  // 2. Screen khultay hi location check karne ka function
  useEffect(() => {
    const initLocationCheck = async () => {
      const isLocationOn = await checkAndEnableLocation();
      
      if (isLocationOn) {
        setLocationActive(true);
        // Yahan aap apna map/coordinates fetch karne ka logic jo pehle se chal raha tha, chala sakti hain
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

  // OpenStreetMap ki HTML Script (Leaflet JS use karte hue)
  const mapHtmlScript = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .leaflet-top.leaflet-left { top: 110px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        
        var map = L.map('map').setView([32.1877, 74.1945], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([32.1877, 74.1945]).addTo(map)
        .bindPopup('QuickFix Gujranwala Center')
        .openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {activeTab === 'home' ? (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <WebView
              source={{ html: mapHtmlScript }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true} 
              scalesPageToFit={true}
              style={{ flex: 1, width: '100%', height: '100%' }}
            />
          </View>

          {/* Floating Top Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⚲</Text> 
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services "
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </>
      ) : activeTab === 'orders' ? (
        <CustomerOrders />
      ) : (
        <CustomerProfile />
      )}
      {/* Bottom Navigation (Hamesha visible rahegi) */}
      <View style={styles.bottomNav}>
        {/* Home Option */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('home')}>
          <Icon 
            name={activeTab === 'home' ? "home" : "home-outline"} 
            size={24} 
            color={activeTab === 'home' ? COLORS.primary : "#666666"} 
          />
          <Text style={activeTab === 'home' ? styles.activeNavText : styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* Orders Option */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('orders')}>
          <Icon 
            name={activeTab === 'orders' ? "clipboard" : "clipboard-outline"} 
            size={24} 
            color={activeTab === 'orders' ? COLORS.primary : "#666666"} 
          />
          <Text style={activeTab === 'orders' ? styles.activeNavText : styles.navText}>Orders</Text>
        </TouchableOpacity>

        {/* Profile Option */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('profile')}>
          <Icon 
            name={activeTab === 'profile' ? "person" : "person-outline"} 
            size={24} 
            color={activeTab === 'profile' ? COLORS.primary : "#666666"} 
          />
          <Text style={activeTab === 'profile' ? styles.activeNavText : styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomerHome;