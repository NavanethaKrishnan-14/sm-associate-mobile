import {AppText,AppTextInput} from './AppText';
import React from 'react';
import {View} from 'react-native';
import {colors} from '../theme/colors';

export default function MetricCard({label,value,accent=colors.gold}) {
  return <View style={{flex:1,minWidth:'46%',backgroundColor:colors.white,borderRadius:20,padding:16,borderWidth:1,borderColor:'rgba(7,19,31,0.06)',marginBottom:10}}>
    <View style={{width:9,height:9,borderRadius:5,backgroundColor:accent,marginBottom:12}}/>
    <AppText style={{fontSize:25,color:colors.ink}}>{value}</Text>
    <AppText style={{fontSize:12,color:colors.muted,marginTop:4}}>{label}</Text>
  </View>;
}