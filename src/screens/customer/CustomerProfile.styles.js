import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Halka sa off-white taake top card ubar kar aaye
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 25,
    paddingTop: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 30, // Original bottom curve back!
    borderBottomRightRadius: 30, // Original bottom curve back!
    elevation: 3, // Soft shadow for card look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  profileImage: {
    marginTop: 20,
    width: 125,
    height: 125,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#002855', // Aapka original deep blue border color
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#002855', // Original camera circle color
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  tapToChangeText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Items ko white rounded blocks banaya
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent', // Clear separation using margin instead of line
    marginVertical: 4,
  },

  // 🟢 WhatsApp style Bottom Sheet Modal Styles
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: height * 0.35,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sheetHandleBAR: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetCloseIcon: {
    marginRight: 15,
    padding: 2,
  },
  sheetTitleText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1E293B',
  },
  trashBinBtn: {
    padding: 6,
  },
  optionsFlexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 40,
    paddingLeft: 8,
  },
  optionClickBlock: {
    alignItems: 'center',
  },
  iconCircleWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    fontWeight: '500',
  },
});