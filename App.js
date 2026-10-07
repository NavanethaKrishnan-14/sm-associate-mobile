import React,{useEffect,useRef} from 'react';
import {useFonts} from '@expo-google-fonts/noto-sans/useFonts';
import {NotoSans_300Light} from '@expo-google-fonts/noto-sans/300Light';
import {NotoSans_400Regular} from '@expo-google-fonts/noto-sans/400Regular';
import {NotoSans_500Medium} from '@expo-google-fonts/noto-sans/500Medium';
import {NotoSans_600SemiBold} from '@expo-google-fonts/noto-sans/600SemiBold';
import {NotoSans_700Bold} from '@expo-google-fonts/noto-sans/700Bold';
import {NotoSans_800ExtraBold} from '@expo-google-fonts/noto-sans/800ExtraBold';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_800ExtraBold,
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
