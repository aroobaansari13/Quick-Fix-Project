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
import { styles } from './MechanicSignUpStep1.styles';
import Icon from 'react-native-vector-icons/Ionicons';

const MechanicSignUpStep1 = ({ onNext, onSignInPress }) => {
  // Inputs ki state manage karne ke liye variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');

  const handleNextStep = () => {
    // Validation check
    // if (!name || !email || !address || !phone || !username || !password || !cnic) {
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
          <Text style={styles.headerText}>Mechanic Registration</Text>
          <Text style={styles.subText}>Step 1 of 2: Basic Personal Details</Text>

          {/* Full Name Input */}
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
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Home Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your complete address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
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

          {/* CNIC Input */}
          <Text style={styles.inputLabel}>Upload CNIC Pictures (Compulsory)</Text>
          <View style={styles.imageUploadRow}>
            {/* Front Side Upload Box */}
            <TouchableOpacity style={styles.imageUploadBox} activeOpacity={0.7}>
                <Icon name="camera-outline" size={26} color="#64748B" style={{ marginBottom: 6 }} />
                <Text style={styles.uploadText}>CNIC Front Side</Text>
            </TouchableOpacity>
            {/* Back Side Upload Box */}
            <TouchableOpacity style={styles.imageUploadBox} activeOpacity={0.7}>
                <Icon name="camera-outline" size={26} color="#64748B" style={{ marginBottom: 6 }} />
                <Text style={styles.uploadText}>CNIC Back Side</Text>
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

export default MechanicSignUpStep1;