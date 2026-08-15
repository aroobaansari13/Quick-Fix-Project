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
  // Provider type check
  const providerType = route?.params?.providerType || '';
  const isFuelStation = providerType.toLowerCase().includes('fuel');
  
  // Dynamic collection select
  const collectionName = isFuelStation ? 'FuelStations' : 'Mechanics';

  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const uid = auth().currentUser?.uid;

  useEffect(() => {
    if (!uid) { 
      setLoading(false); 
      return; 
    }

    // Direct existing collection (FuelStations / Mechanics) se fetch karega
    const unsubscribe = firestore()
      .collection(collectionName)
      .doc(uid)
      .onSnapshot(
        (doc) => {
          if (doc && doc.exists) {
            const data = doc.data() || {};
            setIsOnline(data?.isOnline ?? false);
          } else {
            setIsOnline(false);
          }
          setLoading(false);
        },
        (error) => {
          console.log(`Error fetching ${collectionName} status:`, error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [uid, collectionName]);

  const toggleOnlineStatus = async (value) => {
    setIsOnline(value);
    if (!uid) return;

    try {
      // Direct selected collection ke document me update/set karega
      await firestore()
        .collection(collectionName)
        .doc(uid)
        .set(
          {
            isOnline: value,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (error) {
      console.log('Update Error:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  // Back Track Handler
  const handleBackPress = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      // Apni Profile Screen ka exact route name yahan likhein (e.g. 'ProviderProfile' ya 'Profile')
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