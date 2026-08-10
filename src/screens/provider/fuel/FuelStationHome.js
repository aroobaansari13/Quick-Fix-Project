import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView, Modal, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { styles } from '../fuel/FuelStationHome.styles';
import ProviderOrders from '../ProviderOrders';
import ProviderRequestDetails from '../ProviderRequestDetails';
import ProviderProfile from '../ProviderProfile';
import { checkAndEnableLocation } from '../../../services/locationService';
import { ServiceManager } from '../../../services/ServiceManager';

const FuelStationHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [fuelType, setFuelType] = useState('');
  const [price, setPrice] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [checkingLocation, setCheckingLocation] = useState(true);

  useEffect(() => {
    // 🟢 Location & Services Initialization
    const initApp = async () => {
      const isLocationOn = await checkAndEnableLocation();
      if (!isLocationOn) {
        Alert.alert("Location Off", "Please turn your location on.");
      }
      setCheckingLocation(false);
    };

    initApp();

    const uid = auth().currentUser?.uid;
    let unsubscribe;
    if (uid) {
      unsubscribe = ServiceManager.subscribeToServices(uid, (data) => {
        // Sirf fuel services filter karke set karein
        setServices(data.filter(s => s.isFuelService === true));
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleEditClick = (item) => {
    setEditingServiceId(item.id);
    setFuelType(item.title);
    setPrice(item.price.toString());
    setIsModalVisible(true);
  };

  const handleSaveFuel = async () => {
    if (!fuelType || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const fuelData = {
        providerId: auth().currentUser.uid,
        providerRole: 'fuel_station',
        title: fuelType,
        price: parseFloat(price),
        description: `Fuel type: ${fuelType}`,
        isFuelService: true
      };

      if (editingServiceId) {
        await ServiceManager.updateService(editingServiceId, fuelData);
      } else {
        await ServiceManager.addService(fuelData);
      }
      
      setIsModalVisible(false);
      setFuelType(''); setPrice(''); setEditingServiceId(null);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteFuel = async () => {
    if (editingServiceId) {
      await ServiceManager.deleteService(editingServiceId);
      setFuelType(''); setPrice(''); setEditingServiceId(null);
      setIsModalVisible(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
      return (
        <ProviderOrders
          onViewDetails={(request) => {
            console.log('Opening Request Details:', request);
            setSelectedRequest(request);
            setActiveTab('requestDetails');
          }}
        />
      );

     case 'requestDetails':
      return (
        <ProviderRequestDetails
          request={selectedRequest}
          onBack={() => {
            setSelectedRequest(null);
            setActiveTab('orders');
          }}
        />
      );

      case 'profile':
      return (
        <ProviderProfile
          onLogout={() => auth().signOut()}
        />
      );

      case 'home':
      default:
        return (
          <View style={{ flex: 1 }}>
            {services.length === 0 ? (
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.emptyStateContainer}>
                  <View style={styles.illustrationCircle}>
                    <Icon name="water-outline" size={80} color="#1E3A8A" />
                  </View>
                  <Text style={styles.emptyTitle}>No Fuel Services Yet</Text>
                  <Text style={styles.emptySub}>Tap the plus button to add your fuel types.</Text>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.serviceCard} activeOpacity={0.7} onPress={() => handleEditClick(item)}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardServiceName}>{item.title}</Text>
                      <Text style={styles.cardServicePrice}>Rs. {item.price} / Liter</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        );
    }
  };

  if (checkingLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Checking location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {activeTab !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.topheader}>
            <Text style={styles.mechanicName}>RZC Fuel Station</Text>
          </View>
          <TouchableOpacity style={styles.profileContainer}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {activeTab === 'home' && (
        <TouchableOpacity 
          style={styles.floatingAddButton} 
          activeOpacity={0.9}
          onPress={() => { setEditingServiceId(null); setFuelType(''); setPrice(''); setIsModalVisible(true); }} 
        >
          <Icon name="add" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingServiceId ? 'Edit Fuel' : 'Add New Fuel'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}><Icon name="close" size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Fuel Type</Text>
            <TextInput style={styles.input} placeholder="e.g., Petrol 92" value={fuelType} onChangeText={setFuelType} />
            <Text style={styles.inputLabel}>Price per Liter (Rs.)</Text>
            <TextInput style={styles.input} placeholder="e.g., 275" keyboardType="numeric" value={price} onChangeText={setPrice} />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveFuel}>
              <Text style={styles.saveButtonText}>{editingServiceId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
            {editingServiceId && (
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#ce0a0a', marginTop: 10 }]} onPress={handleDeleteFuel}>
                <Text style={styles.saveButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}><Icon name={activeTab==='home'?'home':'home-outline'} size={26} color={activeTab==='home'?'#1E3A8A':'#94A3B8'} /><Text>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('orders')}><Icon name={activeTab==='orders'?'clipboard':'clipboard-outline'} size={26} color={activeTab==='orders'?'#1E3A8A':'#94A3B8'} /><Text>Orders</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}><Icon name={activeTab==='profile'?'person':'person-outline'} size={26} color={activeTab==='profile'?'#1E3A8A':'#94A3B8'} /><Text>Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
};

export default FuelStationHome;