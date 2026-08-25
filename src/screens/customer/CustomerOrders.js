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
  const [historyRequests, setHistoryRequests] = useState([]); // ✅ Add karo
  const [historyLoading, setHistoryLoading] = useState(true);

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

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = ServiceRequestService.subscribeCustomerHistory(
      currentUser.uid,
      (history) => {
        // ✅ Recent orders ko top par laane ke liye sort karein
        const sortedHistory = history.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA; // Newest first (Descending order)
        });

        setHistoryRequests(sortedHistory);
        setHistoryLoading(false);
      }
    );
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
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />

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

        ) : activeTab === 'history' ? (
            historyLoading ? (
              <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
            ) : historyRequests.length === 0 ? (
              <View style={styles.contentContainer}>
                <View style={styles.emptyIconContainer}>
                  <Icon name="reader-outline" size={50} color={COLORS.primary} />
                </View>
                <Text style={styles.emptyTitle}>No Order History</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't completed any service orders yet.
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ordersList}
              >
                {historyRequests.map(item => (
                  <View key={item.id} style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    elevation: 2,
                    borderLeftWidth: 4,
                    borderLeftColor: '#10B981',
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1E293B' }}>
                      {item.providerName || 'Provider'}
                    </Text>
                    <Text style={{ color: '#64748B', marginTop: 4 }}>
                      PKR {item.totalAmount || 0}
                    </Text>
                    <Text style={{ color: '#10B981', marginTop: 4, fontSize: 12 }}>
                      ✅ Completed
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )
          ) : null}
        </>
      )}
    </View>
  );
};

export default CustomerOrders;