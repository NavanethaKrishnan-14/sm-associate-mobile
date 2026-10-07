import React,{forwardRef} from 'react';
import {StyleSheet,Text,TextInput} from 'react-native';

function getInterFamily(fontWeight){
  switch(String(fontWeight||'400')){
    case '300':
      return 'Inter_300Light';
    case '500':
      return 'Inter_500Medium';
    case '600':
      return 'Inter_600SemiBold';
    case '700':
    case 'bold':
      return 'Inter_700Bold';
    case '800':
    case '900':
      return 'Inter_800ExtraBold';
    default:
      return 'Inter_400Regular';
  }
}

function getReadableTextStyle(style){
  const flatStyle=StyleSheet.flatten(style)||{};
  const fontSize=flatStyle.fontSize;

  const scale=
    typeof fontSize!=='number' ? 1 :
    fontSize<=7 ? 1.35 :
    fontSize<=10 ? 1.22 :
    fontSize<=14 ? 1.14 :
    1.08;

  const increasedFontSize=
    typeof fontSize==='number'
      ? Math.round(fontSize*scale*10)/10
      : undefined;

  const increasedLineHeight=
    typeof flatStyle.lineHeight==='number'
      ? Math.round(flatStyle.lineHeight*scale*10)/10
      : undefined;

  return [
    style,
    {
      fontFamily:getInterFamily(flatStyle.fontWeight),
      ...(increasedFontSize!==undefined ? {fontSize:increasedFontSize} : {}),
      ...(increasedLineHeight!==undefined ? {lineHeight:increasedLineHeight} : {}),
    },
  ];
}

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={getReadableTextStyle(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  const flatStyle=StyleSheet.flatten(style)||{};
  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        style,
        {fontFamily:getInterFamily(flatStyle.fontWeight)},
      ]}
    />
  );
});

export default AppText;
