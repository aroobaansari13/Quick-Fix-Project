import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  ScrollView, 
  Modal,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { styles } from './CustomerEditProfile.styles';
import { COLORS } from '../../config/theme';

const CustomerEditProfile = ({ currentImage, onBack, onImageUpdate }) => {
  const [profileImage, setProfileImage] = useState(currentImage);
  const [tempImage, setTempImage] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  // 🟢 Android Camera Permission Request Function
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "QuickFix app needs access to your camera to take a profile picture.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // 🟢 Real Gallery Option Trigger
  const handleChooseFromGallery = () => {
    const options = { 
      mediaType: 'photo', 
      quality: 0.8,
      includeBase64: false 
    };
    
    launchImageLibrary(options, (response) => {
      setModalVisible(false); // Bottom sheet ko band karein
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Could not open Gallery');
      } else if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri); // Chuni hui picture state me save karein
        setIsEditing(true); // Tick icon dikhane ke liye
      }
    });
  };

  // 🟢 Real Camera Option Trigger
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required to click photos.");
      return;
    }

    const options = { 
      mediaType: 'photo', 
      quality: 0.8,
      saveToPhotos: true // Image mobile me save bhi hogi
    };

    launchCamera(options, (response) => {
      setModalVisible(false); // Bottom sheet ko band karein
      
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Could not open Camera');
      } else if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri); // Clicked picture state me save karein
        setIsEditing(true); // Tick icon dikhane ke liye
      }
    });
  };

  // Delete Action
  const handleDeletePhoto = () => {
    setModalVisible(false);
    setTempImage('https://via.placeholder.com/150'); // Default placeholder layout
    setIsEditing(true);
  };

  // Done (Tick) Button pressed: Save image globally
  const handleSavePhoto = () => {
    const finalImage = tempImage || profileImage;
    
    Alert.alert("Success", "Profile picture updated successfully!", [
      {
        text: "OK",
        onPress: () => {
          onImageUpdate(finalImage); // App.js ki state update karega aur wapas le jayega
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          
          {/* Header Row */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <TouchableOpacity onPress={onBack} style={styles.backArrowBtn}>
                <Icon name="arrow-back" size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.cardTitleText}>Edit Profile</Text>
            </View>
            
            {/* Show Tick dynamic checker when editing is active */}
            {isEditing && (
              <TouchableOpacity onPress={handleSavePhoto} style={styles.saveTickBtn} activeOpacity={0.7}>
                <Icon name="checkmark-circle-outline" size={32} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Interactive Frame Wrapper */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageTouchArea} 
              activeOpacity={0.9}
              onPress={() => setModalVisible(true)}
            >
              <Image 
                source={{ uri: tempImage || profileImage }} 
                style={styles.profileImage} 
              />
              <View style={styles.cameraBadge}>
                <Icon name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.hintText}>Tap on picture to change</Text>
          </View>
        </View>
      </ScrollView>

      {/* WhatsApp Style Bottom Selection Sheet */}
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
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.sheetTitleText}>Profile picture</Text>
              </View>
              
              <TouchableOpacity onPress={handleDeletePhoto} style={styles.trashBinBtn} activeOpacity={0.7}>
                <Icon name="trash-outline" size={22} color="#FF4D4D" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsFlexRow}>
              {/* Camera Icon Wrapper */}
              <TouchableOpacity style={styles.optionClickBlock} onPress={handleTakePhoto} activeOpacity={0.7}>
                <View style={styles.iconCircleWrapper}>
                  <Icon name="camera" size={26} color={COLORS.primary} />
                </View>
                <Text style={styles.optionLabelText}>Camera</Text>
              </TouchableOpacity>

              {/* Gallery Icon Wrapper */}
              <TouchableOpacity style={styles.optionClickBlock} onPress={handleChooseFromGallery} activeOpacity={0.7}>
                <View style={styles.iconCircleWrapper}>
                  <Icon name="images" size={26} color={COLORS.primary} />
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

export default CustomerEditProfile;