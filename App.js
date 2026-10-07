import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View} from 'react-native';
import {useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black} from '@expo-google-fonts/montserrat';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost, installPremiumAlert} from './src/components/PremiumAlert';

export default function App() {
  const alertRef = useRef(null);

  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  useEffect(() => {
    installPremiumAlert();
  }, []);

  if (!fontsLoaded && !fontError) {
    return <View style={{flex: 1}} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
      <PremiumAlertHost ref={alertRef} />
    </SafeAreaProvider>
  );
}
