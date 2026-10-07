import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/inter/useFonts';
import {Inter_300Light} from '@expo-google-fonts/inter/300Light';
import {Inter_400Regular} from '@expo-google-fonts/inter/400Regular';
import {Inter_500Medium} from '@expo-google-fonts/inter/500Medium';
import {Inter_600SemiBold} from '@expo-google-fonts/inter/600SemiBold';
import {Inter_700Bold} from '@expo-google-fonts/inter/700Bold';
import {Inter_800ExtraBold} from '@expo-google-fonts/inter/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {Text,TextInput} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

function applyGlobalInterDefaults(){
  Text.defaultProps={...(Text.defaultProps||{}),style:[Text.defaultProps?.style,{fontFamily:'Inter_400Regular'}]};
  TextInput.defaultProps={...(TextInput.defaultProps||{}),style:[TextInput.defaultProps?.style,{fontFamily:'Inter_400Regular'}]};
}

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(()=>{installPremiumAlert();},[]);
  useEffect(()=>{if(fontsLoaded) applyGlobalInterDefaults();},[fontsLoaded]);

  if(!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light"/>
      <AppNavigator/>
      <PremiumAlertHost ref={alertRef}/>
    </SafeAreaProvider>
  );
}
