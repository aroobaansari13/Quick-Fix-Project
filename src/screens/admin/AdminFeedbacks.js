import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, ScrollView, StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './AdminFeedbacks.styles';

const AdminFeedbacks = ({ onBack }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Feedbacks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeedbacks(data);
        setLoading(false);
      }, error => {
        console.log('Feedbacks error:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      <Icon
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={16}
        color="#F59E0B"
      />
    ));
  };

  // Detail View
  if (selectedFeedback) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedFeedback(null)} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback Detail</Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailScroll}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{selectedFeedback.customerName}</Text>
            <Text style={styles.detailSubValue}>{selectedFeedback.customerEmail}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{selectedFeedback.providerName}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Rating</Text>
            <View style={styles.starsRow}>
              {renderStars(selectedFeedback.rating)}
            </View>
            <Text style={styles.ratingText}>{selectedFeedback.rating}/5</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Feedback</Text>
            <Text style={styles.feedbackText}>
              {selectedFeedback.feedbackText || 'No comment provided'}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // List View
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Manage Feedbacks ({feedbacks.length})
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading feedbacks...</Text>
        </View>
      ) : feedbacks.length === 0 ? (
        <View style={styles.center}>
          <Icon name="chatbubbles-outline" size={60} color="#CBD5E1" />
          <Text style={styles.emptyText}>No feedbacks yet</Text>
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedFeedback(item)}
              style={styles.card}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.customerName}>{item.customerName}</Text>
                <View style={styles.starsRow}>
                  {renderStars(item.rating)}
                </View>
              </View>
              <Text style={styles.providerText}>
                Provider: {item.providerName}
              </Text>
              <Text style={styles.feedbackPreview} numberOfLines={2}>
                {item.feedbackText || 'No comment'}
              </Text>
              <View style={styles.cardBottom}>
                <Icon name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AdminFeedbacks;