import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  sheetHandleBAR: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetCloseIcon: {
    padding: 2,
  },
  sheetTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  doneBtnBlock: {
    padding: 2,
  },
  trashBinBtn: {
    padding: 2,
  },
  previewImageWrapper: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewImageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  previewHintText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  optionsFlexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 35,
    paddingTop: 10,
    paddingLeft: 10,
  },
  optionClickBlock: {
    alignItems: 'center',
  },
  iconCircleWrapper: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabelText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
});