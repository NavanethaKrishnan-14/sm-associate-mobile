import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text, TextInput} from 'react-native';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import AppNavigator from './src/navigation/AppNavigator';
import {PremiumAlertHost, installPremiumAlert} from './src/components/PremiumAlert';

export default function App() {
  const alertRef = useRef(null);

  const [fontsLoaded] = useFonts({
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

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      Text.defaultProps.style,
      {fontFamily: 'Montserrat_400Regular'},
    ];

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.style = [
      TextInput.defaultProps.style,
      {fontFamily: 'Montserrat_400Regular'},
    ];
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
      <PremiumAlertHost ref={alertRef} />
    </SafeAreaProvider>
  );
}
