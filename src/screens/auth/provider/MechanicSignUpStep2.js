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
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './MechanicSignUpStep2.styles';

const MechanicSignUpStep2 = ({ onSignUpFinish, onBack, onSignInPress }) => {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopAddress, setWorkshopAddress] = useState('');
  const [specializations, setSpecializations] = useState('');

  const handleSignUp = () => {
    // Validation (Specialization optional hai, baqi sab check karenge)
    // if (!workshopName || !workshopAddress) {
    //   alert("Please fill Workshop Name and Address!");
    //   return;
    // }
    if (onSignUpFinish) onSignUpFinish();
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
             <TouchableOpacity onPress={onBack}>
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
               />
            </View>
          </View>

          {/* Workshop Image Upload */}
          <Text style={styles.inputLabel}>Workshop Picture *</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Icon name="image-outline" size={30} color="#64748B" />
            <Text style={styles.uploadText}>Click to upload workshop photo</Text>
          </TouchableOpacity>

          {/* Certificates Upload */}
          <Text style={styles.inputLabel}>Professional Certificates *</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Icon name="document-text-outline" size={30} color="#64748B" />
            <Text style={styles.uploadText}>Upload diplomas or certifications (PDF/JPG)</Text>
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
               />
            </View>
          </View>

          {/* Final Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.8} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Complete Registration</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInPress}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default MechanicSignUpStep2;