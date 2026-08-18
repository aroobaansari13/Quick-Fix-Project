import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { styles } from './CustomerOrders.styles';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS } from '../../config/theme'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ServiceRequestService } from '../../services/ServiceRequestService';
import CustomerOrderCard from '../../components/CustomerOrderCard';
import TrackingMap from './TrackingMap';
import FeedbackModal from '../../components/FeedbackModal';

const CustomerOrders = () => {
 
  const [activeTab, setActiveTab] = useState('active');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingRequest, setTrackingRequest] = useState(null); 
  const [completedRequestForFeedback, setCompletedRequestForFeedback] = useState(null);

  const activeRequests = requests.filter(
    item => item.status !== 'rejected'
  );

  const handleCloseOrSubmit = async (requestId) => {
    // Modal band karein
    setCompletedRequestForFeedback(null);
    
    // Firebase mein flag true kar dein taake dobara na aaye
    try {
      await firestore().collection('ServiceRequests').doc(requestId).update({
        feedbackShown: true
      });
    } catch (error) {
      console.error("Error updating feedbackShown:", error);
    }
  };

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
    setLoading(false);
    return;
    }

    const unsubscribe = ServiceRequestService.subscribeCustomerRequests(
      currentUser.uid,
      (customerRequests) => {
        console.log('Customer Requests:', customerRequests);

        setRequests(customerRequests);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
  .collection('ServiceRequests')
  .where('customerId', '==', currentUser.uid)
  .where('status', '==', 'completed')
  .onSnapshot(snapshot => {
    console.log('Completed snapshot size:', snapshot.size); 
    console.log('Docs:', snapshot.docs.map(d => d.data()));
    if (!snapshot.empty) {
      // ✅ feedbackShown check code mein karo — Firebase index ki zaroorat nahi
      const unshownDoc = snapshot.docs.find(
        doc => doc.data().feedbackShown !== true
      );
      if (unshownDoc) {
        setCompletedRequestForFeedback({ 
          id: unshownDoc.id, 
          ...unshownDoc.data() 
        });
      } else {
        setCompletedRequestForFeedback(null);
      }
    } else {
      setCompletedRequestForFeedback(null);
    }
  });
    return () => unsubscribe();
  }, []);
  
  return (
  <View style={styles.container}>

    <StatusBar
      barStyle="dark-content"
      backgroundColor="#FFFFFF"
    />

    <FeedbackModal 
      visible={!!completedRequestForFeedback} 
      requestData={completedRequestForFeedback} 
      onClose={() => handleCloseOrSubmit(completedRequestForFeedback?.id)}
    />

    {/* ✅ TrackingMap puri screen par — ScrollView se bahar */}
    {trackingRequest ? (
      <TrackingMap
        request={trackingRequest}
        onBack={() => setTrackingRequest(null)}
      />
    ) : (
      <>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            My Orders
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'active' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && styles.activeTabText
              ]}
            >
              Active Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'history' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.activeTabText
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.emptySubtitle}>
              Loading orders...
            </Text>
          </View>

        ) : activeTab === 'active' ? (
          activeRequests.length === 0 ? (
            <View style={styles.contentContainer}>
              <View style={styles.emptyIconContainer}>
                <Icon name="reader-outline" size={50} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Active Orders</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any current ongoing service request.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ordersList}
            >
              {activeRequests.map(item => (
                <CustomerOrderCard
                  key={item.id}
                  item={item}
                  onTrack={(request) => setTrackingRequest(request)}
                />
              ))}
            </ScrollView>
          )

        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.emptyIconContainer}>
              <Icon name="reader-outline" size={50} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Order History</Text>
            <Text style={styles.emptySubtitle}>
              You haven't completed any service orders yet.
            </Text>
          </View>
        )}
      </>
    )}
  </View>
);
};
export default CustomerOrders;