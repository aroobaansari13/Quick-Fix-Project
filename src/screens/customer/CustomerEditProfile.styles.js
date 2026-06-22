import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../../config/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 45,
    marginBottom: 15,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrowBtn: {
    marginRight: 12,
    padding: 4,
  },
  cardTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  saveTickBtn: {
    padding: 4,
  },
  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  imageTouchArea: {
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  hintText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '500',
  },
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    justifyContent: 'flex-end',
    zIndex: 99999,
  },
  sheetDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 42 : 32,
    width: '100%',
  },
  sheetHandleBAR: {
    width: 36,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetCloseIcon: {
    marginRight: 15,
  },
  sheetTitleText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1E293B',
  },
  trashBinBtn: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 50,
  },
  optionsFlexRow: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 40,
  },
  optionClickBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F0F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E1EDF7',
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
});