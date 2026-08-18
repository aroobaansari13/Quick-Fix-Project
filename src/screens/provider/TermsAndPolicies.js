import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './TermsAndPolicies.styles';

const TermsAndPolicies = ({ navigation, route }) => {
  // Check provider type ('mechanic', 'fuel_station', ya 'customer')
  const userType = route?.params?.providerType || route?.params?.userType || 'customer';

  // 🛠️ Mechanic Terms
  const mechanicTerms = [
    { title: "1. Safety Standards", description: "Roadside work ke dauran full safety rules follow karein." },
    { title: "2. Clear Pricing", description: "App ke set shuda rates ke mutabiq hi charge karein." },
    { title: "3. Punctuality", description: "Booking accept karne ke baad waqt par pahochan lazmi hai." },
    { title: "4. Valid ID & Tools", description: "Duty par verified CNIC aur basic tools sath rakhein." },
    { title: "5. No Direct Cancels", description: "Bina wajah live customer request cancel na karein." }
  ];

  // ⛽ Fuel Station Terms
  const fuelTerms = [
    { title: "1. Pure Fuel", description: "100% pure aur accurate fuel quantity deliver karein." },
    { title: "2. Safe Packaging", description: "Fuel delivery ke liye safety containers istemal karein." },
    { title: "3. Fixed Radius", description: "Sirf apni set location boundary ke andar delivery dein." },
    { title: "4. Standard Rates", description: "Government rates aur fix delivery fee hi apply karein." },
    { title: "5. Quick Response", description: "Emergency fuel request par jaldi dispatch karein." }
  ];

  // 👤 Customer Terms
  const customerTerms = [
    { title: "1. Accurate Location", description: "Breakdown request par sahi location pin share karein." },
    { title: "2. Polite Behavior", description: "Service provider ke sath professional behavior rakhein." },
    { title: "3. Clear Payment", description: "Work complete hone par decided payment clear karein." }
  ];

  // Filter terms according to user type
  const getContent = () => {
    if (userType === 'fuel_station' || userType === 'fuel') {
      return {
        title: 'Fuel Partner Terms',
        subtitle: 'Rules for fuel delivery partners.',
        data: fuelTerms,
      };
    } else if (userType === 'mechanic') {
      return {
        title: 'Mechanic Partner Terms',
        subtitle: 'Rules for mechanic service partners.',
        data: mechanicTerms,
      };
    } else {
      return {
        title: 'Customer Policies',
        subtitle: 'Rules for QuickFix app users.',
        data: customerTerms,
      };
    }
  };

  const content = getContent();

  // Profile page par back handle karne ke liye
  const handleBackPress = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Policies</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{content.title}</Text>
        <Text style={styles.subText}>{content.subtitle}</Text>

        {content.data.map((item, index) => (
          <View key={index} style={styles.termCard}>
            <Text style={styles.termTitle}>{item.title}</Text>
            <Text style={styles.termDescription}>{item.description}</Text>
          </View>
        ))}

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};

export default TermsAndPolicies;