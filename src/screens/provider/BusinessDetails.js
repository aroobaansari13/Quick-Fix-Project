import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { styles } from './BusinessDetails.styles';

const BusinessDetails = ({ navigation, route }) => {

  /*
   * ---------------------------------------------------------
   * 1. CURRENT USER
   * ---------------------------------------------------------
   */

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;

  /*
   * ---------------------------------------------------------
   * 2. PROVIDER TYPE
   * ---------------------------------------------------------
   *
   * Expected values:
   *
   * mechanic
   * fuel_station
   * fuelStation
   * Fuel Station
   *
   */

  const providerType = route?.params?.providerType || '';

  const passedCollectionName =
    route?.params?.collectionName || '';

  /*
   * ---------------------------------------------------------
   * 3. DETERMINE CORRECT COLLECTION
   * ---------------------------------------------------------
   *
   * providerType has priority.
   *
   * Mechanic      -> Mechanics
   * Fuel Station  -> FuelStations
   *
   */

  const getProviderCollection = () => {

    const type = String(providerType)
      .toLowerCase()
      .trim();

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
     * Normally this should not be reached if providerType
     * is correctly passed.
     */

    return 'Mechanics';
  };

  const collectionName = getProviderCollection();

  /*
   * ---------------------------------------------------------
   * 4. STATES
   * ---------------------------------------------------------
   */

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * ---------------------------------------------------------
   * 5. DEBUG
   * ---------------------------------------------------------
   */

  console.log('----------------------------------');
  console.log('BusinessDetails');
  console.log('Provider Type:', providerType);
  console.log('Passed Collection:', passedCollectionName);
  console.log('Final Collection:', collectionName);
  console.log('Provider UID:', uid);
  console.log('----------------------------------');

  /*
   * ---------------------------------------------------------
   * 6. LOAD PROVIDER DATA
   * ---------------------------------------------------------
   *
   * Read ONLY:
   *
   * Mechanics/{uid}
   *
   * OR
   *
   * FuelStations/{uid}
   *
   */

  useEffect(() => {

    if (!uid) {
      setLoading(false);

      Alert.alert(
        'Error',
        'Provider account not found. Please login again.'
      );

      return;
    }

    setLoading(true);

    console.log(
      `Listening to provider document: ${collectionName}/${uid}`
    );

    const unsubscribe = firestore()
      .collection(collectionName)
      .doc(uid)
      .onSnapshot(
        (doc) => {

          /*
           * Provider document does not exist.
           */

          if (!doc.exists) {

            console.log(
              `Provider document not found: ${collectionName}/${uid}`
            );

            setName('');
            setPhone('');

            setLoading(false);

            return;
          }

          /*
           * Provider document exists.
           */

          const data = doc.data() || {};

          console.log(
            'Provider Business Data:',
            data
          );

          setName(
            data.name ||
            currentUser?.displayName ||
            ''
          );

          setPhone(
            data.phone ||
            ''
          );

          setLoading(false);
        },

        (error) => {

          console.log(
            'Firebase Business Details Sync Error:',
            error
          );

          setLoading(false);

          Alert.alert(
            'Error',
            'Failed to load business details.'
          );
        }
      );

    /*
     * Cleanup listener.
     */

    return () => {
      unsubscribe();
    };

  }, [uid, collectionName]);

  /*
   * ---------------------------------------------------------
   * 7. SAVE / UPDATE DETAILS
   * ---------------------------------------------------------
   */

  const handleSaveDetails = async () => {

    if (!uid) {

      Alert.alert(
        'Error',
        'User account not recognized. Please login again.'
      );

      return;
    }

    /*
     * Validation
     */

    if (!name.trim() || !phone.trim()) {

      Alert.alert(
        'Validation Error',
        'Please fill in both Name and Phone number.'
      );

      return;
    }

    setSaving(true);

    try {

      console.log(
        `Checking provider document before update: ${collectionName}/${uid}`
      );

      /*
       * IMPORTANT:
       *
       * First check that the document already exists.
       *
       * We don't want to accidentally create a new
       * provider document in the wrong collection.
       */

      const providerDoc = await firestore()
        .collection(collectionName)
        .doc(uid)
        .get();

      /*
       * Document missing
       */

      if (!providerDoc.exists) {

        console.log(
          `Provider document does not exist: ${collectionName}/${uid}`
        );

        Alert.alert(
          'Provider Record Not Found',
          `Your provider profile was not found in ${collectionName}.`
        );

        return;
      }

      /*
       * Existing document found.
       *
       * Update ONLY this existing UID document.
       */

      await firestore()
        .collection(collectionName)
        .doc(uid)
        .update({

          name: name.trim(),

          phone: phone.trim(),

          updatedAt:
            firestore.FieldValue.serverTimestamp(),

        });

      /*
       * Save successful
       */

      setIsEditing(false);

      Alert.alert(
        'Success',
        'Business details updated successfully!'
      );

    } catch (error) {

      console.log(
        'Business Details Save Error:',
        error
      );

      Alert.alert(
        'Error',
        'Failed to save changes.'
      );

    } finally {

      setSaving(false);

    }
  };

  /*
   * ---------------------------------------------------------
   * 9. MAIN SCREEN
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
          onPress={() => navigation?.goBack()}
          disabled={saving}
          activeOpacity={0.7}
        >

          <Icon
            name="arrow-back"
            size={24}
            color="#1E3A8A"
          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Business Details
        </Text>

        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          disabled={saving}
          activeOpacity={0.7}
          style={[
            styles.editToggleButton,
            {
              backgroundColor:
                isEditing
                  ? '#FEE2E2'
                  : '#EFF6FF',
            },
          ]}
        >

          <Icon
            name={
              isEditing
                ? 'close'
                : 'create-outline'
            }
            size={16}
            color={
              isEditing
                ? '#EF4444'
                : '#1E3A8A'
            }
          />

          <Text
            style={[
              styles.editToggleText,
              {
                color:
                  isEditing
                    ? '#EF4444'
                    : '#1E3A8A',
              },
            ]}
          >

            {isEditing
              ? 'Cancel'
              : 'Edit'}

          </Text>

        </TouchableOpacity>

      </View>

      {/* Content */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Name */}

        <Text style={styles.label}>
          Name *
        </Text>

        <TextInput
          style={[
            styles.input,
            !isEditing &&
              styles.readOnlyInput,
          ]}
          placeholder="Enter name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        {/* Phone */}

        <Text style={styles.label}>
          Phone Number *
        </Text>

        <TextInput
          style={[
            styles.input,
            !isEditing &&
              styles.readOnlyInput,
          ]}
          placeholder="03XXXXXXXXX"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
        />

        {/* Save */}

        {isEditing && (

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveDetails}
            disabled={saving}
            activeOpacity={0.8}
          >

            {saving ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>

            )}

          </TouchableOpacity>

        )}

      </ScrollView>

    </View>
  );
};

export default BusinessDetails;