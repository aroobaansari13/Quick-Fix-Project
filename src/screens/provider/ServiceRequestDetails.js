import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ServiceRequestDetails.styles';
import { ServiceRequestService } from '../../services/ServiceRequestService';

const ServiceRequestDetails = ({ request, onBack, onActionComplete }) => {
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const handleAction = async (status) => {
    setLoading(true);
    const result = await ServiceRequestService.updateRequestStatus(request.id, status);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", `Request has been ${status}.`, [
        { text: "OK", onPress: () => { if (onActionComplete) onActionComplete(); } }
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to update status.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Customer Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Customer Information</Text>
          <View style={styles.customerRow}>
            {request.customerProfileImage ? (
              <Image source={{ uri: request.customerProfileImage }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePic}>
                <Icon name="person" size={24} color="#6B7280" />
              </View>
            )}
            <View>
              <Text style={styles.customerName}>{request.customerName || "Customer"}</Text>
              <Text style={styles.customerLabel}>New Service Request</Text>
            </View>
          </View>
        </View>

        {/* Selected Services Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Selected Services</Text>
          {request.selectedServices?.map((item, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.servicePrice}>PKR {item.price}</Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>PKR {request.totalAmount}</Text>
          </View>
        </View>

        {/* Additional Requirements */}
        {request.description ? (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Additional Requirements</Text>
            <Text style={styles.descText}>{request.description}</Text>
          </View>
        ) : null}

        {/* Request Status */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Request Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{request.status || "Pending"}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Action Buttons: Reject & Accept */}
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ flex: 1 }} />
        ) : (
          <>
            <TouchableOpacity 
              style={styles.rejectButton} 
              onPress={() => handleAction('rejected')}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.acceptButton} 
              onPress={() => handleAction('accepted')}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ServiceRequestDetails;