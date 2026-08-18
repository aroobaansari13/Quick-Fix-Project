import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './AdminDashboard.styles';

const AdminDashboard = ({ 
  onLogout, 
  onPendingApplicationsPress, 
  onCustomersPress, 
  onProvidersPress,
  onFeedbacksPress
}) => {
  const AdminCard = ({ title, subTitle, icon, iconColor, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubTitle}>{subTitle}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Dashboard Workspace</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* 4 Required Action Cards */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Management Panels</Text>

        {/* 3. Pending Applications */}
        <AdminCard 
          title="Pending Applications"
          subTitle="Review provider sign-up requests"
          icon="document-text-outline"
          iconColor="#F59E0B" // Amber/Yellow
          onPress={onPendingApplicationsPress}
        />

        {/* 1. Customers List */}
        <AdminCard 
          title="Customers List"
          subTitle="View registered customers"
          icon="people-outline"
          iconColor="#3B82F6" // Blue
          onPress={onCustomersPress}
        />

        {/* 4. Manage Feedbacks */}
        <AdminCard 
          title="Manage Feedbacks"
          subTitle="User complaints & reviews"
          icon="chatbubbles-outline"
          iconColor="#8B5CF6" // Purple
          onPress={onFeedbacksPress}
        />

        {/* 2. Providers List */}
        <AdminCard 
          title="Providers List"
          subTitle="Mechanics & Fuel Stations logs"
          icon="construct-outline"
          iconColor="#10B981" // Green
          onPress={onProvidersPress}
        />
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;