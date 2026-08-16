import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 15,
  },

  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  backButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
  },

  map: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
  },

  noLocationText: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});