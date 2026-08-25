import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './ProviderSelection.styles';
import Icon from 'react-native-vector-icons/Ionicons'


const ProviderSelection = ({onBack, onMechanicPress, onFuelPress, onSignInPress }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.backButtonRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>
      
      {/* Small Logo */}
      <Image 
        source={require('../../../assets/logo1.png')} // Path check karlein
        style={styles.logo1}
        resizeMode="contain"
      />

      <Text style={styles.title}>Join QuickFix Network</Text>
      <Text style={styles.subtitle}>Select your service type to register as a provider</Text>

      {/* Option 1: Mechanic */}
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8} 
        onPress={onMechanicPress}
      >
        <Text style={styles.buttonText}>Sign Up As Mechanic</Text>
      </TouchableOpacity>

      {/* Option 2: Fuel Station */}
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8} 
        onPress={onFuelPress}
      >
        <Text style={styles.buttonText}>Sign Up As Fuel Station</Text>
      </TouchableOpacity>

      {/* Sign In Option */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onSignInPress}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProviderSelection;