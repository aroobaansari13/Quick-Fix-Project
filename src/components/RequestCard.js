import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RequestCard = ({ item, onViewDetails }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {item.customerProfileImage ? (
          <Image source={{ uri: item.customerProfileImage }} style={styles.profilePic} />
        ) : (
          <View style={styles.placeholderPic}>
            <Icon name="person" size={22} color="#6B7280" />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.customerName}>{item.customerName || "Customer"}</Text>
          <Text style={styles.requestSubText}>New Order</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => {
          console.log('Selected Request:', item);
          if (onViewDetails) {
            onViewDetails(item);
          }
        }}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  placeholderPic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  requestSubText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: '#0B2545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default RequestCard;