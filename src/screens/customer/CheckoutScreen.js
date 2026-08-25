import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { styles } from './CheckoutScreen.styles';
import { COLORS } from '../../config/theme';
import { ServiceRequestService } from '../../services/ServiceRequestService';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ data, onBack }) => {

  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerProfilePic, setCustomerProfilePic] = useState(null);
  // ServiceDetails se App.js ke through pass kiya gaya data
  const {
    selectedServicesDetails = [],
    description = '',
    provider
  } = data || {};

  useEffect(() => {
  const loadCustomerHeader = async () => {
    const currentUser = auth().currentUser;

    if (!currentUser) return;

    const uid = currentUser.uid;

    try {
      // 1. Cache se foran show karo
      const cachedName = await AsyncStorage.getItem(
        `customerName_${uid}`
      );

      const cachedPic = await AsyncStorage.getItem(
        `customerProfileImage_${uid}`
      );

      if (cachedName) {
        setCustomerName(cachedName);
      }

      if (cachedPic) {
        setCustomerProfilePic(cachedPic);
      }

      // 2. Firestore se latest data background mein lao
      const doc = await firestore()
        .collection('Customers')
        .doc(uid)
        .get();

      if (!doc.exists) return;

      const customerData = doc.data() || {};

      const latestName =
        customerData.name || '';

      const latestPic =
        customerData.profilePicture ||
        customerData.profilePic ||
        customerData.photoURL ||
        null;

      if (latestName) {
        setCustomerName(latestName);

        await AsyncStorage.setItem(
          `customerName_${uid}`,
          latestName
        );
      }

      if (latestPic) {
        setCustomerProfilePic(latestPic);

        await AsyncStorage.setItem(
          `customerProfileImage_${uid}`,
          latestPic
        );
      }

    } catch (error) {
      console.log(
        'Checkout customer profile error:',
        error
      );
    }
  };

  loadCustomerHeader();
}, []);
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

    {/* Customer Header */}
<View
  style={[
    styles.card,
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    styles.cus
  ]}
>
  <Text
    style={styles.customerHeaderName}
    numberOfLines={1}
  >
    {customerName}
  </Text>

  {customerProfilePic ? (
    <Image
      source={{ uri: customerProfilePic }}
      style={styles.customerHeaderImage}
    />
  ) : (
    <View style={styles.customerHeaderPlaceholder}>
      <Icon
        name="person"
        size={27}
        color="#94A3B8"
      />
    </View>
  )}
</View>
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

      {/* Back + Submit Request Buttons */}
      <View style={styles.bottomButtons}>

  <TouchableOpacity
    style={styles.bottomButton}
    onPress={onBack}
    disabled={loading}
  >
    <Text style={styles.confirmButtonText}>Back</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.bottomButton,
      loading && { opacity: 0.7 }
    ]}
    onPress={handleConfirmOrder}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={styles.confirmButtonText}>Submit Request</Text>
    )}
  </TouchableOpacity>

</View>

    </SafeAreaView>
  );
};

export default CheckoutScreen;