import React,{forwardRef} from 'react';
import {Text,TextInput} from 'react-native';

function getReadableTextStyle(style){
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};

  const fontSize = flatStyle.fontSize;

  if (typeof fontSize !== 'number') {
    return style;
  }

  // Increase all AppText typography for better visibility while
  // preserving the existing hierarchy and relative sizing.
  const scale =
    fontSize <= 7 ? 1.35 :
    fontSize <= 10 ? 1.22 :
    fontSize <= 14 ? 1.14 :
    1.08;

  const increasedFontSize = Math.round(fontSize * scale * 10) / 10;
  const increasedLineHeight =
    typeof flatStyle.lineHeight === 'number'
      ? Math.round(flatStyle.lineHeight * scale * 10) / 10
      : undefined;

  return [
    style,
    {
      fontSize: increasedFontSize,
      ...(increasedLineHeight ? {lineHeight: increasedLineHeight} : {}),
    },
  ];
}

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={getReadableTextStyle(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  return <TextInput ref={ref} {...props} style={style}/>;
});

export default AppText;
