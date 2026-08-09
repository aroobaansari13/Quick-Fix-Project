import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './ProviderEditProfileModal.styles';

const ProviderEditProfileModal = ({ visible, onClose, tempImage, onCameraPress, onGalleryPress, onDonePress, onRemovePress }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <TouchableOpacity style={styles.sheetDismissArea} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandleBAR} />
          
          <View style={styles.sheetHeaderRow}>
            <View style={styles.sheetHeaderLeft}>
              <TouchableOpacity onPress={onClose} style={styles.sheetCloseIcon}>
                <Icon name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.sheetTitleText}>Profile picture</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {tempImage && (
                <TouchableOpacity style={styles.doneBtnBlock} onPress={onDonePress}>
                  <Icon name="checkmark-circle" size={26} color="#10B981" /> 
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.trashBinBtn} onPress={onRemovePress}>
                <Icon name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {tempImage && (
            <View style={styles.previewImageWrapper}>
              <Image source={{ uri: tempImage }} style={styles.previewImageStyle} />
              <Text style={styles.previewHintText}>Click the green tick to save changes</Text>
            </View>
          )}

          <View style={styles.optionsFlexRow}>
            <TouchableOpacity style={styles.optionClickBlock} onPress={onCameraPress}>
              <View style={[styles.iconCircleWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="camera" size={26} color="#2E7D32" />
              </View>
              <Text style={styles.optionLabelText}>Camera</Text>
            </TouchableOpacity>

            {/* 🟢 Galti yahan thi: openGallery ko hata kar sirf onGalleryPress set kar diya hai */}
            <TouchableOpacity style={styles.optionClickBlock} onPress={onGalleryPress}>
              <View style={[styles.iconCircleWrapper, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="image" size={26} color="#1565C0" />
              </View>
              <Text style={styles.optionLabelText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProviderEditProfileModal;