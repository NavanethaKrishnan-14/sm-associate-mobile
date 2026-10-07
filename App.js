import React,{useEffect,useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost,installPremiumAlert} from './src/components/PremiumAlert';

export default function App(){
  const alertRef=useRef(null);

  useEffect(()=>{installPremiumAlert();},[]);


  return (
    <SafeAreaProvider>
      <StatusBar style="light"/>
      <AppNavigator/>
      <PremiumAlertHost ref={alertRef}/>
    </SafeAreaProvider>
  );
}
