import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from './CheckoutScreen.styles';
import { COLORS } from '../../config/theme';

const CheckoutScreen = ({ data, onBack }) => {

  // ServiceDetails se App.js ke through pass kiya gaya data
  const {
    selectedServicesDetails = [],
    description = '',
    provider
  } = data || {};

  // Total price calculate karna
  const calculateTotal = () => {
    return selectedServicesDetails.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  };

  const handleConfirmOrder = () => {
    console.log("Order Placed:", {
      selectedServicesDetails,
      description,
      total: calculateTotal()
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Selected Services Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Selected Services</Text>
          {selectedServicesDetails.map((item, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.serviceTitle}>• {item.title}</Text>
              <Text style={styles.servicePrice}>PKR {item.price}</Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>PKR {calculateTotal()}</Text>
          </View>
        </View>

        {/* Additional Requirements */}
        {description ? (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Additional Requirements</Text>
            <Text style={styles.descText}>{description}</Text>
          </View>
        ) : null}

      </ScrollView>

      {/* Confirm & Proceed Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>Submit Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CheckoutScreen;