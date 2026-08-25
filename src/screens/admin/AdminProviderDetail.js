import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/theme';
import { styles } from './AdminProviderDetail.styles';

const AdminProviderDetail = ({ provider, onBack }) => {
  const [loading, setLoading] = useState(false);
  const isMechanic = provider.providerType === 'Mechanic';
  const collectionName = isMechanic ? 'Mechanics' : 'FuelStations';

  // Disable handler: Firestore mein status 'disabled' set karega
  const handleDisableProvider = () => {
    Alert.alert(
      "Disable Provider",
      "Are you sure you want to restrict this provider account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection(collectionName).doc(provider.id).update({
                status: 'disabled',
                disabledAt: firestore.FieldValue.serverTimestamp(),
              });
              Alert.alert("Success", "Provider profile has been disabled.");
            } catch (error) {
              console.log("Disable provider error:", error);
              Alert.alert("Error", "Could not complete update.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Delete handler: Firestore se permanent record delete karega
  const handleDeleteProvider = () => {
    Alert.alert(
      "Delete Permanently",
      "This will remove the provider profile permanently. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection(collectionName).doc(provider.id).delete();
              Alert.alert("Deleted", "Provider record permanently removed.");
              if (onBack) onBack();
            } catch (error) {
              console.log("Delete provider error:", error);
              Alert.alert("Error", "Could not execute deletion.");
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
        <Text style={styles.headerTitle}>{provider.providerType} Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(provider.workshopPicture || provider.fuelStationPicture || provider.picture) && (
          <Image 
            source={{ uri: provider.workshopPicture || provider.fuelStationPicture || provider.picture }} 
            style={styles.providerImage} 
            resizeMode="cover"
          />
        )}

        <View style={styles.detailsSection}>
          <DetailItem label="Full Name" value={provider.fullName || provider.name} icon="person-outline" />
          <DetailItem label="Email Address" value={provider.email} icon="mail-outline" />
          <DetailItem label="Phone Number" value={provider.phone || provider.phoneNumber} icon="call-outline" />
          
          <DetailItem 
  label={isMechanic ? "Workshop Name" : "Fuel Station Name"} 
  value={
    isMechanic
      ? provider.shopDetails?.shopName
      : provider.stationDetails?.stationName
  }
  icon="business-outline" 
/>

<DetailItem 
  label={isMechanic ? "Workshop Address" : "Fuel Station Address"} 
  value={
    isMechanic
      ? provider.shopDetails?.address
      : provider.stationDetails?.address
  }
  icon="location-outline" 
/>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.disableButton]} 
            onPress={handleDisableProvider}
            disabled={loading}
          >
            <Icon name="ban-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Disable Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleDeleteProvider}
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

export default AdminProviderDetail;