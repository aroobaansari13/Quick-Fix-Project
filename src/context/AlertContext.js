import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert as NativeAlert } from 'react-native';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

let globalShowAlert = null;

// Original React Native Alert ko save kar rahe hain
const originalAlert = NativeAlert.alert;

// Global Alert.alert ko intercept karna
NativeAlert.alert = (title, message, buttons, options) => {
  if (globalShowAlert) {
    let type = 'info';

    const lowerTitle = String(title || '').toLowerCase();

    if (
      lowerTitle.includes('error') ||
      lowerTitle.includes('failed') ||
      lowerTitle.includes('failure')
    ) {
      type = 'error';
    } else if (
      lowerTitle.includes('success') ||
      lowerTitle.includes('submitted') ||
      lowerTitle.includes('accepted') ||
      lowerTitle.includes('completed') ||
      lowerTitle.includes('deleted')
    ) {
      type = 'success';
    } else if (
      lowerTitle.includes('warning') ||
      lowerTitle.includes('denied')
    ) {
      type = 'warning';
    }

    globalShowAlert({
      type,
      title: title || '',
      message: message || '',
      buttons: buttons || [],
    });

    return;
  }

  // Agar AlertProvider abhi available nahi hai
  originalAlert(title, message, buttons, options);
};

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = ({
    type = 'info',
    title = '',
    message = '',
    buttons = [],
  }) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  useEffect(() => {
    globalShowAlert = showAlert;

    return () => {
      globalShowAlert = null;
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);