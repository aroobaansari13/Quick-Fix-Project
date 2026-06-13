import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './SignIn.styles';
import { COLORS } from '../config/theme'; // Global blue theme load karne ke liye

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* White background status bar */}
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

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
            />
            {/* Eye Icon to Toggle Password Visibility */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* 3. Sign In Button */}
          <TouchableOpacity style={styles.signInButton} activeOpacity={0.8}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

        </View>

        {/* 4. Footer Section (Don't have an account?) */}
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