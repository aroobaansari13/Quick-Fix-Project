import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  backButton: {
  paddingHorizontal: 20,
  paddingVertical: 12,
},

backButtonText: {
  fontSize: 30,
  fontWeight: '700',
  color: '#01040d',
},

scrollContent: {
  padding: 20,
  paddingBottom: 100,
},
cus:{
padding:9
},
customerHeaderName: {
  flex: 1,
  fontSize: 18,
  fontWeight: '700',
  color: '#111827',
  marginLeft: 10
},
customerHeaderImage: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginLeft: 10,
},

customerHeaderPlaceholder: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginLeft: 1,
  backgroundColor: '#E5E7EB',
  justifyContent: 'center',
  alignItems: 'center',
},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  descText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
 bottomButtons: {
  flexDirection: 'row',
  width: '100%',
  paddingHorizontal: 20,
  gap: 15,
  paddingBottom: 23,
},

bottomButton: {
  flex: 1,
  height: 60,
  borderRadius: 13,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
},
  confirmButton: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    flex:1
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
