import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { styles } from './CustomerOrders.styles';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS } from '../../config/theme'; 
import auth from '@react-native-firebase/auth';
import { ServiceRequestService } from '../../services/ServiceRequestService';
import CustomerOrderCard from '../../components/CustomerOrderCard';

const CustomerOrders = () => {
 
  const [activeTab, setActiveTab] = useState('active');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); 

  const activeRequests = requests.filter(
    item => item.status !== 'rejected'
  );

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
  
  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

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
            activeTab === 'active' &&
              styles.activeTabButton
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' &&
                styles.activeTabText
            ]}
          >
            Active Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' &&
              styles.activeTabButton
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' &&
                styles.activeTabText
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

      </View>

      {/* Content */}

      {loading ? (

        <View style={styles.contentContainer}>

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.emptySubtitle}>
            Loading orders...
          </Text>

        </View>

      ) : activeTab === 'active' ? (

        activeRequests.length === 0 ? (

          <View style={styles.contentContainer}>

            <View style={styles.emptyIconContainer}>
              <Icon
                name="reader-outline"
                size={50}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Active Orders
            </Text>

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
                onTrack={(request) => {
                  console.log(
                    'Track Request:',
                    request
                  );
                }}
              />

            ))}

          </ScrollView>

        )

      ) : (

        <View style={styles.contentContainer}>

          <View style={styles.emptyIconContainer}>
            <Icon
              name="reader-outline"
              size={50}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No Order History
          </Text>

          <Text style={styles.emptySubtitle}>
            You haven't completed any service orders yet.
          </Text>

        </View>

      )}

    </View>
  );
};
export default CustomerOrders;