import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header */

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  backIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '700',
    color: '#1E293B',
  },

  headerSpacer: {
    width: 40,
  },

  /* Scroll */

  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Buttons ke liye proper space
  },

  /* Cards */

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },

  /* Customer */

  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E5E7EB',
  },

  profilePlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  customerDetails: {
    marginLeft: 14,
    flex: 1,
  },

  customerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  customerStatus: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  /* Services */

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  serviceInfo: {
    flex: 1,
    paddingRight: 10,
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* Description */

  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },

  /* Request Information */

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },

  pendingStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
    textTransform: 'capitalize',
  },

  /* Bottom Buttons */

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25, // Safe area ke liye thora mazeed space
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 10, // Buttons ko upar rakhne ke liye shadow/elevation
    zIndex: 999,
  },

  rejectButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  rejectButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  acceptButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Empty */

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

});