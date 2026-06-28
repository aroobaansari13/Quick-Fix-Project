import React, { useEffect, useState } from 'react'; 
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView, Modal, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { styles } from '../mechanic/MechanicHome.styles';
import ProviderOrders from '../ProviderOrders';
import ProviderProfile from '../ProviderProfile';
import { checkAndEnableLocation } from '../../../services/locationService';
import { ServiceManager } from '../../../services/ServiceManager';

const MechanicHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]); 
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [locationActive, setLocationActive] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);

  useEffect(() => {
    // 🟢 Logic to handle Location and Services in one go
    const initApp = async () => {
      // 1. Location Logic
      const isLocationOn = await checkAndEnableLocation();
      if (isLocationOn) {
        setLocationActive(true);
        console.log("Location active! Loading app data...");
      } else {
        setLocationActive(false);
        Alert.alert("Location Off", "Please turn your location on.");
      }
      setCheckingLocation(false);
    };

    initApp();

    // 2. Service Manager Listener
    const uid = auth().currentUser?.uid;
    let unsubscribe;
    if (uid) {
      unsubscribe = ServiceManager.subscribeToServices(uid, (data) => {
        setServices(data);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleEditClick = (item) => {
    setEditingServiceId(item.id);
    setServiceName(item.title); // Backend uses 'title'
    setServicePrice(item.price.toString());
    setServiceDesc(item.description);
    setIsModalVisible(true);
  };
 
  const handleSaveService = async () => {
    if (!serviceName || !servicePrice || !serviceDesc) {
      alert('Please fill all fields');
      return;
    }
    
    try {
      const serviceData = {
        providerId: auth().currentUser.uid,
        providerRole: 'mechanic',
        title: serviceName,
        price: parseFloat(servicePrice),
        description: serviceDesc,
        isFuelService: false
      };

      if (editingServiceId) {
        await ServiceManager.updateService(editingServiceId, serviceData);
      } else {
        await ServiceManager.addService(serviceData);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }

    setServiceName(''); setServicePrice(''); setServiceDesc('');
    setEditingServiceId(null);
    setIsModalVisible(false);
  };

  const handleDeleteService = async () => {
    if (editingServiceId) {
      await ServiceManager.deleteService(editingServiceId);
      setServiceName(''); setServicePrice(''); setServiceDesc('');
      setEditingServiceId(null);
      setIsModalVisible(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <ProviderOrders />;
      case 'profile':
        return <ProviderProfile onLogout={() => auth().signOut()} />;
      case 'home':
      default:
        return (
          <View style={{ flex: 1 }}>
            {services.length === 0 ? (
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.emptyStateContainer}>
                  <View style={styles.illustrationCircle}>
                    <Icon name="construct-outline" size={80} color="#1E3A8A" />
                  </View>
                  <Text style={styles.emptyTitle}>No Services Listed Yet</Text>
                  <Text style={styles.emptySub}>Tap the plus button below to add your first car service and start getting orders.</Text>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.serviceCard} 
                    activeOpacity={0.7}
                    onPress={() => handleEditClick(item)}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardServiceName}>{item.title}</Text>
                      <Text style={styles.cardServicePrice}>Rs. {item.price}</Text>
                    </View>
                    <Text style={styles.cardServiceDesc}>{item.description}</Text>
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
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Checking location settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {activeTab !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.topheader}>
            <Text style={styles.mechanicName}>Expert Mechanic</Text>
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
          onPress={() => { 
            setEditingServiceId(null);
            setServiceName(''); setServicePrice(''); setServiceDesc('');
            setIsModalVisible(true);
          }} 
        >
          <Icon name="add" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingServiceId ? 'Edit Service' : 'Add New Service'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}><Icon name="close" size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Service Name</Text>
            <TextInput style={styles.input} placeholder="e.g., Engine Oil Change" value={serviceName} onChangeText={setServiceName} />
            <Text style={styles.inputLabel}>Price (Rs.)</Text>
            <TextInput style={styles.input} placeholder="e.g., 3500" keyboardType="numeric" value={servicePrice} onChangeText={setServicePrice} />
            <Text style={styles.inputLabel}>Short Description</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Brief details..." multiline value={serviceDesc} onChangeText={setServiceDesc} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
              <Text style={styles.saveButtonText}>{editingServiceId ? 'Update Service' : 'Save Service'}</Text>
            </TouchableOpacity>
            {editingServiceId && (
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#ce0a0a', marginTop: 10 }]} onPress={handleDeleteService}>
                <Text style={styles.saveButtonText}>Delete Service</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}><Icon name={activeTab === 'home' ? 'home' : 'home-outline'} size={26} color={activeTab === 'home' ? '#1E3A8A' : '#94A3B8'} /><Text>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('orders')}><Icon name={activeTab === 'orders' ? 'clipboard' : 'clipboard-outline'} size={26} color={activeTab === 'orders' ? '#1E3A8A' : '#94A3B8'} /><Text>Orders</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}><Icon name={activeTab === 'profile' ? 'person' : 'person-outline'} size={26} color={activeTab === 'profile' ? '#1E3A8A' : '#94A3B8'} /><Text>Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
};

export default MechanicHome;