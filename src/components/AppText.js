import React,{forwardRef} from 'react';
import {Text,TextInput,StyleSheet} from 'react-native';

const MANROPE={
  100:'Manrope_200ExtraLight',
  200:'Manrope_200ExtraLight',
  300:'Manrope_300Light',
  400:'Manrope_400Regular',
  500:'Manrope_500Medium',
  600:'Manrope_600SemiBold',
  700:'Manrope_700Bold',
  800:'Manrope_800ExtraBold',
  900:'Manrope_800ExtraBold',
  normal:'Manrope_400Regular',
  bold:'Manrope_700Bold'
};

function resolveFontFamily(style){
  const flat=StyleSheet.flatten(style)||{};
  return flat.fontFamily || MANROPE[String(flat.fontWeight||'400')] || MANROPE[400];
}

function normalizeStyle(style){
  const flat=StyleSheet.flatten(style)||{};
  return {...flat,fontFamily:resolveFontFamily(flat),fontWeight:undefined};
}

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={normalizeStyle(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  return <TextInput ref={ref} {...props} style={[{fontFamily:MANROPE[400]},normalizeStyle(style)]}/>;
});

export default AppText;
