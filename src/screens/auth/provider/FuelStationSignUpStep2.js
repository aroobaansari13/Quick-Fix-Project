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
import { registerUserInFirebase } from '../../../services/authService';

const FuelStationSignUpStep2 = ({ step1Data, onSignUpFinish, onBack, onSignInPress }) => {
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [loading, setLoading] = useState(false); // Spinner state

  const handleSignUp = async () => {
    // 1. Validation Checks
    if (!stationName || !stationAddress || !licenseNumber || !licenseExpiry) {
      Alert.alert("Error", "Please fill all required fields!");
      return;
    }

    if (!step1Data) {
      Alert.alert("Error", "Basic registration details are missing. Please go back.");
      return;
    }

    setLoading(true);

    // 2. Compile and merge data from Step 1 and Step 2
    const combinedAdditionalData = {
      username: step1Data.username,
      homeAddress: step1Data.homeAddress,
      phone: step1Data.phone,
      cnicFront: step1Data.cnicFront,
      cnicBack: step1Data.cnicBack,
      stationName: stationName.trim(),
      stationAddress: stationAddress.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseExpiry: licenseExpiry.trim(),
    };

    try {
      // 3. Trigger signup functionality with role 'fuel_station'
      const result = await registerUserInFirebase(
        step1Data.email,
        step1Data.password,
        step1Data.name,
        combinedAdditionalData,
        'fuel_station'
      );

      setLoading(false);

      if (result.success) {
        if (onSignUpFinish) {
          onSignUpFinish();
        }
      } else {
        Alert.alert('Registration Failed', result.error);
      }
    } catch (error) {
      setLoading(false);
      console.log("Fuel Station Step 2 Error Block:", error);
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

          {/* Form Header */}
          <View style={styles.headerRow}>
             <TouchableOpacity onPress={onBack} disabled={loading}>
                <Icon name="arrow-back" size={24} color="#333" />
             </TouchableOpacity>
             <Text style={styles.headerText}>Station Details</Text>
          </View>
          <Text style={styles.subText}>Step 2 of 2: Business Information</Text>

          {/* 1. Fuel Station Name */}
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

          {/* 2. Fuel Station Address */}
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

          {/* 3. License Number */}
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

          {/* 4. License Expiry */}
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

          {/* 5. Fuel Station Main Image Upload */}
          <Text style={styles.inputLabel}>Fuel Station Picture *</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} disabled={loading}>
            <Icon name="image-outline" size={30} color="#64748B" />
            <Text style={styles.uploadText}>Click to upload fuel station photo</Text>
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