import React,{useEffect,useState} from 'react';
import {ActivityIndicator,Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Surface from '../components/Surface';

export default function CustomersScreen(){
  const [items,setItems]=useState([]),[q,setQ]=useState(''),[busy,setBusy]=useState(true);
  async function load(){
    setBusy(true);
    try{const r=await api.get('/customers');setItems(r.data?.data||r.data?.customers||[])}
    catch(e){}
    finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);
  const filtered=items.filter(x=>
    (x.name||'').toLowerCase().includes(q.toLowerCase()) ||
    (x.mobile||'').includes(q)
  );
  return <View style={{flex:1,backgroundColor:colors.ivory,paddingTop:58}}>
    <View style={{paddingHorizontal:18}}>
      <Text style={{fontSize:28,fontWeight:'900',color:colors.ink}}>Customers</Text>
      <Text style={{color:colors.muted,fontSize:13,marginTop:4}}>Your customer relationship hub.</Text>
      <View style={{height:52,backgroundColor:colors.white,borderRadius:16,marginTop:18,flexDirection:'row',alignItems:'center',paddingHorizontal:14,borderWidth:1,borderColor:'#E5E7E4'}}>
        <Ionicons name="search" size={18} color={colors.muted}/>
        <TextInput value={q} onChangeText={setQ} placeholder="Search name or mobile" placeholderTextColor="#9AA4AD" style={{flex:1,paddingLeft:9,color:colors.ink}}/>
      </View>
    </View>
    {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={{padding:18}}>
      {filtered.map(c=><Surface key={c._id||c.customerId} style={{marginBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{width:46,height:46,borderRadius:16,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:colors.goldLight,fontWeight:'900'}}>{(c.name||'?').slice(0,1).toUpperCase()}</Text>
          </View>
          <View style={{flex:1,marginLeft:12}}>
            <Text style={{color:colors.ink,fontWeight:'900',fontSize:15}}>{c.name}</Text>
            <Text style={{color:colors.muted,fontSize:12,marginTop:3}}>{c.mobile}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted}/>
        </View>
        {c.city?<Text style={{color:colors.muted,fontSize:12,marginTop:12}}>{c.city}{c.occupation ? ' · ' + c.occupation : ''}</Text>:null}
      </Surface>)}
    </ScrollView>}
  </View>
}