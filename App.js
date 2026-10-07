import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/nunito-sans/useFonts';
import {NunitoSans_300Light} from '@expo-google-fonts/nunito-sans/300Light';
import {NunitoSans_400Regular} from '@expo-google-fonts/nunito-sans/400Regular';
import {NunitoSans_500Medium} from '@expo-google-fonts/nunito-sans/500Medium';
import {NunitoSans_600SemiBold} from '@expo-google-fonts/nunito-sans/600SemiBold';
import {NunitoSans_700Bold} from '@expo-google-fonts/nunito-sans/700Bold';
import {NunitoSans_800ExtraBold} from '@expo-google-fonts/nunito-sans/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(()=>{installPremiumAlert();},[]);

  if(!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light"/>
      <AppNavigator/>
      <PremiumAlertHost ref={alertRef}/>
    </SafeAreaProvider>
  );
}
