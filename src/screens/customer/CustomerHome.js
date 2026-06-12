import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './CustomerHome.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';

const CustomerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* 2. Floating Top Search Bar */}
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

      {/* 3. Bottom Navigation (3 Options) */}
      <View style={styles.bottomNav}>
        {/* Home Option (Active) */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="home" size={24} color={COLORS.primary} /> {/* 👈 Blue Color */}
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>

        {/* Orders Option */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="clipboard-outline" size={24} color="#666666" /> {/* Unactive grey */}
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>

       {/* Profile Option */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
         <Icon name="person-outline" size={24} color="#666666" /> {/* Unactive grey */}
         <Text style={styles.navText}>Profile</Text>
       </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomerHome;