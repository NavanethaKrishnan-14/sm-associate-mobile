import React,{useEffect,useState} from 'react';
import {ActivityIndicator,Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';

export default function CarsScreen(){
  const [items,setItems]=useState([]),[busy,setBusy]=useState(true);
  useEffect(()=>{(async()=>{try{const r=await api.get('/cars');setItems(r.data?.data||r.data?.cars||[])}catch(e){}finally{setBusy(false)}})()},[]);
  return <View style={{flex:1,backgroundColor:colors.ivory,paddingTop:58}}>
    <View style={{paddingHorizontal:18}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View><Text style={{fontSize:28,fontWeight:'900',color:colors.ink}}>Car inventory</Text><Text style={{color:colors.muted,fontSize:13,marginTop:4}}>Live stock and vehicle records.</Text></View>
        <Pressable style={{backgroundColor:colors.midnight,width:44,height:44,borderRadius:14,alignItems:'center',justifyContent:'center'}}><Ionicons name="add" size={22} color={colors.goldLight}/></Pressable>
      </View>
    </View>
    {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={{padding:18}}>
      {items.map((c,i)=><View key={c._id||c.vehicleId||i} style={{backgroundColor:colors.white,borderRadius:24,marginBottom:12,overflow:'hidden',borderWidth:1,borderColor:'rgba(17,26,35,.06)'}}>
        <View style={{backgroundColor:colors.navy,padding:16,flexDirection:'row',alignItems:'center'}}>
          <View style={{flex:1}}><Text style={{color:colors.goldLight,fontSize:10,fontWeight:'900',letterSpacing:1}}>{c.vehicleId||'VEHICLE'}</Text><Text style={{color:colors.white,fontSize:18,fontWeight:'900',marginTop:3}}>{c.make} {c.model}</Text><Text style={{color:'rgba(255,255,255,.62)',fontSize:12,marginTop:4}}>{c.registrationNumber}</Text></View>
          <View style={{backgroundColor:c.status==='SOLD'?colors.burgundy:colors.teal,borderRadius:12,paddingHorizontal:10,paddingVertical:7}}><Text style={{color:colors.white,fontSize:10,fontWeight:'900'}}>{c.status||'AVAILABLE'}</Text></View>
        </View>
        <View style={{padding:16,flexDirection:'row',justifyContent:'space-between'}}>
          <Spec l="Year" v={c.year}/><Spec l="KM" v={c.km?.toLocaleString?.()||c.km}/><Spec l="Fuel" v={c.fuel}/><Spec l="Price" v={'₹'+Number(c.purchasePrice||0).toLocaleString('en-IN')}/>
        </View>
      </View>)}
    </ScrollView>}
  </View>
}
function Spec({l,v}){return <View style={{flex:1}}><Text style={{fontSize:10,color:colors.muted,fontWeight:'700'}}>{l}</Text><Text style={{fontSize:13,color:colors.ink,fontWeight:'900',marginTop:4}}>{v||'—'}</Text></View>}