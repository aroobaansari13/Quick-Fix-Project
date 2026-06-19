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
import { styles } from './FuelStationSignUpStep1.styles';
import Icon from 'react-native-vector-icons/Ionicons';

const FuelStationSignUpStep1 = ({ onNext, onSignInPress }) => {
  // Fuel Station basic details and documentation states
  const [name, setName] = useState ('');
  const [email, setEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleNextStep = () => {
    // Validation Logic (If required)
    // if (!stationName || !email || !stationAddress || !phone || !licenseNumber || !username || !password) {
    //   alert("Please fill all compulsory fields!");
    //   return;
    // }
    if (onNext) onNext();
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
          <Text style={styles.headerText}>Fuel Station Registration</Text>
          <Text style={styles.subText}>Step 1 of 2: Station & Owner Details</Text>

          {/* Station Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Home Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Home Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter complete home location"
              placeholderTextColor="#999"
              value={homeAddress}
              onChangeText={setHomeAddress}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +923001234567"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a unique username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* CNIC Document Upload */}
          <Text style={styles.inputLabel}>Upload CNIC Documents (Compulsory)</Text>
          <View style={styles.imageUploadRow}>
            {/* CNIC Front/Page 1 */}
            <TouchableOpacity style={styles.imageUploadBox} activeOpacity={0.7}>
              <Icon name="document-text-outline" size={26} color="#64748B" style={{ marginBottom: 6 }} />
              <Text style={styles.uploadText}>CNIC Front / Page 1</Text>
            </TouchableOpacity>
            
            {/* CNIC Back/Page 2 */}
            <TouchableOpacity style={styles.imageUploadBox} activeOpacity={0.7}>
              <Icon name="document-text-outline" size={26} color="#64748B" style={{ marginBottom: 6 }} />
              <Text style={styles.uploadText}>CNIC Back / Page 2</Text>
            </TouchableOpacity>
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next Step</Text>
          </TouchableOpacity>

          {/* Footer Area */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onSignInPress}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FuelStationSignUpStep1;