import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView, Modal, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './MechanicHome.styles';
import ProviderOrders from './ProviderOrders';
import ProviderProfile from './ProviderProfile';

const MechanicHome = () => {
  const [activeTab, setActiveTab] = useState('home');

  // 🟢 States for Form and Services
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]); // Services array list
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);

  const handleEditClick = (item) => {
    setEditingServiceId(item.id);
    setServiceName(item.name);
    setServicePrice(item.price);
    setServiceDesc(item.description);
    setIsModalVisible(true);
  };
  
  // 🟢 Function to Add New Service
  const handleSaveService = () => {
    if (!serviceName || !servicePrice || !serviceDesc) {
      alert('Please fill all fields');
      return;
    }

    if (editingServiceId) {
      setServices(services.map(s => 
        s.id === editingServiceId 
          ? { ...s, name: serviceName, price: servicePrice, description: serviceDesc }
          : s
      ));
      setEditingServiceId(null);
    } else {
      const newService = {
        id: Date.now().toString(),
        name: serviceName,
        price: servicePrice,
        description: serviceDesc,
      };
      setServices([...services, newService]);
    }

    setServiceName('');
    setServicePrice('');
    setServiceDesc('');
    setIsModalVisible(false);
  };

  const handleDeleteService = () => {
    if (editingServiceId) {
      setServices(services.filter(s => s.id !== editingServiceId));
      setServiceName('');
      setServicePrice('');
      setServiceDesc('');
      setEditingServiceId(null);
      setIsModalVisible(false);
    }
  };

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
          <View style={{ flex: 1 }}>
            {services.length === 0 ? (
              /* 2. EMPTY STATE (Agar koi service na ho) */
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            ) : (
              /* 🟢 SHOW SERVICES LIST (Jab mechanic services add karle) */
              <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.serviceCard} 
                    activeOpacity={0.7}
                    onPress={() => handleEditClick(item)} // 👈 Yeh click handle karega
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardServiceName}>{item.name}</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* 1. TOP HEADER SECTION */}
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

      {/* Dynamic Content Area */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* 3. CENTER PLUS BUTTON (Clickable banaya hai) */}
      {activeTab === 'home' && (
        <TouchableOpacity 
          style={styles.floatingAddButton} 
          activeOpacity={0.9}
          onPress={() => { 
            setEditingServiceId(null); // 🟢 Reset editing id taake naya form khule
            setServiceName('');        // 🟢 Input fields ko empty clear karne ke liye
            setServicePrice('');
            setServiceDesc('');
            setIsModalVisible(true);   // 🟢 Modal open karein
          }} 
        >
          <Icon name="add" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* 🟢 4. POPUP FORM MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingServiceId ? 'Edit Service' : 'Add New Service'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Service Name Input */}
            <Text style={styles.inputLabel}>Service Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Engine Oil Change"
              value={serviceName}
              onChangeText={setServiceName}
            />

            {/* Price Input */}
            <Text style={styles.inputLabel}>Price (Rs.)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3500"
              keyboardType="numeric"
              value={servicePrice}
              onChangeText={setServicePrice}
            />

            {/* Short Description Input */}
            <Text style={styles.inputLabel}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief details about the service..."
              multiline={true}
              numberOfLines={3}
              value={serviceDesc}
              onChangeText={setServiceDesc}
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
              <Text style={styles.saveButtonText}>{editingServiceId ? 'Update Service' : 'Save Service'}</Text>
            </TouchableOpacity>

            {editingServiceId && (
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: '#ce0a0a', marginTop: 10 }]} 
                onPress={handleDeleteService}
              >
                <Text style={styles.saveButtonText}>Delete Service</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 5. BOTTOM NAVIGATION */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Icon name={activeTab === 'home' ? 'home' : 'home-outline'} size={26} color={activeTab === 'home' ? '#1E3A8A' : '#94A3B8'} />
          <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#1E3A8A' : '#94A3B8' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('orders')}>
          <Icon name={activeTab === 'orders' ? 'clipboard' : 'clipboard-outline'} size={26} color={activeTab === 'orders' ? '#1E3A8A' : '#94A3B8'} />
          <Text style={[styles.tabLabel, { color: activeTab === 'orders' ? '#1E3A8A' : '#94A3B8' }]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Icon name={activeTab === 'profile' ? 'person' : 'person-outline'} size={26} color={activeTab === 'profile' ? '#1E3A8A' : '#94A3B8'} />
          <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? '#1E3A8A' : '#94A3B8' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MechanicHome;