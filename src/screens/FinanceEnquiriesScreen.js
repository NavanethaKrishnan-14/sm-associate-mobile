import {AppText,AppTextInput} from '../components/AppText';
import React,{useCallback,useState} from 'react';
import {ActivityIndicator,Alert,Modal,Pressable,ScrollView,View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import DatePickerField from '../components/DatePickerField';

const blank={customerId:'',serviceCode:'HOME_LOAN',financeCompany:'',requiredAmount:'',followUpDate:'',notes:'',status:'NEW'};
const blankNewCustomer={name:'',mobile:'',city:''};
const statuses=['NEW','IN_PROGRESS','COMPLETED','CANCELLED'];

export default function FinanceEnquiriesScreen({navigation}){
 const {top}=useSafeAreaInsets();
 const [items,setItems]=useState([]);
 const [customers,setCustomers]=useState([]);
 const [services,setServices]=useState([]);
 const [isAdmin,setIsAdmin]=useState(false);
 const [busy,setBusy]=useState(true);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [modal,setModal]=useState(false);
 const [customerPicker,setCustomerPicker]=useState(false);
 const [servicePicker,setServicePicker]=useState(false);
 const [editing,setEditing]=useState(null);
 const [form,setForm]=useState(blank);
 const [customerMode,setCustomerMode]=useState('existing');
 const [newCustomer,setNewCustomer]=useState(blankNewCustomer);

 const set=(key,value)=>setForm(current=>({...current,[key]:value}));
 const load=useCallback(async()=>{
  setBusy(true);setError('');
  const results=await Promise.allSettled([
   api.get('/finance-enquiries'),
   api.get('/customers'),
   api.get('/finance-services'),
   api.get('/auth/me')
  ]);
  const [enquiriesResult,customersResult,servicesResult,userResult]=results;
  if(enquiriesResult.status==='fulfilled'){
   const rows=enquiriesResult.value?.data?.data;
   setItems(Array.isArray(rows)?rows:[]);
  }else{
   setItems([]);
   setError(enquiriesResult.reason?.response?.data?.message||enquiriesResult.reason?.message||'Unable to load finance enquiries.');
  }
  if(customersResult.status==='fulfilled')setCustomers(Array.isArray(customersResult.value?.data?.data)?customersResult.value.data.data:[]);
  if(servicesResult.status==='fulfilled'){
   const rows=servicesResult.value?.data?.data;
   setServices(Array.isArray(rows)?rows:[]);
  }else if(!error){
   setError(servicesResult.reason?.response?.data?.message||'Unable to load finance service options.');
  }
  if(userResult.status==='fulfilled')setIsAdmin(userResult.value?.data?.data?.role==='ADMIN');
  setBusy(false);
 },[]);
 useFocusEffect(useCallback(()=>{load();},[load]));

 function openAdd(){
  setEditing(null);
  setForm({...blank,customerId:customers[0]?._id||customers[0]?.id||''});
  setCustomerMode('existing');
  setNewCustomer({...blankNewCustomer});
  setModal(true);
 }
 function openEdit(item){
  const customer=item?.customerId;
  if(!customer||(typeof customer==='object'&&!customer._id&&!customer.id)){
   Alert.alert('Customer unavailable','This enquiry is linked to a customer who has already been deleted. Refresh the list; this old enquiry cannot be edited.');
   return;
  }
  setEditing(item);
  setCustomerMode('existing');
  setNewCustomer({...blankNewCustomer});
  setForm({
   customerId:typeof customer==='object'?(customer._id||customer.id||''):(customer||''),
   serviceCode:item.serviceCode||'HOME_LOAN',
   financeCompany:item.financeCompany||'',
   requiredAmount:item.requiredAmount===null||item.requiredAmount===undefined?'':String(item.requiredAmount),
   followUpDate:item.followUpDate?String(item.followUpDate).slice(0,10):'',
   notes:item.notes||'',
   status:item.status||'NEW'
  });
  setModal(true);
 }
 async function save(){
  if(saving)return;
  if(editing&&!form.customerId)return Alert.alert('Finance enquiry','Select a customer first.');
  if(!editing&&customerMode==='existing'&&!form.customerId)return Alert.alert('Finance enquiry','Select an existing customer first.');
  if(!editing&&customerMode==='new'&&(!newCustomer.name.trim()||!newCustomer.mobile.trim()))return Alert.alert('Customer details','Enter the new customer name and mobile number.');
  if(!form.serviceCode)return Alert.alert('Finance enquiry','Select a service.');
  if(form.requiredAmount.trim()&&( !Number.isFinite(Number(form.requiredAmount))||Number(form.requiredAmount)<0))return Alert.alert('Amount','Enter a valid non-negative amount.');
  const dateParts=form.followUpDate.trim()?form.followUpDate.trim().split('-'):[];
  if(form.followUpDate.trim()&&(dateParts.length!==3||dateParts[0].length!==4||dateParts[1].length!==2||dateParts[2].length!==2||dateParts.some(part=>!Number.isInteger(Number(part)))))return Alert.alert('Follow-up date','Use YYYY-MM-DD format.');
  setSaving(true);
  try{
   let customerId=form.customerId;
   if(!editing&&customerMode==='new'){
    const customerNameInput=newCustomer.name.trim();
    const customerMobileInput=newCustomer.mobile.trim();
    const customerResponse=await api.post('/customers',{name:customerNameInput,mobile:customerMobileInput,city:newCustomer.city.trim()});
    const responseData=customerResponse?.data;
    const createdCustomer=responseData?.data??responseData?.result??responseData?.customer??responseData;
    const nestedCustomer=createdCustomer?.customer??createdCustomer?.data??createdCustomer?.result;
    customerId=createdCustomer?._id||createdCustomer?.id||nestedCustomer?._id||nestedCustomer?.id||responseData?._id||responseData?.id||'';
    if(!customerId){
     // Some API responses confirm creation without returning the MongoDB document ID.
     // Reload customers and resolve the new record using its mobile number and name.
     const refreshedCustomers=await api.get('/customers');
     const customerRows=refreshedCustomers?.data?.data;
     if(Array.isArray(customerRows)){
      const normalizedMobile=customerMobileInput.replace(/\D/g,'');
      const matchingCustomer=customerRows.find(item=>(item?.mobile||'').replace(/\D/g,'')===normalizedMobile&&(item?.name||'').trim().toLowerCase()===customerNameInput.toLowerCase());
      customerId=matchingCustomer?._id||matchingCustomer?.id||'';
      if(matchingCustomer)setCustomers(customerRows);
     }
    }
    if(!customerId||typeof customerId!=='string')throw new Error('Customer was created, but its ID could not be retrieved. Refresh the Customers screen and try again.');
   }
   const payload={
    customerId,
    serviceCode:form.serviceCode,
    financeCompany:form.financeCompany.trim(),
    requiredAmount:form.requiredAmount.trim()?Number(form.requiredAmount):undefined,
    followUpDate:form.followUpDate.trim()||undefined,
    notes:form.notes.trim()
   };
   if(editing){
    if(isAdmin)payload.status=form.status;
    await api.patch('/finance-enquiries/'+encodeURIComponent(editing._id||editing.id),payload);
   }else{
    const result=await api.post('/finance-enquiries',payload);
    if(!result.data?.success||!result.data?.data)throw new Error('The server did not confirm that the enquiry was saved.');
   }
   setModal(false);
   await load();
   Alert.alert('Saved',editing?'Finance enquiry updated.':'Finance enquiry saved to the database.');
  }catch(e){
   Alert.alert('Save failed',e?.response?.data?.message||e?.message||'Unable to save the finance enquiry.');
  }finally{setSaving(false);}
 }

 const customerName=(value)=>{
  if(value&&typeof value==='object')return value.name||value.customerId||'Customer';
  return customers.find(c=>(c._id||c.id)===value)?.name||'Select customer';
 };
 const serviceName=(code)=>services.find(s=>s.code===code)?.name||code||'Select service';

 return <View style={{flex:1,backgroundColor:'#F2F3F1'}}>
  <ScrollView contentContainerStyle={{paddingTop:top+12,paddingHorizontal:18,paddingBottom:130}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>navigation?.canGoBack?.()?navigation.goBack():navigation?.navigate?.('Main')} style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-start',paddingVertical:10,paddingHorizontal:14,marginBottom:12,borderRadius:12,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E1E6E3'}}>
    <AppText style={{fontSize:20,color:colors.ink,marginRight:8}}>‹</AppText>
    <AppText style={{fontSize:13,color:colors.ink}}>Back</AppText>
   </Pressable>
   <View style={{backgroundColor:colors.midnight,borderRadius:22,padding:20,marginBottom:18}}>
    <AppText style={{fontSize:11,color:colors.teal,letterSpacing:2}}>SM ASSOCIATE / SERVICES</AppText>
    <AppText style={{fontSize:27,color:colors.white,marginTop:8}}>Finance enquiries</AppText>
    <AppText style={{fontSize:13,color:'#C5CED1',marginTop:7,lineHeight:20}}>Capture customer requests for loans, insurance renewal and gold resale. Enquiries are saved through the API to PostgreSQL.</AppText>
    <View style={{flexDirection:'row',marginTop:18,gap:10}}>
     <View style={{flex:1,backgroundColor:'#29343C',padding:13,borderRadius:14}}>
      <AppText style={{fontSize:22,color:colors.white}}>{items.length}</AppText>
      <AppText style={{fontSize:10,color:'#C5CED1',marginTop:3}}>TOTAL ENQUIRIES</AppText>
     </View>
     <View style={{flex:1,backgroundColor:'#29343C',padding:13,borderRadius:14}}>
      <AppText style={{fontSize:22,color:colors.white}}>{items.filter(x=>x.status==='NEW'||x.status==='IN_PROGRESS').length}</AppText>
      <AppText style={{fontSize:10,color:'#C5CED1',marginTop:3}}>OPEN REQUESTS</AppText>
     </View>
    </View>
   </View>
   <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
    <View><AppText style={{fontSize:20,color:colors.ink}}>Recent requests</AppText><AppText style={{fontSize:12,color:colors.muted,marginTop:3}}>Synced from the backend</AppText></View>
    <Pressable onPress={openAdd} style={{backgroundColor:colors.teal,paddingHorizontal:15,paddingVertical:11,borderRadius:12}}><AppText style={{color:'#FFFFFF',fontSize:12}}>+ Add enquiry</AppText></Pressable>
   </View>
   {busy?<ActivityIndicator size="large" color={colors.teal} style={{marginTop:30}}/>:null}
   {!busy&&error?<View style={{backgroundColor:'#FCEAEA',padding:15,borderRadius:12,marginBottom:12}}><AppText style={{color:colors.danger}}>{error}</AppText><Pressable onPress={load} style={{marginTop:10}}><AppText style={{color:colors.ink}}>Retry</AppText></Pressable></View>:null}
   {!busy&&!error&&items.length===0?<View style={{backgroundColor:'#FFFFFF',padding:24,borderRadius:16,alignItems:'center'}}><AppText style={{fontSize:16,color:colors.ink}}>No finance enquiries yet</AppText><AppText style={{fontSize:12,color:colors.muted,marginTop:6,textAlign:'center'}}>Add an enquiry to start tracking customer service requests.</AppText></View>:null}
   {items.map((item,index)=>{
    const customer=item.customerId&&typeof item.customerId==='object'?item.customerId:{};
    const service=item.service||services.find(s=>s.code===item.serviceCode)||{};
    return <Pressable key={item._id||item.id||String(index)} onPress={()=>openEdit(item)} style={{backgroundColor:'#FFFFFF',borderRadius:16,padding:16,marginBottom:11,borderWidth:1,borderColor:'#E4E8E7'}}>
     <View style={{flexDirection:'row',justifyContent:'space-between',gap:10}}>
      <View style={{flex:1}}>
       <AppText style={{fontSize:15,color:colors.ink}}>{customer.name||customer.customerId||'Customer'}</AppText>
       <AppText style={{fontSize:12,color:colors.muted,marginTop:4}}>{item.enquiryId||'Enquiry'} · {service.name||serviceName(item.serviceCode)}</AppText>
      </View>
      <View style={{backgroundColor:item.status==='COMPLETED'?'#E2F4EC':item.status==='CANCELLED'?'#FCEAEA':'#E5F4F1',paddingHorizontal:9,paddingVertical:6,borderRadius:9,alignSelf:'flex-start'}}>
       <AppText style={{fontSize:10,color:item.status==='CANCELLED'?colors.danger:colors.ink}}>{String(item.status||'NEW').replace('_',' ')}</AppText>
      </View>
     </View>
     {item.requiredAmount!==null&&item.requiredAmount!==undefined?<AppText style={{fontSize:14,color:colors.ink,marginTop:12}}>Required amount: ₹{Number(item.requiredAmount).toLocaleString('en-IN')}</AppText>:null}
     {item.financeCompany?<AppText style={{fontSize:12,color:colors.muted,marginTop:6}}>Finance company: {item.financeCompany}</AppText>:null}
     {item.notes?<AppText style={{fontSize:12,color:colors.muted,marginTop:7}} numberOfLines={2}>{item.notes}</AppText>:null}
     <AppText style={{fontSize:11,color:colors.teal,marginTop:12}}>Tap to view or update →</AppText>
    </Pressable>
   })}
  </ScrollView>
  <Modal visible={modal} transparent animationType="slide" onRequestClose={()=>setModal(false)}>
   <View style={{flex:1,backgroundColor:'rgba(12,22,28,0.55)',justifyContent:'flex-end'}}>
    <View style={{maxHeight:'90%',backgroundColor:'#F7F8F6',borderTopLeftRadius:24,borderTopRightRadius:24,paddingHorizontal:18,paddingTop:20,paddingBottom:28}}>
     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
      <View><AppText style={{fontSize:21,color:colors.ink}}>{editing?'Update enquiry':'New enquiry'}</AppText><AppText style={{fontSize:12,color:colors.muted,marginTop:4}}>Required fields marked *</AppText></View>
      <Pressable onPress={()=>setModal(false)} style={{padding:8}}><AppText style={{fontSize:20,color:colors.ink}}>×</AppText></Pressable>
     </View>
     <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <AppText style={label}>Customer *</AppText>
      {!editing?<View style={{flexDirection:'row',gap:8,marginBottom:10}}><Pressable onPress={()=>setCustomerMode('existing')} style={{flex:1,paddingVertical:11,borderRadius:11,alignItems:'center',backgroundColor:customerMode==='existing'?colors.teal:'#E6EAE8'}}><AppText style={{fontSize:12,color:customerMode==='existing'?'#FFFFFF':colors.ink}}>Existing Customer</AppText></Pressable><Pressable onPress={()=>setCustomerMode('new')} style={{flex:1,paddingVertical:11,borderRadius:11,alignItems:'center',backgroundColor:customerMode==='new'?colors.teal:'#E6EAE8'}}><AppText style={{fontSize:12,color:customerMode==='new'?'#FFFFFF':colors.ink}}>New Customer</AppText></Pressable></View>:null}
      {(!editing&&customerMode==='new')?<><AppText style={label}>Customer name *</AppText><AppTextInput value={newCustomer.name} onChangeText={v=>setNewCustomer(p=>({...p,name:v}))} placeholder="Enter full name" style={inputStyle} placeholderTextColor={colors.muted}/><AppText style={label}>Mobile number *</AppText><AppTextInput value={newCustomer.mobile} onChangeText={v=>setNewCustomer(p=>({...p,mobile:v}))} keyboardType="phone-pad" placeholder="Enter mobile number" style={inputStyle} placeholderTextColor={colors.muted}/><AppText style={label}>City (optional)</AppText><AppTextInput value={newCustomer.city} onChangeText={v=>setNewCustomer(p=>({...p,city:v}))} placeholder="Enter city" style={inputStyle} placeholderTextColor={colors.muted}/></>:<Pressable disabled={Boolean(editing)} onPress={()=>setCustomerPicker(true)} style={selectStyle}><AppText style={{color:form.customerId?colors.ink:colors.muted}}>{customerName(form.customerId)}</AppText><AppText style={{color:colors.teal}}>Choose</AppText></Pressable>}
      <AppText style={label}>Service *</AppText>
      <Pressable onPress={()=>setServicePicker(true)} style={selectStyle}><AppText style={{color:colors.ink}}>{serviceName(form.serviceCode)}</AppText><AppText style={{color:colors.teal}}>Change</AppText></Pressable>
      <AppText style={label}>Finance company</AppText><AppTextInput value={form.financeCompany} onChangeText={v=>set('financeCompany',v)} placeholder="Company / bank name" style={inputStyle} placeholderTextColor={colors.muted}/>
      <AppText style={label}>Required amount (₹)</AppText><AppTextInput value={form.requiredAmount} onChangeText={v=>set('requiredAmount',v)} keyboardType="decimal-pad" placeholder="Optional" style={inputStyle} placeholderTextColor={colors.muted}/>
      <DatePickerField label="Follow-up date" value={form.followUpDate} onChange={v=>set('followUpDate',v)} placeholder="Choose follow-up date"/>
      <AppText style={label}>Notes</AppText><AppTextInput value={form.notes} onChangeText={v=>set('notes',v)} placeholder="Customer requirement or next step" multiline style={[inputStyle,{minHeight:90,textAlignVertical:'top'}]} placeholderTextColor={colors.muted}/>
      {editing&&isAdmin?<><AppText style={label}>Status</AppText><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{statuses.map(status=><Pressable key={status} onPress={()=>set('status',status)} style={{paddingHorizontal:12,paddingVertical:9,borderRadius:10,backgroundColor:form.status===status?colors.teal:'#E6EAE8'}}><AppText style={{fontSize:11,color:form.status===status?'#FFFFFF':colors.ink}}>{status.replace('_',' ')}</AppText></Pressable>)}</View></>:null}
      <Pressable disabled={saving} onPress={save} style={{backgroundColor:colors.midnight,padding:15,borderRadius:13,alignItems:'center',marginTop:22,marginBottom:15,opacity:saving?0.65:1}}>{saving?<ActivityIndicator color="#FFFFFF"/>:<AppText style={{color:'#FFFFFF',fontSize:14}}>{editing?'Save changes':'Save enquiry'}</AppText>}</Pressable>
     </ScrollView>
    </View>
   </View>
  </Modal>
  <Modal visible={customerPicker} transparent animationType="fade" onRequestClose={()=>setCustomerPicker(false)}>
   <View style={pickerBackdrop}><View style={pickerCard}><AppText style={{fontSize:18,color:colors.ink,marginBottom:12}}>Select customer</AppText><ScrollView>{customers.map(customer=><Pressable key={customer._id||customer.id} onPress={()=>{set('customerId',customer._id||customer.id);setCustomerPicker(false)}} style={pickerRow}><View style={{flex:1}}><AppText style={{color:colors.ink}}>{customer.name}</AppText><AppText style={{fontSize:11,color:colors.muted,marginTop:3}}>{customer.customerId||''} · {customer.mobile||''}</AppText></View></Pressable>)}{customers.length===0?<AppText style={{color:colors.muted}}>No customers found. Add a customer first.</AppText>:null}</ScrollView><Pressable onPress={()=>setCustomerPicker(false)} style={{padding:12,alignItems:'center'}}><AppText style={{color:colors.teal}}>Cancel</AppText></Pressable></View></View>
  </Modal>
  <Modal visible={servicePicker} transparent animationType="fade" onRequestClose={()=>setServicePicker(false)}>
   <View style={pickerBackdrop}><View style={pickerCard}><AppText style={{fontSize:18,color:colors.ink,marginBottom:12}}>Select service</AppText><ScrollView>{services.map(service=><Pressable key={service.code} onPress={()=>{set('serviceCode',service.code);setServicePicker(false)}} style={pickerRow}><View style={{flex:1}}><AppText style={{color:colors.ink}}>{service.name}</AppText><AppText style={{fontSize:11,color:colors.muted,marginTop:3}}>{service.description||service.category}</AppText></View><AppText style={{color:form.serviceCode===service.code?colors.teal:colors.muted}}>{form.serviceCode===service.code?'✓':''}</AppText></Pressable>)}{services.length===0?<AppText style={{color:colors.muted}}>Service list unavailable. Retry the screen.</AppText>:null}</ScrollView><Pressable onPress={()=>setServicePicker(false)} style={{padding:12,alignItems:'center'}}><AppText style={{color:colors.teal}}>Cancel</AppText></Pressable></View></View>
  </Modal>
 </View>;
}

const label={fontSize:12,color:colors.ink,marginTop:12,marginBottom:6};
const inputStyle={backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DFE5E2',borderRadius:11,paddingHorizontal:12,paddingVertical:11,fontSize:13,color:colors.ink};
const selectStyle={backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DFE5E2',borderRadius:11,paddingHorizontal:12,paddingVertical:13,flexDirection:'row',justifyContent:'space-between',alignItems:'center'};
const pickerBackdrop={flex:1,backgroundColor:'rgba(12,22,28,0.55)',justifyContent:'center',padding:20};
const pickerCard={maxHeight:'75%',backgroundColor:'#FFFFFF',borderRadius:18,padding:18};
const pickerRow={paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#EEF0EF',flexDirection:'row',alignItems:'center',gap:10};
