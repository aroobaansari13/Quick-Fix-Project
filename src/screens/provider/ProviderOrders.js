import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';
import { styles } from './ProviderOrders.styles';
import auth from '@react-native-firebase/auth';
import { ServiceRequestService } from '../../services/ServiceRequestService';
import RequestCard from '../../components/RequestCard';

const ProviderOrders = ({ onViewDetails }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      console.log('No provider logged in');
      setLoading(false);
      return;
    }

    console.log('Provider UID:', currentUser.uid);

    const unsubscribe = ServiceRequestService.subscribeProviderRequests(
      currentUser.uid,
      (newRequests) => {
        console.log('Provider Requests:', newRequests);

        setRequests(newRequests);
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
          Incoming Orders
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            New Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

      </View>

      {/* Content */}
      {activeTab === 'active' ? (

        loading ? (

          <View style={styles.contentContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />

            <Text style={styles.emptySubtitle}>
              Loading requests...
            </Text>
          </View>

        ) : requests.length === 0 ? (

          <View style={styles.contentContainer}>

            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: '#E0E7FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Icon
                name="construct-outline"
                size={50}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Job Requests
            </Text>

            <Text style={styles.emptySubtitle}>
              You don't have any incoming customer requests right now.
            </Text>

          </View>

        ) : (

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            {requests.map((item) => (
              item.status === 'accepted' ? (
                // ✅ Accepted request — Completed button wala card
                <View key={item.id} style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  elevation: 2,
                  borderLeftWidth: 4,
                  borderLeftColor: '#10B981',
                }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>
                    {item.customerName || 'Customer'}
                  </Text>
                  <Text style={{ color: '#64748B', marginTop: 4 }}>
                    PKR {item.totalAmount || 0}
                  </Text>
                  <Text style={{ color: '#10B981', marginTop: 4, fontSize: 12 }}>
                    ✅ Request Accepted
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#1E3A8A',
                      borderRadius: 8,
                      padding: 12,
                      marginTop: 12,
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      Alert.alert(
                        'Complete Service',
                        'Service complete ho gayi hai?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Yes, Complete',
                            onPress: async () => {
                              const result = await ServiceRequestService.completeRequest(item.id);
                              if (!result.success) {
                                Alert.alert('Error', result.error);
                              }
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      Completed
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Pending request — normal card
                <RequestCard
                  key={item.id}
                  item={item}
                  onViewDetails={onViewDetails}
                />
              )
            ))}
          </ScrollView>

        )

      ) : (

        <View style={styles.contentContainer}>

          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: '#E0E7FF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Icon
              name="clipboard-outline"
              size={50}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No Order History
          </Text>

          <Text style={styles.emptySubtitle}>
            Your completed workshop service records will display here.
          </Text>

        </View>

      )}

    </View>
  );
};

export default ProviderOrders;