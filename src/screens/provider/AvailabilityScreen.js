import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { styles } from './AvailabilityScreen.styles';

const AvailabilityScreen = ({ navigation, route }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;

  // App.js se aane wala providerType ('mechanic' ya 'fuel_station')
  const providerType = route?.params?.providerType || 'mechanic';

  useEffect(() => {
    if (!uid) { 
      setLoading(false); 
      return; 
    }

    const fetchCurrentStatus = async () => {
      try {
        // Priority 1: Check Mechanics collection
        const mechDoc = await firestore().collection('Mechanics').doc(uid).get();
        if (mechDoc.exists && mechDoc.data()?.isOnline !== undefined) {
          setIsOnline(mechDoc.data()?.isOnline);
          setLoading(false);
          return;
        }

        // Priority 2: Check FuelStations collection
        const fuelDoc = await firestore().collection('FuelStations').doc(uid).get();
        if (fuelDoc.exists && fuelDoc.data()?.isOnline !== undefined) {
          setIsOnline(fuelDoc.data()?.isOnline);
          setLoading(false);
          return;
        }

        // Priority 3: Fallback to users collection
        const userDoc = await firestore().collection('users').doc(uid).get();
        if (userDoc.exists) {
          setIsOnline(userDoc.data()?.isOnline ?? false);
        }
      } catch (error) {
        console.log('Error fetching status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentStatus();
  }, [uid]);

  const toggleOnlineStatus = async (value) => {
    if (!uid) {
      Alert.alert("Error", "Unable to update status. User not logged in.");
      return;
    }

    // Update UI immediately
    setIsOnline(value);

    try {
      const statusPayload = {
        isOnline: value,
        isAvailable: value,
        availabilityStatus: value ? 'online' : 'offline',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // 🟢 Target exact collection based on providerType or update existing doc with UID
      const collectionName = (providerType === 'fuel_station' || providerType === 'fuel') 
        ? 'FuelStations' 
        : 'Mechanics';

      // 1. Direct update on exact Document UID (NO .add() used, NO duplicate document possible)
      await firestore().collection(collectionName).doc(uid).set({
        ...statusPayload,
        ...(collectionName === 'Mechanics' 
          ? { 'shopDetails.isOnline': value, 'shopDetails.isAvailable': value }
          : { 'stationDetails.isOnline': value, 'stationDetails.isAvailable': value }
        )
      }, { merge: true });

      // 2. Always mirror update in 'users' collection using UID
      await firestore().collection('users').doc(uid).set(statusPayload, { merge: true });

      console.log(`Successfully updated status to ${value} for UID: ${uid}`);

    } catch (error) {
      console.log('Status Update Error:', error);
      Alert.alert('Error', 'Failed to update availability status.');
      setIsOnline(!value);
    }
  };

  const handleBackPress = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProviderProfile'); 
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>Current Availability</Text>
            <Text style={styles.statusDescription}>
              {isOnline
                ? 'You are currently ONLINE and visible to users.'
                : 'You are currently OFFLINE and hidden from the map.'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={isOnline ? '#1E3A8A' : '#94A3B8'}
          />
        </View>
      </View>
    </View>
  );
};

export default AvailabilityScreen;