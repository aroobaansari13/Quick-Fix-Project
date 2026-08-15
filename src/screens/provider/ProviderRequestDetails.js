import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ProviderRequestDetails.styles';
import { COLORS } from '../../config/theme';
import { ServiceRequestService } from '../../services/ServiceRequestService';

const ProviderRequestDetails = ({ request, onBack }) => {

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Request details not found.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAccept = async () => {
    const result = await ServiceRequestService.updateRequestStatus(
      request.id,
      'accepted'
    );

    if (result.success) {
      Alert.alert(
        'Request Accepted',
        'The service request has been accepted.',
        [
          {
            text: 'OK',
            onPress: onBack,
          },
        ]
      );
    } else {
      Alert.alert(
        'Error',
        result.error || 'Failed to accept request.'
      );
    }
  };

  const handleReject = async () => {
    const result = await ServiceRequestService.updateRequestStatus(
      request.id,
      'rejected'
    );

    if (result.success) {
      Alert.alert(
        'Request Rejected',
        'The service request has been rejected.',
        [
          {
            text: 'OK',
            onPress: onBack,
          },
        ]
      );
    } else {
      Alert.alert(
        'Error',
        result.error || 'Failed to reject request.'
      );
    }
  };

  const calculateTotal = () => {
    return (request.selectedServices || []).reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={onBack}
          >
            <Icon
              name="arrow-back"
              size={24}
              color="#1E293B"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Request Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Customer Information */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Customer
          </Text>

          <View style={styles.customerRow}>

            {request.customerProfileImage ? (
              <Image
                source={{
                  uri: request.customerProfileImage,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Icon
                  name="person"
                  size={28}
                  color="#64748B"
                />
              </View>
            )}

            <View style={styles.customerDetails}>

              <Text style={styles.customerName}>
                {request.customerName || 'Customer'}
              </Text>

              <Text style={styles.customerStatus}>
                Service Request
              </Text>

            </View>

          </View>

        </View>

        {/* Services */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Requested Services
          </Text>

          {(request.selectedServices || []).map(
            (service, index) => (
              <View
                key={service.serviceId || index}
                style={styles.serviceRow}
              >

                <View style={styles.serviceInfo}>

                  <Text style={styles.serviceTitle}>
                    {service.title || 'Service'}
                  </Text>

                </View>

                <Text style={styles.servicePrice}>
                  PKR {service.price || 0}
                </Text>

              </View>
            )
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>

            <Text style={styles.totalLabel}>
              Total Amount
            </Text>

            <Text style={styles.totalAmount}>
              PKR {request.totalAmount || calculateTotal()}
            </Text>

          </View>

        </View>

        {/* Additional Requirements */}
        {request.description ? (
          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Additional Requirements
            </Text>

            <Text style={styles.description}>
              {request.description}
            </Text>

          </View>
        ) : null}

        {/* Request Information */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Request Information
          </Text>

          {request.distance !== undefined ? (
            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Distance
              </Text>

              <Text style={styles.infoValue}>
                {request.distance} km
              </Text>

            </View>
          ) : null}

        </View>

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleReject}
        >
          <Text style={styles.rejectButtonText}>
            Reject
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
        >
          <Text style={styles.acceptButtonText}>
            Accept
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default ProviderRequestDetails;