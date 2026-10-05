import React,{useEffect,useState} from 'react';
import {ActivityIndicator,ScrollView,Text,View} from 'react-native';
import {api} from '../api/client';
import {colors} from '../theme/colors';

export default function LoansScreen(){
  const [items,setItems]=useState([]),[busy,setBusy]=useState(true);
  useEffect(()=>{(async()=>{try{const r=await api.get('/loans');setItems(r.data?.data||r.data?.loans||[])}catch(e){}finally{setBusy(false)}})()},[]);
  return <View style={{flex:1,backgroundColor:colors.ivory,paddingTop:58}}>
    <View style={{paddingHorizontal:18}}>
      <Text style={{fontSize:28,fontWeight:'900',color:colors.ink}}>Loans</Text>
      <Text style={{color:colors.muted,fontSize:13,marginTop:4}}>Pipeline, amounts and application status.</Text>
    </View>
    {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={{padding:18}}>
      {items.map((l,i)=><View key={l._id||l.loanId||i} style={{backgroundColor:colors.white,borderRadius:22,padding:17,marginBottom:10,borderWidth:1,borderColor:'rgba(17,26,35,.06)'}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <View><Text style={{color:colors.muted,fontSize:10,fontWeight:'900',letterSpacing:1}}>{l.loanId||'LOAN'}</Text><Text style={{color:colors.ink,fontSize:16,fontWeight:'900',marginTop:4}}>{l.loanType}</Text></View>
          <Text style={{color:colors.gold,fontWeight:'900',fontSize:13}}>{l.status}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:16}}>
          <Money label="Required" value={l.requiredAmount}/><Money label="Approved" value={l.approvedAmount}/><Money label="Commission" value={l.commission} green/>
        </View>
      </View>)}
    </ScrollView>}
  </View>
}
function Money({label,value,green}){return <View style={{flex:1}}><Text style={{fontSize:10,color:colors.muted}}>{label}</Text><Text style={{fontSize:15,color:green?colors.teal:colors.ink,fontWeight:'900',marginTop:3}}>₹{Number(value||0).toLocaleString('en-IN')}</Text></View>}