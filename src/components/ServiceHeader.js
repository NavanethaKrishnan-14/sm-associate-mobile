import React from 'react';
import {Pressable,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {AppText} from './AppText';
import {colors} from '../theme/colors';

export default function ServiceHeader({title,subtitle,navigation,showBack=true,kicker='SM ASSOCIATE / SERVICES',actionLabel,actionIcon='add',onAction,count}){
 return <View style={{marginBottom:18}}>
  {showBack&&navigation?<Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>navigation?.canGoBack?.()?navigation.goBack():navigation?.navigate?.('Main')} style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-start',paddingVertical:10,paddingHorizontal:14,marginBottom:12,borderRadius:12,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1E6E3'}}>
   <AppText style={{fontSize:20,color:colors.ink,marginRight:8}}>‹</AppText>
   <AppText style={{fontSize:13,color:colors.ink}}>Back</AppText>
  </Pressable>:null}
  <View style={{backgroundColor:colors.midnight,borderRadius:22,padding:20}}>
   <View style={{alignItems:'flex-end'}}>
    <AppText style={{fontSize:11,color:colors.teal,letterSpacing:2,textAlign:'right'}}>{kicker}</AppText>
    <AppText style={{fontSize:25,color:colors.white,marginTop:8,textAlign:'right',width:'100%'}}>{title}</AppText>
    <AppText style={{fontSize:12,color:'#C5CED1',marginTop:7,lineHeight:19,textAlign:'right',width:'100%'}}>{subtitle}</AppText>
   </View>
   {(typeof count==='number'||(actionLabel&&onAction))?<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginTop:16}}>
    {typeof count==='number'?<View style={{minWidth:42,paddingHorizontal:12,paddingVertical:9,borderRadius:12,backgroundColor:'#29343C',alignItems:'center'}}><AppText style={{fontSize:18,color:colors.white}}>{count}</AppText></View>:<View style={{flex:1}}/>}
    {actionLabel&&onAction?<Pressable accessibilityRole="button" onPress={onAction} style={{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:colors.teal,paddingHorizontal:12,paddingVertical:11,borderRadius:12}}><Ionicons name={actionIcon} size={18} color="#FFFFFF"/><AppText style={{fontSize:12,color:'#FFFFFF'}}>{actionLabel}</AppText></Pressable>:null}
   </View>:null}
  </View>
 </View>;
}
