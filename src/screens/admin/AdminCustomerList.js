import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/theme';
import { styles } from './AdminCustomerList.styles';

const AdminCustomerList = ({ onSelectCustomer, onBack }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestore ke 'Customers' collection se data fetch karna
    const subscriber = firestore()
      .collection('Customers')
      .onSnapshot(querySnapshot => {
        const list = [];
        querySnapshot.forEach(documentSnapshot => {
          list.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setCustomers(list);
        setLoading(false);
      }, error => {
        console.log("Error fetching customers:", error);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Customers Management</Text>
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onSelectCustomer(item)}
          >
            <View style={styles.avatarContainer}>
              <Icon name="person-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.nameText}>{item.fullName || item.name || 'No Name'}</Text>
              <Text style={styles.emailText}>{item.email || 'No Email'}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No registered customers found.</Text>
          </View>
        }
      />
    </View>
  );
};

export default AdminCustomerList;