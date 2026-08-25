import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/theme';
import { styles } from './AdminCustomerDetail.styles';

const AdminCustomerDetail = ({ customer, onBack }) => {
  const [loading, setLoading] = useState(false);

  // Disable handler: Firestore mein status 'disabled' set karega bagair delete kiye
  const handleDisableCustomer = () => {
    Alert.alert(
      "Disable Account",
      "Are you sure you want to disable this customer account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection('Customers').doc(customer.id).update({
                status: 'disabled',
                disabledAt: firestore.FieldValue.serverTimestamp(),
              });
              Alert.alert("Success", "Customer account has been disabled.");
            } catch (error) {
              console.log("Disable error:", error);
              Alert.alert("Error", "Failed to disable account.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Delete handler: Firestore se permanent record delete karega
  const handleDeleteCustomer = () => {
    Alert.alert(
      "Delete Permanently",
      "This action is permanent and cannot be undone. Do you wish to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection('Customers').doc(customer.id).delete();
              Alert.alert("Deleted", "Customer profile permanently deleted.");
              if (onBack) onBack();
            } catch (error) {
              console.log("Delete error:", error);
              Alert.alert("Error", "Failed to delete customer record.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Customer Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.iconCircle}>
            <Icon name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.profileName}>{customer.fullName || customer.name || 'N/A'}</Text>
          <Text style={styles.profileStatus}>Status: {customer.status === 'disabled' ? 'Disabled' : 'Active'}</Text>
        </View>

        <View style={styles.detailsSection}>
          <DetailItem label="Full Name" value={customer.fullName || customer.name} icon="person-outline" />
          <DetailItem label="Email Address" value={customer.email} icon="mail-outline" />
          <DetailItem label="Phone Number" value={customer.phone || customer.phoneNumber} icon="call-outline" />
          <DetailItem label="Home Address" value={customer.address || customer.homeAddress} icon="location-outline" />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.disableButton]} 
            onPress={handleDisableCustomer}
            disabled={loading}
          >
            <Icon name="ban-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Disable Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleDeleteCustomer}
            disabled={loading}
          >
            <Icon name="trash-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Delete Permanently</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={20} color="#64748B" style={styles.detailIcon} />
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'Not Provided'}</Text>
    </View>
  </View>
);

export default AdminCustomerDetail;