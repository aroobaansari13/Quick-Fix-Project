import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 1,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileStatus: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailIcon: {
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 2,
  },
  actionContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  disableButton: {
    backgroundColor: '#D97706',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});