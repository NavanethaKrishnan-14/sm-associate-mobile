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

function getVisibleFontSize(fontSize){
  if(typeof fontSize!=='number') return undefined;

  if(fontSize<=7) return fontSize+2;
  if(fontSize<=10) return fontSize+2;
  if(fontSize<=12) return fontSize+1.5;
  if(fontSize<=14) return fontSize+1;
  return fontSize;
}

function getVisibleLineHeight(lineHeight,fontSize){
  if(typeof fontSize!=='number') return lineHeight;
  const visibleSize=getVisibleFontSize(fontSize);
  if(typeof lineHeight==='number'){
    return Math.max(lineHeight,Math.round((visibleSize+5)*10)/10);
  }
  return undefined;
}

function getReadableTextStyle(style){
  const flatStyle=StyleSheet.flatten(style)||{};
  const fontSize=flatStyle.fontSize;
  const resolvedWeight=resolveWeight(flatStyle);
  const visibleFontSize=getVisibleFontSize(fontSize);
  const visibleLineHeight=getVisibleLineHeight(flatStyle.lineHeight,fontSize);

  return [
    style,
    {
      fontFamily:getInterFamily(resolvedWeight),
      fontWeight:'400',
      ...(visibleFontSize!==undefined ? {fontSize:visibleFontSize} : {}),
      ...(visibleLineHeight!==undefined ? {lineHeight:visibleLineHeight} : {}),
    },
  ];
}

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={getReadableTextStyle(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  const flatStyle=StyleSheet.flatten(style)||{};
  const resolvedWeight=flatStyle.fontWeight ?? '500';
  const fontSize=flatStyle.fontSize;
  const visibleFontSize=getVisibleFontSize(fontSize);
  const visibleLineHeight=getVisibleLineHeight(flatStyle.lineHeight,fontSize);

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        style,
        {
          fontFamily:getInterFamily(resolvedWeight),
          fontWeight:'400',
          ...(visibleFontSize!==undefined ? {fontSize:visibleFontSize} : {}),
          ...(visibleLineHeight!==undefined ? {lineHeight:visibleLineHeight} : {}),
        },
      ]}
    />
  );
});

export default AppText;
