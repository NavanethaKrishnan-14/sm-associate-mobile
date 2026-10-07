import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/poppins/useFonts';
import {Poppins_300Light} from '@expo-google-fonts/poppins/300Light';
import {Poppins_400Regular} from '@expo-google-fonts/poppins/400Regular';
import {Poppins_500Medium} from '@expo-google-fonts/poppins/500Medium';
import {Poppins_600SemiBold} from '@expo-google-fonts/poppins/600SemiBold';
import {Poppins_700Bold} from '@expo-google-fonts/poppins/700Bold';
import {Poppins_800ExtraBold} from '@expo-google-fonts/poppins/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
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
