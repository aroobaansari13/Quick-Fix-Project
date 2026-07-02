import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { styles } from './ServiceDetails.styles';
import { COLORS } from '../../config/theme';

const ServiceDetails = ({ service, onNext }) => {
  const [servicesList, setServicesList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([service.id]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderServices = async () => {
      try {
        const snapshot = await firestore()
          .collection('ProviderServices')
          .where('providerId', '==', service.providerId)
          .get();
        
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServicesList(data);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderServices();
  }, [service.providerId]);

  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  if (loading) return <ActivityIndicator style={{flex:1}} color={COLORS.primary} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Provider Header */}
        <View style={styles.headerCard}>
          <View style={styles.profilePic} />
          <Text style={styles.providerName}>{service.providerName}</Text>
          <Text style={styles.businessName}>{service.businessName}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>Mechanic</Text></View>
            <View style={styles.badge}><Text style={styles.statusText}>● Online</Text></View>
          </View>
          <Text style={styles.infoText}>{service.distance} KM • ⭐ 4.8</Text>
        </View>

        {/* Section 2: Services List */}
        // ServiceDetails.js ka Services List wala hissa update karein
        <Text style={styles.sectionTitle}>Select Services</Text>
        {servicesList.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.serviceCard} 
            onPress={() => toggleService(item.id)}
          >
            <Icon 
             name={selectedServices.includes(item.id) ? "checkbox" : "square-outline"} 
             size={26} 
             color={selectedServices.includes(item.id) ? COLORS.primary : "#9CA3AF"} 
            />
    
            <View style={styles.serviceInfoContainer}>
              <View style={styles.titlePriceRow}>
                <Text style={styles.serviceText}>{item.title}</Text>
                <Text style={styles.priceText}>PKR {item.price}</Text>
              </View>
              {item.description ? (
                <Text style={styles.descText}>{item.description}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}

        {/* Section 3: Additional Requirements */}
        <Text style={styles.sectionTitle}>Additional Requirements</Text>
        <View style={styles.descCard}>
          <TextInput
            style={styles.input}
            placeholder="Describe your issue or special requirements..."
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      {/* Section 4: Next Button */}
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => onNext({selectedServices, description})}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ServiceDetails;