import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import MetricCard from '../components/MetricCard';
import Surface from '../components/Surface';

export default function DashboardScreen({navigation}){
  const [data,setData]=useState(null);
  const [refreshing,setRefreshing]=useState(false);

  async function load(){
    try{
      const response=await api.get('/reports/dashboard');
      setData(response.data?.data||{});
    }catch(error){
      setData({});
    }finally{
      setRefreshing(false);
    }
  }

  useEffect(()=>{load();},[]);


  const loanPipeline=data?.loanPipeline||{};
  const actions=[
    ['Customer','people-outline','Customers'],
    ['Car Buying','car-sport-outline','Cars'],
    ['Car Sold','car-sport-outline','CarSale'],
    ['Loan','cash-outline','Loans'],
    ['Documents','folder-open-outline','Documents'],
    ['Reports','bar-chart-outline','More']
  ];

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.logoMark}>
            <Logo width={108}/>
          </View>
          <View style={styles.topBarText}>
            <Text style={styles.topBarEyebrow}>BUSINESS OVERVIEW</Text>
            <Text style={styles.topBarTitle}>Dashboard</Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot}/>
            <Text style={styles.statusText}>LIVE</Text>
          </View>
          <Pressable
            onPress={()=>navigation.navigate('More')}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={19}
              color={colors.goldLight}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{setRefreshing(true);load();}}
            tintColor={colors.gold}
          />
        }
      >
        <View style={styles.metrics}>
          <MetricCard label="Customers" value={data?.customers??'—'} accent={colors.gold}/>
          <MetricCard label="Active loans" value={data?.activeLoans??'—'} accent={colors.teal}/>
          <MetricCard label="Inventory" value={data?.carsInInventory??'—'} accent={colors.burgundy}/>
          <MetricCard label="Open follow-ups" value={data?.openFollowUps??'—'} accent={colors.royal}/>
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>

        <View style={styles.actions}>
          {actions.map(([label,icon,screen])=>(
            <Pressable
              key={label}
              onPress={()=>navigation.navigate(screen)}
              style={styles.action}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={icon} size={20} color={colors.midnight}/>
              </View>
              <Text style={styles.actionText}>{label}</Text>
              <Ionicons name="arrow-forward" size={15} color={colors.muted}/>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle,{marginTop:26}]}>
          Loan pipeline
        </Text>

        <Surface>
          <PipelineRow name="Entered" value={loanPipeline.ENTERED}/>
          <PipelineRow name="Documents pending" value={loanPipeline.DOCUMENTS_PENDING}/>
          <PipelineRow name="Submitted" value={loanPipeline.SUBMITTED}/>
          <PipelineRow name="Under review" value={loanPipeline.UNDER_REVIEW}/>
          <PipelineRow name="Approved" value={loanPipeline.APPROVED}/>
        </Surface>

        <View style={{height:32}}/>
      </ScrollView>
    </View>
  );
}

function PipelineRow({name,value}){
  return (
    <View style={styles.pipelineRow}>
      <Text style={styles.pipelineName}>{name}</Text>
      <Text style={styles.pipelineValue}>{value??0}</Text>
    </View>
  );
}

const styles=StyleSheet.create({
  page:{
    flex:1,
    backgroundColor:colors.ivory
  },
topBar:{
    height:78,
    backgroundColor:colors.midnight,
    paddingHorizontal:18,
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderBottomLeftRadius:24,
    borderBottomRightRadius:24,
    borderBottomWidth:1,
    borderBottomColor:'rgba(232,216,173,0.18)',
    elevation:8,
    shadowColor:'#000',
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.16,
    shadowRadius:7,
    zIndex:10
  },
  topBarLeft:{
    flexDirection:'row',
    alignItems:'center',
    flex:1
  },
  logoMark:{
    width:116,
    height:52,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  topBarText:{
    marginLeft:8,
    justifyContent:'center'
  },
  topBarEyebrow:{
    color:colors.goldLight,
    fontSize:8,
    fontWeight:'900',
    letterSpacing:1.8,
    marginBottom:2
  },
  topBarTitle:{
    color:colors.white,
    fontSize:20,
    fontWeight:'900',
    letterSpacing:0.2
  },
  topBarRight:{
    flexDirection:'row',
    alignItems:'center',
    gap:9
  },
  statusPill:{
    height:30,
    paddingHorizontal:10,
    borderRadius:15,
    backgroundColor:'rgba(232,216,173,0.09)',
    borderWidth:1,
    borderColor:'rgba(232,216,173,0.18)',
    flexDirection:'row',
    alignItems:'center',
    gap:6
  },
  statusDot:{
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal
  },
  statusText:{
    color:colors.goldLight,
    fontSize:9,
    fontWeight:'900',
    letterSpacing:1
  },
  notificationButton:{
    width:44,
    height:44,
    borderRadius:15,
    borderWidth:1,
    borderColor:'rgba(232,216,173,0.25)',
    alignItems:'center',
    justifyContent:'center'
  },
  largeContent:{
    marginTop:18
  },
  kicker:{
    color:colors.goldLight,
    fontSize:10,
    fontWeight:'900',
    letterSpacing:1.7
  },
  title:{
    color:colors.white,
    fontSize:31,
    fontWeight:'900',
    marginTop:6
  },
  sub:{
    color:'rgba(255,255,255,0.68)',
    fontSize:14,
    lineHeight:20,
    marginTop:5,
    maxWidth:330
  },
  scroll:{
    flex:1
  },
  scrollContent:{
    padding:18,
    paddingTop:18
  },
  metrics:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    paddingTop:18
  },
  sectionTitle:{
    color:colors.ink,
    fontSize:18,
    fontWeight:'900',
    marginBottom:12
  },
  actions:{
    flexDirection:'row',
    flexWrap:'wrap',
    gap:10
  },
  action:{
    backgroundColor:colors.white,
    borderRadius:18,
    padding:12,
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    width:'48%',
    borderWidth:1,
    borderColor:'rgba(17,26,35,0.06)'
  },
  actionIcon:{
    width:38,
    height:38,
    borderRadius:13,
    backgroundColor:colors.goldLight,
    alignItems:'center',
    justifyContent:'center'
  },
  actionText:{
    flex:1,
    color:colors.ink,
    fontSize:13,
    fontWeight:'800'
  },
  pipelineRow:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:'#EFF0EE'
  },
  pipelineName:{
    flex:1,
    color:colors.ink,
    fontSize:13,
    fontWeight:'600'
  },
  pipelineValue:{
    fontSize:14,
    fontWeight:'900',
    color:colors.midnight
  }
});
