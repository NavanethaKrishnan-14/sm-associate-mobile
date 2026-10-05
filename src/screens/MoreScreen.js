import React from 'react';
import {Pressable,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

export default function MoreScreen({navigation}){
 const items=[
  ['Car Sold','car-sport-outline','CarSale'],
  ['User Management','users-outline','Users'],
  ['Vehicle Expenses','receipt-outline','Expenses'],
  ['Car Profit','trending-up-outline','Car Profit'],
  ['Loan Revenue','cash-outline','Loan Revenue'],
  ['Operational Reports','document-text-outline','Reports']
 ];
 return <View style={{flex:1,backgroundColor:colors.ivory,paddingTop:58,paddingHorizontal:18}}>
  <View style={{backgroundColor:colors.midnight,borderRadius:26,padding:20}}>
   <Logo width={154}/><Text style={{color:colors.white,fontSize:18,fontWeight:'900',marginTop:16}}>SM Associate</Text><Text style={{color:'rgba(255,255,255,.62)',fontSize:12,marginTop:4}}>Finance · Mobility · Assistance</Text>
  </View>
  <View style={{marginTop:18,backgroundColor:colors.white,borderRadius:22,padding:8}}>
   {items.map(([label,icon,section])=><Pressable key={label} onPress={()=>section==='CarSale'?navigation.navigate('CarSale'):navigation.navigate('AdminTools',{section})} style={{flexDirection:'row',alignItems:'center',padding:15,borderBottomWidth:1,borderBottomColor:'#F0F1EF'}}>
    <Ionicons name={icon} size={20} color={colors.gold}/><Text style={{flex:1,marginLeft:12,color:colors.ink,fontWeight:'800'}}>{label}</Text><Ionicons name="chevron-forward" size={17} color={colors.muted}/>
   </Pressable>)}
  </View>
  <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={{marginTop:18,height:54,borderRadius:16,borderWidth:1,borderColor:'#E0C7C7',alignItems:'center',justifyContent:'center',backgroundColor:'#FFF9F9'}}>
   <Text style={{color:colors.danger,fontWeight:'900'}}>Sign out</Text>
  </Pressable>
 </View>
}