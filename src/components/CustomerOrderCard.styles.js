import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },

  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  requestText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  statusButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  trackButton: {
    backgroundColor: '#1E3A8A',
  },

  statusButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 7,
  },

  trackButtonText: {
    color: '#FFFFFF',
  },

});