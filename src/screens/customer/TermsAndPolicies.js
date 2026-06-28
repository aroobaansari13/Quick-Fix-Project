import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './TermsAndPolicies.styles';

const TermsAndPolicies = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Policies</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>
        
        <Text style={styles.welcomeText}>
          Please review the simplified terms and privacy choices for using the QuickFix platform.
        </Text>

        {/* SECTION 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Platform Role</Text>
          <Text style={styles.sectionBody}>
            QuickFix is an intermediary app connecting users with independent, verified mechanics and fuel stations. We do not provide direct repair or towing services ourselves.
          </Text>
        </View>

        {/* SECTION 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Accounts & Verification</Text>
          <Text style={styles.sectionBody}>
            Users must provide authentic profile info. Service providers undergo mandatory document audit and admin review before verification approval to prevent fraud.
          </Text>
        </View>

        {/* SECTION 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Flexible Pricing</Text>
          <Text style={styles.sectionBody}>
            App estimates are baseline starting points. Final prices may vary dynamically based on physical site inspections, required spare parts, and active fuel market rates.
          </Text>
        </View>

        {/* SECTION 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Cancellation Rules</Text>
          <Text style={styles.sectionBody}>
            Cancellations are free before dispatch. If a user cancels after the mechanic travels or reaches the location, a standard displacement fee is charged for transit costs.
          </Text>
        </View>

        {/* SECTION 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Safety & Liability</Text>
          <Text style={styles.sectionBody}>
            Roadside breakdowns have safety hazards. Users must stay alert. QuickFix is not liable for direct vehicle damage or injury caused by third-party providers.
          </Text>
        </View>

        {/* SECTION 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Location Tracking</Text>
          <Text style={styles.sectionBody}>
            Continuous background and foreground GPS location is required to route mechanics accurately to your exact vehicle breakdown point. Data is securely protected.
          </Text>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          By utilizing the QuickFix mobile application, you automatically consent to these listed standard operating procedures.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndPolicies;