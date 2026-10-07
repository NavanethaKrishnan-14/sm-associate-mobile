import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/manrope/useFonts';
import {Manrope_300Light} from '@expo-google-fonts/manrope/300Light';
import {Manrope_400Regular} from '@expo-google-fonts/manrope/400Regular';
import {Manrope_500Medium} from '@expo-google-fonts/manrope/500Medium';
import {Manrope_600SemiBold} from '@expo-google-fonts/manrope/600SemiBold';
import {Manrope_700Bold} from '@expo-google-fonts/manrope/700Bold';
import {Manrope_800ExtraBold} from '@expo-google-fonts/manrope/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
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
