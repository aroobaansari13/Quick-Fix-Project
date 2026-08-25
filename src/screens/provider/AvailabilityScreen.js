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
  const [updating, setUpdating] = useState(false);

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;

  /*
   * ---------------------------------------------------------
   * 1. GET PROVIDER TYPE
   * ---------------------------------------------------------
   *
   * Expected values can be:
   * mechanic
   * fuel_station
   * fuelStation
   * Fuel Station
   *
   */

  const providerType = route?.params?.providerType || '';

  const passedCollectionName = route?.params?.collectionName || '';

  /*
   * ---------------------------------------------------------
   * 2. DETERMINE CORRECT FIRESTORE COLLECTION
   * ---------------------------------------------------------
   *
   * providerType has priority.
   *
   * Mechanic      -> Mechanics
   * Fuel Station  -> FuelStations
   *
   */

  const getProviderCollection = () => {
    const type = String(providerType).toLowerCase().trim();

    // Fuel Station
    if (
      type.includes('fuel') ||
      type.includes('fuelstation') ||
      type.includes('fuel_station')
    ) {
      return 'FuelStations';
    }

    // Mechanic
    if (type.includes('mechanic')) {
      return 'Mechanics';
    }

    /*
     * If providerType is unavailable,
     * use collectionName passed from ProviderProfile.
     */
    if (
      passedCollectionName === 'FuelStations' ||
      passedCollectionName === 'Mechanics'
    ) {
      return passedCollectionName;
    }

    /*
     * Final fallback.
     *
     * This should normally NOT be reached if providerType
     * is correctly passed from the provider account.
     */
    return 'Mechanics';
  };

  const collectionName = getProviderCollection();

  /*
   * Debug information
   */
  console.log('----------------------------------');
  console.log('AvailabilityScreen');
  console.log('Provider Type:', providerType);
  console.log('Passed Collection:', passedCollectionName);
  console.log('Final Collection:', collectionName);
  console.log('Provider UID:', uid);
  console.log('----------------------------------');

  /*
   * ---------------------------------------------------------
   * 3. LOAD CURRENT AVAILABILITY STATUS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentStatus = async () => {
      if (!uid) {
        if (isMounted) {
          setLoading(false);
        }

        Alert.alert(
          'Error',
          'Provider account not found. Please login again.'
        );

        return;
      }

      try {
        console.log(
          `Checking provider document: ${collectionName}/${uid}`
        );

        const providerDoc = await firestore()
          .collection(collectionName)
          .doc(uid)
          .get();

        if (!providerDoc.exists) {
          console.log(
            `Provider document does not exist: ${collectionName}/${uid}`
          );

          if (isMounted) {
            setIsOnline(false);
          }

          Alert.alert(
            'Provider Record Not Found',
            `Your provider profile was not found in ${collectionName}.`
          );

          return;
        }

        const data = providerDoc.data() || {};

        console.log(
          'Provider document data:',
          data
        );

        if (isMounted) {
          setIsOnline(data.isOnline ?? false);
        }

      } catch (error) {
        console.log(
          'Error fetching availability status:',
          error
        );

        if (isMounted) {
          setIsOnline(false);
        }

        Alert.alert(
          'Error',
          'Failed to load availability status.'
        );

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCurrentStatus();

    return () => {
      isMounted = false;
    };

  }, [uid, collectionName]);

  /*
   * ---------------------------------------------------------
   * 4. UPDATE ONLINE / OFFLINE STATUS
   * ---------------------------------------------------------
   */

  const toggleOnlineStatus = async (value) => {
    if (!uid) {
      Alert.alert(
        'Error',
        'Unable to update status. User is not logged in.'
      );

      return;
    }

    if (updating) {
      return;
    }

    /*
     * Do NOT immediately change UI permanently.
     * First update Firestore successfully.
     */

    setUpdating(true);

    try {
      console.log(
        `Updating availability: ${collectionName}/${uid}`
      );

      /*
       * First make sure the provider document exists.
       */
      const providerDoc = await firestore()
        .collection(collectionName)
        .doc(uid)
        .get();

      if (!providerDoc.exists) {
        console.log(
          `Provider document missing: ${collectionName}/${uid}`
        );

        Alert.alert(
          'Error',
          `Provider document was not found in ${collectionName}.`
        );

        return;
      }

      /*
       * Update ONLY the existing UID document.
       *
       * update() is intentional here.
       * It prevents accidentally creating a new provider document.
       */

      await firestore()
        .collection(collectionName)
        .doc(uid)
        .update({
          isOnline: value,
          isAvailable: value,
          availabilityStatus: value
            ? 'online'
            : 'offline',
          updatedAt:
            firestore.FieldValue.serverTimestamp(),
        });

      /*
       * Firestore update successful.
       */
      setIsOnline(value);

      console.log(
        `Availability successfully updated to ${
          value ? 'ONLINE' : 'OFFLINE'
        }`
      );

    } catch (error) {
      console.log(
        'Status Update Error:',
        error
      );

      Alert.alert(
        'Error',
        'Failed to update availability status.'
      );

    } finally {
      setUpdating(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * 5. BACK BUTTON
   * ---------------------------------------------------------
   */

  const handleBackPress = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('ProviderProfile', {
        providerType,
        collectionName,
      });
    }
  };

  /*
   * ---------------------------------------------------------
   * 6. LOADING SCREEN
   * ---------------------------------------------------------
   */

  /*
   * ---------------------------------------------------------
   * 7. MAIN SCREEN
   * ---------------------------------------------------------
   */

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          disabled={updating}
        >
          <Icon
            name="arrow-back"
            size={24}
            color="#1E3A8A"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Status
        </Text>

      </View>

      {/* Content */}

      <View style={styles.content}>

        <View style={styles.statusCard}>

          <View style={styles.statusTextContainer}>

            <Text style={styles.statusTitle}>
              Current Availability
            </Text>

            <Text style={styles.statusDescription}>
              {isOnline
                ? 'You are currently ONLINE and visible to users.'
                : 'You are currently OFFLINE and hidden from the map.'}
            </Text>

          </View>

          {updating ? (
            <ActivityIndicator
              size="small"
              color="#1E3A8A"
            />
          ) : (
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              disabled={updating}
              trackColor={{
                false: '#CBD5E1',
                true: '#93C5FD',
              }}
              thumbColor={
                isOnline
                  ? '#1E3A8A'
                  : '#94A3B8'
              }
            />
          )}

        </View>

      </View>

    </View>
  );
};

export default AvailabilityScreen;