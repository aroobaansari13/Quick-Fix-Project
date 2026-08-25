import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './CustomerProfile.styles';
import { COLORS } from '../../config/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CustomerProfile = ({
  onManageProfilePress,
  onTermsAndPoliciesPress,
  onLogout
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const currentUser = auth().currentUser;

  // 1. Fetch user data and saved profile picture from Customers collection
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;
      const uid = currentUser.uid;

  // Cached data foran show karo
  const cachedName = await AsyncStorage.getItem(
    `customerName_${uid}`
  );

  const cachedEmail = await AsyncStorage.getItem(
    `customerEmail_${uid}`
  );

  const cachedProfileImage = await AsyncStorage.getItem(
    `customerProfileImage_${uid}`
  );

  if (cachedName) {
    setUserName(cachedName);
  }

  if (cachedEmail) {
    setUserEmail(cachedEmail);
  }

  if (cachedProfileImage) {
    setProfileImage(cachedProfileImage);
  }

  if (currentUser.email) {
    setUserEmail(currentUser.email);

    await AsyncStorage.setItem(
      `customerEmail_${uid}`,
      currentUser.email
    );
  }

      try {
        const userDoc = await firestore()
          .collection('Customers')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();

          if (data?.name) {
  setUserName(data.name);

  await AsyncStorage.setItem(
    `customerName_${currentUser.uid}`,
    data.name
  );
}

          if (data?.profilePicture) {
  setProfileImage(data.profilePicture);

  await AsyncStorage.setItem(
    `customerProfileImage_${currentUser.uid}`,
    data.profilePicture
  );
} else {
  setProfileImage(null);

  await AsyncStorage.removeItem(
    `customerProfileImage_${currentUser.uid}`
  );
}
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.log("Error fetching profile data:", error);
        setUserName('User');
      }
    };

    fetchProfileData();
  }, [currentUser]);

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
      quality: 0.8,
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
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;

      if (response.assets && response.assets.length > 0) {
        setTempImage(response.assets[0].uri);
      }
    });
  };

  // 2. Upload profile picture to Firebase Storage
  //    and save download URL in Firestore
  const handleDoneUpdate = async () => {
    if (!tempImage || !currentUser) return;

    setUploading(true);

    try {
      const storagePath =
        `profilePictures/Customers/${currentUser.uid}/profile.jpg`;

      console.log(
        'Uploading customer profile picture to:',
        storagePath
      );

      // Firebase Storage reference
      const storageRef = storage().ref(storagePath);

      // Upload local image
      await storageRef.putFile(tempImage);

      // Get Firebase Storage download URL
      const downloadURL = await storageRef.getDownloadURL();

      console.log(
        'Customer profile picture URL:',
        downloadURL
      );

      // Save ONLY the Storage URL in Firestore
      await firestore()
        .collection('Customers')
        .doc(currentUser.uid)
        .set(
          {
            profilePicture: downloadURL,
          },
          { merge: true }
        );

      // Update UI immediately
      setProfileImage(downloadURL);
      await AsyncStorage.setItem(
  `customerProfileImage_${currentUser.uid}`,
  downloadURL
);
      setModalVisible(false);
      setTempImage(null);

      Alert.alert(
        "Success",
        "Profile picture updated successfully!"
      );

    } catch (error) {
      console.log(
        "Error uploading customer profile picture:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // 3. Remove photo from Firebase Storage and Firestore
  const removePhoto = () => {
    setModalVisible(false);

    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",

          onPress: async () => {
            try {
              if (currentUser) {
                const storagePath =
                  `profilePictures/Customers/${currentUser.uid}/profile.jpg`;

                // Delete image from Firebase Storage
                try {
                  await storage()
                    .ref(storagePath)
                    .delete();
                } catch (storageError) {
                  // Image may not exist in Storage
                  console.log(
                    "Storage image delete warning:",
                    storageError
                  );
                }

                // Remove URL from Firestore
                await firestore()
                  .collection('Customers')
                  .doc(currentUser.uid)
                  .set(
                    {
                      profilePicture: '',
                    },
                    { merge: true }
                  );
              }

              setProfileImage(null);
              await AsyncStorage.removeItem(
  `customerProfileImage_${currentUser.uid}`
);

            } catch (error) {
              console.log(
                "Error removing photo:",
                error
              );

              Alert.alert(
                "Error",
                "Failed to remove profile picture."
              );
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
  Alert.alert(
    "Logout",
    "Do you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        style: "destructive",

        onPress: async () => {
  try {
    if (typeof onLogout === 'function') {
      onLogout();
    }

    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('lastActive');

    await auth().signOut();

  } catch (error) {
    console.log('Logout Error:', error);
  }
}
      }
    ]
  );
};

  const MenuItem = ({
    icon,
    title,
    onPress,
    color = '#333'
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Icon
          name={icon}
          size={22}
          color={
            color === '#FF4D4D'
              ? '#FF4D4D'
              : COLORS.primary || '#10B981'
          }
        />

        <Text
          style={[
            styles.menuItemText,
            { color }
          ]}
        >
          {title}
        </Text>
      </View>

      <Icon
        name="chevron-forward"
        size={18}
        color="#CCC"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>

          <View style={styles.profileImageContainer}>

            <TouchableOpacity
  activeOpacity={0.8}
  onPress={openBottomSheet}
  style={styles.imageWrapper}
>
  {profileImage ? (
    <Image
      source={{ uri: profileImage }}
      style={styles.profileImage}
    />
  ) : (
    <View
      style={[
        styles.profileImage,
        {
          backgroundColor: '#E2E8F0',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Icon
        name="person"
        size={60}
        color="#CBD5E1"
      />
    </View>
  )}

  <View style={styles.editBadge}>
    <Icon
      name="camera"
      size={16}
      color="#FFF"
    />
  </View>
</TouchableOpacity>
            <Text style={styles.tapToChangeText}>
              Tap on picture to change
            </Text>

            <Text style={styles.userName}>
              {userName}
            </Text>

            <Text style={styles.userEmail}>
              {userEmail}
            </Text>

          </View>

        </View>

        <View style={styles.menuSection}>

          <MenuItem
            icon="person-outline"
            title="Manage Profile"
            onPress={onManageProfilePress}
          />

          <MenuItem
            icon="document-text-outline"
            title="Terms & Policies"
            onPress={onTermsAndPoliciesPress}
          />

          <View style={styles.separator} />

          <MenuItem
            icon="log-out-outline"
            title="Logout"
            color="#FF4D4D"
            onPress={handleLogout}
          />

        </View>

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >

        <View style={styles.sheetOverlay}>

          <TouchableOpacity
            style={styles.sheetDismissArea}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.sheetContainer}>

            <View style={styles.sheetHandleBAR} />

            <View style={styles.sheetHeaderRow}>

              <View style={styles.sheetHeaderLeft}>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={
                    styles.sheetHeaderClose ||
                    styles.sheetCloseIcon
                  }
                >
                  <Icon
                    name="close"
                    size={24}
                    color="#1E293B"
                  />
                </TouchableOpacity>

                <Text style={styles.sheetTitleText}>
                  Profile picture
                </Text>

              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12
                }}
              >

                {tempImage && (
                  <TouchableOpacity
                    style={styles.doneBtnBlock}
                    onPress={handleDoneUpdate}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator
                        size="small"
                        color="#10B981"
                      />
                    ) : (
                      <Icon
                        name="checkmark-circle"
                        size={26}
                        color="#10B981"
                      />
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.trashBinBtn}
                  onPress={removePhoto}
                >
                  <Icon
                    name="trash-outline"
                    size={22}
                    color="#EF4444"
                  />
                </TouchableOpacity>

              </View>

            </View>

            {tempImage && (
              <View style={styles.previewImageWrapper}>

                <Image
                  source={{ uri: tempImage }}
                  style={styles.previewImageStyle}
                />

                <Text style={styles.previewHintText}>
                  Click the green tick to save changes
                </Text>

              </View>
            )}

            <View style={styles.optionsFlexRow}>

              <TouchableOpacity
                style={styles.optionClickBlock}
                onPress={openCamera}
              >

                <View
                  style={[
                    styles.iconCircleWrapper,
                    { backgroundColor: '#E8F5E9' }
                  ]}
                >
                  <Icon
                    name="camera"
                    size={26}
                    color="#2E7D32"
                  />
                </View>

                <Text style={styles.optionLabelText}>
                  Camera
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionClickBlock}
                onPress={openGallery}
              >

                <View
                  style={[
                    styles.iconCircleWrapper,
                    { backgroundColor: '#E3F2FD' }
                  ]}
                >
                  <Icon
                    name="image"
                    size={26}
                    color="#1565C0"
                  />
                </View>

                <Text style={styles.optionLabelText}>
                  Gallery
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </View>
  );
};

export default CustomerProfile;