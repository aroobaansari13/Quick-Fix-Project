import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
  Modal, 
  Dimensions
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './AdminPendingApplications.styles';

const { width, height } = Dimensions.get('window');
const AdminPendingApplications = ({ onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState('');

  useEffect(() => {
    const subscriber = firestore()
      .collection('PendingApplications')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const appsList = [];
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            appsList.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
        }
        setApplications(appsList);
        setLoading(false);
      }, error => {
        console.log("Admin Firestore Fetch Error: ", error);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const openImageFull = (uri) => {
    if (uri && !uri.includes('via.placeholder.com')) {
      setCurrentImageUri(uri);
      setModalVisible(true);
    } else {
      Alert.alert("Info", "This is a placeholder or no image available.");
    }
  };

  const handleApprove = async (appId, appData) => {
    Alert.alert(
      "Confirm Approval",
      `Are you sure you want to approve ${appData.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: async () => {
            try {
              const targetCollection = appData.role === 'mechanic' ? 'Mechanics' : 'FuelStations';
              
              await firestore()
                .collection(targetCollection)
                .doc(appId)
                .set({
                  ...appData,
                  approvedAt: firestore.FieldValue.serverTimestamp(),
                  isVerified: true
                });

              await firestore().collection('PendingApplications').doc(appId).delete();
              setSelectedApp(null);
              Alert.alert("Success", "Application Approved!");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  const handleReject = (appId) => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this application?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject", 
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('PendingApplications').doc(appId).delete();
              setSelectedApp(null);
              Alert.alert("Rejected", "Application has been removed.");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading Applications...</Text>
      </View>
    );
  }

  // VIEW 1: DETAILED REVIEW SCREEN
  if (selectedApp) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSelectedApp(null)} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Review Application</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/*  STEP 1: Personal Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}><Icon name="person-outline" size={18} /> Step 1: Personal Details</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Full Name:</Text> {selectedApp.name}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Email Address:</Text> {selectedApp.email}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Home Address:</Text> {selectedApp.homeAddress || selectedApp.address }</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Phone Number:</Text> {selectedApp.phone}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Username:</Text> {selectedApp.username || 'N/A'}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Password:</Text> {selectedApp.password || '******'}</Text>
            
            {/* CNIC Images Form View - Made Clickable */}
            <Text style={[styles.boldLabel, { marginTop: 15, marginBottom: 2 }]}>CNIC Documents (Tap to Zoom):</Text>
            <View style={styles.imageGrid}>
              <TouchableOpacity 
                style={styles.imgWrapper} 
                onPress={() => openImageFull(selectedApp.cnicFrontUrl || selectedApp.documentUrl)}
              >
                <Text style={styles.imgLabel}>CNIC Front</Text>
                <Image 
                  source={{ uri: selectedApp.cnicFrontUrl || selectedApp.documentUrl || 'https://via.placeholder.com/150?text=CNIC+Front' }} 
                  style={styles.documentImage} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imgWrapper} 
                onPress={() => openImageFull(selectedApp.cnicBackUrl)}
              >
                <Text style={styles.imgLabel}>CNIC Back</Text>
                <Image 
                  source={{ uri: selectedApp.cnicBackUrl || 'https://via.placeholder.com/150?text=CNIC+Back' }} 
                  style={styles.documentImage} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/*  STEP 2: Business Information */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}><Icon name="business-outline" size={18} /> Step 2: Workshop Details</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Workshop Name:</Text> {selectedApp.shopDetails?.shopName || 'N/A'}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Workshop Address:</Text> {selectedApp.shopDetails?.address || 'N/A'}</Text>
            <Text style={styles.infoText}><Text style={styles.boldLabel}>Specializations:</Text> {selectedApp.shopDetails?.specializations || 'N/A'}</Text>
            
            {/* Workshop & Certificate Pictures - Made Clickable */}
            <Text style={[styles.boldLabel, { marginTop: 15, marginBottom: 4 }]}>Workshop Picture (Tap to Zoom):</Text>
            <TouchableOpacity onPress={() => openImageFull(selectedApp.profilePicture)}>
              <Image 
                source={{ uri: selectedApp.profilePicture || 'https://via.placeholder.com/300x150?text=No+Workshop+Pic' }} 
                style={styles.largeDocumentImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>

            <Text style={[styles.boldLabel, { marginTop: 15, marginBottom: 4 }]}>Professional Certificates (Tap to Zoom):</Text>
            <TouchableOpacity onPress={() => openImageFull(selectedApp.documentUrl)}>
              <Image 
                source={{ uri: selectedApp.documentUrl || 'https://via.placeholder.com/300x150?text=No+Certificate+Uploaded' }} 
                style={styles.largeDocumentImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(selectedApp.id)}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(selectedApp.id, selectedApp)}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* FULL SCREEN IMAGE MODAL LAYER */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
          animationType="fade"
        >
          <View style={styles.modalBackground}>
            {/* Close Button on top right */}
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Icon name="close-circle" size={40} color="#FFFFFF" />
            </TouchableOpacity>
            
            {/* Full Screen Rendered Image */}
            <Image 
              source={{ uri: currentImageUri }} 
              style={styles.fullScreenImage} 
              resizeMode="contain" 
            />
          </View>
        </Modal>

      </View>
    );
  }

  //  VIEW 2: MINIMAL LIST VIEW
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Pending Applications ({applications.length})</Text>
      </View>
      
      {applications.length === 0 ? (
        <View style={styles.center}>
          <Icon name="checkmark-done-circle-outline" size={60} color="#10B981" />
          <Text style={styles.noDataText}>No pending requests found.</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.providerName}>{item.name}</Text>
                <Text style={styles.providerEmail}>{item.email}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.viewDetailsBtn} 
                activeOpacity={0.7} 
                onPress={() => setSelectedApp(item)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Icon name="eye-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AdminPendingApplications;