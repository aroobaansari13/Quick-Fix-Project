import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16, 
    paddingTop: 40 
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  backBtn: { 
    padding: 8, 
    marginRight: 12, 
    borderRadius: 8, 
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1E293B' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#64748B', 
    fontWeight: '500' 
  },
  noDataText: { 
    fontSize: 15, 
    color: '#64748B', 
    marginTop: 10 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  cardBody: { 
    flex: 0.65 
  },
  providerName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0F172A' 
  },
  providerEmail: { 
    fontSize: 13, 
    color: '#64748B', 
    marginTop: 2 
  },
  viewDetailsBtn: { 
    backgroundColor: '#1E3A8A', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewDetailsText: { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  sectionCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 15, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1E3A8A', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9', 
    paddingBottom: 8, 
    marginBottom: 12 
  },
  infoText: { 
    fontSize: 14, 
    color: '#475569', 
    marginTop: 6 
  },
  boldLabel: { 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  imageGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  },
  imgWrapper: { 
    flex: 0.48 
  },
  imgLabel: { 
    fontSize: 12, 
    color: '#64748B', 
    marginBottom: 4, 
    textAlign: 'center', 
    fontWeight: '500' 
  },
  documentImage: { 
    width: '100%', 
    height: 110, 
    borderRadius: 8, 
    backgroundColor: '#E2E8F0' 
  },
  largeDocumentImage: { 
    width: '100%', 
    height: 160, 
    borderRadius: 8, 
    backgroundColor: '#E2E8F0', 
    marginBottom: 12,
    marginTop: 4
  },
  btnRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 5,
    marginBottom: 20
  },
  actionBtn: { 
    flex: 0.48, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  approveBtn: { 
    backgroundColor: '#08ad76' 
  },
  rejectBtn: { 
    backgroundColor: '#bd0a0a' 
  },
  btnText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  modalBackground: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.95)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  closeModalBtn: { 
    position: 'absolute', 
    top: 40, 
    right: 20, 
    zIndex: 10 
  },
  fullScreenImage: { 
    width: width, 
    height: height * 0.8 
  }
});