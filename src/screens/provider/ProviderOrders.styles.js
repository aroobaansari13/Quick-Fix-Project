import { StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme'; // Agar COLORS direct nahi milta toh upar check kar lein path

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary || '#1E3A8A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: COLORS.primary || '#1E3A8A',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60, // Tab bar ke balance ke liye
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  requestCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 15,
  padding: 15,
  marginBottom: 15,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

customerInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

profileImage: {
  width: 55,
  height: 55,
  borderRadius: 28,
  backgroundColor: '#E5E7EB',
},

customerText: {
  marginLeft: 12,
  flex: 1,
},

customerName: {
  fontSize: 17,
  fontWeight: '700',
  color: '#111827',
},

requestStatus: {
  fontSize: 13,
  color: '#6B7280',
  marginTop: 4,
},

viewDetailsButton: {
  marginTop: 15,
  backgroundColor: COLORS.primary,
  paddingVertical: 11,
  borderRadius: 10,
  alignItems: 'center',
},

viewDetailsText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '600',
},
});