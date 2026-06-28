import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './FuelStationSignUpStep2.styles'; 
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth'; 
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FuelStationSignUpStep2 = ({ step1Data, onSignUpFinish, onBack, onSignInPress }) => {
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [stationPic, setStationPic] = useState(null);

  const handleStationPicPick = async () => {
    const options = { mediaType: 'photo', quality: 0.8 };
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setStationPic(response.assets[0]);
        Alert.alert("Success", "Station Photo selected successfully!");
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening gallery');
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    if (!stationName || !stationAddress || !licenseNumber || !licenseExpiry) {
      Alert.alert("Error", "Please fill all required fields!");
      return;
    }
    if (!stationPic) {
      Alert.alert("Error", "Please upload your Fuel Station Picture!");
      return;
    }
    if (!step1Data) {
      Alert.alert("Error", "Basic registration details are missing. Please go back.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create User Account directly in Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        step1Data.email.trim().toLowerCase(),
        step1Data.password
      );

      const uid = userCredential.user.uid;

      // 2. Save Direct in FuelStations Collection with status: 'pending'
      await firestore().collection('FuelStations').doc(uid).set({
        uid: uid,
        name: step1Data.name || 'Unknown Fuel Provider',
        email: step1Data.email.trim().toLowerCase(),
        password: step1Data.password,
        phone: step1Data.phone || 'N/A',
        username: step1Data.username || '',
        homeAddress: step1Data.homeAddress || '',
        role: 'fuel_station',
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        cnicFrontUrl: step1Data.cnicFront?.uri || '',
        cnicBackUrl: step1Data.cnicBack?.uri || '',
        stationName: stationName.trim(),
        stationAddress: stationAddress.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseExpiry: licenseExpiry.trim(),
        stationPicName: stationPic.uri || '', 
      });

      // 3. Force sign out right after registration
      await auth().signOut();
      await AsyncStorage.setItem('userRole', 'pendingReview'); 
      await AsyncStorage.setItem('lastActive', Date.now().toString());

      setLoading(false);
      Alert.alert(
        "Application Submitted",
        "Your registration request has been sent to Admin for approval. You can log in once approved.",
        [{ text: "OK", onPress: () => { if (onSignUpFinish) onSignUpFinish(); } }]
      );

    } catch (error) {
      setLoading(false);
      console.log("Fuel Station Step 2 Registration Crash Block:", error);
      Alert.alert("Submission Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          <View style={styles.headerRow}>
             <TouchableOpacity onPress={onBack} disabled={loading}>
                <Icon name="arrow-back" size={24} color="#333" />
             </TouchableOpacity>
             <Text style={styles.headerText}>Station Details</Text>
          </View>
          <Text style={styles.subText}>Step 2 of 2: Business Information</Text>

          {/* Fuel Station Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fuel Station Name *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="business-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="Enter fuel station name"
                 placeholderTextColor="#999"
                 value={stationName}
                 onChangeText={setStationName}
                 editable={!loading}
               />
            </View>
          </View>

          {/* Fuel Station Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fuel Station Address *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="location-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="Enter station complete address"
                 placeholderTextColor="#999"
                 value={stationAddress}
                 onChangeText={setStationAddress}
                 editable={!loading}
               />
            </View>
          </View>

          {/* License Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>License Number *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="card-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="Enter station license number"
                 placeholderTextColor="#999"
                 autoCapitalize="characters"
                 value={licenseNumber}
                 onChangeText={setLicenseNumber}
                 editable={!loading}
               />
            </View>
          </View>

          {/* License Expiry */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>License Expiry Date *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="calendar-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="DD / MM / YYYY"
                 placeholderTextColor="#999"
                 value={licenseExpiry}
                 onChangeText={setLicenseExpiry}
                 editable={!loading}
               />
            </View>
          </View>

          {/* Fuel Station Image Upload */}
          <Text style={styles.inputLabel}>Fuel Station Picture *</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, stationPic && { borderColor: '#10B981', borderWidth: 1.5 }]} 
            activeOpacity={0.7} 
            onPress={handleStationPicPick}
            disabled={loading}
          >
            <Icon 
              name={stationPic ? "checkmark-circle-outline" : "image-outline"} 
              size={30} 
              color={stationPic ? '#10B981' : '#64748B'} 
            />
            <Text style={[styles.uploadText, stationPic && { color: '#10B981', fontWeight: '500' }]}>
              {stationPic ? `Selected: ${stationPic.fileName?.substring(0, 20)}...` : "Click to upload fuel station photo"}
            </Text>
          </TouchableOpacity>

          {/* Final Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, loading && { opacity: 0.7 }]} 
            activeOpacity={0.8} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Registration</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInPress} disabled={loading}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FuelStationSignUpStep2;