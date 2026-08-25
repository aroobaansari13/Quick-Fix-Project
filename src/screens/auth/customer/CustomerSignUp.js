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
  ActivityIndicator,
  Alert
} from 'react-native';
import { styles } from './CustomerSignUp.styles';
import { registerUserInFirebase } from '../../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/Ionicons'

const CustomerSignUp = ({ onBack, onSignUpSuccess, onSignInPress }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !address || !phone || !password) {
      Alert.alert('Error', 'Please fill all compulsory fields!');
      return;
    }
    // Full Name Validation
if (!/^[A-Za-z ]+$/.test(name.trim())) {
  Alert.alert('Error', 'Full Name can contain letters and spaces only!');
  return;
}

// Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email.trim())) {
  Alert.alert('Error', 'Please enter a valid email address!');
  return;
}

// Address Validation
if (!/^[A-Za-z0-9\s,./#-]+$/.test(address.trim())) {
  Alert.alert('Error', 'Please enter a valid address!');
  return;
}

// Pakistani Phone Number Validation
if (!/^\+923\d{9}$/.test(phone)) {
  Alert.alert(
    'Error',
    'Enter a valid Pakistani number e.g. +923001234567'
  );
  return;
}

// Password Validation
if (password.length < 6) {
  Alert.alert('Error', 'Password must be at least 6 characters!');
  return;
}

if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
  Alert.alert(
    'Error',
    'Password must contain at least one letter and one number!'
  );
  return;
}

    setLoading(true);

    const additionalData = {
      address: address.trim(),
      phone: phone.trim(),
    };

    const result = await registerUserInFirebase(
      email.trim(),
      password,
      name.trim(),
      additionalData,
      'customer'
    );

    setLoading(false);

    if (result.success) {
      await AsyncStorage.setItem('userRole', 'customer');
      await AsyncStorage.setItem('lastActive', Date.now().toString());
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          <View style={styles.backButtonRow}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Account</Text>
          </View>
          <Text style={styles.subText}>Sign up as a customer to get instant help</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
  style={styles.input}
  placeholder="Enter your name"
  placeholderTextColor="#999"
  value={name}
  onChangeText={(text) => {
    const cleanText = text.replace(/[^A-Za-z ]/g, '');
    setName(cleanText);
  }}
  maxLength={50}
/>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
  style={styles.input}
  placeholder="Enter your email"
  placeholderTextColor="#999"
  keyboardType="email-address"
  autoCapitalize="none"
  value={email}
  onChangeText={setEmail}
  maxLength={100}
/>
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
  style={styles.input}
  placeholder="Enter your current address"
  placeholderTextColor="#999"
  value={address}
  onChangeText={setAddress}
  maxLength={150}
/>
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
  style={styles.input}
  placeholder="e.g. +923001234567"
  placeholderTextColor="#999"
  keyboardType="phone-pad"
  value={phone}
  onChangeText={(text) => {
    let cleanText = text.replace(/[^0-9+]/g, '');

    if (cleanText.length > 0 && !cleanText.startsWith('+')) {
      cleanText = '+' + cleanText;
    }

    setPhone(cleanText);
  }}
  maxLength={13}
/>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
  style={styles.input}
  placeholder="Create a strong password (min 6 characters)"
  placeholderTextColor="#999"
  secureTextEntry={true}
  value={password}
  onChangeText={setPassword}
  maxLength={50}
/>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            activeOpacity={0.8} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading 
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Sign Up</Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onSignInPress}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomerSignUp;