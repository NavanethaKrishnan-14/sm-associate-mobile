import React,{forwardRef} from 'react';
import {Text,TextInput} from 'react-native';

function getDescriptionScale(style){
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};

  const fontSize = flatStyle.fontSize;
  if (typeof fontSize !== 'number' || fontSize < 8 || fontSize > 12) {
    return style;
  }

  const increasedFontSize = fontSize + 1.5;
  const increasedLineHeight =
    typeof flatStyle.lineHeight === 'number'
      ? flatStyle.lineHeight + 2
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
  return <Text ref={ref} {...props} style={getDescriptionScale(style)}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  return <TextInput ref={ref} {...props} style={style}/>;
});

export default AppText;
