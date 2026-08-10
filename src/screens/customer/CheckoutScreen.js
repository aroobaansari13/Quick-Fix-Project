import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { styles } from './CheckoutScreen.styles';
import { COLORS } from '../../config/theme';
import { ServiceRequestService } from '../../services/ServiceRequestService';

const CheckoutScreen = ({ data, onBack }) => {

  const [loading, setLoading] = useState(false);
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

  const handleConfirmOrder = async () => {
  try {
    setLoading(true);

    const result = await ServiceRequestService.createServiceRequest({
      selectedServicesDetails,
      description,
      provider
    });

    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Request Submitted",
        "Your service request has been submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              if (onBack) {
                onBack();
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to submit service request."
      );
    }

  } catch (error) {
    setLoading(false);
    console.error("Submit Request Error:", error);

    Alert.alert(
      "Error",
      error.message || "Something went wrong."
    );
  }
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

      <TouchableOpacity
        style={[styles.confirmButton, loading && { opacity: 0.7 }]}
        onPress={handleConfirmOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.confirmButtonText}>Submit Request</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CheckoutScreen;