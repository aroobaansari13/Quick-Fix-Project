import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#EFF6FF', // Light blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircle: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6', // Vibrant blue badge
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A', // Dark professional blue
    marginBottom: 15,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  }
});