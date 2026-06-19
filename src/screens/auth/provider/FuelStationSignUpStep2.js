import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './FuelStationSignUpStep2.styles';

const FuelStationSignUpStep2 = ({ onSignUpFinish, onBack, onSignInPress }) => {
  // States according to your exact order
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');

  const handleSignUp = () => {
    // Validation Check (If needed)
    // if (!stationName || !stationAddress || !licenseNumber || !licenseExpiry) {
    //   alert("Please fill all required fields!");
    //   return;
    // }
    if (onSignUpFinish) onSignUpFinish();
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
             <TouchableOpacity onPress={onBack}>
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
               />
            </View>
          </View>

          {/* 5. Fuel Station Main Image Upload */}
          <Text style={styles.inputLabel}>Fuel Station Picture *</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Icon name="image-outline" size={30} color="#64748B" />
            <Text style={styles.uploadText}>Click to upload fuel station photo</Text>
          </TouchableOpacity>


          {/* Final Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.8} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Complete Registration</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInPress}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FuelStationSignUpStep2;