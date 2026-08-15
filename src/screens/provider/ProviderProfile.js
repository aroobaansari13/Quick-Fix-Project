import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ProviderProfile.styles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ProviderEditProfileModal from './ProviderEditProfileModal';

const ProviderProfile = ({ navigation, onLogout, providerType = 'mechanic' }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const uid = auth().currentUser?.uid;
  const userEmail = auth().currentUser?.email || 'provider@quickfix.com';

  // Role mapping check to align db parameter formats safely
  const formattedRole = providerType === 'fuelStation' || providerType === 'fuel_station' ? 'fuel_station' : 'mechanic';

  useEffect(() => {
    if (!uid) {
      setFetchingData(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('providers')
      .doc(uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data && data.profilePic) {
            setProfileImage(data.profilePic);
          } else {
            setProfileImage(null);
          }
        } else {
          setProfileImage(null);
        }
        setFetchingData(false);
      }, (error) => {
        console.log("Firestore Fetch Error:", error);
        setFetchingData(false);
      });

    return () => unsubscribe();
  }, [uid]);

  const openBottomSheet = () => {
    setTempImage(null);
    setModalVisible(true);
  };

  const openCamera = () => {
    const options = { mediaType: 'photo', maxHeight: 600, maxWidth: 600, quality: 0.8 };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    const options = { mediaType: 'photo', maxHeight: 600, maxWidth: 600, quality: 0.8 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  const handleDoneUpdate = async () => {
    if (!tempImage || !uid) return;
    setModalVisible(false);
    setUploading(true);

    try {
      const storagePath = `profiles/providers/${uid}_${formattedRole}.jpg`;
      const storageRef = storage().ref(storagePath);
      
      await storageRef.putFile(tempImage);
      const downloadURL = await storageRef.getDownloadURL();

      await firestore().collection('providers').doc(uid).set({
        profilePic: downloadURL,
        providerRole: formattedRole,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      setTempImage(null);
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.log("Upload error details:", error);
      Alert.alert("Upload Failed", "Please verify your selection or Firebase Storage Rules.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setModalVisible(false);
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!uid) return;
            setUploading(true);
            try {
              await firestore().collection('providers').doc(uid).update({
                profilePic: firestore.FieldValue.delete()
              });
              try {
                const storagePath = `profiles/providers/${uid}_${formattedRole}.jpg`;
                await storage().ref(storagePath).delete();
              } catch (e) { console.log("File clean catch"); }
              setProfileImage(null);
            } catch (error) {
              console.log(error);
            } finally {
              setUploading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Do you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await auth().signOut();
              await AsyncStorage.removeItem('userRole');
              await AsyncStorage.removeItem('lastActive');
              if (onLogout) onLogout();
            } catch (error) {
              console.log(error);
            }
          }
        }
      ]
    );
  };

  if (fetchingData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              {uploading ? (
                <View style={styles.placeholderImage}>
                  <ActivityIndicator size="small" color="#1E3A8A" />
                </View>
              ) : profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Icon name="person" size={60} color="#CBD5E1" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.editBadge} 
                activeOpacity={0.8} 
                onPress={openBottomSheet}
                disabled={uploading}
              >
                <Icon name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {formattedRole === 'mechanic' ? 'Mechanic Provider' : 'Fuel Station Provider'}
            </Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.6}
            onPress={() => navigation?.navigate('BusinessDetails', { providerType: formattedRole, returnTab: 'profile' })}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="business-outline" size={22} color="#1E3A8A" />
              <Text style={[styles.menuItemText, { color: '#1E293B' }]}>Business Details</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          {/* 🟢 Settings & Availability (Role isolated + Back navigation fixed to profile) */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.6}
            onPress={() => {
              if (navigation && navigation.navigate) {
                navigation.navigate('AvailabilityScreen', { 
                  providerType: formattedRole,
                  initialTab: 'profile'
                });
              }
            }}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="settings-outline" size={22} color="#1E3A8A" />
              <Text style={[styles.menuItemText, { color: '#1E293B' }]}>Settings & Availability</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
            <View style={styles.menuItemLeft}>
              <Icon name="document-text-outline" size={22} color="#1E3A8A" />
              <Text style={[styles.menuItemText, { color: '#1E293B' }]}>Terms & Policies</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.6} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Icon name="log-out-outline" size={22} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Logout Account</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ProviderEditProfileModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        tempImage={tempImage}
        onCameraPress={openCamera}
        onGalleryPress={openGallery}
        onDonePress={handleDoneUpdate}
        onRemovePress={removePhoto}
      />
    </View>
  );
};

export default ProviderProfile;