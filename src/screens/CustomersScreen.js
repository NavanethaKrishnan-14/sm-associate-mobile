import React,{useEffect,useState} from 'react';
import {Alert,ActivityIndicator,Modal,Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';

const empty={name:'',mobile:'',alternateMobile:'',email:'',address:'',city:'',occupation:'',pan:'',aadhaarLast4:'',notes:''};

export default function CustomersScreen(){
 const [items,setItems]=useState([]),[q,setQ]=useState(''),[busy,setBusy]=useState(true);
 const [modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(empty),[saving,setSaving]=useState(false),[history,setHistory]=useState(null),[profile,setProfile]=useState(null);
 async function load(){setBusy(true);try{const r=await api.get('/customers');setItems(r.data?.data||[])}catch(e){Alert.alert('Customers',e?.response?.data?.message||'Unable to load customers.')}finally{setBusy(false)}}
 useEffect(()=>{load()},[]);
 const filtered=items.filter(x=>(x.name||'').toLowerCase().includes(q.toLowerCase())||(x.mobile||'').includes(q));
 function openAdd(){setEditing(null);setForm({...empty});setModal(true)}
 function openProfile(item){setProfile(item)}
 function openEdit(item){setEditing(item);setForm({...empty,...item});setModal(true)}
 async function save(){
   if(!form.name.trim()||!form.mobile.trim())return Alert.alert('Customer','Name and mobile are required.');
   setSaving(true);
   try{if(editing)await api.patch('/customers/'+editing._id,form);else await api.post('/customers',form);setModal(false);await load()}
   catch(e){Alert.alert('Customer',e?.response?.data?.message||'Unable to save customer.')}finally{setSaving(false)}
 }
 async function openHistory(item){try{const r=await api.get('/customers/'+item._id+'/history');setHistory(r.data?.data||null)}catch(e){Alert.alert('History',e?.response?.data?.message||'Unable to load customer history.')}}
 function remove(item){
   Alert.alert('Delete customer','Delete '+item.name+'? This cannot be undone.',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:async()=>{try{await api.delete('/customers/'+item._id);load()}catch(e){Alert.alert('Delete',e?.response?.data?.message||'Unable to delete customer.')}}}
   ]);
 }
 return <View style={s.page}>
   <View style={s.header}><View><Text style={s.title}>Customers</Text><Text style={s.subtitle}>Same customer management as web.</Text></View><Pressable onPress={openAdd} style={s.add}><Ionicons name="add" size={22} color={colors.goldLight}/></Pressable></View>
   <View style={s.search}><Ionicons name="search" size={18} color={colors.muted}/><TextInput value={q} onChangeText={setQ} placeholder="Search name or mobile" placeholderTextColor="#9AA4AD" style={s.searchInput}/></View>
   {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={s.list}>{filtered.map(c=><View key={c._id} style={s.card}>
     <Pressable onPress={()=>openProfile(c)} style={s.row}><View style={s.avatar}><Text style={s.avatarText}>{(c.name||'?').slice(0,1).toUpperCase()}</Text></View><View style={{flex:1,marginLeft:12}}><Text style={s.cardTitle}>{c.name}</Text><Text style={s.muted}>{c.customerId} · {c.mobile}</Text><Text style={s.muted}>{c.city||'No city'}{c.occupation?' · '+c.occupation:''}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.muted}/></Pressable>
     <View style={s.actions}><Pressable onPress={()=>openEdit(c)} style={s.secondary}><Text style={s.secondaryText}>Edit</Text></Pressable><Pressable onPress={()=>remove(c)} style={s.delete}><Text style={s.deleteText}>Delete</Text></Pressable></View>
   </View>)}</ScrollView>}
   <Modal visible={!!profile} animationType="slide" transparent onRequestClose={()=>setProfile(null)}>
    <View style={s.overlay}><View style={s.modal}><View style={s.modalHead}><View style={{flexDirection:'row',alignItems:'center',flex:1}}><Pressable onPress={()=>setProfile(null)} style={s.back}><Ionicons name="arrow-back" size={22} color={colors.ink}/></Pressable><Text style={s.modalTitle}>View Customer</Text></View><Pressable onPress={()=>setProfile(null)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View>
      {profile&&<ScrollView contentContainerStyle={s.form}>
       <View style={s.profileHero}><View style={s.profileAvatar}><Text style={s.profileAvatarText}>{(profile.name||'?').slice(0,1).toUpperCase()}</Text></View><Text style={s.profileName}>{profile.name}</Text><Text style={s.muted}>{profile.customerId||'Customer'}</Text></View>
       {[['Mobile',profile.mobile],['Alternate Mobile',profile.alternateMobile],['Email',profile.email],['Address',profile.address],['City',profile.city],['Occupation',profile.occupation],['PAN',profile.pan],['Aadhaar Last 4',profile.aadhaarLast4],['Notes',profile.notes]].map(([k,v])=><View key={k} style={s.detailRow}><Text style={s.detailLabel}>{k}</Text><Text style={s.detailValue}>{v||'—'}</Text></View>)}
       <View style={s.profileActions}><Pressable onPress={()=>{openEdit(profile);setProfile(null)}} style={s.secondary}><Text style={s.secondaryText}>Edit</Text></Pressable><Pressable onPress={()=>{setProfile(null);remove(profile)}} style={s.delete}><Text style={s.deleteText}>Delete</Text></Pressable></View>
      </ScrollView>}
    </View></View>
   </Modal>
   <Modal visible={modal} animationType="slide" transparent onRequestClose={()=>setModal(false)}>
    <View style={s.overlay}><View style={s.modal}><View style={s.modalHead}><Text style={s.modalTitle}>{editing?'Edit Customer':'Add Customer'}</Text><Pressable onPress={()=>setModal(false)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View>
      <ScrollView contentContainerStyle={s.form}>{Object.entries(form).map(([key,value])=><Field key={key} label={label(key)} value={value} onChangeText={v=>setForm(prev=>({...prev,[key]:v}))}/>)}<Pressable disabled={saving} onPress={save} style={s.primary}><Text style={s.primaryText}>{saving?'Saving...':editing?'Update Customer':'Add Customer'}</Text></Pressable></ScrollView>
    </View></View>
   </Modal>
 </View>
}
function label(k){return k.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase())}
function Field({label,value,onChangeText}){return <View style={{marginBottom:12}}><Text style={s.label}>{label}</Text><TextInput value={String(value??'')} onChangeText={onChangeText} placeholder={'Enter '+label.toLowerCase()} placeholderTextColor="#9AA4AD" style={s.input}/></View>}
const s={page:{flex:1,backgroundColor:colors.ivory,paddingTop:58},header:{paddingHorizontal:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},title:{fontSize:28,fontWeight:'900',color:colors.ink},subtitle:{color:colors.muted,fontSize:13,marginTop:4},add:{width:46,height:46,borderRadius:15,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},search:{height:52,margin:18,backgroundColor:colors.white,borderRadius:16,paddingHorizontal:14,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#E5E7E4'},searchInput:{flex:1,paddingLeft:9,color:colors.ink},list:{paddingHorizontal:18,paddingBottom:30},card:{backgroundColor:colors.white,borderRadius:22,padding:16,marginBottom:12,borderWidth:1,borderColor:'#E5E7E4'},row:{flexDirection:'row',alignItems:'center'},avatar:{width:46,height:46,borderRadius:16,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'},avatarText:{color:colors.goldLight,fontWeight:'900'},cardTitle:{color:colors.ink,fontWeight:'900',fontSize:15},muted:{color:colors.muted,fontSize:12,marginTop:4},actions:{flexDirection:'row',gap:8,marginTop:14},secondary:{flex:1,height:44,borderRadius:13,borderWidth:1,borderColor:'#DDE1DE',alignItems:'center',justifyContent:'center'},secondaryText:{color:colors.midnight,fontWeight:'900'},delete:{flex:1,height:44,borderRadius:13,backgroundColor:'#FFF2F2',borderWidth:1,borderColor:'#E8CACA',alignItems:'center',justifyContent:'center'},deleteText:{color:colors.danger,fontWeight:'900'},overlay:{flex:1,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'flex-end'},modal:{backgroundColor:colors.ivory,maxHeight:'92%',borderTopLeftRadius:28,borderTopRightRadius:28,padding:18},modalHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},modalTitle:{fontSize:21,fontWeight:'900',color:colors.ink},back:{width:40,height:40,borderRadius:12,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',marginRight:10},profileHero:{alignItems:'center',paddingVertical:12,marginBottom:8},profileAvatar:{width:72,height:72,borderRadius:24,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'},profileAvatarText:{fontSize:28,fontWeight:'900',color:colors.goldLight},profileName:{fontSize:22,fontWeight:'900',color:colors.ink,marginTop:10},detailRow:{backgroundColor:colors.white,borderRadius:14,padding:13,marginBottom:8,borderWidth:1,borderColor:'#E5E7E4'},detailLabel:{fontSize:10,fontWeight:'900',color:colors.muted,textTransform:'uppercase'},detailValue:{fontSize:14,fontWeight:'700',color:colors.ink,marginTop:4},profileActions:{flexDirection:'row',gap:10,marginTop:10},form:{paddingBottom:30},section:{fontSize:17,fontWeight:'900',color:colors.ink,marginTop:14,marginBottom:7},historyRow:{backgroundColor:colors.white,borderRadius:14,padding:12,marginBottom:8,borderWidth:1,borderColor:'#E5E7E4'},label:{fontSize:11,fontWeight:'900',color:colors.ink,marginBottom:6},input:{height:50,borderRadius:14,borderWidth:1,borderColor:'#DDE1DE',backgroundColor:colors.white,paddingHorizontal:14,color:colors.ink},primary:{height:54,borderRadius:16,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center',marginTop:8},primaryText:{color:colors.midnight,fontWeight:'900',fontSize:15}};
