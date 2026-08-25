import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProviderFeedbacks = ({ navigation }) => {

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth().currentUser;
  const providerId = currentUser?.uid;


  useEffect(() => {

    const loadFeedbacks = async () => {

      if (!providerId) {
        setLoading(false);
        return;
      }

      try {

        // --------------------------------------------------
        // 1. Get only current provider's feedbacks
        // --------------------------------------------------

        const snapshot = await firestore()
          .collection('Feedbacks')
          .where('providerId', '==', providerId)
          .get();


        // --------------------------------------------------
        // 2. Get service information from ServiceRequests
        // --------------------------------------------------

        const feedbackList = await Promise.all(

          snapshot.docs.map(async (doc) => {

            const feedbackData = doc.data();

            let serviceNames = [];

            if (feedbackData.requestId) {

              try {

                const requestDoc = await firestore()
                  .collection('ServiceRequests')
                  .doc(feedbackData.requestId)
                  .get();

                if (requestDoc.exists) {

                  const requestData = requestDoc.data() || {};

                  serviceNames =
                    (requestData.selectedServices || [])
                      .map(service => service.title)
                      .filter(Boolean);

                }

              } catch (error) {

                console.log(
                  'Error loading service information:',
                  error
                );

              }

            }


            return {
              id: doc.id,
              ...feedbackData,
              serviceNames,
            };

          })

        );


        // --------------------------------------------------
        // 3. Newest feedback first
        // --------------------------------------------------

        feedbackList.sort((a, b) => {

          const dateA =
            a.createdAt?.toDate?.() || new Date(0);

          const dateB =
            b.createdAt?.toDate?.() || new Date(0);

          return dateB - dateA;

        });


        setFeedbacks(feedbackList);

      } catch (error) {

        console.error(
          'Error loading provider feedbacks:',
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadFeedbacks();

  }, [providerId]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (timestamp) => {

    if (!timestamp?.toDate) {
      return '';
    }

    const date = timestamp.toDate();

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  };


  // =====================================================
  // STAR RATING
  // =====================================================

  const renderStars = (rating) => {

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 6,
        }}
      >

        {[1, 2, 3, 4, 5].map((star) => (

          <Icon
            key={star}
            name={
              star <= Number(rating)
                ? 'star'
                : 'star-outline'
            }
            size={18}
            color="#F59E0B"
            style={{ marginRight: 2 }}
          />

        ))}

      </View>
    );

  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: '#F8FAFC',
      }}
    >

      {/* HEADER */}

      <View
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}
      >

        <TouchableOpacity
          onPress={() => navigation?.goBack()}
        >

          <Icon
            name="arrow-back"
            size={24}
            color="#1E293B"
          />

        </TouchableOpacity>


        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#1E293B',
            marginLeft: 16,
            
          }}
        >
          Feedbacks
        </Text>

      </View>


      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* NO FEEDBACK */}

        {feedbacks.length === 0 ? (

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: 30,
              alignItems: 'center',
              marginTop: 20,
            }}
          >

            <Icon
              name="chatbubble-ellipses-outline"
              size={50}
              color="#CBD5E1"
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#334155',
                marginTop: 15,
              }}
            >
              No Feedbacks Yet
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: '#64748B',
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Customer feedbacks for your completed
              services will appear here.
            </Text>

          </View>

        ) : (

          feedbacks.map((feedback) => (

            <View
              key={feedback.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: 16,
                marginBottom: 14,
                elevation: 2,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 5,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
              }}
            >

              {/* CUSTOMER */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#1E293B',
                    }}
                  >
                    {feedback.customerName || 'Customer'}
                  </Text>

                  {renderStars(feedback.rating)}

                </View>


                <Text
                  style={{
                    fontSize: 12,
                    color: '#94A3B8',
                  }}
                >
                  {formatDate(feedback.createdAt)}
                </Text>

              </View>


              {/* SERVICES */}

              {feedback.serviceNames?.length > 0 && (

                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 8,
                    padding: 10,
                  }}
                >

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#64748B',
                      marginBottom: 4,
                    }}
                  >
                    Service
                  </Text>

                  {feedback.serviceNames.map(
                    (serviceName, index) => (

                      <Text
                        key={index}
                        style={{
                          fontSize: 14,
                          color: '#334155',
                          fontWeight: '500',
                        }}
                      >
                        • {serviceName}
                      </Text>

                    )
                  )}

                </View>

              )}


              {/* FEEDBACK */}

              <Text
                style={{
                  fontSize: 15,
                  color: '#475569',
                  lineHeight: 22,
                  marginTop: 14,
                }}
              >
                "{feedback.feedbackText || 'No written feedback.'}"
              </Text>

            </View>

          ))

        )}

      </ScrollView>

    </View>

  );

};

export default ProviderFeedbacks;