import {AppText,AppTextInput} from '../components/AppText';
import React,{useEffect,useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, Alert, ScrollView, View, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import ServiceHeader from '../components/ServiceHeader';

const money=v=>'₹'+Number(v||0).toLocaleString('en-IN');
function Layout({title,children,navigation}){ const {top}=useSafeAreaInsets();return <View style={[s.page,{paddingTop:top+12}]}><ServiceHeader title={title} subtitle="Review performance, financial summaries and operational activity." navigation={navigation} kicker="SM ASSOCIATE / REPORTS"/><ScrollView contentContainerStyle={s.list}>{children}</ScrollView></View>}
function Loading(){return <ActivityIndicator style={{marginTop:50}} color={colors.gold}/>}
function Stat({label,value,icon}){return <View style={s.stat}><View style={s.statTop}><View style={s.statIcon}><Ionicons name={icon} size={18} color={colors.teal}/></View><AppText style={s.statLabel} numberOfLines={2}>{label}</AppText></View><AppText style={s.value} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.78}>{String(value)}</AppText></View>}
function LoadFailure({message,onRetry}) {
 return <View style={{alignItems:'center',padding:22,marginTop:24,backgroundColor:colors.white,borderRadius:18}}>
  <Ionicons name="cloud-offline-outline" size={34} color={colors.burgundy}/>
  <AppText style={{fontSize:15,color:colors.ink,marginTop:12,textAlign:'center'}}>Could not load this report</AppText>
  <AppText style={{fontSize:12,color:colors.muted,marginTop:6,textAlign:'center'}}>{message}</AppText>
  <Pressable onPress={onRetry} style={{marginTop:16,paddingHorizontal:20,paddingVertical:11,borderRadius:12,backgroundColor:colors.midnight}}>
   <AppText style={{color:colors.white}}>Retry</AppText>
  </Pressable>
 </View>
}
export function CarProfitScreen({navigation}){
 const[d,setD]=useState(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setD(null);setError('');api.get('/cars/profits').then(r=>{if(active)setD(r.data?.data||{})}).catch(e=>{if(active)setError(e?.response?.data?.message||e?.message||'Unable to load car profit report.')}).finally(()=>{});return()=>{active=false}},[attempt]);
 if(!d)return <Layout title="Car Profit" navigation={navigation}>{error?<LoadFailure message={error} onRetry={()=>setAttempt(x=>x+1)}/>:<Loading/>}</Layout>;
 const x=d.summary||{};
 return <Layout title="Car Profit" navigation={navigation}><View style={s.grid}><Stat label="Total Sales" value={money(x.sales)} icon="cart-outline"/><Stat label="Investment" value={money(x.investment)} icon="wallet-outline"/><Stat label="Selling Expenses" value={money(x.sellingExpenses)} icon="receipt-outline"/><Stat label="Net Profit" value={money(x.profit)} icon="trending-up-outline"/></View><AppText style={s.section}>Vehicle-wise Profit</AppText>{(d.sales||[]).map((x,i)=><View style={s.card} key={x._id||i}><View style={s.cardIcon}><Ionicons name="car-sport-outline" size={21} color={colors.teal}/></View><View style={{flex:1}}><AppText style={s.name}>{x.carId?.vehicleId||'Vehicle'}</AppText><AppText style={s.muted}>{[x.carId?.make,x.carId?.model,x.carId?.registrationNumber].filter(Boolean).join(' · ')||'Vehicle details'}</AppText><AppText style={s.muted}>Buyer: {x.buyerId?.name||'—'}</AppText></View><AppText style={s.profit}>{money(x.profit)}</AppText></View>)}</Layout>
}
export function LoanRevenueScreen({navigation}){
 const[d,setD]=useState(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setD(null);setError('');api.get('/reports/loan-revenue').then(r=>{if(active)setD(r.data?.data||{})}).catch(e=>{if(active)setError(e?.response?.data?.message||e?.message||'Unable to load loan revenue.')});return()=>{active=false}},[attempt]);
 if(!d)return <Layout title="Loan Revenue" navigation={navigation}>{error?<LoadFailure message={error} onRetry={()=>setAttempt(x=>x+1)}/>:<Loading/>}</Layout>;
 const x=d.summary||{};
 return <Layout title="Loan Revenue" navigation={navigation}><View style={s.grid}><Stat label="Total Commission" value={money(x.totalCommission)} icon="cash-outline"/><Stat label="Disbursed Revenue" value={money(x.disbursedCommission)} icon="checkmark-circle-outline"/><Stat label="Approved+" value={x.approvedOrBetter||0} icon="thumbs-up-outline"/><Stat label="Loan Records" value={(d.loans||[]).length} icon="document-text-outline"/></View><AppText style={s.section}>Revenue by Loan Type</AppText>{Object.entries(d.byType||{}).map(([k,v])=><View style={s.row} key={k}><View style={s.rowIcon}><Ionicons name="cash-outline" size={18} color={colors.teal}/></View><AppText style={s.name}>{k}</AppText><AppText style={s.profit}>{money(v)}</AppText></View>)}<AppText style={s.section}>Revenue by Finance Company</AppText>{Object.entries(d.byFinance||{}).map(([k,v])=><View style={s.row} key={k}><View style={s.rowIcon}><Ionicons name="business-outline" size={18} color={colors.teal}/></View><AppText style={s.name}>{k}</AppText><AppText style={s.profit}>{money(v)}</AppText></View>)}</Layout>
}
export function OperationalReportsScreen({navigation}){
 const[d,setD]=useState(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setD(null);setError('');api.get('/reports/operational').then(r=>{if(active)setD(r.data?.data||{})}).catch(e=>{if(active)setError(e?.response?.data?.message||e?.message||'Unable to load operational report.')});return()=>{active=false}},[attempt]);
 if(!d)return <Layout title="Operational Reports" navigation={navigation}>{error?<LoadFailure message={error} onRetry={()=>setAttempt(x=>x+1)}/>:<Loading/>}</Layout>;
 const l=d.loanSummary||{},sales=d.sales||{},ex=d.carExpenses||{},op=d.operationalExpenses||{};
 return <Layout title="Operational Reports" navigation={navigation}><View style={s.grid}><Stat label="Customers" value={Array.isArray(d.customers)?d.customers.length:d.customers||0} icon="people-outline"/><Stat label="Total Loans" value={l.count||0} icon="cash-outline"/><Stat label="Open Follow-ups" value={(d.openFollowUps||[]).length} icon="call-outline"/><Stat label="Inventory" value={(d.inventory||[]).length} icon="car-sport-outline"/><Stat label="Cars Sold" value={sales.count||0} icon="car-sport-outline"/><Stat label="Sales Profit" value={money(sales.profit)} icon="trending-up-outline"/><Stat label="Car Expenses" value={money(ex.total)} icon="receipt-outline"/><Stat label="Expense Records" value={ex.count||0} icon="document-text-outline"/><Stat label="Operational Expenses" value={money(op.total)} icon="business-outline"/><Stat label="Operational Records" value={op.count||0} icon="receipt-outline"/></View><AppText style={s.section}>Loans by Status</AppText>{Object.entries(l.byStatus||{}).map(([k,v])=><View style={s.row} key={k}><AppText style={s.name}>{k}</AppText><AppText style={s.badge}>{v}</AppText></View>)}<AppText style={s.section}>Loans by Type</AppText>{Object.entries(l.byType||{}).map(([k,v])=><View style={s.row} key={k}><AppText style={s.name}>{k}</AppText><AppText style={s.badge}>{v}</AppText></View>)}<AppText style={s.section}>Operational Expenses by Category</AppText>{Object.entries(op.byCategory||{}).map(([k,v])=><View style={s.row} key={k}><View style={s.rowIcon}><Ionicons name="wallet-outline" size={18} color={colors.teal}/></View><AppText style={s.name}>{k}</AppText><AppText style={s.profit}>{money(v)}</AppText></View>)}<AppText style={s.section}>Recent Operational Expenses</AppText>{(op.records||[]).map((x,i)=><View style={s.card} key={x.expenseId||x.id||i}><View style={s.cardIcon}><Ionicons name="receipt-outline" size={21} color={colors.teal}/></View><View style={{flex:1}}><AppText style={s.name}>{x.description||x.category}</AppText><AppText style={s.muted}>{[x.category,x.vendor,x.paymentMethod].filter(Boolean).join(' · ')}</AppText><AppText style={s.muted}>{x.date?new Date(x.date).toLocaleDateString('en-IN'):''}</AppText></View><AppText style={s.profit}>{money(x.amount)}</AppText></View>)}<AppText style={s.section}>Current Inventory</AppText>{(d.inventory||[]).map((x,i)=><View style={s.card} key={x._id||i}><View style={s.cardIcon}><Ionicons name="car-sport-outline" size={21} color={colors.teal}/></View><View style={{flex:1}}><AppText style={s.name}>{x.vehicleId||'Vehicle'}</AppText><AppText style={s.muted}>{[x.make,x.model,x.registrationNumber].filter(Boolean).join(' · ')}</AppText></View><AppText style={s.profit}>{money(x.purchasePrice)}</AppText></View>)}</Layout>
}
const s={
 page:{flex:1,backgroundColor:'#F2F4F2',paddingTop:0},
 header:{minHeight:78,paddingHorizontal:18,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:'#E5E9E6',backgroundColor:'#F8F9F7'},
 back:{width:42,height:42,borderRadius:14,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#E4E9E6'},
 title:{fontSize:22,color:'#182027'},
 sub:{fontSize:11,color:'#71808A',marginTop:3},
 list:{padding:16,paddingBottom:40},
 grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10,columnGap:0},
 stat:{width:'48%',minHeight:118,borderRadius:17,backgroundColor:'#FFFFFF',padding:13,justifyContent:'space-between',borderWidth:1,borderColor:'#E0E8E4',shadowColor:'#182027',shadowOffset:{width:0,height:2},shadowOpacity:0.04,shadowRadius:5,elevation:1},
 statTop:{flexDirection:'row',alignItems:'center',gap:8,minHeight:36},
 statIcon:{width:34,height:34,borderRadius:11,backgroundColor:'#E2F1EE',alignItems:'center',justifyContent:'center',flexShrink:0},
 statLabel:{fontSize:11,color:'#64727A',flex:1,lineHeight:15},
 value:{fontSize:20,color:'#147F74',marginTop:10,flexShrink:1},
 label:{fontSize:11,color:'#64727A'},
 section:{fontSize:16,color:'#182027',fontWeight:'700',marginTop:24,marginBottom:10,paddingLeft:11,borderLeftWidth:3,borderLeftColor:'#27A89A'},
 card:{backgroundColor:'#FFFFFF',borderRadius:17,padding:14,marginBottom:10,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#E1E7E3',shadowColor:'#182027',shadowOffset:{width:0,height:2},shadowOpacity:0.035,shadowRadius:4,elevation:1},
 cardIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#E2F1EE',alignItems:'center',justifyContent:'center',marginRight:11,flexShrink:0},
 row:{backgroundColor:'#FFFFFF',borderRadius:13,paddingHorizontal:13,paddingVertical:12,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#E1E7E3',minHeight:58},
 rowIcon:{width:34,height:34,borderRadius:10,backgroundColor:'#E2F1EE',alignItems:'center',justifyContent:'center',marginRight:10,flexShrink:0},
 name:{fontSize:13,color:'#26343A',flexShrink:1},
 muted:{fontSize:11,color:'#71808A',marginTop:4,lineHeight:15},
 profit:{fontSize:13,color:'#147F74',fontWeight:'700',marginLeft:8,flexShrink:0},
 badge:{fontSize:12,color:'#182027',backgroundColor:'#D9F1ED',paddingHorizontal:10,paddingVertical:6,borderRadius:9,overflow:'hidden',marginLeft:8}
};