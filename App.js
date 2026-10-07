import React,{useEffect,useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text,TextInput} from 'react-native';
import {useFonts,Montserrat_400Regular,Montserrat_500Medium,Montserrat_600SemiBold,Montserrat_700Bold,Montserrat_800ExtraBold,Montserrat_900Black} from '@expo-google-fonts/montserrat';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);
  const [fontsLoaded]=useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  useEffect(()=>{installPremiumAlert();},[]);

  useEffect(()=>{
    if(!fontsLoaded) return;
    const originalTextStyle=Text.defaultProps?.style;
    const originalInputStyle=TextInput.defaultProps?.style;
    Text.defaultProps={
      ...Text.defaultProps,
      style:[originalTextStyle,{fontFamily:'Montserrat_400Regular'}],
    };
    TextInput.defaultProps={
      ...TextInput.defaultProps,
      style:[originalInputStyle,{fontFamily:'Montserrat_400Regular'}],
    };
    return ()=>{
      if(originalTextStyle!==undefined){
        Text.defaultProps={...Text.defaultProps,style:originalTextStyle};
      }
      if(originalInputStyle!==undefined){
        TextInput.defaultProps={...TextInput.defaultProps,style:originalInputStyle};
      }
    };
  },[fontsLoaded]);

  if(!fontsLoaded) return null;

  return <SafeAreaProvider>
    <StatusBar style="light"/>
    <AppNavigator/>
    <PremiumAlertHost ref={alertRef}/>
  </SafeAreaProvider>;
}
