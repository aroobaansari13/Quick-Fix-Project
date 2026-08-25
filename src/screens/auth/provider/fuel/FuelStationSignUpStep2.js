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

  const isValidExpiryDate = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // License expiry future mein honi chahiye
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

  const handleSignUp = async () => {
    if (
  !stationName.trim() ||
  !stationAddress.trim() ||
  !licenseNumber.trim() ||
  !licenseExpiry.trim()
) {
  Alert.alert(
    "Error",
    "Please fill all required fields!"
  );
  return;
}

if (stationName.trim().length < 3) {
  Alert.alert(
    "Invalid Station Name",
    "Fuel station name must be at least 3 characters."
  );
  return;
}

if (stationAddress.trim().length < 5) {
  Alert.alert(
    "Invalid Address",
    "Please enter the complete fuel station address."
  );
  return;
}

if (licenseNumber.trim().length < 4) {
  Alert.alert(
    "Invalid License Number",
    "Please enter a valid station license number."
  );
  return;
}

if (!isValidExpiryDate(licenseExpiry)) {
  Alert.alert(
    "Invalid Expiry Date",
    "Enter a valid future expiry date in DD/MM/YYYY format."
  );
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
        stationDetails:{
          stationName: stationName.trim(),
          address: stationAddress.trim(),
          licenseNumber: licenseNumber.trim(),
          licenseExpiry: licenseExpiry.trim(),
          stationPicName: stationPic.uri || '', 
          latitude: step1Data.latitude || 0,
          longitude: step1Data.longitude || 0
        }
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
  onChangeText={(text) => {
    const cleaned = text.replace(/[^A-Za-z0-9\s.&'-]/g, '');
    setStationName(cleaned);
  }}
  maxLength={60}
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
  maxLength={150}
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
  onChangeText={(text) => {
    const cleaned = text
      .toUpperCase()
      .replace(/[^A-Z0-9/()\-]/g, '');

    setLicenseNumber(cleaned);
  }}
  maxLength={30}
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
  placeholder="DD/MM/YYYY"
  placeholderTextColor="#999"
  keyboardType="number-pad"
  value={licenseExpiry}
  onChangeText={(text) => {
    let digits = text.replace(/\D/g, '').slice(0, 8);

    if (digits.length >= 5) {
      digits =
        digits.slice(0, 2) +
        '/' +
        digits.slice(2, 4) +
        '/' +
        digits.slice(4);
    } else if (digits.length >= 3) {
      digits =
        digits.slice(0, 2) +
        '/' +
        digits.slice(2);
    }

    setLicenseExpiry(digits);
  }}
  maxLength={10}
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