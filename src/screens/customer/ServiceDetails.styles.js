import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Header Section
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  providerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  businessName: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  statusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  infoText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  // Services Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    paddingLeft: 4,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Description ke liye alignment change ki
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceInfoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary, // Theme color
  },
  descText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },

  // Requirements Section
  descCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1F2937',
  },

  // Button
  nextButton: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});