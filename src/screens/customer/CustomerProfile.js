import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './CustomerProfile.styles';
import { COLORS } from '../../config/theme';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CustomerProfile = ({ onManageProfilePress, onTermsAndPoliciesPress, onLogout, profileImage, onImageUpdate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const openBottomSheet = () => {
    setTempImage(null);
    setModalVisible(true);
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 600,
      maxWidth: 600,
      quality: 1,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 600,
      maxWidth: 600,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  const handleDoneUpdate = () => {
    if (tempImage) {
      if (onImageUpdate) onImageUpdate(tempImage);
      setModalVisible(false);
      setTempImage(null);
      setTimeout(() => Alert.alert("Success", "Profile picture updated successfully!"), 500);
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
          onPress: () => {
            if (onImageUpdate) {
              onImageUpdate('https://via.placeholder.com/150'); 
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth().signOut();
            await AsyncStorage.clear();
            if (onLogout) onLogout();
          } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Error", "Logout failed. Please try again.");
          }
        }
      }
    ]);
  };

  const MenuItem = ({ icon, title, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={22} color={color === '#FF4D4D' ? '#FF4D4D' : COLORS.primary || '#10B981'} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={openBottomSheet}
              style={styles.imageWrapper}
            >
              <Image 
                source={{ uri: profileImage || 'https://via.placeholder.com/150' }} 
                style={styles.profileImage} 
              />
              <View style={styles.editBadge}>
                <Icon name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.tapToChangeText}>Tap on picture to change</Text>
            <Text style={styles.userName}>Arooba</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem 
            icon="person-outline" 
            title="Manage Profile" 
            onPress={onManageProfilePress} 
          />
          <MenuItem icon="settings-outline" title="Account Settings" onPress={() => {}} />
          <MenuItem 
            icon="document-text-outline" 
            title="Terms & Policies" 
            onPress={onTermsAndPoliciesPress} 
          />
          <View style={styles.separator} />
          <MenuItem icon="log-out-outline" title="Logout" color="#FF4D4D" onPress={handleLogout} />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetDismissArea} activeOpacity={1} onPress={() => setModalVisible(false)} />
          
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandleBAR} />
            
            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetHeaderLeft}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.sheetCloseIcon}>
                  <Icon name="close" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.sheetTitleText}>Profile picture</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {tempImage && (
                  <TouchableOpacity style={styles.doneBtnBlock} onPress={handleDoneUpdate}>
                    <Icon name="checkmark-circle" size={26} color="#10B981" /> 
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.trashBinBtn} onPress={removePhoto}>
                  <Icon name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {tempImage && (
              <View style={styles.previewImageWrapper}>
                <Image source={{ uri: tempImage }} style={styles.previewImageStyle} />
                <Text style={styles.previewHintText}>Click the green tick to save changes</Text>
              </View>
            )}

            <View style={styles.optionsFlexRow}>
              <TouchableOpacity style={styles.optionClickBlock} onPress={openCamera}>
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#E8F5E9' }]}>
                  <Icon name="camera" size={26} color="#2E7D32" />
                </View>
                <Text style={styles.optionLabelText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionClickBlock} onPress={openGallery}>
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#E3F2FD' }]}>
                  <Icon name="image" size={26} color="#1565C0" />
                </View>
                <Text style={styles.optionLabelText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerProfile;