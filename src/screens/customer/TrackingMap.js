import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import { styles } from './TrackingMap.styles';

const TrackingMap = ({ request, onBack }) => {
  const [providerLocation, setProviderLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!request?.providerId) {
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const findAndTrackProvider = async () => {
      try {
        // ✅ providerType se directly sahi collection choose karo
        let targetCollection = null;

        if (request.providerType === 'mechanic') {
          targetCollection = 'Mechanics';
        } else if (
          request.providerType === 'fuel_station' ||
          request.providerType === 'fuelStation'
        ) {
          targetCollection = 'FuelStations';
        } else {
          // Fallback — dono check karo
          const mechDoc = await firestore()
            .collection('Mechanics')
            .doc(request.providerId)
            .get();

          if (mechDoc.exists) {
            targetCollection = 'Mechanics';
          } else {
            const fuelDoc = await firestore()
              .collection('FuelStations')
              .doc(request.providerId)
              .get();

            if (fuelDoc.exists) {
              targetCollection = 'FuelStations';
            }
          }
        }

        if (!targetCollection) {
          console.log('❌ Provider not found');
          setLoading(false);
          return;
        }

        console.log('✅ Tracking from:', targetCollection);

        // ✅ Realtime listener
        const docRef = firestore()
          .collection(targetCollection)
          .doc(request.providerId);

        unsubscribe = docRef.onSnapshot(
          doc => {
            if (doc.exists) {
              const data = doc.data();
              const location = data?.currentLocation;

              if (
                location &&
                typeof location.latitude === 'number' &&
                typeof location.longitude === 'number'
              ) {
                setProviderLocation({
                  latitude: location.latitude,
                  longitude: location.longitude,
                });
                console.log('📍 Location updated:', location);
              } else {
                console.log('⚠️ currentLocation missing');
                setProviderLocation(null);
              }
            }
            setLoading(false);
          },
          error => {
            console.log('Snapshot error:', error);
            setLoading(false);
          }
        );

      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    findAndTrackProvider();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [request?.providerId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Locating provider...</Text>
      </View>
    );
  }

  if (!providerLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noLocationText}>
          Provider location not available yet. Please wait...
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${providerLocation.latitude}, ${providerLocation.longitude}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          L.marker([${providerLocation.latitude}, ${providerLocation.longitude}])
            .addTo(map)
            .bindPopup('${request.providerName || "Provider"} is here')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Tracking {request.providerName || 'Provider'}
        </Text>
      </View>
      <WebView source={{ html: mapHtml }} style={styles.map} />
    </View>
  );
};

export default TrackingMap;