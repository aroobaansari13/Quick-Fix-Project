import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './PendingReviewScreen.styles';

const PendingReviewScreen = ({}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Top Vector/Icon Section */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name="time-outline" size={60} color="#1E3A8A" />
        </View>
        {/* Chota check icon top par dynamic look ke liye */}
        <View style={styles.badgeCircle}>
          <Icon name="sync-outline" size={18} color="#FFFFFF" />
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textSection}>
        <Text style={styles.titleText}>Application Under Review</Text>
        <Text style={styles.subText}>
          Thank you for registering with QuickFix! Your workshop details and certificates are currently being reviewed by our admin team.
        </Text>
        <Text style={styles.infoText}>
          This process usually takes up to 24-48 hours. We will notify you via email once your account is approved.
        </Text>
      </View>
    </View>
  );
};
export default PendingReviewScreen;