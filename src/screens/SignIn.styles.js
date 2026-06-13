import { StyleSheet } from 'react-native';
import { COLORS } from '../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 40, // 🟢 Content ko top par push karne ke liye thodi padding
  },
  headerSection: {
    marginBottom: 20, // 🟢 Logo aur text ke baad ka gap kam kiya (Pehle 40 tha)
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 26, // 👈 Thoda mazeed compact kiya
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10, // Logo aur Welcome ke darmiyan space
  },
  subText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  formSection: {
    marginTop: 10, // 🟢 Header aur Input form ke darmiyan space kam ki
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 6, // 🟢 Label aur Input box ka gap kam kiya
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
    height: 52, // 🟢 Input box ki height thodi compact ki (Pehle 56 thi)
    marginBottom: 12, // 🟢 Email aur Password fields ke darmiyan ka gap kam kiya (Pehle 20 tha)
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
    marginTop: 2, // 🟢 Password input ke foran baad chipkane ke liye
    marginBottom: 20, // 🟢 Forgot password aur Sign In button ka gap kam kiya (Pehle 30 tha)
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 52, // 🟢 Button ki height compact ki
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 5, // Extra push spacing
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
    marginTop: 25, // 🟢 Button ke baad bottom area ki narrow space
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