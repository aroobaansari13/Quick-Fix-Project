import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { styles } from '../mechanic/MechanicSignUpStep1.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import { launchImageLibrary } from 'react-native-image-picker';
import { checkAndEnableLocation } from '../../../../services/locationService';


const MechanicSignUpStep1 = ({onBack, onNext, onSignInPress }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cnicFront, setCnicFront] = useState(null); 
  const [cnicBack, setCnicBack] = useState(null);
  const [latitude,setLatitude]=useState(null);
  const [longitude,setLongitude]=useState(null);

  const validateName = (value) => {
  return /^[A-Za-z\s.'-]+$/.test(value.trim());
};

const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const validatePhone = (value) => {
  return /^\+92\d{10}$/.test(value.trim());
};

const validateUsername = (value) => {
  return /^[a-zA-Z0-9_]{4,20}$/.test(value.trim());
};

const validatePassword = (value) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);
};

  useEffect(() => {
  Geolocation.getCurrentPosition(
    position => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    },
    error => {
      console.log(error);
      Alert.alert("Location Error", "Unable to get your location.");
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );
  }, []);

  // Function to handle CNIC Selection from Gallery
  const handleCnicPick = async (side) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log(`User cancelled CNIC ${side} picker`);
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const pickedAsset = response.assets[0];
        
        if (side === 'front') {
          setCnicFront(pickedAsset);
        } else if (side === 'back') {
          setCnicBack(pickedAsset);
        }
        Alert.alert("Success", `${side === 'front' ? 'CNIC Front' : 'CNIC Back'} selected!`);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening gallery');
      console.log(error);
    }
  };

  const handleNextStep = () => {
  if (
    !name.trim() ||
    !email.trim() ||
    !address.trim() ||
    !phone.trim() ||
    !username.trim() ||
    !password
  ) {
    Alert.alert(
      "Error",
      "Please fill all compulsory fields!"
    );
    return;
  }

  if (!validateName(name)) {
    Alert.alert(
      "Invalid Name",
      "Full name can only contain letters and spaces."
    );
    return;
  }

  if (name.trim().length < 2) {
    Alert.alert(
      "Invalid Name",
      "Please enter a valid full name."
    );
    return;
  }

  if (!validateEmail(email)) {
    Alert.alert(
      "Invalid Email",
      "Please enter a valid email address."
    );
    return;
  }

  if (address.trim().length < 5) {
    Alert.alert(
      "Invalid Address",
      "Please enter your complete home address."
    );
    return;
  }

  if (!validatePhone(phone)) {
    Alert.alert(
      "Invalid Phone Number",
      "Phone number must be in format +923001234567."
    );
    return;
  }

  if (!validateUsername(username)) {
    Alert.alert(
      "Invalid Username",
      "Username must be 4 to 20 characters and can contain only letters, numbers and underscore."
    );
    return;
  }

  if (!validatePassword(password)) {
    Alert.alert(
      "Weak Password",
      "Password must be at least 6 characters and contain at least one letter and one number."
    );
    return;
  }

  if (!cnicFront || !cnicBack) {
    Alert.alert(
      "Error",
      "Please upload both Front and Back sides of your CNIC!"
    );
    return;
  }

  const step1Data = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    homeAddress: address.trim(),
    phone: phone.trim(),
    username: username.trim().toLowerCase(),
    password: password,
    cnicFront: cnicFront,
    cnicBack: cnicBack,
    latitude,
    longitude,
  };

  if (onNext) {
    onNext(step1Data);
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
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mechanic Registration</Text>
          </View>
          <Text style={styles.subText}>Step 1 of 2: Basic Personal Details</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
  style={styles.input}
  placeholder="Enter your full name"
  placeholderTextColor="#999"
  value={name}
  onChangeText={(text) => {
    const cleaned = text.replace(/[^A-Za-z\s.'-]/g, '');
    setName(cleaned);
  }}
  maxLength={50}
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
  autoCorrect={false}
  value={email}
  onChangeText={setEmail}
  maxLength={100}
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
  maxLength={150}
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
  onChangeText={(text) => {
    let cleaned = text.replace(/[^\d+]/g, '');

    if (cleaned.indexOf('+') > 0) {
      cleaned = cleaned.replace(/\+/g, '');
    }

    if (!cleaned.startsWith('+') && cleaned.length > 0) {
      cleaned = '+' + cleaned.replace(/\+/g, '');
    }

    setPhone(cleaned.slice(0, 13));
  }}
  maxLength={13}
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
  autoCorrect={false}
  value={username}
  onChangeText={(text) => {
    const cleaned = text.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(cleaned);
  }}
  maxLength={20}
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
  maxLength={50}
/>
          </View>

          {/* CNIC Input */}
          <Text style={styles.inputLabel}>Upload CNIC Pictures (Compulsory)</Text>
          <View style={styles.imageUploadRow}>
            {/* Front Side Upload Box */}
            <TouchableOpacity 
              style={[styles.imageUploadBox, cnicFront && { borderColor: '#10B981' }]} 
              activeOpacity={0.7}
              onPress={() => handleCnicPick('front')} // ⚡ Link to logic
            >
              <Icon 
                name={cnicFront ? "checkmark-circle-outline" : "camera-outline"} 
                size={26} 
                color={cnicFront ? '#10B981' : '#64748B'} 
                style={{ marginBottom: 6 }} 
              />
              <Text style={[styles.uploadText, cnicFront && { color: '#10B981' }]}>
                {cnicFront ? "Front Selected" : "CNIC Front Side"}
              </Text>
            </TouchableOpacity>

            {/* Back Side Upload Box */}
            <TouchableOpacity 
              style={[styles.imageUploadBox, cnicBack && { borderColor: '#10B981' }]} 
              activeOpacity={0.7}
              onPress={() => handleCnicPick('back')} // ⚡ Link to logic
            >
              <Icon 
                name={cnicBack ? "checkmark-circle-outline" : "camera-outline"} 
                size={26} 
                color={cnicBack ? '#10B981' : '#64748B'} 
                style={{ marginBottom: 6 }} 
              />
              <Text style={[styles.uploadText, cnicBack && { color: '#10B981' }]}>
                {cnicBack ? "Back Selected" : "CNIC Back Side"}
              </Text>
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