import {AppText,AppTextInput} from '../components/AppText';
import React,{useEffect,useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Alert, ActivityIndicator, Linking, Modal, Pressable, ScrollView, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api,uploadDocument} from '../api/client';
import DocumentPickerButton from '../components/DocumentPickerButton';
import {colors} from '../theme/colors';

const empty={name:'',mobile:'',alternateMobile:'',email:'',address:'',city:'',occupation:'',pan:'',aadhaarLast4:'',notes:''};
const docs=[['idProof','ID Proof'],['addressProof','Address Proof'],['incomeProof','Income Proof'],['bankStatement','Bank Statement']];

export default function CustomersScreen({navigation}){
 const {top}=useSafeAreaInsets();
 const [items,setItems]=useState([]),[q,setQ]=useState(''),[busy,setBusy]=useState(true);
 const [modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(empty),[files,setFiles]=useState({}),[customDocs,setCustomDocs]=useState([]),[customName,setCustomName]=useState(''),[saving,setSaving]=useState(false),[history,setHistory]=useState(null),[profile,setProfile]=useState(null);
 async function load(){setBusy(true);try{const r=await api.get('/customers');setItems(r.data?.data||[])}catch(e){Alert.alert('Customers',e?.response?.data?.message||'Unable to load customers.')}finally{setBusy(false)}}
 useEffect(()=>{load()},[]);
 const filtered=items.filter(x=>(x.name||'').toLowerCase().includes(q.toLowerCase())||(x.mobile||'').includes(q));
 function openAdd(){setEditing(null);setForm({...empty});setFiles({});setCustomDocs([]);setCustomName('');setModal(true)}
 function openProfile(item){setProfile(item)}
 function openEdit(item){setEditing(item);const { _id, documents, ...editable }=item||{};setForm({...empty,...editable});setFiles({});setCustomDocs(Array.isArray(documents?.customDocuments)?documents.customDocuments:[]);setCustomName('');setModal(true)}
 function addCustom(){const n=customName.trim();if(!n)return Alert.alert('Document','Enter a document name.');if(docs.some(([,title])=>title.toLowerCase()===n.toLowerCase())||customDocs.some(x=>x.toLowerCase()===n.toLowerCase()))return Alert.alert('Document','This document already exists.');setCustomDocs(p=>[...p,n]);setCustomName('')}
 async function save(){
   if(!form.name.trim()||!form.mobile.trim())return Alert.alert('Customer','Name and mobile are required.');
   setSaving(true);
   try{
     let id=editing?editing._id:null;
     if(editing)await api.patch('/customers/'+id,form);
     else{const r=await api.post('/customers',form);id=r.data?.data?._id}
     if(!id)throw new Error('Customer was saved, but the server did not return the customer ID.');
     for(const [key] of docs){
       if(!files[key])continue;
       try{await uploadDocument('/customers/'+id+'/documents/'+key,files[key])}
       catch(uploadError){throw new Error((editing?'Customer updated':'Customer created')+' successfully, but '+key+' upload failed: '+(uploadError?.message||'Document upload failed.'))}
     }
     for(const name of customDocs){
       const key='custom:'+name;
       if(!files[key])continue;
       try{await uploadDocument('/customers/'+id+'/documents/custom',files[key],{documentName:name})}
       catch(uploadError){throw new Error((editing?'Customer updated':'Customer created')+' successfully, but '+name+' upload failed: '+(uploadError?.message||'Document upload failed.'))}
     }
     await api.patch('/customers/'+id+'/documents',{customDocuments:customDocs,...Object.fromEntries(docs.map(([key])=>[key,Boolean(editing?.documents?.[key]||files[key])]))});
     setModal(false);await load();
   }catch(e){Alert.alert('Customer',e?.message||e?.response?.data?.message||'Unable to save customer.')}finally{setSaving(false)}
 }
 async function openHistory(item){try{const r=await api.get('/customers/'+item._id+'/history');setHistory(r.data?.data||null)}catch(e){Alert.alert('History',e?.response?.data?.message||'Unable to load customer history.')}}
 function remove(item){
   Alert.alert('Delete customer','Delete '+item.name+'? This cannot be undone.',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:async()=>{try{await api.delete('/customers/'+item._id);load()}catch(e){Alert.alert('Delete',e?.response?.data?.message||'Unable to delete customer.')}}}
   ]);
 }
 return <View style={[s.page,{paddingTop:Math.max(22,top+22)}]}>
   <View style={s.header}><View style={{flex:1}}><AppText style={s.title}>Customers</Text><AppText style={s.subtitle}>Same customer management as web.</Text></View><Pressable onPress={openAdd} style={s.add}><Ionicons name="add" size={22} color={colors.goldLight}/></Pressable></View>
   <View style={s.search}><Ionicons name="search" size={18} color={colors.muted}/><AppTextInput value={q} onChangeText={setQ} placeholder="Search name or mobile" placeholderTextColor="#9AA4AD" style={s.searchInput}/></View>
   {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={s.list}>{filtered.map(c=><Pressable key={c._id} onPress={()=>openProfile(c)} style={s.card}>
     <View style={s.row}><View style={s.avatar}><AppText style={s.avatarText}>{(c.name||'?').slice(0,1).toUpperCase()}</Text></View><View style={{flex:1,marginLeft:12}}><AppText style={s.cardTitle}>{c.name}</Text><AppText style={s.muted}>{c.customerId} · {c.mobile}</Text><AppText style={s.muted}>{c.city||'No city'}{c.occupation?' · '+c.occupation:''}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.muted}/></View>
     <View style={s.actions}><Pressable onPress={()=>openEdit(c)} style={s.secondary}><AppText style={s.secondaryText}>Edit</Text></Pressable><Pressable onPress={()=>remove(c)} style={s.delete}><AppText style={s.deleteText}>Delete</Text></Pressable></View>
   </Pressable>)}</ScrollView>}
   <Modal visible={!!profile} animationType="slide" transparent onRequestClose={()=>setProfile(null)}>
    <View style={s.overlay}><View style={s.modal}><View style={s.modalHead}><View style={{flexDirection:'row',alignItems:'center',flex:1}}><Pressable onPress={()=>setProfile(null)} style={s.back}><Ionicons name="arrow-back" size={22} color={colors.ink}/></Pressable><AppText style={s.modalTitle}>View Customer</Text></View><Pressable onPress={()=>setProfile(null)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View>
      {profile&&<ScrollView contentContainerStyle={s.form}>
       <View style={s.profileHero}><View style={s.profileAvatar}><AppText style={s.profileAvatarText}>{(profile.name||'?').slice(0,1).toUpperCase()}</Text></View><AppText style={s.profileName}>{profile.name}</Text><AppText style={s.muted}>{profile.customerId||'Customer'}</Text></View>
       {[['Mobile',profile.mobile],['Alternate Mobile',profile.alternateMobile],['Email',profile.email],['Address',profile.address],['City',profile.city],['Occupation',profile.occupation],['PAN',profile.pan],['Aadhaar Last 4',profile.aadhaarLast4],['Notes',profile.notes]].map(([k,v])=><View key={k} style={s.detailRow}><AppText style={s.detailLabel}>{k}</Text><AppText style={s.detailValue}>{v||'—'}</Text></View>)}
       <AppText style={s.section}>Uploaded Documents</Text>
       {docs.map(([key,title])=>{const doc=profile.documents?.uploads?.[key];return <View key={key} style={s.viewDoc}><View style={{flex:1}}><AppText style={s.docTitle}>{title}</Text><AppText style={s.muted}>{doc?.originalName||'Not uploaded'}</Text></View>{doc?.url&&<Pressable onPress={()=>Linking.openURL(doc.url)} style={s.openDoc}><AppText style={s.openDocText}>Open</Text></Pressable>}</View>})}
       {(profile.documents?.customUploads||[]).map(doc=><View key={doc.name} style={s.viewDoc}><View style={{flex:1}}><AppText style={s.docTitle}>{doc.name}</Text><AppText style={s.muted}>{doc.originalName||'Not uploaded'}</Text></View>{doc.url&&<Pressable onPress={()=>Linking.openURL(doc.url)} style={s.openDoc}><AppText style={s.openDocText}>Open</Text></Pressable>}</View>)}
       <View style={s.profileActions}><Pressable onPress={()=>{openEdit(profile);setProfile(null)}} style={s.secondary}><AppText style={s.secondaryText}>Edit</Text></Pressable><Pressable onPress={()=>{setProfile(null);remove(profile)}} style={s.delete}><AppText style={s.deleteText}>Delete</Text></Pressable></View>
      </ScrollView>}
    </View></View>
   </Modal>
   <Modal visible={modal} animationType="slide" transparent onRequestClose={()=>setModal(false)}>
    <View style={s.overlay}><View style={s.modal}><View style={s.modalHead}><AppText style={s.modalTitle}>{editing?'Edit Customer':'Add Customer'}</Text><Pressable onPress={()=>setModal(false)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View>
      <ScrollView contentContainerStyle={s.form}>{Object.entries(form).map(([key,value])=><Field key={key} label={label(key)} value={value} onChangeText={v=>setForm(prev=>({...prev,[key]:v}))}/>)}
      <AppText style={s.section}>Documents</Text>{docs.map(([key,title])=>{const uploaded=editing?.documents?.uploads?.[key];return <View key={key} style={s.doc}><AppText style={s.docTitle}>{title}</Text>{uploaded?.originalName&&<AppText style={s.muted}>Uploaded: {uploaded.originalName}</Text>}<DocumentPickerButton label={'Upload '+title} file={files[key]} uploaded={!!uploaded} onPick={f=>setFiles(p=>({...p,[key]:f}))}/></View>})}
      {customDocs.map(name=>{const uploaded=editing?.documents?.customUploads?.find(x=>String(x.name).toLowerCase()===name.toLowerCase());const key='custom:'+name;return <View key={key} style={s.doc}><AppText style={s.docTitle}>{name}</Text>{uploaded?.originalName&&<AppText style={s.muted}>Uploaded: {uploaded.originalName}</Text>}<DocumentPickerButton label={'Upload '+name} file={files[key]} uploaded={!!uploaded} onPick={f=>setFiles(p=>({...p,[key]:f}))}/></View>})}
      <View style={s.customRow}><AppTextInput value={customName} onChangeText={setCustomName} placeholder="Custom document name" placeholderTextColor="#9AA4AD" style={[s.input,{flex:1}]}/><Pressable onPress={addCustom} style={s.smallAdd}><AppText style={s.smallAddText}>Add</Text></Pressable></View>
      {customDocs.map(name=>{const uploaded=editing?.documents?.customUploads?.find(x=>String(x.name).toLowerCase()===name.toLowerCase());const key='custom:'+name;return <View key={key} style={s.doc}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><AppText style={s.docTitle}>{name}</Text><View style={{flexDirection:'row',alignItems:'center',gap:8}}>{uploaded?.url&&<View style={s.uploadedBadge}><Ionicons name="checkmark-circle" size={13} color={colors.teal}/><AppText style={s.uploadedBadgeText}>Uploaded</Text></View>}<Pressable onPress={()=>setCustomDocs(p=>p.filter(x=>x!==name))}><AppText style={s.deleteText}>Remove</Text></Pressable></View></View>{uploaded?.originalName&&!files[key]&&<AppText style={s.fileMeta} numberOfLines={1}>Current file: {uploaded.originalName}</Text>}<DocumentPickerButton label={'Upload '+name} file={files[key]} uploaded={!!uploaded} onPick={f=>setFiles(p=>({...p,[key]:f}))}/></View>})}
      <Pressable disabled={saving} onPress={save} style={s.primary}><AppText style={s.primaryText}>{saving?'Saving...':editing?'Update Customer':'Add Customer'}</Text></Pressable></ScrollView>
    </View></View>
   </Modal>
 </View>
}
function label(k){return k.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase())}
function Field({label,value,onChangeText}){return <View style={{marginBottom:12}}><AppText style={s.label}>{label}</Text><AppTextInput value={String(value??'')} onChangeText={onChangeText} placeholder={'Enter '+label.toLowerCase()} placeholderTextColor="#9AA4AD" style={s.input}/></View>}
const s={page:{flex:1,backgroundColor:'#F4F6F3',paddingTop:0},header:{paddingHorizontal:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},backButton:{width:42,height:42,borderRadius:14,backgroundColor:colors.white,borderWidth:1,borderColor:'rgba(39,168,154,.16)',alignItems:'center',justifyContent:'center'},title:{fontSize:30,fontFamily:'Manrope800',color:colors.ink},subtitle:{color:colors.muted,fontSize:13,marginTop:4},add:{width:46,height:46,borderRadius:17,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},search:{height:52,margin:18,backgroundColor:'#FFFFFF',borderRadius:20,paddingHorizontal:14,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'rgba(39,168,154,0.13)'},searchInput:{flex:1,paddingLeft:9,color:colors.ink},list:{paddingHorizontal:18,paddingBottom:30},card:{backgroundColor:'#FFFFFF',borderRadius:26,padding:18,marginBottom:14,borderWidth:1,borderColor:'rgba(39,168,154,0.13)'},row:{flexDirection:'row',alignItems:'center'},avatar:{width:46,height:46,borderRadius:16,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'},avatarText:{color:colors.goldLight,fontFamily:'Manrope800'},cardTitle:{color:colors.ink,fontFamily:'Manrope800',fontSize:15},muted:{color:colors.muted,fontSize:12,marginTop:4},actions:{flexDirection:'row',gap:8,marginTop:14},secondary:{flex:1,height:44,borderRadius:15,borderWidth:1,borderColor:'rgba(39,168,154,0.20)',alignItems:'center',justifyContent:'center'},secondaryText:{color:colors.midnight,fontFamily:'Manrope800'},delete:{flex:1,height:44,borderRadius:13,backgroundColor:'#FFF2F2',borderWidth:1,borderColor:'#E8CACA',alignItems:'center',justifyContent:'center'},deleteText:{color:colors.danger,fontFamily:'Manrope800'},overlay:{flex:1,backgroundColor:'rgba(7,13,18,.70)',justifyContent:'flex-end'},modal:{backgroundColor:'#FAFCFA',maxHeight:'92%',borderTopLeftRadius:28,borderTopRightRadius:28,padding:20,borderWidth:1,borderColor:'rgba(39,168,154,.18)',shadowColor:'#000',shadowOffset:{width:0,height:18},shadowOpacity:.22,shadowRadius:28,elevation:18,overflow:'hidden'},modalHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14},modalTitle:{fontSize:22,fontFamily:'Manrope800',color:colors.midnight},back:{width:40,height:40,borderRadius:12,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',marginRight:10},profileHero:{alignItems:'center',paddingVertical:12,marginBottom:8},profileAvatar:{width:72,height:72,borderRadius:24,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'},profileAvatarText:{fontSize:30,fontFamily:'Manrope800',color:colors.goldLight},profileName:{fontSize:23,fontFamily:'Manrope800',color:colors.ink,marginTop:10},detailRow:{backgroundColor:colors.white,borderRadius:14,padding:13,marginBottom:8,borderWidth:1,borderColor:'rgba(39,168,154,0.13)'},detailLabel:{fontSize:10,fontFamily:'Manrope800',color:colors.muted,textTransform:'uppercase'},detailValue:{fontSize:14,fontFamily:'Manrope700',color:colors.ink,marginTop:4},profileActions:{flexDirection:'row',gap:10,marginTop:10},viewDoc:{backgroundColor:colors.white,borderRadius:14,padding:12,marginBottom:8,borderWidth:1,borderColor:'rgba(39,168,154,0.13)',flexDirection:'row',alignItems:'center'},openDoc:{height:36,paddingHorizontal:13,borderRadius:11,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center'},openDocText:{color:colors.midnight,fontFamily:'Manrope800',fontSize:11},doc:{backgroundColor:colors.white,borderRadius:18,padding:12,marginTop:10,borderWidth:1,borderColor:'rgba(39,168,154,0.13)'},docTitle:{fontFamily:'Manrope800',color:colors.ink,marginBottom:4},form:{paddingBottom:30},section:{fontSize:17,fontFamily:'Manrope800',color:colors.ink,marginTop:14,marginBottom:7},historyRow:{backgroundColor:colors.white,borderRadius:14,padding:12,marginBottom:8,borderWidth:1,borderColor:'rgba(39,168,154,0.13)'},label:{fontSize:11,fontFamily:'Manrope800',color:colors.ink,marginBottom:6},input:{height:50,borderRadius:16,borderWidth:1,borderColor:'rgba(39,168,154,0.20)',backgroundColor:colors.white,paddingHorizontal:14,color:colors.ink},primary:{height:56,borderRadius:18,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center',marginTop:8},primaryText:{color:colors.midnight,fontFamily:'Manrope800',fontSize:15},addDocType:{height:46,borderRadius:15,borderWidth:1,borderColor:'rgba(39,168,154,.20)',backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:7,marginTop:12},addDocTypeText:{color:colors.midnight,fontFamily:'Manrope800',fontSize:12},pickerOverlay:{flex:1,backgroundColor:'rgba(7,13,18,.70)',justifyContent:'center',padding:18},customModal:{backgroundColor:'#FAFCFA',borderRadius:28,padding:20,borderWidth:1,borderColor:'rgba(39,168,154,.18)'}};
