import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../config/theme'; // Apne path ke mutabiq adjust kar lein
import { styles } from './CustomAlert.styles';

const CustomAlert = ({
  visible,
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  message,
  buttons = [], // Array of objects: [{ text: 'Cancel', onPress: fn, style: 'cancel' | 'destructive' | 'default' }]
  onClose,
}) => {
  // Theme colors ke sath configuration
  const getConfig = () => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: COLORS.success, bg: '#E8F8EC' };
      case 'error':
        return { icon: 'alert-circle', color: COLORS.error, bg: '#FFEBEA' };
      case 'warning':
        return { icon: 'warning', color: '#F59E0B', bg: '#FEF3C7' };
      default:
        return { icon: 'information-circle', color: COLORS.primary, bg: '#E6ECF5' };
    }
  };

  const config = getConfig();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* ICON */}
          <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
            <Icon name={config.icon} size={32} color={config.color} />
          </View>

          {/* TITLE & MESSAGE */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            {buttons && buttons.length > 0 ? (
              buttons.map((btn, index) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';

                let btnBg = COLORS.primary; // App primary theme color
                let btnText = COLORS.white;

                if (isCancel) {
                  btnBg = COLORS.background;
                  btnText = COLORS.gray;
                } else if (isDestructive) {
                  btnBg = COLORS.error;
                  btnText = COLORS.white;
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      { backgroundColor: btnBg },
                      buttons.length === 1 && styles.singleButton,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (btn.onPress) btn.onPress();
                      if (onClose) onClose();
                    }}
                  >
                    <Text style={[styles.buttonText, { color: btnText }]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              // Default OK button
              <TouchableOpacity
                style={[styles.button, styles.singleButton, { backgroundColor: COLORS.primary }]}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: COLORS.white }]}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;