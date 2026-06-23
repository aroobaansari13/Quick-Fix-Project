import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
  },
  subText: {
    fontSize: 14,
    color: COLORS.primary, // Your Global Dark Blue Theme
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 52,
    color: '#333333',
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  signInText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageUploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  imageUploadBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  uploadText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
});