import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ServiceDetails = ({ service, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text>⬅ Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{service.businessName}</Text>
      <Text style={styles.info}>Provider: {service.providerName}</Text>
      <Text style={styles.info}>Service: {service.title}</Text>
      <Text style={styles.info}>Price: PKR {service.price}</Text>
      <Text style={styles.info}>Distance: {service.distance} KM</Text>
      
      {/* Yahan aap apna "Book Now" ka button laga sakte hain */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, marginVertical: 5 }
});

export default ServiceDetails;