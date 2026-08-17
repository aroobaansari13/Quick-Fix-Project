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

const AvailabilityScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;

  useEffect(() => {
    if (!uid) { 
      setLoading(false); 
      return; 
    }

    const fetchCurrentStatus = async () => {
      try {
        // First priority: Check Mechanics collection
        const mechDoc = await firestore().collection('Mechanics').doc(uid).get();
        if (mechDoc.exists && mechDoc.data()?.isOnline !== undefined) {
          setIsOnline(mechDoc.data()?.isOnline);
          setLoading(false);
          return;
        }

        // Second priority: Check FuelStations collection
        const fuelDoc = await firestore().collection('FuelStations').doc(uid).get();
        if (fuelDoc.exists && fuelDoc.data()?.isOnline !== undefined) {
          setIsOnline(fuelDoc.data()?.isOnline);
          setLoading(false);
          return;
        }

        // Fallback: Check users collection
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

    // Immediately change UI state
    setIsOnline(value);

    try {
      const statusPayload = {
        isOnline: value,
        isAvailable: value,
        availabilityStatus: value ? 'online' : 'offline',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // 1. Force update 'Mechanics' collection if document exists
      const mechRef = firestore().collection('Mechanics').doc(uid);
      const mechDoc = await mechRef.get();
      if (mechDoc.exists) {
        await mechRef.set({
          ...statusPayload,
          shopDetails: {
            ...(mechDoc.data()?.shopDetails || {}),
            isOnline: value,
            isAvailable: value,
          }
        }, { merge: true });
      }

      // 2. Force update 'FuelStations' collection if document exists
      const fuelRef = firestore().collection('FuelStations').doc(uid);
      const fuelDoc = await fuelRef.get();
      if (fuelDoc.exists) {
        await fuelRef.set({
          ...statusPayload,
          stationDetails: {
            ...(fuelDoc.data()?.stationDetails || {}),
            isOnline: value,
            isAvailable: value,
          }
        }, { merge: true });
      }

      // 3. Always mirror update in 'users' collection
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