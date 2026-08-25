import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import { styles } from './ServiceDetails.styles';
import { COLORS } from '../../config/theme';

const ServiceDetails = ({ service, onNext, onBack }) => {
  const [servicesList, setServicesList] = useState(
  service?.id ? [service] : []
);
  const [selectedServices, setSelectedServices] = useState(
  service?.id ? [service.id] : []
);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Provider real profile data
  const [providerName, setProviderName] = useState(
    service?.providerName || 'Provider'
  );
const [profileImage, setProfileImage] = useState(
  service?.profilePic ||
  service?.profileImage ||
  service?.profileImageUrl ||
  null
);

  // Real distance
  const [providerDistance, setProviderDistance] = useState(
    service?.distance ?? null
  );

  useEffect(() => {
  if (!service?.providerId) return;

  const providerType =
    service?.providerType ||
    service?.providerRole ||
    service?.type ||
    '';

  const normalizedType =
    providerType.toString().toLowerCase();

  const isFuelStation =
    normalizedType === 'fuelstation' ||
    normalizedType === 'fuel_station' ||
    normalizedType === 'fuel station';

  const providerCollection = isFuelStation
    ? 'FuelStations'
    : 'Mechanics';

  const unsubscribe = firestore()
    .collection(providerCollection)
    .doc(service.providerId)
    .onSnapshot(
      (doc) => {
        if (!doc.exists) return;

        const providerData = doc.data() || {};

        // Name
        setProviderName(
          providerData.name ||
          providerData.username ||
          service?.providerName ||
          'Provider'
        );

        // Profile Picture
        const imageUrl =
          providerData.profilePic ||
          providerData.profileImageUrl ||
          providerData.profilePicture ||
          providerData.photoURL ||
          null;

        if (imageUrl) {
          setProfileImage(imageUrl);
        }

        // Distance
        if (
          service?.distance !== undefined &&
          service?.distance !== null
        ) {
          setProviderDistance(service.distance);
        }
      },
      (error) => {
        console.log(
          'ServiceDetails provider listener error:',
          error
        );
      }
    );

  return () => unsubscribe();

}, [
  service?.providerId,
  service?.providerType,
  service?.providerRole
]);

  useEffect(() => {
  const fetchProviderServices = async () => {
    if (!service?.providerId) {
      setLoading(false);
      return;
    }

    try {
      const snapshot = await firestore()
        .collection('ProviderServices')
        .where('providerId', '==', service.providerId)
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sirf tab state update karo agar actual data different ho
      setServicesList(prev => {
        const prevIds = prev.map(item => item.id).sort().join(',');
        const newIds = data.map(item => item.id).sort().join(',');

        if (prevIds === newIds) {
          return prev;
        }

        return data;
      });

    } catch (error) {
      console.error(
        'Error fetching services:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProviderServices();
}, [service?.providerId]);

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(
            sId => sId !== id
          )
        : [...prev, id]
    );
  };

  const handleNextPress = () => {
    // Selected IDs ke mutabiq complete service objects
    const selectedDetails =
      servicesList.filter(s =>
        selectedServices.includes(s.id)
      );

    onNext({
      selectedServicesDetails:
        selectedDetails,

      description:
        description,

      provider:
        service
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* =========================================
            SECTION 1: PROVIDER HEADER
        ========================================== */}

        <View style={styles.headerCard}>

          {/* Real Provider Profile Picture */}

          {profileImage ? (
            <Image
              source={{
                uri: profileImage
              }}
              style={styles.profilePic}
            />
          ) : (
            <View style={styles.profilePic}>
              <Icon
                name="person"
                size={35}
                color="#9CA3AF"
              />
            </View>
          )}

          {/* REAL PROVIDER NAME */}

          <Text style={styles.providerName}>
            {providerName}
          </Text>

          {/* Business Name REMOVED */}

          <View style={styles.badgeRow}>

            {/* Provider Type */}

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {(
                  service?.providerType ||
                  service?.providerRole ||
                  ''
                )
                  .toString()
                  .toLowerCase()
                  .includes('fuel')
                  ? 'Fuel Station'
                  : 'Mechanic'}
              </Text>
            </View>

            {/* Online status - SAME AS BEFORE */}

            <View style={styles.badge}>
              <Text style={styles.statusText}>
                ● Online
              </Text>
            </View>

          </View>

          {/* REAL DISTANCE - NO RATING */}

          <Text style={styles.infoText}>
            {providerDistance !== null &&
            providerDistance !== undefined
              ? `${Number(providerDistance).toFixed(1)} KM`
              : 'Distance unavailable'}
          </Text>

        </View>

        {/* =========================================
            SECTION 2: SERVICES LIST
        ========================================== */}

        <Text style={styles.sectionTitle}>
          Select Services
        </Text>

        {servicesList.map((item) => (

          <TouchableOpacity
            key={item.id}
            style={styles.serviceCard}
            onPress={() =>
              toggleService(item.id)
            }
          >

            <Icon
              name={
                selectedServices.includes(
                  item.id
                )
                  ? "checkbox"
                  : "square-outline"
              }
              size={26}
              color={
                selectedServices.includes(
                  item.id
                )
                  ? COLORS.primary
                  : "#9CA3AF"
              }
            />

            <View
              style={
                styles.serviceInfoContainer
              }
            >

              <View
                style={
                  styles.titlePriceRow
                }
              >

                <Text
                  style={
                    styles.serviceText
                  }
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.priceText
                  }
                >
                  PKR {item.price}
                </Text>

              </View>

              {item.description ? (
                <Text
                  style={
                    styles.descText
                  }
                >
                  {item.description}
                </Text>
              ) : null}

            </View>

          </TouchableOpacity>

        ))}

        {/* =========================================
            SECTION 3: ADDITIONAL REQUIREMENTS
        ========================================== */}

        <Text style={styles.sectionTitle}>
          Additional Requirements
        </Text>

        <View style={styles.descCard}>

          <TextInput
            style={styles.input}
            placeholder="Describe your issue or special requirements..."
            multiline
            value={description}
            onChangeText={
              setDescription
            }
          />

        </View>

      </ScrollView>

      {/* =========================================
          SECTION 4: NEXT BUTTON
      ========================================== */}

      <View style={styles.bottomButtons}>

  <TouchableOpacity
    style={styles.bottomButton}
    onPress={onBack}
  >
    <Text style={styles.bottomButtonText}>Back</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.bottomButton}
    onPress={handleNextPress}
  >
    <Text style={styles.bottomButtonText}>Next</Text>
  </TouchableOpacity>

</View>

    </SafeAreaView>
  );
};

export default ServiceDetails;