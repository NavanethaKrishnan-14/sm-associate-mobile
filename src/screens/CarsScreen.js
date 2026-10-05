import React,{useEffect,useState} from 'react';
import {Alert,ActivityIndicator,Modal,Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api,uploadDocument} from '../api/client';
import {colors} from '../theme/colors';
import DocumentPickerButton from '../components/DocumentPickerButton';

const blank={sellerName:'',sellerMobile:'',registrationNumber:'',make:'',model:'',year:'',ownerNumber:'1',km:'',fuel:'Petrol',purchasePrice:'',notes:''};
const fixedDocs=[['carBook','Car Book','RC / registration document'],['carInsurance','Car Insurance','Insurance document'],['agreement','Agreement','Purchase / seller agreement']];

export default function CarsScreen(){
 const[items,setItems]=useState([]),[busy,setBusy]=useState(true),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(blank),[saving,setSaving]=useState(false),[files,setFiles]=useState({}),[customName,setCustomName]=useState(''),[customDocs,setCustomDocs]=useState([]);
 async function load(){setBusy(true);try{const r=await api.get('/cars');setItems(r.data?.data||[])}catch(e){Alert.alert('Cars',e?.response?.data?.message||'Unable to load cars.')}finally{setBusy(false)}}
 useEffect(()=>{load()},[]);
 function openAdd(){setEditing(null);setForm({...blank});setFiles({});setCustomDocs([]);setCustomName('');setModal(true)}
 function openEdit(c){setEditing(c);setForm({sellerName:c.sellerId?.name||'',sellerMobile:c.sellerId?.mobile||'',registrationNumber:c.registrationNumber||'',make:c.make||'',model:c.model||'',year:String(c.year||''),ownerNumber:String(c.ownerNumber||1),km:String(c.km||''),fuel:c.fuel||'Petrol',purchasePrice:String(c.purchasePrice||''),notes:c.notes||''});setFiles({});setCustomDocs(c.documents?.customDocuments||[]);setCustomName('');setModal(true)}
 function set(key,value){setForm(p=>({...p,[key]:value}))}
 async function save(){
  if(!form.registrationNumber||!form.make||!form.model||!form.purchasePrice)return Alert.alert('Vehicle','Registration, make, model and purchase price are required.');
  setSaving(true);
  try{
   let id=editing?editing._id:null;
   if(editing){
    await api.patch('/cars/'+id,{registrationNumber:form.registrationNumber,make:form.make,model:form.model,year:Number(form.year||0),ownerNumber:Number(form.ownerNumber||1),km:Number(form.km||0),fuel:form.fuel,purchasePrice:Number(form.purchasePrice||0),notes:form.notes});
   }else{
    const r=await api.post('/cars',{seller:{name:form.sellerName,mobile:form.sellerMobile},registrationNumber:form.registrationNumber,make:form.make,model:form.model,year:Number(form.year||0),ownerNumber:Number(form.ownerNumber||1),km:Number(form.km||0),fuel:form.fuel,purchasePrice:Number(form.purchasePrice||0),notes:form.notes});
    id=r.data?.data?._id;
   }
   if(id){
    for(const [key] of fixedDocs){if(files[key])await uploadDocument('/cars/'+id+'/documents/'+key,files[key])}
    for(const name of customDocs){const f=files['custom:'+name];if(f)await uploadDocument('/cars/'+id+'/documents/custom',f,{documentName:name})}
    if(editing)await api.patch('/cars/'+id+'/documents',{customDocuments:customDocs,...Object.fromEntries(fixedDocs.map(([key])=>[key,Boolean(editing.documents?.[key]||files[key])]))});
   }
   setModal(false);await load();
  }catch(e){Alert.alert('Vehicle',e?.response?.data?.message||'Unable to save vehicle.')}finally{setSaving(false)}
 }
 function remove(c){Alert.alert('Delete vehicle','Delete '+c.vehicleId+'? This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{try{await api.delete('/cars/'+c._id);load()}catch(e){Alert.alert('Delete',e?.response?.data?.message||'Unable to delete vehicle.')}}}])}
 function addCustom(){const n=customName.trim();if(!n)return;if(customDocs.some(x=>x.toLowerCase()===n.toLowerCase()))return Alert.alert('Document','This document already exists.');setCustomDocs(p=>[...p,n]);setCustomName('')}
 return <View style={s.page}>
  <View style={s.header}><View><Text style={s.title}>Car Inventory</Text><Text style={s.subtitle}>Add, edit, delete and upload documents.</Text></View><Pressable onPress={openAdd} style={s.add}><Ionicons name="add" size={22} color={colors.goldLight}/></Pressable></View>
  {busy?<ActivityIndicator style={{marginTop:40}} color={colors.gold}/>:<ScrollView contentContainerStyle={s.list}>{items.map(c=><View key={c._id} style={s.card}><View style={s.cardTop}><View style={{flex:1}}><Text style={s.id}>{c.vehicleId}</Text><Text style={s.cardTitle}>{c.make} {c.model}</Text><Text style={s.muted}>{c.registrationNumber} · {c.year}</Text></View><Text style={s.status}>{c.status}</Text></View><View style={s.stats}><Spec l="KM" v={c.km}/><Spec l="Fuel" v={c.fuel}/><Spec l="Price" v={'₹'+Number(c.purchasePrice||0).toLocaleString('en-IN')}/></View><View style={s.actions}><Pressable onPress={()=>openEdit(c)} style={s.secondary}><Text style={s.secondaryText}>Edit / Documents</Text></Pressable><Pressable onPress={()=>remove(c)} style={s.delete}><Text style={s.deleteText}>Delete</Text></Pressable></View></View>)}</ScrollView>}
  <Modal visible={modal} animationType="slide" transparent onRequestClose={()=>setModal(false)}><View style={s.overlay}><View style={s.modal}><View style={s.modalHead}><Text style={s.modalTitle}>{editing?'Edit Vehicle':'Record Purchase'}</Text><Pressable onPress={()=>setModal(false)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View><ScrollView contentContainerStyle={s.form}>
   {!editing&&<><Field label="Seller Name" value={form.sellerName} onChangeText={v=>set('sellerName',v)}/><Field label="Seller Mobile" value={form.sellerMobile} onChangeText={v=>set('sellerMobile',v)}/></>}
   <Field label="Registration Number" value={form.registrationNumber} onChangeText={v=>set('registrationNumber',v)}/><Field label="Make" value={form.make} onChangeText={v=>set('make',v)}/><Field label="Model" value={form.model} onChangeText={v=>set('model',v)}/><Field label="Year" value={form.year} onChangeText={v=>set('year',v)} keyboardType="numeric"/><Field label="No. of Owners" value={form.ownerNumber} onChangeText={v=>set('ownerNumber',v)} keyboardType="numeric"/><Field label="KM" value={form.km} onChangeText={v=>set('km',v)} keyboardType="numeric"/><Field label="Fuel Type" value={form.fuel} onChangeText={v=>set('fuel',v)}/><Field label="Purchase Price" value={form.purchasePrice} onChangeText={v=>set('purchasePrice',v)} keyboardType="numeric"/><Field label="Notes" value={form.notes} onChangeText={v=>set('notes',v)}/>
   <Text style={s.section}>Documents</Text><Text style={s.helper}>Select files here and they will be uploaded with the vehicle record.</Text>
   {fixedDocs.map(([key,title,desc])=><View key={key} style={s.doc}><Text style={s.docTitle}>{title}</Text><Text style={s.helper}>{desc}</Text><DocumentPickerButton file={files[key]} onPick={f=>setFiles(p=>({...p,[key]:f}))}/></View>)}
   <View style={s.customRow}><TextInput value={customName} onChangeText={setCustomName} placeholder="Custom document name" placeholderTextColor="#9AA4AD" style={[s.input,{flex:1}]}/><Pressable onPress={addCustom} style={s.smallAdd}><Text style={s.smallAddText}>Add</Text></Pressable></View>
   {customDocs.map(name=><View key={name} style={s.doc}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={s.docTitle}>{name}</Text><Pressable onPress={()=>setCustomDocs(p=>p.filter(x=>x!==name))}><Text style={s.deleteText}>Remove</Text></Pressable></View><DocumentPickerButton file={files['custom:'+name]} onPick={f=>setFiles(p=>({...p,['custom:'+name]:f}))}/></View>)}
   <Pressable disabled={saving} onPress={save} style={s.primary}><Text style={s.primaryText}>{saving?'Saving...':editing?'Update Vehicle':'Record Purchase'}</Text></Pressable>
  </ScrollView></View></View></Modal>
 </View>
}
function Field({label,value,onChangeText,keyboardType}){return <View style={{marginBottom:11}}><Text style={s.label}>{label}</Text><TextInput value={String(value??'')} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={'Enter '+label.toLowerCase()} placeholderTextColor="#9AA4AD" style={s.input}/></View>}
function Spec({l,v}){return <View style={{flex:1}}><Text style={s.helper}>{l}</Text><Text style={s.spec}>{String(v??'—')}</Text></View>}
const s={page:{flex:1,backgroundColor:colors.ivory,paddingTop:58},header:{paddingHorizontal:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},title:{fontSize:28,fontWeight:'900',color:colors.ink},subtitle:{color:colors.muted,fontSize:13,marginTop:4},add:{width:46,height:46,borderRadius:15,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},list:{padding:18,paddingBottom:30},card:{backgroundColor:colors.white,borderRadius:22,padding:16,marginBottom:12,borderWidth:1,borderColor:'#E5E7E4'},cardTop:{flexDirection:'row',alignItems:'center'},id:{fontSize:10,fontWeight:'900',color:colors.gold,letterSpacing:1},cardTitle:{fontSize:17,fontWeight:'900',color:colors.ink,marginTop:3},muted:{color:colors.muted,fontSize:12,marginTop:4},status:{color:colors.teal,fontWeight:'900',fontSize:11},stats:{flexDirection:'row',marginTop:16},helper:{fontSize:11,color:colors.muted,marginTop:3},spec:{fontSize:14,fontWeight:'900',color:colors.ink,marginTop:3},actions:{flexDirection:'row',gap:8,marginTop:15},secondary:{flex:1,height:44,borderRadius:13,borderWidth:1,borderColor:'#DDE1DE',alignItems:'center',justifyContent:'center'},secondaryText:{color:colors.midnight,fontWeight:'900'},delete:{flex:1,height:44,borderRadius:13,backgroundColor:'#FFF2F2',alignItems:'center',justifyContent:'center'},deleteText:{color:colors.danger,fontWeight:'900'},overlay:{flex:1,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'flex-end'},modal:{backgroundColor:colors.ivory,maxHeight:'94%',borderTopLeftRadius:28,borderTopRightRadius:28,padding:18},modalHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},modalTitle:{fontSize:21,fontWeight:'900',color:colors.ink},form:{paddingBottom:35},label:{fontSize:11,fontWeight:'900',color:colors.ink,marginBottom:6},input:{height:49,borderRadius:14,borderWidth:1,borderColor:'#DDE1DE',backgroundColor:colors.white,paddingHorizontal:13,color:colors.ink},section:{fontSize:17,fontWeight:'900',color:colors.ink,marginTop:10,marginBottom:3},doc:{backgroundColor:colors.white,borderRadius:16,padding:12,marginTop:10,borderWidth:1,borderColor:'#E5E7E4'},docTitle:{fontWeight:'900',color:colors.ink},customRow:{flexDirection:'row',gap:8,marginTop:12},smallAdd:{width:70,height:49,borderRadius:14,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},smallAddText:{color:colors.goldLight,fontWeight:'900'},primary:{height:54,borderRadius:16,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center',marginTop:18},primaryText:{color:colors.midnight,fontWeight:'900',fontSize:15}};
