import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './CustomerOrderCard.styles';

const CustomerOrderCard = ({ item, onTrack }) => {

  const isAccepted = item.status === 'accepted';

  return (
    <View style={styles.card}>

      <View style={styles.topRow}>

        <View style={styles.providerInfo}>
          <View style={styles.iconContainer}>
            <Icon
              name="construct-outline"
              size={24}
              color="#1E3A8A"
            />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.providerName}>
              {item.providerName || item.businessName || 'Provider'}
            </Text>

            <Text style={styles.requestText}>
              Service Request
            </Text>
          </View>
        </View>

        <Text style={styles.amount}>
          PKR {item.totalAmount || 0}
        </Text>

      </View>

      <TouchableOpacity
        style={[
          styles.statusButton,
          isAccepted && styles.trackButton,
        ]}
        onPress={() => {
          if (isAccepted && onTrack) {
            console.log('TRACK REQUEST PROVIDER ID:', item.providerId);
            console.log('TRACK REQUEST:', item);
            console.log('🔥 PROVIDER TYPE:', item.providerType);
            onTrack(item);
          }
        }}
        activeOpacity={0.8}
      >

        <Icon
          name={
            isAccepted
              ? 'location-outline'
              : 'time-outline'
          }
          size={18}
          color={isAccepted ? '#FFFFFF' : '#475569'}
        />

        <Text
          style={[
            styles.statusButtonText,
            isAccepted && styles.trackButtonText,
          ]}
        >
          {isAccepted ? 'Track on Map' : 'In Progress'}
        </Text>

      </TouchableOpacity>

    </View>
  );
};

export default CustomerOrderCard;