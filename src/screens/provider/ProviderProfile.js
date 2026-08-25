import React, { useState, useEffect } from 'react';
import {  View,  Text,  TouchableOpacity,  Image,  StatusBar,  ScrollView,  Alert,  ActivityIndicator,} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ProviderProfile.styles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  launchCamera,  launchImageLibrary,} from 'react-native-image-picker';
import ProviderEditProfileModal from './ProviderEditProfileModal';

const ProviderProfile = ({
  navigation,
  providerType,
  collectionName,
  onLogout,
}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;


  // ============================================================
  // 1. DETERMINE PROVIDER COLLECTION
  // ============================================================

  const getProviderCollection = () => {

    // First priority: explicitly passed collection
    if (
      collectionName === 'Mechanics' ||
      collectionName === 'FuelStations'
    ) {
      return collectionName;
    }

    // Second priority: providerType
    const type = String(providerType || '').toLowerCase();

    if (
      type.includes('fuel') ||
      type.includes('station')
    ) {
      return 'FuelStations';
    }

    if (type.includes('mechanic')) {
      return 'Mechanics';
    }

    // IMPORTANT:
    // Do NOT silently default to Mechanics.
    return null;
  };


  const activeCollection = getProviderCollection();


  // ============================================================
  // DEBUG
  // ============================================================

  useEffect(() => {

    console.log('=================================');
    console.log('Provider Profile');
    console.log('Provider Type:', providerType);
    console.log('Passed Collection:', collectionName);
    console.log('Selected Collection:', activeCollection);
    console.log('Provider UID:', uid);
    console.log('=================================');

  }, [
    providerType,
    collectionName,
    activeCollection,
    uid,
  ]);


  // ============================================================
  // 2. LOAD PROVIDER PROFILE
  // ============================================================

  useEffect(() => {

    let unsubscribe = null;

    const loadProfile = async () => {

      if (!uid) {
        console.log('No authenticated user found.');
        setLoadingProfile(false);
        return;
      }

      // Cached profile picture foran show karo
const cachedProfileImage = await AsyncStorage.getItem(
  `providerProfileImage_${uid}`
);

if (cachedProfileImage) {
  setProfileImage(cachedProfileImage);
}

// Cached name aur email foran show karo
const cachedProviderName = await AsyncStorage.getItem(
  `providerName_${uid}`
);

const cachedProviderEmail = await AsyncStorage.getItem(
  `providerEmail_${uid}`
);

if (cachedProviderName) {
  setUserName(cachedProviderName);
}

if (cachedProviderEmail) {
  setUserEmail(cachedProviderEmail);
}

      if (!activeCollection) {

        console.log(
          'ERROR: Could not determine provider collection.'
        );

        Alert.alert(
          'Error',
          'Provider type could not be determined.'
        );

        setLoadingProfile(false);
        return;
      }


      if (currentUser?.email) {
  setUserEmail(currentUser.email);

  await AsyncStorage.setItem(
    `providerEmail_${uid}`,
    currentUser.email
  );
}


      try {

        // IMPORTANT:
        // Read ONLY the existing UID document.
        const providerRef = firestore()
          .collection(activeCollection)
          .doc(uid);


        const providerDoc = await providerRef.get();


        if (providerDoc.exists) {

          const data = providerDoc.data() || {};

          console.log(
            `Provider data from ${activeCollection}:`,
            data
          );


          const providerName =
  data.name ||
  currentUser?.displayName ||
  'Provider';

setUserName(providerName);

await AsyncStorage.setItem(
  `providerName_${uid}`,
  providerName
);


          /*
           * profilePic contains Firebase Storage download URL.
           *
           * Do NOT use cnicFrontUrl or documentUrl here.
           */
          if (
  data.profilePic &&
  typeof data.profilePic === 'string'
) {

  setProfileImage(data.profilePic);

  await AsyncStorage.setItem(
    `providerProfileImage_${uid}`,
    data.profilePic
  );

} else {

  setProfileImage(null);

  await AsyncStorage.removeItem(
    `providerProfileImage_${uid}`
  );

}

        } else {

          console.log(
            `No provider document found at ${activeCollection}/${uid}`
          );

          setUserName(
            currentUser?.displayName || 'Provider'
          );

          setProfileImage(null);
        }

      } catch (error) {

        console.log(
          'Error loading provider profile:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to load profile information.'
        );

      } finally {

        setLoadingProfile(false);

      }
    };


    loadProfile();


    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, [
    uid,
    activeCollection,
    currentUser?.email,
    currentUser?.displayName,
  ]);


  // ============================================================
  // 3. OPEN IMAGE MODAL
  // ============================================================

  const openBottomSheet = () => {

    setTempImage(null);
    setModalVisible(true);

  };


  // ============================================================
  // 4. CAMERA
  // ============================================================

  const openCamera = () => {

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 0.8,
    };


    launchCamera(options, (response) => {

      if (response.didCancel) {
        return;
      }


      if (response.errorCode) {

        console.log(
          'Camera Error:',
          response.errorMessage
        );

        Alert.alert(
          'Camera Error',
          response.errorMessage ||
          'Unable to open camera.'
        );

        return;
      }


      if (
        response.assets &&
        response.assets.length > 0
      ) {

        const uri = response.assets[0]?.uri;

        if (uri) {
          setTempImage(uri);
        }

      }

    });

  };


  // ============================================================
  // 5. GALLERY
  // ============================================================

  const openGallery = () => {

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 0.8,
    };


    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        return;
      }


      if (response.errorCode) {

        console.log(
          'Gallery Error:',
          response.errorMessage
        );

        Alert.alert(
          'Gallery Error',
          response.errorMessage ||
          'Unable to open gallery.'
        );

        return;
      }


      if (
        response.assets &&
        response.assets.length > 0
      ) {

        const uri = response.assets[0]?.uri;

        if (uri) {
          setTempImage(uri);
        }

      }

    });

  };


  // ============================================================
  // 6. UPLOAD IMAGE TO FIREBASE STORAGE
  // ============================================================

  const uploadProfileImage = async (imageUri) => {

    if (!uid) {
      throw new Error('User is not logged in.');
    }


    if (!activeCollection) {
      throw new Error(
        'Provider collection could not be determined.'
      );
    }


    if (!imageUri) {
      throw new Error('No image selected.');
    }


    /*
     * Storage path:
     *
     * profilePictures/
     *     Mechanics/
     *         UID/
     *             profile.jpg
     *
     * OR
     *
     * profilePictures/
     *     FuelStations/
     *         UID/
     *             profile.jpg
     */


    const storagePath =
      `profilePictures/${activeCollection}/${uid}/profile.jpg`;


    console.log(
      'Uploading profile picture to:',
      storagePath
    );


    const storageRef =
      storage().ref(storagePath);


    // Upload local image to Firebase Storage
    await storageRef.putFile(imageUri);


    // Get permanent download URL
    const downloadURL =
      await storageRef.getDownloadURL();


    console.log(
      'Profile picture download URL:',
      downloadURL
    );


    return downloadURL;
  };


  // ============================================================
  // 7. SAVE PROFILE PICTURE
  // ============================================================

  const handleDoneUpdate = async () => {

    if (!uid) {

      Alert.alert(
        'Error',
        'User account not found. Please login again.'
      );

      return;
    }


    if (!activeCollection) {

      Alert.alert(
        'Error',
        'Provider type could not be determined.'
      );

      return;
    }


    if (!tempImage) {

      Alert.alert(
        'Info',
        'Please select a profile picture first.'
      );

      return;
    }


    setUploading(true);


    try {

      console.log(
        '================================='
      );

      console.log(
        'Saving Profile Picture'
      );

      console.log(
        'Collection:',
        activeCollection
      );

      console.log(
        'UID:',
        uid
      );

      console.log(
        '================================='
      );


      // --------------------------------------------------------
      // STEP 1: Make sure provider document already exists
      // --------------------------------------------------------

      const providerRef = firestore()
        .collection(activeCollection)
        .doc(uid);


      const providerDoc =
        await providerRef.get();


      if (!providerDoc.exists) {

        Alert.alert(
          'Error',
          `Provider record does not exist in ${activeCollection}.`
        );

        setUploading(false);

        return;
      }


      // --------------------------------------------------------
      // STEP 2: Upload image to Firebase Storage
      // --------------------------------------------------------

      const downloadURL =
        await uploadProfileImage(tempImage);


      // --------------------------------------------------------
      // STEP 3: Save Storage URL to SAME provider document
      // --------------------------------------------------------

      await providerRef.update({

        profilePic: downloadURL,

        updatedAt:
          firestore.FieldValue.serverTimestamp(),

      });


      // --------------------------------------------------------
      // STEP 4: Update UI
      // --------------------------------------------------------

      setProfileImage(downloadURL);

      await AsyncStorage.setItem(
  `providerProfileImage_${uid}`,
  downloadURL
);

      setTempImage(null);

      setModalVisible(false);


      Alert.alert(
        'Success',
        'Profile picture updated successfully!'
      );


    } catch (error) {

      console.log(
        'Profile Picture Upload Error:',
        error
      );


      Alert.alert(
        'Error',
        error.message ||
        'Failed to update profile picture.'
      );


    } finally {

      setUploading(false);

    }

  };


  // ============================================================
  // 8. REMOVE PROFILE PICTURE
  // ============================================================

  const removePhoto = () => {

    setModalVisible(false);


    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {

          text: 'Remove',
          style: 'destructive',

          onPress: async () => {

            if (!uid || !activeCollection) {

              Alert.alert(
                'Error',
                'Provider information not available.'
              );

              return;
            }


            setUploading(true);


            try {

              const providerRef =
                firestore()
                  .collection(activeCollection)
                  .doc(uid);


              const providerDoc =
                await providerRef.get();


              if (!providerDoc.exists) {

                throw new Error(
                  'Provider record does not exist.'
                );

              }


              const data =
                providerDoc.data() || {};


              /*
               * Delete image from Storage.
               *
               * We know the exact path because every profile
               * picture is stored using the same structure.
               */

              const storagePath =
                `profilePictures/${activeCollection}/${uid}/profile.jpg`;


              try {

                await storage()
                  .ref(storagePath)
                  .delete();

                console.log(
                  'Profile image deleted from Storage.'
                );

              } catch (storageError) {

                /*
                 * If the file does not exist, don't stop the
                 * Firestore cleanup.
                 */

                console.log(
                  'Storage delete notice:',
                  storageError
                );

              }


              // Remove profilePic from Firestore
              await providerRef.update({

                profilePic:
                  firestore.FieldValue.delete(),

                updatedAt:
                  firestore.FieldValue.serverTimestamp(),

              });


              setProfileImage(null);

              await AsyncStorage.removeItem(
  `providerProfileImage_${uid}`
);


              Alert.alert(
                'Success',
                'Profile picture removed successfully!'
              );


            } catch (error) {

              console.log(
                'Remove Profile Picture Error:',
                error
              );


              Alert.alert(
                'Error',
                error.message ||
                'Could not remove profile picture.'
              );


            } finally {

              setUploading(false);

            }

          },

        },

      ]
    );

  };


  // ============================================================
  // 9. LOGOUT
  // ============================================================

  const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Do you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',

        onPress: async () => {
          try {
            // 1. Pehle Sign In screen show karo
            if (typeof onLogout === 'function') {
              onLogout();
            }

            // 2. Sirf session data remove karo
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('lastActive');

            // 3. Firebase logout
            await auth().signOut();

          } catch (error) {
            console.log('Logout Error:', error);
          }
        },
      },
    ]
  );
};

  return (

    <View style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />


      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <View style={styles.header}>

          <View style={styles.profileImageContainer}>

            <View style={styles.imageWrapper}>

              {uploading ? (

                <View style={styles.placeholderImage}>

                  <ActivityIndicator
                    size="small"
                    color="#1E3A8A"
                  />

                </View>

              ) : profileImage ? (

                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.profileImage}
                />

              ) : (

                <View style={styles.placeholderImage}>

                  <Icon
                    name="person"
                    size={60}
                    color="#CBD5E1"
                  />

                </View>

              )}


              {/* CAMERA BUTTON */}

              <TouchableOpacity
                style={styles.editBadge}
                activeOpacity={0.8}
                onPress={openBottomSheet}
                disabled={uploading}
              >

                <Icon
                  name="camera"
                  size={16}
                  color="#FFFFFF"
                />

              </TouchableOpacity>

            </View>


            <Text style={styles.userName}>
              {userName}
            </Text>


            <Text style={styles.userEmail}>
              {userEmail}
            </Text>

          </View>

        </View>


        {/* =====================================================
            MENU
        ====================================================== */}

        <View style={styles.menuSection}>


          {/* BUSINESS DETAILS */}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => {

              if (!activeCollection) {

                Alert.alert(
                  'Error',
                  'Provider collection could not be determined.'
                );

                return;
              }


              navigation?.navigate(
                'BusinessDetails',
                {
                  providerType:
                    providerType,

                  collectionName:
                    activeCollection,

                  returnTab:
                    'profile',
                }
              );

            }}
          >

            <View style={styles.menuItemLeft}>

              <Icon
                name="business-outline"
                size={22}
                color="#1E3A8A"
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: '#1E293B',
                  },
                ]}
              >
                Manage Profile
              </Text>

            </View>


            <Icon
              name="chevron-forward"
              size={18}
              color="#CBD5E1"
            />

          </TouchableOpacity>


          {/* =================================================
              AVAILABILITY
          ================================================== */}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => {

              if (!activeCollection) {

                Alert.alert(
                  'Error',
                  'Provider collection could not be determined.'
                );

                return;
              }


              navigation?.navigate(
                'AvailabilityScreen',
                {
                  providerType:
                    providerType,

                  collectionName:
                    activeCollection,

                  initialTab:
                    'profile',
                }
              );

            }}
          >

            <View style={styles.menuItemLeft}>

              <Icon
                name="settings-outline"
                size={22}
                color="#1E3A8A"
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: '#1E293B',
                  },
                ]}
              >
                Availability
              </Text>

            </View>


            <Icon
              name="chevron-forward"
              size={18}
              color="#CBD5E1"
            />

          </TouchableOpacity>

          {/* =================================================
    FEEDBACKS
================================================== */}

