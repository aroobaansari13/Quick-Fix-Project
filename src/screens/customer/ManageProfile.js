import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ManageProfile.styles';
import auth from '@react-native-firebase/auth'; // Firebase Auth Import
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore Import

const ManageProfile = ({ navigation, route }) => {
  // Initial dynamic states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Toggling states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Initial data loading state

  // Current login user ki details nikalne ke liye
  const currentUser = auth().currentUser;

  // 🟢 1. AuthManager ke mutabiq 'Customers' collection se data fetch karne ka logic
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        Alert.alert("Error", "User session not found. Please login again.");
        setFetchingData(false);
        return;
      }

      try {
        // 🌟 Nayi collection ki bajaye AuthManager wali 'Customers' collection ko get kiya
        const userDoc = await firestore().collection('Customers').doc(currentUser.uid).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.name) setName(userData.name);
          if (userData.phone) setPhone(userData.phone);
        } else {
          console.log("No such document in 'Customers' collection!");
        }
      } catch (error) {
        console.log("Error fetching profile from Firestore:", error);
        Alert.alert("Error", "Failed to load profile data from server.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // 🟢 2. AuthManager wali hi same 'Customers' collection mein data save karne ka function
  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Name and Phone Number cannot be empty.");
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "Authentication session expired.");
      return;
    }

    setLoading(true);
    
    try {
      // 🌟 'customer' ko badal kar 'Customers' kar diya hai taake koi alag collection na bane
      // Aur merge: true lagaya hai taake purana save data delete na ho, sirf name aur phone update ho
      await firestore().collection('Customers').doc(currentUser.uid).set({
        name: name.trim(),
        phone: phone.trim(),
      }, { merge: true });

      setLoading(false);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");

    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to update profile on server.");
      console.log("Firestore update/merge error:", error);
    }
  };

  // 🟢 3. Cancel dabane par unsaved text clear karke wapas Firebase wala data load karna
  const handleCancel = async () => {
    setIsEditing(false);
    if (!currentUser) return;

    try {
      const userDoc = await firestore().collection('Customers').doc(currentUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.name) setName(userData.name);
        if (userData.phone) setPhone(userData.phone);
      }
    } catch (error) {
      console.log("Error reverting Firestore data:", error);
    }
  };

  // Agar background mein database se data aa raha ho toh loading screen dikhayein
  if (fetchingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#002855" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Fetching profile data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Profile</Text>
        
        {/* Right side edit icon toggler */}
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editTopBtn}>
            <Icon name="create-outline" size={22} color="#002855" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} /> // Spacing balance karne ke liye
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Information Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Personal Details</Text>
          
          {/* NAME FIELD */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.inputWrapper, !isEditing && styles.disabledInputWrapper]}>
              <Icon name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledTextInput]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* PHONE NUMBER FIELD */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[styles.inputWrapper, !isEditing && styles.disabledInputWrapper]}>
              <Icon name="call-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledTextInput]}
                value={phone}
                onChangeText={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* SAVE CHANGES BUTTON */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon name="checkmark-sharp" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* CANCEL EDITING BUTTON */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel} 
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
};

export default ManageProfile;