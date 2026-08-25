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
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth'; 
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MechanicSignUpStep2 = ({ step1Data, onSignUpFinish, onBack, onSignInPress }) => {
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
    if (!workshopName.trim() || !workshopAddress.trim()) {
  Alert.alert(
    "Error",
    "Please fill Workshop Name and Address!"
  );
  return;
}

if (workshopName.trim().length < 3) {
  Alert.alert(
    "Invalid Workshop Name",
    "Workshop name must be at least 3 characters."
  );
  return;
}

if (workshopAddress.trim().length < 5) {
  Alert.alert(
    "Invalid Address",
    "Please enter a complete workshop address."
  );
  return;
}
    if (!workshopPic) {
      Alert.alert("Error", "Please upload your Workshop Picture!");
      return;
    }
    if (!certificate) {
  Alert.alert(
    "Error",
    "Please upload your Professional Certificate!"
  );
  return;
}
    if (!step1Data) {
      Alert.alert("Error", "Basic details missing. Please go back to Step 1.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create User Account in Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        step1Data.email.trim().toLowerCase(),
        step1Data.password
      );
      const uid = userCredential.user.uid; 

      await firestore().collection('Mechanics').doc(uid).set({
        uid: uid,
        name: step1Data.name || 'Unknown Provider',
        email: step1Data.email.trim().toLowerCase(),
        password: step1Data.password,
        phone: step1Data.phone || 'N/A',
        username: step1Data.username || '',
        role: 'mechanic',
        status: 'pending', 
        createdAt: firestore.FieldValue.serverTimestamp(),
        cnicFrontUrl: step1Data.cnicFront?.uri || '',
        cnicBackUrl: step1Data.cnicBack?.uri || '',
        documentUrl: step1Data.documentUrl || certificate?.uri || '',
        shopDetails: {
          shopName: workshopName.trim(),
          address: workshopAddress.trim(),
          specializations: specializations.trim() || 'General Mechanic',
          workshopPicUrl: workshopPic?.uri || '',
          latitude: step1Data.latitude || 0,
          longitude: step1Data.longitude || 0
        }
      });

      await auth().signOut();
      await AsyncStorage.setItem('userRole', 'pendingReview');
      await AsyncStorage.setItem('lastActive', Date.now().toString());
      setLoading(false);
      Alert.alert(
        "Application Submitted", 
        "Your registration request has been successfully sent to the Admin for approval. You can log in once approved.",
        [
          { 
            text: "OK", 
            onPress: () => {
              if (onSignUpFinish) {
                onSignUpFinish(); 
              }
            } 
          }
        ]
      );

    } catch (error) {
      setLoading(false);
      console.log("Mechanic Step 2 Status Flag Crash Block:", error);
      Alert.alert("Submission Failed", error.message);
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
  onChangeText={(text) => {
    const cleaned = text.replace(/[^A-Za-z0-9\s.&'-]/g, '');
    setWorkshopName(cleaned);
  }}
  maxLength={60}
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
                 maxLength={150}
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
          <Text style={styles.inputLabel}>Professional Certificates*</Text>
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
              {certificate ? `Selected: ${certificate.fileName?.substring(0, 20)}...` : "Upload diplomas or certifications"}
            </Text>
          </TouchableOpacity>

          {/* Specializations */}
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
  onChangeText={(text) => {
    const cleaned = text.replace(/[^A-Za-z0-9\s,./&()-]/g, '');
    setSpecializations(cleaned);
  }}
  maxLength={150}
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