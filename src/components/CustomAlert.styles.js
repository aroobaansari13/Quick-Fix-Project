import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../config/theme'; // Apne path ke mutabiq adjust kar lein

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  message: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.extraLarge,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  singleButton: {
    width: '100%',
  },
  buttonText: {
    fontSize: SIZES.font,
    fontWeight: FONTS.semiBold,
  },
});