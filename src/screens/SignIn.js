import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './SignIn.styles';
import { COLORS } from '../config/theme';
import { ADMIN_CREDENTIALS } from '../config/adminConfig';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthManager } from '../services/AuthManager';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const SignIn = ({ onAdminLoginSuccess, onSignUpPress, onSignInSuccess, onBack, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLoginSuccess = async (userRole) => {
    try {
      await AsyncStorage.setItem('userRole', userRole);
      await AsyncStorage.setItem('lastActive', Date.now().toString());
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

  setLoading(true);
  try {
    // Admin check pehle hi rehne dein jaisa aapka tha
    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.EMAIL.toLowerCase() && password === ADMIN_CREDENTIALS.PASSWORD) {
      try {
          // ✅ Yeh line add karni hai taake Firebase Auth session ban jaye aur rules block na karein
          await auth().signInWithEmailAndPassword(email.trim().toLowerCase(), password);
      } catch (authError) {
          console.log("Admin Firebase Auth Error (Ignore if already signed in):", authError);
        }
        onAdminLoginSuccess();
        return;
    }

    // Naya flow: AuthManager ko use karein
    const screenName = await AuthManager.loginAndGetRole(email.trim().toLowerCase(), password);
    
    // Success hone par ye App.js ko screen name bhej dega
    onSignInSuccess(screenName); 
    
  } catch (error) {
    Alert.alert("Login Failed", error.message);
  } finally {
    setLoading(false);
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
        <View style={styles.headerSection}>
          <Image 
            source={require('../assets/logo1.png')} 
            style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center', marginTop: 50 }}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subText}>Sign in to continue to QuickFix</Text>
        </View>

        <View style={styles.formSection}>
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
              <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.signInButton, loading && { opacity: 0.7 }]} 
            activeOpacity={0.8} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
          </TouchableOpacity>
          <ForgotPasswordModal 
            isVisible={isModalVisible} 
            onClose={() => setModalVisible(false)}
            onSelectEmail={() => {
            setModalVisible(false);
             // Yahan navigate ki jagah direct screen ka naam bhejein
             navigation.navigate('forgotPasswordScreen'); 
            }}
          />
        </View>
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onSignUpPress}>
            <Text style={styles.signUpLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;