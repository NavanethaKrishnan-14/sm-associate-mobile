import React,{forwardRef} from 'react';
import {StyleSheet,Text,TextInput} from 'react-native';

function getInterFamily(fontWeight){
  switch(String(fontWeight||'400')){
    case '300': return 'Inter_300Light';
    case '500': return 'Inter_500Medium';
    case '600': return 'Inter_600SemiBold';
    case '700':
    case 'bold': return 'Inter_700Bold';
    case '800':
    case '900': return 'Inter_800ExtraBold';
    default: return 'Inter_400Regular';
  }
}

function resolveWeight(flatStyle){
  if(flatStyle.fontWeight!==undefined && flatStyle.fontWeight!==null){
    return flatStyle.fontWeight;
  }

  const size=flatStyle.fontSize;
  if(typeof size==='number'){
    if(size>=28) return '800';
    if(size>=20) return '700';
    if(size>=15) return '600';
    return '500';
  }

  return '500';
}

function getReadableTextStyle(style){
  const flatStyle=StyleSheet.flatten(style)||{};
  const fontSize=flatStyle.fontSize;
  const resolvedWeight=resolveWeight(flatStyle);

  return [
    style,
    {
      fontFamily:getInterFamily(resolvedWeight),
      fontWeight:'400',
      ...(typeof fontSize==='number' ? {fontSize} : {}),
      ...(typeof flatStyle.lineHeight==='number' ? {lineHeight:flatStyle.lineHeight} : {}),
    },
  ];
}

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={getReadableTextStyle(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  const flatStyle=StyleSheet.flatten(style)||{};
  const resolvedWeight=flatStyle.fontWeight ?? '500';

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        style,
        {
          fontFamily:getInterFamily(resolvedWeight),
          fontWeight:'400',
        },
      ]}
    />
  );
});

export default AppText;
