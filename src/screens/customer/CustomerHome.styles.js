import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25, 
    height: 55,
    marginHorizontal: 15,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 1,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 22,
    color: COLORS.primary, 
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }], 
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1, // Taake bottom nav map ke upar click ho sake
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666666',
  },
  activeNavText: {
  fontSize: 12,
  marginTop: 4,
  color: COLORS.primary, 
  fontWeight: '600',
},
uiOverlay: { 
  position: 'absolute', 
  top: 50, 
  left: 20, 
  right: 20, 
  zIndex: 10 
},
resultsDropdown: {
  backgroundColor: '#FFFFFF',
  marginTop: 10,
  marginHorizontal: 20, // Search bar ke sath perfect align karne ke liye
  borderRadius: 20,     // Thoda zyada round corners
  padding: 5,
  elevation: 8,         // Thoda gehra shadow taake card "pop" kare
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  maxHeight: 300,
},

resultItem: {
  paddingVertical: 15,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#F5F5F5', // Light divider
},
});