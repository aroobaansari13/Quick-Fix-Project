import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './AdminDashboard.styles';

const AdminDashboard = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Temporary Header for Blank Page */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Dashboard Workspace</Text>
        <TouchableOpacity onPress={onLogout}>
          <Icon name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area (Blank for now) */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Blank Admin Space (Ready for modifications)</Text>
      </View>
    </View>
  );
};

export default AdminDashboard;