import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/plus-jakarta-sans/useFonts';
import {PlusJakartaSans_300Light} from '@expo-google-fonts/plus-jakarta-sans/300Light';
import {PlusJakartaSans_400Regular} from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import {PlusJakartaSans_500Medium} from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import {PlusJakartaSans_600SemiBold} from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import {PlusJakartaSans_700Bold} from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import {PlusJakartaSans_800ExtraBold} from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
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
