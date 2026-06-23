import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './SignIn.styles';
import { COLORS } from '../config/theme';
import { ADMIN_CREDENTIALS } from '../config/adminConfig';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ onAdminLoginSuccess, onSignUpPress, onSignInSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = async (userRole) => {
    try {
      // ✅ AsyncStorage mein role aur time save karo
      await AsyncStorage.setItem('userRole', userRole);
      await AsyncStorage.setItem('lastActive', Date.now().toString());
      // ✅ App.js ko batao ke kaunsi screen par jao
      if (onSignInSuccess) {
        onSignInSuccess(userRole);
      }
    } catch (error) {
      console.log("Storage Error:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password || email.trim() === '') {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin Login Check
    if (ADMIN_CREDENTIALS && ADMIN_CREDENTIALS.email) {
      if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
        // ✅ Admin ke liye bhi AsyncStorage save karo
        await AsyncStorage.setItem('userRole', 'admin');
        await AsyncStorage.setItem('lastActive', Date.now().toString());
        if (onAdminLoginSuccess) onAdminLoginSuccess();
        return;
      }
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(cleanEmail, password);
      const uid = userCredential.user.uid;

      const userDoc = await firestore().collection('Users').doc(uid).get();
      setLoading(false);

      if (userDoc.exists) {
        const userData = userDoc.data();
        const userRole = userData.role;
        await handleLoginSuccess(userRole); // ✅ Ab yeh call ho raha hai
      } else {
        Alert.alert("Error", "User details not found in database.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {onBack && (
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 1. Header Section */}
        <View style={styles.headerSection}>
          <Image 
            source={require('../assets/logo1.png')} 
            style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center', marginTop: 50 }}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subText}>Sign in to continue to QuickFix</Text>
        </View>

        {/* 2. Input Fields Form */}
        <View style={styles.formSection}>
          
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.signInButton, loading && { opacity: 0.7 }]} 
            activeOpacity={0.8} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* 4. Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.signUpLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default SignIn;