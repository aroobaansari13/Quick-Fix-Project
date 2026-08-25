import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StatusBar, Image, ScrollView, Modal, TextInput, FlatList, Alert, ActivityIndicator, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { styles } from '../fuel/FuelStationHome.styles';
import ProviderOrders from '../ProviderOrders';
import ProviderProfile from '../ProviderProfile';
import { checkAndEnableLocation } from '../../../services/locationService';
import { ServiceManager } from '../../../services/ServiceManager';
import { ProviderLocationService } from '../../../services/ProviderLocationService';

const FuelStationHome = ({navigation, onLogout, initialTab = 'home',}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [fuelType, setFuelType] = useState('');
  const [price, setPrice] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [checkingLocation, setCheckingLocation] = useState(initialTab !== 'profile');
  const [providerName, setProviderName] = useState('Fuel Station');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [servicesLoading, setServicesLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    let unsubscribe;
    let locationWatchId = null;
    let unsubscribeProfile = null;
    
    // =========================================================
    // LOCATION
    // =========================================================
    const initApp = async () => {
      const isLocationOn = await checkAndEnableLocation();

      // if (!isLocationOn) {
      //   Alert.alert(
      //     "Location Off",
      //     "Please turn your location on."
      //   );
      // }

      setCheckingLocation(false);
    };

    initApp();
  
    if (uid) {
  unsubscribeProfile = firestore()
    .collection('FuelStations')
    .doc(uid)
    .onSnapshot(
      (doc) => {
        if (!doc.exists) {
          setProviderName('Fuel Station');
          setProfileImageUrl(null);
          return;
        }

        const providerData = doc.data() || {};

        setProviderName(
          providerData.name || 'Fuel Station'
        );

        setProfileImageUrl(
          providerData.profilePic || null
        );
      },
      (error) => {
        console.log(
          'Fuel Station Profile Listener Error:',
          error
        );
      }
    );
}

    // =========================================================
    // SERVICES
    // =========================================================
    if (uid) {
      unsubscribe = ServiceManager.subscribeToServices(
  uid,
  (data) => {
    // Sirf fuel services filter karke set karein
    setServices(
      data.filter(
        (s) => s.isFuelService === true
      )
    );

    setServicesLoading(false);
  }
);
    }

    // =========================================================
    // LOCATION TRACKING
    // =========================================================
    if (uid) {
      locationWatchId =
        ProviderLocationService.startTracking(
          uid,
          'FuelStations'
        );

      console.log(
        '📍 Watch ID:',
        locationWatchId
      );
    }

    // =========================================================
    // CLEANUP
    // =========================================================
    return () => {
  if (unsubscribe) {
    unsubscribe();
  }

  if (unsubscribeProfile) {
    unsubscribeProfile();
  }

  if (locationWatchId !== null) {
    ProviderLocationService.stopTracking(
      locationWatchId
    );
  }
};
  }, []);

  // =========================================================
  // EDIT FUEL
  // =========================================================
  const handleEditClick = (item) => {
    setEditingServiceId(item.id);
    setFuelType(item.title);
    setPrice(item.price.toString());
    setIsModalVisible(true);
  };

  // =========================================================
  // SAVE FUEL
  // =========================================================
  const handleSaveFuel = async () => {
    if (!fuelType || !price) {
      Alert.alert(
        'Error',
        'Please fill all fields'
      );
      return;
    }

    try {
      const fuelData = {
        providerId:
          auth().currentUser.uid,

        providerRole: 'fuel_station',

        title: fuelType,

        price: parseFloat(price),

        description:
          `Fuel type: ${fuelType}`,

        isFuelService: true,
      };

      if (editingServiceId) {
        await ServiceManager.updateService(
          editingServiceId,
          fuelData
        );
      } else {
        await ServiceManager.addService(
          fuelData
        );
      }

      setIsModalVisible(false);
      setFuelType('');
      setPrice('');
      setEditingServiceId(null);

    } catch (error) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  // =========================================================
  // DELETE FUEL
  // =========================================================
  const handleDeleteFuel = async () => {
    if (editingServiceId) {
      await ServiceManager.deleteService(
        editingServiceId
      );

      setFuelType('');
      setPrice('');
      setEditingServiceId(null);
      setIsModalVisible(false);
    }
  };

  // =========================================================
  // CONTENT
  // =========================================================
  const renderContent = () => {
    switch (activeTab) {

      case 'orders':
        return <ProviderOrders />;

      // 🟢 ProviderProfile
      case 'profile':
        return (
          <ProviderProfile
            navigation={{
              ...navigation,

              navigate: (screen, params) => {
                const lowerScreen =
                  screen?.toLowerCase() || '';

                if (
                  lowerScreen.includes('availability') ||
                  lowerScreen.includes('setting')
                ) {
                  navigation?.navigate(
                    'AvailabilityScreen',
                    {
                      providerType:
                        'fuel_station',
                      ...params,
                    }
                  );

                } else if (
                  lowerScreen.includes('terms') ||
                  lowerScreen.includes('policy')
                ) {
                  navigation?.navigate(
                    'TermsAndPolicies',
                    {
                      ...params,
                      providerType:
                        'fuel_station',
                      
                    }
                  );

                } else if (
                  navigation?.navigate
                ) {
                  navigation.navigate(
                    screen,
                    params
                  );
                }
              },
            }}

            providerType="fuelStation"

            onLogout={
              onLogout ||
              (() => auth().signOut())
            }
          />
        );

      // =====================================================
      // HOME
      // =====================================================
     case 'home':
default:
  return (
    <View style={{ flex: 1 }}>

      {servicesLoading ? (

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#1E3A8A"
          />
        </View>

      ) : services.length === 0 ? (

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyStateContainer}>

            <View style={styles.illustrationCircle}>
              <Icon
                name="water-outline"
                size={80}
                color="#1E3A8A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Fuel Services Yet
            </Text>

            <Text style={styles.emptySub}>
              Tap the plus button to add your fuel types.
            </Text>

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

                <Text style={styles.cardServiceName}>
                  {item.title}
                </Text>

                <Text style={styles.cardServicePrice}>
                  Rs. {item.price} / Liter
                </Text>

              </View>
            </TouchableOpacity>

          )}
        />

      )}

    </View>
  );
    }
  };
  
  // =========================================================
  // MAIN SCREEN
  // =========================================================
  return (
    <Animated.View style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* =====================================================
          🟢 UPDATED HEADER
          Name + Profile Picture of Logged-in Fuel Station
          ===================================================== */}

      {activeTab !== 'profile' && (

        <View style={styles.header}>

          <View style={styles.topheader}>

            <Text
              style={styles.mechanicName}
              numberOfLines={1}
            >
              {providerName}
            </Text>

          </View>

          <TouchableOpacity
            style={styles.profileContainer}
            activeOpacity={0.8}
            onPress={() =>
              setActiveTab('profile')
            }
          >

            {profileImageUrl ? (
  <Image
    source={{ uri: profileImageUrl }}
    style={styles.profileImage}
  />
) : (
  <View
    style={[
      styles.profileImage,
      {
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
      },
    ]}
  >
    <Icon
      name="person"
      size={25}
      color="#CBD5E1"
    />
  </View>
)}

          </TouchableOpacity>

        </View>

      )}

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* =====================================================
          ADD BUTTON
          ===================================================== */}

      {activeTab === 'home' && (

        <TouchableOpacity
          style={
            styles.floatingAddButton
          }
          activeOpacity={0.9}

          onPress={() => {
            setEditingServiceId(null);
            setFuelType('');
            setPrice('');
            setIsModalVisible(true);
          }}
        >

          <Icon
            name="add"
            size={35}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      )}

      {/* =====================================================
          FUEL MODAL
          ===================================================== */}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}

        onRequestClose={() =>
          setIsModalVisible(false)
        }
      >

        <View
          style={styles.modalOverlay}
        >

          <View
            style={styles.modalContainer}
          >

            <View
              style={styles.modalHeader}
            >

              <Text
                style={styles.modalTitle}
              >
                {editingServiceId
                  ? 'Edit Fuel'
                  : 'Add New Fuel'}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setIsModalVisible(false)
                }
              >

                <Icon
                  name="close"
                  size={24}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>

            <Text
              style={styles.inputLabel}
            >
              Fuel Type
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., Petrol 92"
              value={fuelType}
              onChangeText={setFuelType}
            />

            <Text
              style={styles.inputLabel}
            >
              Price per Liter (Rs.)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., 275"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveFuel}
            >

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {editingServiceId
                  ? 'Update'
                  : 'Save'}
              </Text>

            </TouchableOpacity>

            {editingServiceId && (

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor:
                      '#ce0a0a',
                    marginTop: 10,
                  },
                ]}
                onPress={handleDeleteFuel}
              >

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Delete
                </Text>

              </TouchableOpacity>

            )}

          </View>

        </View>

      </Modal>

      {/* =====================================================
          BOTTOM TAB
          ===================================================== */}

      <View style={styles.bottomTab}>

        {/* HOME */}

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            setActiveTab('home')
          }
        >

          <Icon
            name={
              activeTab === 'home'
                ? 'home'
                : 'home-outline'
            }
            size={26}
            color={
              activeTab === 'home'
                ? '#1E3A8A'
                : '#94A3B8'
            }
          />

          <Text
            style={{
              fontSize: 11,
              color:
                activeTab === 'home'
                  ? '#1E3A8A'
                  : '#94A3B8',
              fontWeight: '500',
            }}
          >
            Home
          </Text>

        </TouchableOpacity>

        {/* ORDERS */}

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            setActiveTab('orders')
          }
        >

          <Icon
            name={
              activeTab === 'orders'
                ? 'clipboard'
                : 'clipboard-outline'
            }
            size={26}
            color={
              activeTab === 'orders'
                ? '#1E3A8A'
                : '#94A3B8'
            }
          />

          <Text
            style={{
              fontSize: 11,
              color:
                activeTab === 'orders'
                  ? '#1E3A8A'
                  : '#94A3B8',
              fontWeight: '500',
            }}
          >
            Orders
          </Text>

        </TouchableOpacity>

        {/* PROFILE */}

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            setActiveTab('profile')
          }
        >

          <Icon
            name={
              activeTab === 'profile'
                ? 'person'
                : 'person-outline'
            }
            size={26}
            color={
              activeTab === 'profile'
                ? '#1E3A8A'
                : '#94A3B8'
            }
          />

          <Text
            style={{
              fontSize: 11,
              color:
                activeTab === 'profile'
                  ? '#1E3A8A'
                  : '#94A3B8',
              fontWeight: '500',
            }}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default FuelStationHome;