import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './TrackingMap.styles';

const TrackingMap = ({ request, onBack }) => {
  const [providerLocation, setProviderLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  // ✅ Customer ki real-time location
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerLocation({ latitude, longitude });
      },
      (error) => console.log('Customer location error:', error),
      { enableHighAccuracy: true, distanceFilter: 5, interval: 3000 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  // ✅ Provider real-time location
  useEffect(() => {
    if (!request?.providerId) {
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const findAndTrackProvider = async () => {
      try {
        let targetCollection = null;

        if (request.providerType === 'mechanic') {
          targetCollection = 'Mechanics';
        } else if (
          request.providerType === 'fuel_station' ||
          request.providerType === 'fuelStation'
        ) {
          targetCollection = 'FuelStations';
        } else {
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
            if (fuelDoc.exists) targetCollection = 'FuelStations';
          }
        }

        if (!targetCollection) {
          setLoading(false);
          return;
        }

        const docRef = firestore()
          .collection(targetCollection)
          .doc(request.providerId);

        unsubscribe = docRef.onSnapshot(doc => {
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

              // ✅ WebView ko real-time update bhejo
              if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`
                  updateProviderLocation(${location.latitude}, ${location.longitude});
                  true;
                `);
              }
            }
          }
          setLoading(false);
        }, error => {
          console.log('Snapshot error:', error);
          setLoading(false);
        });

      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    findAndTrackProvider();
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, [request?.providerId]);

  // ✅ Customer location update WebView ko bhejo
  useEffect(() => {
    if (customerLocation && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        updateCustomerLocation(${customerLocation.latitude}, ${customerLocation.longitude});
        true;
      `);
    }
  }, [customerLocation]);

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
          var providerLat = ${providerLocation.latitude};
          var providerLng = ${providerLocation.longitude};
          var customerLat = ${customerLocation?.latitude || providerLocation.latitude};
          var customerLng = ${customerLocation?.longitude || providerLocation.longitude};

          var map = L.map('map').setView([providerLat, providerLng], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          // ✅ Provider marker — blue
          var providerIcon = L.divIcon({
            html: '<div style="background:#1E3A8A;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            className: ''
          });

          // ✅ Customer marker — green
          var customerIcon = L.divIcon({
            html: '<div style="background:#10B981;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            className: ''
          });

          var providerMarker = L.marker([providerLat, providerLng], { icon: providerIcon })
            .addTo(map)
            .bindPopup('${request.providerName || "Provider"}')
            .openPopup();

          var customerMarker = L.marker([customerLat, customerLng], { icon: customerIcon })
            .addTo(map)
            .bindPopup('You');

          // ✅ Line between customer and provider
          var routeLine = L.polyline(
            [[customerLat, customerLng], [providerLat, providerLng]],
            { color: '#1E3A8A', weight: 4, opacity: 0.7, dashArray: '8, 8' }
          ).addTo(map);

          // ✅ Map ko fit karo dono markers ke beech
          var bounds = L.latLngBounds(
            [providerLat, providerLng],
            [customerLat, customerLng]
          );
          map.fitBounds(bounds, { padding: [50, 50] });

          // ✅ Provider location update function — React Native se call hoga
          function updateProviderLocation(lat, lng) {
            providerMarker.setLatLng([lat, lng]);
            routeLine.setLatLngs([
              customerMarker.getLatLng(),
              [lat, lng]
            ]);
          }

          // ✅ Customer location update function
          function updateCustomerLocation(lat, lng) {
            customerMarker.setLatLng([lat, lng]);
            routeLine.setLatLngs([
              [lat, lng],
              providerMarker.getLatLng()
            ]);
          }
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
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default TrackingMap;