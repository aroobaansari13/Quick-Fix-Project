import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ForgotPasswordModal = ({ isVisible, onClose, onSelectEmail }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Forgot Password</Text>
          <Text style={styles.modalSubtitle}>Choose how you want to recover your account.</Text>
          
          <TouchableOpacity style={styles.optionButton} onPress={onSelectEmail}>
            <Text>Recover using Email</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={{ color: 'red' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalSubtitle: { marginBottom: 20 },
  optionButton: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 5, alignItems: 'center' },
  cancelButton: { marginTop: 15, alignItems: 'center' }
});

export default ForgotPasswordModal;