<TouchableOpacity
  style={styles.menuItem}
  activeOpacity={0.6}
  onPress={() => {

    if (!activeCollection) {

      Alert.alert(
        'Error',
        'Provider collection could not be determined.'
      );

      return;
    }

    navigation?.navigate(
      'ProviderFeedbacks',
      {
        providerType: providerType,
        collectionName: activeCollection,
        initialTab: 'profile',
      }
    );

  }}
>

  <View style={styles.menuItemLeft}>

    <Icon
      name="chatbubble-ellipses-outline"
      size={22}
      color="#1E3A8A"
    />

    <Text
      style={[
        styles.menuItemText,
        {
          color: '#1E293B',
        },
      ]}
    >
      Customer Feedbacks
    </Text>

  </View>


  <Icon
    name="chevron-forward"
    size={18}
    color="#CBD5E1"
  />

</TouchableOpacity>


          {/* =================================================
              TERMS & POLICIES
          ================================================== */}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => {

              navigation?.navigate(
                'TermsAndPolicies',
                {
                  providerType:
                    providerType,

                  collectionName:
                    activeCollection,

                  initialTab:
                    'profile',
                }
              );

            }}
          >

            <View style={styles.menuItemLeft}>

              <Icon
                name="document-text-outline"
                size={22}
                color="#1E3A8A"
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: '#1E293B',
                  },
                ]}
              >
                Terms & Policies
              </Text>

            </View>


            <Icon
              name="chevron-forward"
              size={18}
              color="#CBD5E1"
            />

          </TouchableOpacity>


          {/* SEPARATOR */}

          <View style={styles.separator} />


          {/* LOGOUT */}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={handleLogout}
          >

            <View style={styles.menuItemLeft}>

              <Icon
                name="log-out-outline"
                size={22}
                color="#EF4444"
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: '#EF4444',
                  },
                ]}
              >
                Logout Account
              </Text>

            </View>


            <Icon
              name="chevron-forward"
              size={18}
              color="#CBD5E1"
            />

          </TouchableOpacity>


        </View>

      </ScrollView>


      {/* =======================================================
          IMAGE EDIT MODAL
      ======================================================== */}

      <ProviderEditProfileModal

        visible={modalVisible}

        onClose={() => {

          if (!uploading) {
            setModalVisible(false);
          }

        }}

        tempImage={tempImage}

        uploading={uploading}

        onCameraPress={openCamera}

        onGalleryPress={openGallery}

        onDonePress={handleDoneUpdate}

        onRemovePress={removePhoto}

      />

    </View>

  );

};


export default ProviderProfile;