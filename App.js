import React,{useEffect,useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {ActivityIndicator,View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from '@expo-google-fonts/manrope/useFonts';
import {Manrope200} from '@expo-google-fonts/manrope/200ExtraLight';
import {Manrope300} from '@expo-google-fonts/manrope/300Light';
import {Manrope400} from '@expo-google-fonts/manrope/400Regular';
import {Manrope500} from '@expo-google-fonts/manrope/500Medium';
import {Manrope600} from '@expo-google-fonts/manrope/600SemiBold';
import {Manrope700} from '@expo-google-fonts/manrope/700Bold';
import {Manrope800} from '@expo-google-fonts/manrope/800ExtraBold';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded,fontError]=useFonts({
    Manrope200,
    Manrope300,
    Manrope400,
    Manrope500,
    Manrope600,
    Manrope700,
    Manrope800
  });

  useEffect(()=>{installPremiumAlert();},[]);

  if(!fontsLoaded&&!fontError){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#0B1720'}}>
        <ActivityIndicator size="large" color="#27A89A"/>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light"/>
      <AppNavigator/>
      <PremiumAlertHost ref={alertRef}/>
    </SafeAreaProvider>
  );
}
