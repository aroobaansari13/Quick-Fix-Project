import { StyleSheet } from 'react-native';
import { COLORS } from '../../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButtonRow: {
  width: '100%',
  alignItems: 'flex-start',
  marginTop: 0,
  paddingTop: 0,
},
backButton: {
  padding: 4,
  backgroundColor: 'transparent',
  marginTop:25
  
},
  logo1: {
    width: 120,
    height: 120,
    marginBottom: 10,
    marginTop:145
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    // marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signInText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 60
  },
});