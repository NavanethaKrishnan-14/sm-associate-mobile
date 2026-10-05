import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import MetricCard from '../components/MetricCard';
import Surface from '../components/Surface';

export default function DashboardScreen({navigation}){
  const [data,setData]=useState(null),[refreshing,setRefreshing]=useState(false);
  async function load(){
    try{const r=await api.get('/reports/dashboard');setData(r.data?.data||{})}
    catch(e){}
    finally{setRefreshing(false)}
  }
  useEffect(()=>{load()},[]);
  const loanPipeline=data?.loanPipeline||{};
  return <View style={{flex:1,backgroundColor:colors.ivory}}>
    <LinearGradient colors={[colors.midnight,colors.navy]} style={styles.hero}>
      <View style={styles.top}>
        <Logo width={142}/>
        <Pressable onPress={()=>navigation.navigate('More')} style={styles.icon}><Ionicons name="notifications-outline" size={21} color={colors.goldLight}/></Pressable>
      </View>
      <Text style={styles.kicker}>OPERATIONS OVERVIEW</Text>
      <Text style={styles.title}>Good morning.</Text>
      <Text style={styles.sub}>A sharper view of your business, all from your phone.</Text>
    </LinearGradient>
    <ScrollView contentContainerStyle={{padding:18,paddingTop:0}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={colors.gold}/>}>
      <View style={styles.metrics}>
        <MetricCard label="Customers" value={data?.customers ?? '—'} accent={colors.gold}/>
        <MetricCard label="Active loans" value={data?.activeLoans ?? '—'} accent={colors.teal}/>
        <MetricCard label="Inventory" value={data?.carsInInventory ?? '—'} accent={colors.burgundy}/>
        <MetricCard label="Open follow-ups" value={data?.openFollowUps ?? '—'} accent={colors.royal}/>
      </View>
      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
        {[['Customer','people-outline','Customers'],['Car','car-sport-outline','Cars'],['Loan','cash-outline','Loans'],['Reports','bar-chart-outline','More']].map(([label,icon,screen])=>
          <Pressable key={label} onPress={()=>navigation.navigate(screen)} style={styles.action}>
            <View style={styles.actionIcon}><Ionicons name={icon} size={20} color={colors.midnight}/></View>
            <Text style={styles.actionText}>{label}</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.muted}/>
          </Pressable>
        )}
      </View>
      <Text style={[styles.sectionTitle,{marginTop:26}]}>Loan pipeline</Text>
      <Surface>
        <PipelineRow name="Entered" value={loanPipeline.ENTERED}/>
        <PipelineRow name="Documents pending" value={loanPipeline.DOCUMENTS_PENDING}/>
        <PipelineRow name="Submitted" value={loanPipeline.SUBMITTED}/>
        <PipelineRow name="Under review" value={loanPipeline.UNDER_REVIEW}/>
        <PipelineRow name="Approved" value={loanPipeline.APPROVED}/>
      </Surface>
      <View style={{height:28}}/>
    </ScrollView>
  </View>
}
function PipelineRow({name,value}){return <View style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#EFF0EE'}}><Text style={{flex:1,color:colors.ink,fontSize:13,fontWeight:'600'}}>{name}</Text><Text style={{fontSize:14,fontWeight:'900',color:colors.midnight}}>{value ?? 0}</Text></View>}
const styles=StyleSheet.create({
  hero:{paddingHorizontal:20,paddingTop:58,paddingBottom:24,borderBottomLeftRadius:32,borderBottomRightRadius:32},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  icon:{width:42,height:42,borderRadius:14,borderWidth:1,borderColor:'rgba(232,216,173,.25)',alignItems:'center',justifyContent:'center'},
  kicker:{color:colors.goldLight,fontSize:10,fontWeight:'900',letterSpacing:1.7,marginTop:25},
  title:{color:colors.white,fontSize:31,fontWeight:'900',marginTop:6},
  sub:{color:'rgba(255,255,255,.68)',fontSize:14,lineHeight:20,marginTop:5,maxWidth:330},
  metrics:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',paddingTop:18},
  sectionTitle:{color:colors.ink,fontSize:18,fontWeight:'900',marginBottom:12},
  action:{backgroundColor:colors.white,borderRadius:18,padding:12,flexDirection:'row',alignItems:'center',gap:10,width:'48%',borderWidth:1,borderColor:'rgba(17,26,35,.06)'},
  actionIcon:{width:38,height:38,borderRadius:13,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},
  actionText:{flex:1,color:colors.ink,fontSize:13,fontWeight:'800'}
});