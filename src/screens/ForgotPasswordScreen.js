import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../config/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Success", "Reset link sent to your email!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your registered email address below, and we'll send you a link to reset your password.</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#888" style={styles.icon} />
          <TextInput 
            placeholder="Enter your email" 
            value={email} 
            onChangeText={setEmail} 
            style={styles.input} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  backButton: { marginTop: 50, marginBottom: 20 },
  content: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20 },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, color: '#333' },
  button: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default ForgotPasswordScreen;