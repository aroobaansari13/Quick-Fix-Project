import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS } from '../../config/theme'; 
import { styles } from './ProviderOrders.styles';

const ProviderOrders = () => {
  const [activeTab, setActiveTab] = useState('active'); 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incoming Orders</Text>
      </View>

      {/* Tabs Layout */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]} 
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            New Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]} 
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Center Content State Area */}
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
          <Icon name="construct-outline" size={50} color={COLORS.primary} /> 
        </View>
        <Text style={styles.emptyTitle}>
          {activeTab === 'active' ? 'No Job Requests' : 'No Order History'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeTab === 'active' 
            ? "You don't have any incoming customer requests right now." 
            : "Your completed workshop service records will display here."
          }
        </Text>
      </View>
    </View>
  );
};

export default ProviderOrders;