import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './CustomerOrders.styles';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS } from '../../config/theme'; 

const CustomerOrders = () => {
 
  const [activeTab, setActiveTab] = useState('active'); 
  return (
    <View style={styles.container}>
      {/* Status Bar style */}
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {/* Screen Header Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      {/* Top Toggle Tabs (Active vs History) */}
      <View style={styles.tabContainer}>
        {/* Active Orders Tab */}
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]} 
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Orders
          </Text>
        </TouchableOpacity>
        {/* Order History Tab */}
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]} 
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={{
          width: 90, 
          height: 90, 
          borderRadius: 45, 
          backgroundColor: '#E0E7FF',
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: 20
        }}>
          <Icon name="reader-outline" size={50} color={COLORS.primary} /> 
        </View>
        <Text style={styles.emptyTitle}>
          {activeTab === 'active' ? 'No Active Orders' : 'No Order History'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeTab === 'active' 
            ? "You don't have any current ongoing service request." 
            : "You haven't completed any service orders yet."
          }
        </Text>
      </View>
    </View>
  );
};
export default CustomerOrders;