import { StyleSheet } from 'react-native';
import { COLORS } from '../../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerText: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#1E293B',
  textAlign: 'center',
  flex: 1, 
  marginRight: 50
},
  subText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  backButtonRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // 🌟 Left, Center aur Right elements ko balance karne ke liye
  marginBottom: 5,
  marginTop: 10,
},
backButton: {
  padding: 4,
  backgroundColor: 'transparent',
},
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  signInText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  }
});