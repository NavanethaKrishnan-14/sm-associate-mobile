import React from 'react';
import {Pressable,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {AppText} from './AppText';
import {colors} from '../theme/colors';

export default function ServiceHeader({title,subtitle,navigation,showBack=true,kicker='SM ASSOCIATE / SERVICES',actionLabel,actionIcon='add',onAction,count}){
 return <View style={{backgroundColor:colors.midnight,borderRadius:22,padding:18,marginBottom:18}}>
  <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
   {showBack&&navigation?<Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>navigation.canGoBack?.()?navigation.goBack():navigation.navigate?.('Main')} style={{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#29343C',borderWidth:1,borderColor:'#46535A'}}><Ionicons name="arrow-back" size={20} color={colors.white}/></Pressable>:null}
   <View style={{flex:1}}>
    <AppText style={{fontSize:10,color:colors.teal,letterSpacing:1.8}}>{kicker}</AppText>
    <AppText style={{fontSize:25,color:colors.white,marginTop:7}}>{title}</AppText>
   </View>
   {typeof count==='number'?<View style={{minWidth:42,paddingHorizontal:11,paddingVertical:9,borderRadius:12,backgroundColor:'#29343C',alignItems:'center'}}><AppText style={{fontSize:18,color:colors.white}}>{count}</AppText></View>:null}
   {actionLabel&&onAction?<Pressable accessibilityRole="button" onPress={onAction} style={{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:colors.teal,paddingHorizontal:11,paddingVertical:11,borderRadius:12}}><Ionicons name={actionIcon} size={18} color="#FFFFFF"/><AppText style={{fontSize:12,color:'#FFFFFF'}}>{actionLabel}</AppText></Pressable>:null}
  </View>
  <AppText style={{fontSize:12,color:'#C5CED1',marginTop:9,lineHeight:19}}>{subtitle}</AppText>
 </View>;
}
