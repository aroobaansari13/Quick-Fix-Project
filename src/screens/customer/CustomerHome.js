import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './CustomerHome.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';
import CustomerOrders from './CustomerOrders';
import CustomerProfile from './CustomerProfile';
import Geolocation from 'react-native-geolocation-service';
import { searchNearbyServices } from '../../services/ProviderSearchService';

const CustomerHome = ({ onLogout, onEditProfilePress, initialTab, profileImage, onManageProfilePress, onTermsAndPoliciesPress, onServiceSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'home');
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 32.1877, lng: 74.1945 });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        setCheckingLocation(false);
      },
      (error) => {
        setCheckingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 0 }
    );
  }, []);

  if (checkingLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Checking location settings...</Text>
      </View>
    );
  }

  const mapHtmlScript = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body { margin: 0; padding: 0; } #map { height: 100vh; width: 100vw; } .leaflet-top.leaflet-left { top: 110px; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${coordinates.lat}, ${coordinates.lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        L.marker([${coordinates.lat}, ${coordinates.lng}]).addTo(map).bindPopup('You are here').openPopup();
      </script>
    </body>
    </html>
  `;

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setLoadingSearch(true);
      try {
        const results = await searchNearbyServices(text, coordinates.lat, coordinates.lng);
        
        // 🟢 Offline Providers Filter: Sirf wohi show honge jin ka availability/online status true hai
        const activeResults = results.filter((item) => {
          const isOffline = 
            item.isOnline === false || 
            item.isAvailable === false || 
            item.availabilityStatus === false || 
            item.availabilityStatus === 'offline' ||
            item.status === 'offline';
            
          return !isOffline;
        });

        setSearchResults(activeResults);
      } catch (e) {
        Alert.alert("Error", e.message);
      } finally {
        setLoadingSearch(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {activeTab === 'home' ? (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <WebView source={{ html: mapHtmlScript }} style={{ flex: 1 }} />
          </View>

          <View style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1 }}>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⚲</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for services..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={() => handleSearch(searchQuery)}
                returnKeyType="search"
              />
            </View>

            {loadingSearch && (
              <View style={{ backgroundColor: 'white', marginHorizontal: 20, marginTop: 5, padding: 15, borderRadius: 10, elevation: 5 }}>
                <ActivityIndicator color={COLORS.primary} size="small" />
              </View>
            )}

            {!loadingSearch && searchResults.length > 0 && (
              <View style={styles.resultsDropdown}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.resultItem}
                    activeOpacity={0.6}
                    onPress={() => {
                      // Fix: Search list close karke navigate karna
                      setSearchResults([]);
                      setSearchQuery('');
                      if (onServiceSelect) {
                        onServiceSelect(item);
                      }
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{item.businessName}</Text>
                    <Text>Distance - {item.distance} Km</Text>
                    <Text style={{ color: COLORS.primary }}>{item.title} - PKR {item.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </>
      ) : activeTab === 'orders' ? (
        <CustomerOrders />
      ) : (
        <CustomerProfile 
          onLogout={onLogout} 
          profileImage={profileImage}
          onManageProfilePress={onManageProfilePress}
          onTermsAndPoliciesPress={onTermsAndPoliciesPress} 
          onImageUpdate={(newImage) => { if (onEditProfilePress) onEditProfilePress(newImage); }}
        />
      )}

      <View style={[styles.bottomNav, { zIndex: 2 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Icon name={activeTab === 'home' ? "home" : "home-outline"} size={24} color={activeTab === 'home' ? COLORS.primary : "#666666"} />
          <Text style={activeTab === 'home' ? styles.activeNavText : styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('orders')}>
          <Icon name={activeTab === 'orders' ? "clipboard" : "clipboard-outline"} size={24} color={activeTab === 'orders' ? COLORS.primary : "#666666"} />
          <Text style={activeTab === 'home' ? styles.activeNavText : styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Icon name={activeTab === 'profile' ? "person" : "person-outline"} size={24} color={activeTab === 'profile' ? COLORS.primary : "#666666"} />
          <Text style={activeTab === 'home' ? styles.activeNavText : styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerHome;