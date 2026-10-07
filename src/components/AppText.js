import React,{forwardRef} from 'react';
import {Text,TextInput} from 'react-native';

export const AppText=forwardRef(function AppText({style,...props},ref){
  return <Text ref={ref} {...props} style={style}/>;
});

export const AppTextInput=forwardRef(function AppTextInput({style,...props},ref){
  return <TextInput ref={ref} {...props} style={style}/>;
});

export default AppText;
