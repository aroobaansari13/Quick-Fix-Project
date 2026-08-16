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
  const [userCollection, setUserCollection] = useState(null);
  const [targetDocId, setTargetDocId] = useState(null);

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!uid && !userEmail) { 
      setLoading(false); 
      return; 
    }

    const findProfileDoc = async () => {
      try {
        // 1. Check FuelStations by UID
        if (uid) {
          const fuelDoc = await firestore().collection('FuelStations').doc(uid).get();
          if (fuelDoc.exists) {
            setUserCollection('FuelStations');
            setTargetDocId(uid);
            setIsOnline(fuelDoc.data()?.isOnline ?? false);
            setLoading(false);
            return;
          }
        }

        // 2. Check Mechanics by UID
        if (uid) {
          const mechDoc = await firestore().collection('Mechanics').doc(uid).get();
          if (mechDoc.exists) {
            setUserCollection('Mechanics');
            setTargetDocId(uid);
            setIsOnline(mechDoc.data()?.isOnline ?? false);
            setLoading(false);
            return;
          }
        }

        // 3. Check FuelStations by Email
        if (userEmail) {
          const fuelByEmail = await firestore()
            .collection('FuelStations')
            .where('email', '==', userEmail)
            .get();

          if (!fuelByEmail.empty) {
            const foundId = fuelByEmail.docs[0].id;
            setUserCollection('FuelStations');
            setTargetDocId(foundId);
            setIsOnline(fuelByEmail.docs[0].data()?.isOnline ?? false);
            setLoading(false);
            return;
          }

          // 4. Check Mechanics by Email
          const mechByEmail = await firestore()
            .collection('Mechanics')
            .where('email', '==', userEmail)
            .get();

          if (!mechByEmail.empty) {
            const foundId = mechByEmail.docs[0].id;
            setUserCollection('Mechanics');
            setTargetDocId(foundId);
            setIsOnline(mechByEmail.docs[0].data()?.isOnline ?? false);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Error finding profile:', error);
      } finally {
        setLoading(false);
      }
    };

    findProfileDoc();
  }, [uid, userEmail]);

  const toggleOnlineStatus = async (value) => {
    if (!userCollection || !targetDocId) {
      Alert.alert("Error", "Unable to update status. Profile not synced.");
      return;
    }

    setIsOnline(value);

    try {
      const updateData = {
        isOnline: value,
        isAvailable: value,
        availabilityStatus: value ? 'online' : 'offline',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (userCollection === 'FuelStations') {
        updateData['stationDetails.isOnline'] = value;
      } else {
        updateData['shopDetails.isOnline'] = value;
      }

      // Merge: true hone ki waja se agar isOnline ki field pehle nahi thi, toh nayi create ho jayegi
      await firestore()
        .collection(userCollection)
        .doc(targetDocId)
        .set(updateData, { merge: true });

    } catch (error) {
      console.log('Update Error:', error);
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