import React,{useEffect,useState} from 'react';
import {Alert,ActivityIndicator,Modal,Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api,uploadDocument} from '../api/client';
import {colors} from '../theme/colors';
import DocumentPickerButton from '../components/DocumentPickerButton';

export default function CarSaleScreen({navigation}){
 const[cars,setCars]=useState([]),[soldCars,setSoldCars]=useState([]),[customers,setCustomers]=useState([]),[busy,setBusy]=useState(true),[modal,setModal]=useState(false),[carId,setCarId]=useState(''),[buyerId,setBuyerId]=useState(''),[price,setPrice]=useState(''),[expenses,setExpenses]=useState('0'),[files,setFiles]=useState({}),[customName,setCustomName]=useState(''),[customDocs,setCustomDocs]=useState([]),[saving,setSaving]=useState(false);
 async function load(){
  setBusy(true);
  try{
   const[r,c]=await Promise.all([api.get('/cars'),api.get('/customers')]);
   const all=r.data?.data||[];
   setCars(all.filter(x=>x.status==='AVAILABLE'));
   setSoldCars(all.filter(x=>x.status==='SOLD'));
   setCustomers(c.data?.data||[]);
  }catch(e){Alert.alert('Car Sold',e?.response?.data?.message||'Unable to load car sales.')}
  finally{setBusy(false)}
 }
 useEffect(()=>{load()},[]);
 function openSale(){setCarId('');setBuyerId('');setPrice('');setExpenses('0');setFiles({});setCustomDocs([]);setCustomName('');setModal(true)}
 async function sell(){
  if(!carId||!buyerId||!price)return Alert.alert('Car Sale','Please select a car, select a customer and enter the selling price.');
  setSaving(true);
  try{
   const r=await api.post('/cars/'+carId+'/sell',{buyerId,sellingPrice:Number(price),sellingExpenses:Number(expenses||0),documents:{idProof:Boolean(files.idProof),agreement:Boolean(files.agreement),customDocuments:customDocs}});
   for(const key of ['idProof','agreement'])if(files[key])await uploadDocument('/cars/'+carId+'/sale/documents/'+key,files[key]);
   for(const name of customDocs)if(files['custom:'+name])await uploadDocument('/cars/'+carId+'/sale/documents/custom',files['custom:'+name],{documentName:name});
   setModal(false);Alert.alert('Sale Completed','Vehicle sold successfully. Net profit: ₹'+Number(r.data?.data?.profit||0).toLocaleString('en-IN'));load();
  }catch(e){Alert.alert('Car Sale',e?.response?.data?.message||'Unable to complete sale.')}
  finally{setSaving(false)}
 }
 return <View style={s.page}>
  <View style={s.header}>
   <View style={{flex:1}}><Text style={s.eyebrow}>AUTOMOTIVE</Text><Text style={s.title}>Car Sold</Text><Text style={s.subtitle}>Track available inventory and completed vehicle sales.</Text></View>
   <Pressable onPress={openSale} style={s.sellButton}><Ionicons name="car-outline" size={18} color={colors.goldLight}/><Text style={s.sellButtonText}>Sell Car</Text></Pressable>
  </View>
  {busy?<ActivityIndicator style={{marginTop:45}} color={colors.gold}/>:<ScrollView contentContainerStyle={s.list}>
   <View style={s.summaryRow}><View style={s.summary}><Text style={s.summaryNumber}>{cars.length}</Text><Text style={s.summaryLabel}>Cars Remaining</Text></View><View style={s.summary}><Text style={s.summaryNumber}>{soldCars.length}</Text><Text style={s.summaryLabel}>Cars Sold</Text></View></View>
   <Text style={s.sectionLabel}>CARS REMAINING TO SELL</Text>
   {cars.length?cars.map(c=><View key={c._id} style={s.carCard}><View style={s.carIcon}><Ionicons name="car-sport-outline" size={22} color={colors.teal}/></View><View style={{flex:1}}><Text style={s.cardTitle}>{c.vehicleId} · {c.make} {c.model}</Text><Text style={s.muted}>{c.registrationNumber} · {c.year||'—'} · {c.fuel||'—'}</Text><Text style={s.priceText}>Purchase ₹{Number(c.purchasePrice||0).toLocaleString('en-IN')}</Text></View></View>):<Empty icon="car-outline" title="No cars remaining" text="All available inventory has been sold."/>}
   <Text style={s.sectionLabel}>CARS SOLD OUT</Text>
   {soldCars.length?soldCars.map(c=><View key={c._id} style={s.carCard}><View style={s.soldIcon}><Ionicons name="checkmark-circle-outline" size={22} color={colors.teal}/></View><View style={{flex:1}}><Text style={s.cardTitle}>{c.vehicleId} · {c.make} {c.model}</Text><Text style={s.muted}>{c.registrationNumber} · SOLD</Text><Text style={s.priceText}>Purchase ₹{Number(c.purchasePrice||0).toLocaleString('en-IN')}</Text></View><Text style={s.soldBadge}>SOLD</Text></View>):<Empty icon="receipt-outline" title="No sold cars yet" text="Completed vehicle sales will appear here."/>}
  </ScrollView>}
  <Modal visible={modal} animationType="slide" transparent onRequestClose={()=>setModal(false)}>
   <View style={s.overlay}><View style={s.modal}>
    <View style={s.modalHead}><View><Text style={s.modalTitle}>Sell Car</Text><Text style={s.modalSub}>Complete the customer purchase details.</Text></View><Pressable onPress={()=>setModal(false)}><Ionicons name="close" size={24} color={colors.ink}/></Pressable></View>
    <ScrollView contentContainerStyle={s.form}>
     <Text style={s.formSection}>1. SELECT CAR</Text>
     {cars.length?cars.map(c=><Pressable key={c._id} onPress={()=>setCarId(c._id)} style={[s.option,carId===c._id&&s.active]}><View style={s.carIcon}><Ionicons name="car-sport-outline" size={20} color={colors.teal}/></View><View style={{flex:1}}><Text style={s.cardTitle}>{c.vehicleId} · {c.make} {c.model}</Text><Text style={s.muted}>{c.registrationNumber} · ₹{Number(c.purchasePrice||0).toLocaleString('en-IN')}</Text></View><Ionicons name={carId===c._id?'checkmark-circle':'ellipse-outline'} size={21} color={carId===c._id?colors.teal:colors.muted}/></Pressable>):<Empty icon="car-outline" title="No cars available" text="Add a car to inventory before selling."/>}
     <Text style={s.formSection}>2. CUSTOMER / BUYER</Text>
     {customers.length?customers.map(c=><Pressable key={c._id} onPress={()=>setBuyerId(c._id)} style={[s.option,buyerId===c._id&&s.active]}><View style={s.avatar}><Text style={s.avatarText}>{(c.name||'?').slice(0,1).toUpperCase()}</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>{c.customerId} · {c.name}</Text><Text style={s.muted}>{c.mobile}{c.city?' · '+c.city:''}</Text></View><Ionicons name={buyerId===c._id?'checkmark-circle':'chevron-forward'} size={21} color={buyerId===c._id?colors.teal:colors.muted}/></Pressable>):<Empty icon="person-outline" title="No customers" text="Create a customer before recording a sale."/>}
     <Text style={s.formSection}>3. SALE DETAILS</Text>
     <Field label="Selling Price" value={price} onChangeText={setPrice}/><Field label="Selling Expenses" value={expenses} onChangeText={setExpenses}/>
     <View style={s.net}><Text style={s.netLabel}>NET SALE VALUE</Text><Text style={s.netValue}>₹{Math.max(0,Number(price||0)-Number(expenses||0)).toLocaleString('en-IN')}</Text></View>
     <Text style={s.formSection}>4. CUSTOMER DOCUMENTS</Text>
     {[['idProof','ID Proof'],['agreement','Sale Agreement']].map(([key,title])=><View key={key} style={s.doc}><Text style={s.cardTitle}>{title}</Text><DocumentPickerButton file={files[key]} onPick={f=>setFiles(p=>({...p,[key]:f}))}/></View>)}
     <View style={s.customRow}><TextInput value={customName} onChangeText={setCustomName} placeholder="Custom document name" placeholderTextColor="#9AA4AD" style={[s.input,{flex:1}]}/><Pressable onPress={()=>{const n=customName.trim();if(n&&!customDocs.some(x=>x.toLowerCase()===n.toLowerCase())){setCustomDocs(p=>[...p,n]);setCustomName('')}}} style={s.add}><Text style={s.addText}>Add</Text></Pressable></View>
     {customDocs.map(n=><View key={n} style={s.doc}><Text style={s.cardTitle}>{n}</Text><DocumentPickerButton file={files['custom:'+n]} onPick={f=>setFiles(p=>({...p,['custom:'+n]:f}))}/></View>)}
     <Pressable disabled={saving||!carId||!buyerId||!price} onPress={sell} style={[s.primary,(!carId||!buyerId||!price)&&s.disabled]}><Ionicons name="checkmark-circle-outline" size={20} color={colors.midnight}/><Text style={s.primaryText}>{saving?'Completing...':'Complete Car Sale'}</Text></Pressable>
    </ScrollView>
   </View></View>
  </Modal>
 </View>
}
function Empty({icon,title,text}){return <View style={s.empty}><Ionicons name={icon} size={28} color={colors.muted}/><Text style={s.emptyTitle}>{title}</Text><Text style={s.emptyText}>{text}</Text></View>}
function Field({label,value,onChangeText}){return <View style={{marginBottom:11}}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType="numeric" placeholder={'Enter '+label.toLowerCase()} placeholderTextColor="#9AA4AD" style={s.input}/></View>}
const s={
 page:{flex:1,backgroundColor:'#F4F6F3',paddingTop:58},
 header:{paddingHorizontal:18,flexDirection:'row',alignItems:'center',gap:12},
 eyebrow:{fontSize:9,fontWeight:'900',letterSpacing:1.5,color:colors.teal,marginBottom:2},
 title:{fontSize:30,fontWeight:'900',color:colors.ink},
 subtitle:{color:colors.muted,fontSize:13,marginTop:4},
 sellButton:{height:44,paddingHorizontal:13,borderRadius:15,backgroundColor:colors.midnight,flexDirection:'row',alignItems:'center',gap:6},
 sellButtonText:{color:colors.goldLight,fontWeight:'900',fontSize:12},
 list:{padding:18,paddingBottom:40},
 summaryRow:{flexDirection:'row',gap:10,marginBottom:4},
 summary:{flex:1,backgroundColor:colors.white,borderRadius:20,padding:16,borderWidth:1,borderColor:'rgba(39,168,154,.14)'},
 summaryNumber:{fontSize:25,fontWeight:'900',color:colors.ink},
 summaryLabel:{fontSize:10,fontWeight:'800',color:colors.muted,marginTop:3},
 sectionLabel:{fontSize:11,fontWeight:'900',letterSpacing:1,color:colors.ink,marginTop:18,marginBottom:9},
 carCard:{backgroundColor:colors.white,borderRadius:20,padding:15,marginBottom:9,borderWidth:1,borderColor:'rgba(39,168,154,.13)',flexDirection:'row',alignItems:'center'},
 carIcon:{width:44,height:44,borderRadius:14,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center',marginRight:11},
 soldIcon:{width:44,height:44,borderRadius:14,backgroundColor:'#EAF6F1',alignItems:'center',justifyContent:'center',marginRight:11},
 cardTitle:{fontSize:14,fontWeight:'900',color:colors.ink},
 muted:{fontSize:11,color:colors.muted,marginTop:4},
 priceText:{fontSize:11,fontWeight:'800',color:colors.teal,marginTop:5},
 soldBadge:{fontSize:9,fontWeight:'900',color:colors.teal,backgroundColor:colors.goldLight,paddingHorizontal:8,paddingVertical:5,borderRadius:9},
 empty:{backgroundColor:colors.white,borderRadius:20,padding:24,alignItems:'center',borderWidth:1,borderColor:'rgba(39,168,154,.12)'},
 emptyTitle:{fontSize:14,fontWeight:'900',color:colors.ink,marginTop:8},
 emptyText:{fontSize:11,color:colors.muted,marginTop:4,textAlign:'center'},
 overlay:{flex:1,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'flex-end'},
 modal:{backgroundColor:'#F4F6F3',maxHeight:'94%',borderTopLeftRadius:28,borderTopRightRadius:28,padding:18},
 modalHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
 modalTitle:{fontSize:22,fontWeight:'900',color:colors.ink},
 modalSub:{fontSize:11,color:colors.muted,marginTop:3},
 form:{paddingBottom:30},
 formSection:{fontSize:12,fontWeight:'900',letterSpacing:.8,color:colors.ink,marginTop:12,marginBottom:8},
 option:{backgroundColor:colors.white,borderRadius:17,padding:13,marginBottom:8,borderWidth:1,borderColor:'rgba(39,168,154,.13)',flexDirection:'row',alignItems:'center'},
 active:{borderColor:colors.gold,backgroundColor:'#FFF9E8'},
 avatar:{width:44,height:44,borderRadius:14,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center',marginRight:11},
 avatarText:{color:colors.goldLight,fontSize:17,fontWeight:'900'},
 net:{backgroundColor:colors.midnight,borderRadius:18,padding:15,marginBottom:4,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 netLabel:{fontSize:9,fontWeight:'900',color:'rgba(255,255,255,.6)'},
 netValue:{fontSize:19,fontWeight:'900',color:colors.goldLight},
 label:{fontSize:11,fontWeight:'900',color:colors.ink,marginBottom:6},
 input:{height:49,borderRadius:16,borderWidth:1,borderColor:'rgba(39,168,154,.20)',backgroundColor:colors.white,paddingHorizontal:13,color:colors.ink},
 doc:{backgroundColor:colors.white,borderRadius:17,padding:12,marginBottom:8,borderWidth:1,borderColor:'rgba(39,168,154,.13)'},
 customRow:{flexDirection:'row',gap:8,marginTop:3,marginBottom:8},
 add:{width:70,height:49,borderRadius:16,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},
 addText:{color:colors.goldLight,fontWeight:'900'},
 primary:{height:56,borderRadius:18,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:10},
 primaryText:{color:colors.midnight,fontWeight:'900',fontSize:15},
 disabled:{opacity:.45}
};