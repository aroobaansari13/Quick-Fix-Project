import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { styles } from '../mechanic/MechanicHome.styles';
import ProviderOrders from '../ProviderOrders';
import ProviderProfile from '../ProviderProfile';

import { checkAndEnableLocation } from '../../../services/locationService';
import { ServiceManager } from '../../../services/ServiceManager';
import { ProviderLocationService } from '../../../services/ProviderLocationService';

const MechanicHome = ({ navigation, onLogout, initialTab = 'home' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [services, setServices] = useState([]);

  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [locationActive, setLocationActive] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(
  initialTab !== 'profile'
);
  // =========================================================
  // MECHANIC PROFILE DATA
  // =========================================================
  const [mechanicName, setMechanicName] = useState('Expert Mechanic');
  const [mechanicProfileImage, setMechanicProfileImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

  // =========================================================
  // LOCATION + SERVICES + PROFILE
  // =========================================================
  useEffect(() => {
    const currentUser = auth().currentUser;
    const uid = currentUser?.uid;

    let locationWatchId = null;
    let unsubscribeServices = null;
    let unsubscribeProfile = null;

    // ---------------------------------------------------------
    // LOCATION
    // ---------------------------------------------------------
    const initApp = async () => {
      const isLocationOn = await checkAndEnableLocation();

      if (isLocationOn) {
        setLocationActive(true);
        console.log('Location active! Starting tracking...');
      } else {
        setLocationActive(false);
        // Alert.alert(
        //   'Location Off',
        //   'Please turn your location on.'
        // );
      }

      setCheckingLocation(false);
    };

    initApp();

    // ---------------------------------------------------------
    // MECHANIC PROFILE
    // Mechanics/{UID}
    // ---------------------------------------------------------
    if (uid) {
      console.log('=================================');
      console.log('Mechanic Home Profile');
      console.log('Collection: Mechanics');
      console.log('UID:', uid);
      console.log('=================================');

      unsubscribeProfile = firestore()
        .collection('Mechanics')
        .doc(uid)
        .onSnapshot(
          async (doc) => {
            try {
              if (!doc.exists) {
                console.log(
                  'Mechanic profile document does not exist:',
                  uid
                );

                setMechanicName(
                  currentUser?.displayName || 'Expert Mechanic'
                );

                setMechanicProfileImage(null);
                setProfileLoading(false);
                return;
              }

              const data = doc.data() || {};

              // -------------------------------------------------
              // NAME
              // -------------------------------------------------
              const fetchedName =
                data?.name ||
                currentUser?.displayName ||
                'Expert Mechanic';

              setMechanicName(fetchedName);

              console.log(
                'Mechanic name fetched:',
                fetchedName
              );

              // -------------------------------------------------
              // PROFILE PICTURE
              // -------------------------------------------------
              const profilePic = data?.profilePic;

              if (!profilePic) {
                setMechanicProfileImage(null);
                setProfileLoading(false);
                return;
              }

              console.log(
                'Mechanic profilePic from Firestore:',
                profilePic
              );

              // Agar already Firebase Storage ka DOWNLOAD URL hai
              if (
                typeof profilePic === 'string' &&
                (
                  profilePic.startsWith('http://') ||
                  profilePic.startsWith('https://')
                )
              ) {
                setMechanicProfileImage(profilePic);
                setProfileLoading(false);
                return;
              }

              // -------------------------------------------------
              // Agar profilePic mein Storage PATH save hai
              // example:
              // profilePictures/Mechanics/UID/profile.jpg
              // -------------------------------------------------
              try {
                const downloadURL = await storage()
                  .ref(profilePic)
                  .getDownloadURL();

                console.log(
                  'Mechanic profile image download URL:',
                  downloadURL
                );

                setMechanicProfileImage(downloadURL);
              } catch (storageError) {
                console.log(
                  'Could not fetch profile image from Storage:',
                  storageError
                );

                setMechanicProfileImage(null);
              }

              setProfileLoading(false);
            } catch (error) {
              console.log(
                'Mechanic Profile Snapshot Error:',
                error
              );

              setMechanicName(
                currentUser?.displayName || 'Expert Mechanic'
              );

              setMechanicProfileImage(null);
              setProfileLoading(false);
            }
          },
          (error) => {
            console.log(
              'Mechanic Profile Firestore Error:',
              error
            );

            setMechanicName(
              currentUser?.displayName || 'Expert Mechanic'
            );

            setMechanicProfileImage(null);
            setProfileLoading(false);
          }
        );

      // ---------------------------------------------------------
      // LOCATION TRACKING
      // ---------------------------------------------------------
      locationWatchId = ProviderLocationService.startTracking(
        uid,
        'Mechanics'
      );

      console.log('📍 Watch ID:', locationWatchId);

      // ---------------------------------------------------------
      // SERVICES
      // ---------------------------------------------------------
      unsubscribeServices = ServiceManager.subscribeToServices(
        uid,
        (data) => {
          setServices(data);
          setServicesLoading(false);
        }
      );
    } else {
      setProfileLoading(false);
      setServicesLoading(false);
    }

    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------
    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }

      if (unsubscribeServices) {
        unsubscribeServices();
      }

      if (locationWatchId !== null) {
        ProviderLocationService.stopTracking(
          locationWatchId
        );
      }
    };
  }, []);

  // =========================================================
  // EDIT SERVICE
  // =========================================================
  const handleEditClick = (item) => {
    setEditingServiceId(item.id);
    setServiceName(item.title);
    setServicePrice(item.price.toString());
    setServiceDesc(item.description);
    setIsModalVisible(true);
  };

  // =========================================================
  // SAVE SERVICE
  // =========================================================
  const handleSaveService = async () => {
    if (!serviceName || !servicePrice || !serviceDesc) {
      alert('Please fill all fields');
      return;
    }

    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        Alert.alert(
          'Error',
          'User is not logged in.'
        );
        return;
      }

      const serviceData = {
        providerId: currentUser.uid,
        providerRole: 'mechanic',
        title: serviceName,
        price: parseFloat(servicePrice),
        description: serviceDesc,
        isFuelService: false,
      };

      if (editingServiceId) {
        await ServiceManager.updateService(
          editingServiceId,
          serviceData
        );
      } else {
        await ServiceManager.addService(serviceData);
      }

      setServiceName('');
      setServicePrice('');
      setServiceDesc('');
      setEditingServiceId(null);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message
      );
    }
  };

  // =========================================================
  // DELETE SERVICE
  // =========================================================
  const handleDeleteService = async () => {
    if (editingServiceId) {
      try {
        await ServiceManager.deleteService(
          editingServiceId
        );

        setServiceName('');
        setServicePrice('');
        setServiceDesc('');
        setEditingServiceId(null);
        setIsModalVisible(false);
      } catch (error) {
        Alert.alert(
          'Error',
          error.message
        );
      }
    }
  };

  // =========================================================
  // CONTENT
  // =========================================================
  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <ProviderOrders />;

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
                      providerType: 'mechanic',
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
                      providerType: 'mechanic',
                      ...params,
                    }
                  );
                } else if (navigation?.navigate) {
                  navigation.navigate(
                    screen,
                    params
                  );
                }
              },
            }}
            providerType="mechanic"
            onLogout={
              onLogout ||
              (() => auth().signOut())
            }
          />
        );

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
                      name="construct-outline"
                      size={80}
                      color="#1E3A8A"
                    />
                  </View>

                  <Text style={styles.emptyTitle}>
                    No Services Listed Yet
                  </Text>

                  <Text style={styles.emptySub}>
                    Tap the plus button below to add your first car service and start getting orders.
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
                        Rs. {item.price}
                      </Text>
                    </View>

                    <Text style={styles.cardServiceDesc}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        );
    }
  };

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <Animated.View style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* HOME HEADER */}
      {activeTab !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.topheader}>
            <Text style={styles.mechanicName}>
              {profileLoading ? 'Loading...' : mechanicName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileContainer}
            activeOpacity={0.8}
            onPress={() => setActiveTab('profile')}
          >
            {mechanicProfileImage ? (
              <Image
                source={{ uri: mechanicProfileImage }}
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

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* FLOATING ADD BUTTON */}
      {activeTab === 'home' && (
        <TouchableOpacity
          style={styles.floatingAddButton}
          activeOpacity={0.9}
          onPress={() => {
            setEditingServiceId(null);
            setServiceName('');
            setServicePrice('');
            setServiceDesc('');
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

      {/* SERVICE MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingServiceId ? 'Edit Service' : 'Add New Service'}
              </Text>

              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Service Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Engine Oil Change"
              value={serviceName}
              onChangeText={setServiceName}
            />

            <Text style={styles.inputLabel}>Price (Rs.)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3500"
              keyboardType="numeric"
              value={servicePrice}
              onChangeText={setServicePrice}
            />

            <Text style={styles.inputLabel}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief details..."
              multiline
              value={serviceDesc}
              onChangeText={setServiceDesc}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveService}
            >
              <Text style={styles.saveButtonText}>
                {editingServiceId ? 'Update Service' : 'Save Service'}
              </Text>
            </TouchableOpacity>

            {editingServiceId && (
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: '#ce0a0a',
                    marginTop: 10,
                  },
                ]}
                onPress={handleDeleteService}
              >
                <Text style={styles.saveButtonText}>
                  Delete Service
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* BOTTOM TAB */}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <Icon
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={26}
            color={activeTab === 'home' ? '#1E3A8A' : '#94A3B8'}
          />
          <Text
            style={{
              fontSize: 11,
              color: activeTab === 'home' ? '#1E3A8A' : '#94A3B8',
              fontWeight: '500',
            }}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('orders')}
        >
          <Icon
            name={activeTab === 'orders' ? 'clipboard' : 'clipboard-outline'}
            size={26}
            color={activeTab === 'orders' ? '#1E3A8A' : '#94A3B8'}
          />
          <Text
            style={{
              fontSize: 11,
              color: activeTab === 'orders' ? '#1E3A8A' : '#94A3B8',
              fontWeight: '500',
            }}
          >
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <Icon
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={26}
            color={activeTab === 'profile' ? '#1E3A8A' : '#94A3B8'}
          />
          <Text
            style={{
              fontSize: 11,
              color: activeTab === 'profile' ? '#1E3A8A' : '#94A3B8',
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

export default MechanicHome;