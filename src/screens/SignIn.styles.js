import { StyleSheet } from 'react-native';
import { COLORS } from '../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  headerSection: {
    marginBottom: 20, 
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 5, 
  },
  subText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  formSection: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 12, 
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#333333',
    fontSize: 15,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 2, 
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 5,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  signUpLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});