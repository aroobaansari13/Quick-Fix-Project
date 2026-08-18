import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { styles } from './BusinessDetails.styles';

const BusinessDetails = ({ navigation, route }) => {
  const providerType = route?.params?.providerType || 'mechanic';
  const currentUser = auth().currentUser;

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🟢 Current Gmail UID ke mutabiq Realtime Sync (Crash-Proof)
  useEffect(() => {
    const uid = currentUser?.uid;

    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Stream Firestore updates strictly for logged-in user's UID
    const unsubscribe = firestore()
      .collection('providers')
      .doc(uid)
      .onSnapshot(
        (doc) => {
          // 🟢 CRASH FIX: doc aur doc.data() dono par safety checks
          if (doc && doc.exists) {
            const data = doc.data() || {};

            // 🟢 SAFELY FETCH WITH ALTERNATIVE KEYS & OPTIONAL CHAINING
            setBusinessName(
              data?.businessName || data?.shopName || data?.stationName || ''
            );
            setOwnerName(
              data?.ownerName || data?.fullName || data?.name || currentUser?.displayName || ''
            );
            setPhone(
              data?.phone || data?.phoneNumber || data?.contact || ''
            );
            setAddress(
              data?.address || data?.locationAddress || data?.location || ''
            );
            setDescription(
              data?.description || data?.about || data?.services || ''
            );
          } else {
            // Document exist na kare toh empty strings
            setBusinessName('');
            setOwnerName('');
            setPhone('');
            setAddress('');
            setDescription('');
          }
          setLoading(false);
        },
        (error) => {
          console.log('Firebase Sync Error:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 🟢 Permanently Save/Update changes to Firebase for current Gmail UID
  const handleSaveDetails = async () => {
    const uid = currentUser?.uid;
    const email = currentUser?.email;

    if (!uid) {
      Alert.alert('Error', 'User account not recognized. Please login again.');
      return;
    }

    if (!businessName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Validation Error', 'Please fill in all mandatory fields (*)');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        uid: uid,
        email: email,
        businessName: businessName.trim(),
        shopName: businessName.trim(),
        ownerName: ownerName.trim(),
        fullName: ownerName.trim(),
        phone: phone.trim(),
        phoneNumber: phone.trim(),
        address: address.trim(),
        description: description.trim(),
        providerRole: providerType === 'mechanic' ? 'mechanic' : 'fuel_station',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Permanent Write to Firestore 'providers' collection under UID
      await firestore().collection('providers').doc(uid).set(payload, { merge: true });

      setIsEditing(false);
      Alert.alert('Success', 'Business details permanently saved to Firebase!');
    } catch (error) {
      console.log('Save Error:', error);
      Alert.alert('Error', 'Failed to save changes to Firebase.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Business Details</Text>

        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.7}
          style={[
            styles.editToggleButton,
            { backgroundColor: isEditing ? '#FEE2E2' : '#EFF6FF' }
          ]}
        >
          <Icon
            name={isEditing ? 'close' : 'create-outline'}
            size={16}
            color={isEditing ? '#EF4444' : '#1E3A8A'}
          />
          <Text
            style={[
              styles.editToggleText,
              { color: isEditing ? '#EF4444' : '#1E3A8A' }
            ]}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Business / Shop Name *</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.readOnlyInput
          ]}
          placeholder="e.g. Auto Fix Workshop"
          placeholderTextColor="#94A3B8"
          value={businessName}
          onChangeText={setBusinessName}
          editable={isEditing}
        />

        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.readOnlyInput
          ]}
          placeholder="e.g. John Doe"
          placeholderTextColor="#94A3B8"
          value={ownerName}
          onChangeText={setOwnerName}
          editable={isEditing}
        />

        <Text style={styles.label}>Contact Phone *</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.readOnlyInput
          ]}
          placeholder="03XXXXXXXXX"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
        />

        <Text style={styles.label}>Shop Address *</Text>
        <TextInput
          style={[
            styles.input,
            !isEditing && styles.readOnlyInput
          ]}
          placeholder="e.g. Main Market, City"
          placeholderTextColor="#94A3B8"
          value={address}
          onChangeText={setAddress}
          editable={isEditing}
        />

        <Text style={styles.label}>Description / Services Summary</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            !isEditing && styles.readOnlyInput
          ]}
          placeholder="Brief details about your business..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          editable={isEditing}
        />

        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveDetails}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default BusinessDetails;