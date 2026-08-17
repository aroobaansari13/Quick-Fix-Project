import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/theme';
import { styles } from './AdminProviderList.styles';

const AdminProviderList = ({ onSelectProvider, onBack }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Mechanics aur FuelStations dono collections se data fetch karna
        const [mechanicsSnap, fuelSnap] = await Promise.all([
          firestore().collection('Mechanics').get(),
          firestore().collection('FuelStations').get()
        ]);

        const mechanics = mechanicsSnap.docs.map(doc => ({
          id: doc.id,
          providerType: 'Mechanic',
          ...doc.data()
        }));

        const fuelStations = fuelSnap.docs.map(doc => ({
          id: doc.id,
          providerType: 'Fuel Station',
          ...doc.data()
        }));

        setProviders([...mechanics, ...fuelStations]);
      } catch (error) {
        console.log("Error combining provider lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading providers...</Text>
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
        <Text style={styles.headerTitle}>Providers Management</Text>
      </View>

      <FlatList
        data={providers}
        keyExtractor={(item) => `${item.providerType}-${item.id}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onSelectProvider(item)}
          >
            <View style={[styles.avatarContainer, { backgroundColor: item.providerType === 'Mechanic' ? '#E0E7FF' : '#FEF3C7' }]}>
              <Icon 
                name={item.providerType === 'Mechanic' ? 'construct-outline' : 'water-outline'} 
                size={22} 
                color={item.providerType === 'Mechanic' ? COLORS.primary : '#D97706'} 
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.nameText}>{item.fullName || item.name || 'Unnamed Provider'}</Text>
              <Text style={styles.typeText}>{item.providerType}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No registered mechanics or fuel stations found.</Text>
          </View>
        }
      />
    </View>
  );
};

export default AdminProviderList;