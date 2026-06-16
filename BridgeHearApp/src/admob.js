
import { Platform } from 'react-native';

export const BANNER_ID = 'ca-app-pub-3973742192500595/5348035338';
export const INTERSTITIAL_ID = 'ca-app-pub-3973742192500595/2889688105';

export const getBannerId = () => {
  if (Platform.OS === 'web') return null;
  const { TestIds } = require('react-native-google-mobile-ads');
  return __DEV__ ? TestIds.BANNER : BANNER_ID;
};

export const getInterstitialId = () => {
  if (Platform.OS === 'web') return null;
  const { TestIds } = require('react-native-google-mobile-ads');
  return __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_ID;
};

export const cargarInterstitial = () => {
  if (Platform.OS === 'web') return null;
  const { InterstitialAd } = require('react-native-google-mobile-ads');
  const ad = InterstitialAd.createForAdRequest(getInterstitialId());
  ad.load();
  return ad;
};

export const mostrarInterstitial = (onClosed) => {
  if (Platform.OS === 'web') { if (onClosed) onClosed(); return; }
  if (onClosed) onClosed();
};
