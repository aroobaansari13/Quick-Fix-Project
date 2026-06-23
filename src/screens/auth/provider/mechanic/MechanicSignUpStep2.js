import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../mechanic/MechanicSignUpStep2.styles';
import { registerUserInFirebase } from '../../../../services/authService';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MechanicSignUpStep2 = ({step1Data, onSignUpFinish, onBack, onSignInPress }) => {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopAddress, setWorkshopAddress] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [workshopPic, setWorkshopPic] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilePick = async (fileType) => {
    const options = { mediaType: 'photo', quality: 0.8 };
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const pickedAsset = response.assets[0];
        if (fileType === 'workshop_pic') setWorkshopPic(pickedAsset);
        if (fileType === 'certificate') setCertificate(pickedAsset);
        Alert.alert("Success", "Photo selected successfully!");
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening gallery');
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    if (!workshopName || !workshopAddress) {
      Alert.alert("Error", "Please fill Workshop Name and Address!");
      return;
    }
    if (!workshopPic) {
      Alert.alert("Error", "Please upload your Workshop Picture!");
      return;
    }
    if (!step1Data) {
      Alert.alert("Error", "Basic details missing. Please go back to Step 1.");
      return;
    }
    setLoading(true);

    const combinedAdditionalData = {
      username: step1Data.username,
      address: step1Data.homeAddress || step1Data.address,
      phone: step1Data.phone,
      cnicFrontName: step1Data.cnicFront ? (step1Data.cnicFront.fileName || 'cnic_front.jpg') : 'None',
      cnicBackName: step1Data.cnicBack ? (step1Data.cnicBack.fileName || 'cnic_back.jpg') : 'None',
      workshopName: workshopName.trim(),
      workshopAddress: workshopAddress.trim(),
      specializations: specializations.trim() || 'General Mechanic',
      workshopPicName: workshopPic.fileName || 'workshop.jpg',
      certificateName: certificate ? (certificate.fileName || 'certificate.jpg') : 'None',
    };
    
    try {
      const result = await registerUserInFirebase(
        step1Data.email,
        step1Data.password,
        step1Data.name,
        combinedAdditionalData,
        'mechanic'
      );
      if (result.success) {
        const currentTimestamp = Date.now().toString();
        await AsyncStorage.setItem('userRole', 'mechanic');
        await AsyncStorage.setItem('lastActive', currentTimestamp);
        setLoading(false);
        if (onSignUpFinish) {
          onSignUpFinish();
        }
      } else {
        Alert.alert('Signup Failed', result.error);
      }
    } catch (error) {
      setLoading(false);
      console.log("Mechanic Step 2 Crash Block:", error);
    }
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
             <TouchableOpacity onPress={onBack} disabled={loading}>
                <Icon name="arrow-back" size={24} color="#333" />
             </TouchableOpacity>
             <Text style={styles.headerText}>Workshop Details</Text>
          </View>
          <Text style={styles.subText}>Step 2 of 2: Business Information</Text>

          {/* Workshop Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Workshop Name *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="business-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="Enter workshop name"
                 placeholderTextColor="#999"
                 value={workshopName}
                 onChangeText={setWorkshopName}
                 editable={!loading}
               />
            </View>
          </View>

          {/* Workshop Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Workshop Address *</Text>
            <View style={styles.fieldWrapper}>
               <Icon name="location-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={styles.input}
                 placeholder="Enter workshop location"
                 placeholderTextColor="#999"
                 value={workshopAddress}
                 onChangeText={setWorkshopAddress}
                 editable={!loading}
               />
            </View>
          </View>

          {/* Workshop Image Upload */}
          <Text style={styles.inputLabel}>Workshop Picture *</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, workshopPic && { borderColor: '#10B981', borderWidth: 1.5 }]} 
            activeOpacity={0.7}
            onPress={() => handleFilePick('workshop_pic')}
            disabled={loading}
          >
            <Icon 
              name={workshopPic ? "checkmark-circle-outline" : "image-outline"} 
              size={30} 
              color={workshopPic ? '#10B981' : '#64748B'} 
            />
            <Text style={[styles.uploadText, workshopPic && { color: '#10B981', fontWeight: '500' }]}>
              {workshopPic ? `Selected: ${workshopPic.fileName?.substring(0, 20)}...` : "Click to upload workshop photo"}
            </Text>
          </TouchableOpacity>

          {/* Certificates Upload */}
          <Text style={styles.inputLabel}>Professional Certificates (Optional)</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, certificate && { borderColor: '#10B981', borderWidth: 1.5 }]} 
            activeOpacity={0.7}
            onPress={() => handleFilePick('certificate')}
            disabled={loading}
          >
            <Icon 
              name={certificate ? "checkmark-circle-outline" : "document-text-outline"} 
              size={30} 
              color={certificate ? '#10B981' : '#64748B'} 
            />
            <Text style={[styles.uploadText, certificate && { color: '#10B981', fontWeight: '500' }]}>
              {certificate ? `Selected: ${certificate.fileName?.substring(0, 20)}...` : "Upload diplomas or certifications (PDF/JPG)"}
            </Text>
          </TouchableOpacity>

          {/* Specializations (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Specializations (Optional)</Text>
            <View style={[styles.fieldWrapper, { height: 80, alignItems: 'flex-start', paddingTop: 10 }]}>
               <Icon name="star-outline" size={20} color="#64748B" style={styles.fieldIcon} />
               <TextInput
                 style={[styles.input, { textAlignVertical: 'top' }]}
                 placeholder="e.g. Engine Expert, Hybrid Specialist, etc."
                 placeholderTextColor="#999"
                 multiline={true}
                 value={specializations}
                 onChangeText={setSpecializations}
                 editable={!loading}
               />
            </View>
          </View>

          {/* Final Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, loading && { opacity: 0.7 }]} 
            activeOpacity={0.8} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Registration</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInPress} disabled={loading} >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default MechanicSignUpStep2;