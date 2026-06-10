import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './UserSelection.styles';

const UserSelection = ({ onCustomerPress }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Small Logo */}
      <Image 
        source={require('../../assets/logo1.png')} 
        style={styles.logo1}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to QuickFix</Text>
      <Text style={styles.subtitle}>Choose how you want to use the app</Text>

      {/* Option 1: Customer */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onCustomerPress}>
        <Text style={styles.buttonText}>Sign Up As Customer</Text>
      </TouchableOpacity>

      {/* Option 2: Provider */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Sign Up As Provider</Text>
      </TouchableOpacity>

      {/* Sign In Option */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserSelection;