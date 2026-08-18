import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';
import CustomerSignUp from './src/screens/auth/customer/CustomerSignUp';
import CustomerHome from './src/screens/customer/CustomerHome';
import ManageProfile from './src/screens/customer/ManageProfile'; 
import TermsAndPolicies from './src/screens/customer/TermsAndPolicies'; // 🌟 Nayi screen import ki
import SignIn from './src/screens/SignIn';
import ProviderSelection from './src/screens/auth/provider/ProviderSelection';
import MechanicSignUpContainer from './src/screens/auth/provider/mechanic/MechanicSignUpContainer';
import AdminDashboard from './src/screens/admin/AdminDashboard';
import PendingReviewScreen from './src/screens/auth/provider/PendingReviewScreen';
import MechanicHome from './src/screens/provider/mechanic/MechanicHome';
import FuelStationSignUpContainer from './src/screens/auth/provider/fuel/FuelStationSignUpContainer';
import FuelStationHome from './src/screens/provider/fuel/FuelStationHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; 
import AdminPendingApplications from './src/screens/admin/AdminPendingApplications';
import AdminCustomerList from './src/screens/admin/AdminCustomerList';
import AdminCustomerDetail from './src/screens/admin/AdminCustomerDetail';
import AdminProviderList from './src/screens/admin/AdminProviderList';
import AdminProviderDetail from './src/screens/admin/AdminProviderDetail';
import AdminFeedbacks from './src/screens/admin/AdminFeedbacks';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ServiceDetails from './src/screens/customer/ServiceDetails';
import CheckoutScreen from './src/screens/customer/CheckoutScreen';
import { FCMService } from './src/services/FCMService';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [customerActiveTab, setCustomerActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // App component se bahar — top level par
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
   console.log('Background message:', remoteMessage);
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (isShowSplash) return;
      if (!user) {
        setCurrentScreen('selection');
      }
      else {
        await FCMService.initializeFCM();
      }
      setIsSessionChecking(false);
    });
    return () => unsubscribe();
  }, [isShowSplash]);
  
  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }
  
  if (isSessionChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Verifying Identity Securely...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {currentScreen === 'selection' && (
        <UserSelection 
          onCustomerPress={() => setCurrentScreen('customerSignUp')} 
          onSignInPress={() => setCurrentScreen('signIn')} 
          onProviderPress={() => setCurrentScreen('providerSelection')} 
        />
      )}

      {currentScreen === 'customerSignUp' && (
        <CustomerSignUp 
          onBack={() => setCurrentScreen('selection')}
          onSignUpSuccess={() => {
            setCustomerActiveTab('home');
            setCurrentScreen('customerHome');
          }}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}

      {currentScreen === 'signIn' && (
        <SignIn 
          onAdminLoginSuccess={() => setCurrentScreen('adminDashboard')}
          onBack={() => setCurrentScreen('selection')} 
          onSignInSuccess={(screenName) => setCurrentScreen(screenName)}
          navigation={{
            navigate: (screen) => setCurrentScreen(screen)
          }}
        />
      )}

      {currentScreen === 'forgotPasswordScreen' && (
        <ForgotPasswordScreen 
          navigation={{
            goBack: () => setCurrentScreen('signIn')
          }} 
        />
      )}

      {currentScreen === 'providerSelection' && (
        <ProviderSelection 
          onMechanicPress={() => setCurrentScreen('mechanicFlow')}
          onFuelPress={() => setCurrentScreen('fuelStationFlow')}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}

      {currentScreen === 'mechanicFlow' && (
        <MechanicSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={(targetScreen) => {
            if (targetScreen === 'pendingReview') {
               setCurrentScreen('pendingReview');
            } else {
                setCurrentScreen('mechanicHome');
            }
          }}
        />
      )}

      {currentScreen === 'mechanicHome' && (
        <MechanicHome onLogout={() => setCurrentScreen('signIn')} />
      )}

      {currentScreen === 'fuelStationFlow' && (
        <FuelStationSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={(targetScreen) => {
            if (targetScreen === 'pendingReview') {
              setCurrentScreen('pendingReview'); 
            } else {
              setCurrentScreen('fuelStationHome'); 
            }
          }} 
        />
      )}

      {currentScreen === 'fuelStationHome' && (
        <FuelStationHome onLogout={() => setCurrentScreen('signIn')} />
      )}

      {currentScreen === 'pendingReview' && (
        <PendingReviewScreen 
          onBackToSignIn={async () => {
            try {
              await auth().signOut(); 
              await AsyncStorage.multiRemove(['userRole', 'lastActive']);
            } catch (e) { console.log(e); }
            setCurrentScreen('signIn');
          }} 
        />
      )}

      {currentScreen === 'adminDashboard' && (
        <AdminDashboard 
          onLogout={() => setCurrentScreen('signIn')}
          onPendingApplicationsPress={() => setCurrentScreen('pendingAppsList')}
          onCustomersPress={() => setCurrentScreen('adminCustomerList')}
          onProvidersPress={() => setCurrentScreen('adminProviderList')}
          onFeedbacksPress={() => setCurrentScreen('feedbacksList')} 
        />
      )}
      {currentScreen === 'pendingAppsList' && (
        <AdminPendingApplications 
          onBack={() => setCurrentScreen('adminDashboard')} 
        />
      )}
      {currentScreen === 'adminCustomerList' && (
        <AdminCustomerList 
          onBack={() => setCurrentScreen('adminDashboard')}
          onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          setCurrentScreen('adminCustomerDetail');
          }}
        />
      )}

      {currentScreen === 'adminCustomerDetail' && (
        <AdminCustomerDetail 
          customer={selectedCustomer}
          onBack={() => setCurrentScreen('adminCustomerList')}
        />
      )}

      {currentScreen === 'adminProviderList' && (
        <AdminProviderList 
          onBack={() => setCurrentScreen('adminDashboard')}
          onSelectProvider={(provider) => {
          setSelectedProvider(provider);
          setCurrentScreen('adminProviderDetail');
          }}
        />
      )}

      {currentScreen === 'adminProviderDetail' && (
        <AdminProviderDetail 
          provider={selectedProvider}
          onBack={() => setCurrentScreen('adminProviderList')}
        />
      )}

      {currentScreen === 'feedbacksList' && (
        <AdminFeedbacks 
          onBack={() => setCurrentScreen('adminDashboard')} 
        />
      )}

      {currentScreen === 'customerHome' && (
        <CustomerHome 
          onLogout={() => setCurrentScreen('signIn')} 
          initialTab={customerActiveTab} 
          profileImage={profileImage}
          onEditProfilePress={(newImage) => {
            setProfileImage(newImage); 
          }}
          onManageProfilePress={() => setCurrentScreen('manageProfile')}
          onTermsAndPoliciesPress={() => setCurrentScreen('termsAndPolicies')} 
          onServiceSelect={(item) => {
            setSelectedService(item); // Click ki hui service save ki
            setCurrentScreen('serviceDetails'); // Nayi screen par switch kiya
          }}
        />
      )}

      {currentScreen === 'serviceDetails' && (
        <ServiceDetails 
          service={selectedService} 
          onBack={() => setCurrentScreen('customerHome')} 
          onNext={(data) => {
            setCheckoutData(data);
            setCurrentScreen('checkout');
          }}
        />
      )}

      {currentScreen === 'checkout' && (
        <CheckoutScreen
         data={checkoutData}
         onBack={() => setCurrentScreen('serviceDetails')}
        />
      )}

      {currentScreen === 'manageProfile' && (
        <ManageProfile 
          navigation={{
            goBack: () => {
              setCustomerActiveTab('profile'); 
              setCurrentScreen('customerHome');
            }
          }} 
        />
      )}

      {/* 🟢 2. TermsAndPolicies Screen ka navigation route */}
      {currentScreen === 'termsAndPolicies' && (
        <TermsAndPolicies 
          navigation={{
            goBack: () => {
              setCustomerActiveTab('profile'); // Back jane par default profile tab hi open rahega
              setCurrentScreen('customerHome');
            }
          }} 
        />
      )}
    </View>
  );
};

export default App;