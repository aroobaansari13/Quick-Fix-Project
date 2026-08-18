import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'; // 🛑 Firebase import zaroori hai status update ke liye
import { ServiceRequestService } from '../services/ServiceRequestService';
import { styles } from './FeedbackModal.styles';

const FeedbackModal = ({ visible, requestData, onClose }) => {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible || !requestData) return null;

  // 🛑 Status ko 'reviewed' karne ka function taake popup dobara na aaye
  const handleDismissOrComplete = async () => {
    try {
      if (requestData?.id) {
        await firestore().collection('ServiceRequests').doc(requestData.id).update({
          feedbackShown: true
        });
      }
    } catch (error) {
      console.error("Error updating status to reviewed:", error);
    }
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await ServiceRequestService.submitFeedback(requestData.id, {
      rating, 
      feedbackText,
      customerName: requestData.customerName,
      providerId: requestData.providerId,
      providerName: requestData.providerName,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert("Thank You!", "Feedback received.");
      // handleSubmit ke andar bhi status 'reviewed' ho jayega kyunki submitFeedback function 
      // pehle hi ServiceRequestService mein status ko 'reviewed' kar deta hai.
      onClose(); 
    } else {
      Alert.alert("Error", result.error);
    }
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          
          {/* ❌ Cross button dabane par status 'reviewed' ho jayega aur popup band ho jayega */}
          <TouchableOpacity style={styles.closeButton} onPress={handleDismissOrComplete}>
            <Icon name="close" size={24} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Icon name="star" size={30} color="#F59E0B" />
          </View>

          <Text style={styles.title}>Service Completed!</Text>
          <Text style={styles.subtitle}>How was the {requestData.providerName || 'provider'}'s service.</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} key={star}>
                <Icon name={star <= rating ? "star" : "star-outline"} size={32} color="#F59E0B" />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Apna experience likhein..."
            placeholderTextColor="#94A3B8"
            multiline 
            value={feedbackText} 
            onChangeText={setFeedbackText}
            editable={!loading}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Feedback</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;