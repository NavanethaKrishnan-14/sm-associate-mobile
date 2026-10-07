import React,{forwardRef} from 'react';
import {Text,TextInput,StyleSheet} from 'react-native';

const MANROPE={
  100:'Manrope200',
  200:'Manrope200',
  300:'Manrope300',
  400:'Manrope400',
  500:'Manrope500',
  600:'Manrope600',
  700:'Manrope700',
  800:'Manrope800',
  900:'Manrope800',
  normal:'Manrope400',
  bold:'Manrope700'
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
