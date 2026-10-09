import React,{useMemo,useState} from 'react';
import {Modal,Pressable,ScrollView,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {AppText} from './AppText';
import {colors} from '../theme/colors';

const pad=value=>String(value).padStart(2,'0');
const toISO=date=>date?date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate()):'';
const parseISO=value=>{if(!value)return new Date();const parts=String(value).slice(0,10).split('-').map(Number);return parts.length===3&&parts.every(Number.isFinite)?new Date(parts[0],parts[1]-1,parts[2]):new Date();};

export default function DatePickerField({label,value,onChange,placeholder='Select date',allowClear=true}){
 const[selected,setSelected]=useState(()=>parseISO(value));
 const[visible,setVisible]=useState(false);
 const[month,setMonth]=useState(()=>{const d=parseISO(value);return new Date(d.getFullYear(),d.getMonth(),1)});
 const days=useMemo(()=>{const first=new Date(month.getFullYear(),month.getMonth(),1);const offset=first.getDay();const total=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();return [...Array(offset).fill(null),...Array.from({length:total},(_,i)=>i+1)];},[month]);
 function open(){const d=parseISO(value);setSelected(d);setMonth(new Date(d.getFullYear(),d.getMonth(),1));setVisible(true)}
 function choose(day){const d=new Date(month.getFullYear(),month.getMonth(),day);setSelected(d);onChange?.(toISO(d));setVisible(false)}
 const display=value?toISO(parseISO(value)):'';
 return <View style={{marginBottom:11}}>
  <AppText style={{fontSize:11,color:colors.ink,marginBottom:6}}>{label}</AppText>
  <Pressable accessibilityRole="button" accessibilityLabel={'Choose '+label} onPress={open} style={{minHeight:49,borderRadius:16,borderWidth:1,borderColor:'rgba(39,168,154,0.20)',backgroundColor:colors.white,paddingHorizontal:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
   <AppText style={{fontSize:13,color:display?colors.ink:'#9AA4AD'}}>{display||placeholder}</AppText>
   <Ionicons name="calendar-outline" size={19} color={colors.teal}/>
  </Pressable>
  <Modal visible={visible} transparent animationType="fade" onRequestClose={()=>setVisible(false)}>
   <View style={{flex:1,backgroundColor:'rgba(7,13,18,0.65)',justifyContent:'center',padding:20}}>
    <View style={{backgroundColor:'#FFFFFF',borderRadius:22,padding:18,borderWidth:1,borderColor:'rgba(39,168,154,0.2)'}}>
     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
      <Pressable accessibilityLabel="Previous month" onPress={()=>setMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))} style={{width:38,height:38,borderRadius:12,backgroundColor:'#F2F5F3',alignItems:'center',justifyContent:'center'}}><Ionicons name="chevron-back" size={20} color={colors.ink}/></Pressable>
      <View style={{alignItems:'center',flex:1}}><AppText style={{fontSize:17,color:colors.ink}}>{month.toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</AppText><AppText style={{fontSize:10,color:colors.muted,marginTop:3}}>SELECT A DATE</AppText></View>
      <Pressable accessibilityLabel="Next month" onPress={()=>setMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))} style={{width:38,height:38,borderRadius:12,backgroundColor:'#F2F5F3',alignItems:'center',justifyContent:'center'}}><Ionicons name="chevron-forward" size={20} color={colors.ink}/></Pressable>
     </View>
     <View style={{flexDirection:'row',marginBottom:7}}>{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><View key={d} style={{width:'14.2857%',alignItems:'center',paddingVertical:7}}><AppText style={{fontSize:11,color:colors.muted}}>{d}</AppText></View>)}</View>
     <View style={{flexDirection:'row',flexWrap:'wrap'}}>
      {days.map((day,index)=>{if(!day)return <View key={'blank-'+index} style={{width:'14.2857%',height:42}}/>;const active=!!value&&toISO(new Date(month.getFullYear(),month.getMonth(),day))===String(value).slice(0,10);const today=toISO(new Date())===toISO(new Date(month.getFullYear(),month.getMonth(),day));return <Pressable key={day} onPress={()=>choose(day)} style={{width:'14.2857%',height:42,alignItems:'center',justifyContent:'center'}}><View style={{width:34,height:34,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:active?colors.midnight:today?'#E1F3EF':'transparent',borderWidth:today&&!active?1:0,borderColor:colors.teal}}><AppText style={{fontSize:12,color:active?colors.white:colors.ink}}>{day}</AppText></View></Pressable>})}
     </View>
     <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15,borderTopWidth:1,borderTopColor:'#EEF0EF',paddingTop:13}}>
      {allowClear?<Pressable onPress={()=>{onChange?.('');setVisible(false)}} style={{paddingVertical:10,paddingHorizontal:12}}><AppText style={{fontSize:12,color:colors.danger}}>Clear date</AppText></Pressable>:<View/>}
      <Pressable onPress={()=>setVisible(false)} style={{paddingVertical:10,paddingHorizontal:16,borderRadius:11,backgroundColor:colors.midnight}}><AppText style={{fontSize:12,color:colors.white}}>Cancel</AppText></Pressable>
     </View>
    </View>
   </View>
  </Modal>
 </View>;
}
