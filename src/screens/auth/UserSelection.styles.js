import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,           
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo1: {
    width: 150,
    height: 150,
    marginTop: 120
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
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
  },
});