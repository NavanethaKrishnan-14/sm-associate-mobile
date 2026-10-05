import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';

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
    ['Car Buying','car-sport-outline','Cars'],
    ['Car Sold','car-sport-outline','CarSale'],
    ['Customer','people-outline','Customers'],
    ['Loan','cash-outline','Loans'],
    ['Documents','folder-open-outline','Documents'],
    ['Reports','bar-chart-outline','More']
  ];

  const metrics=[
    ['Customers',data?.customers??'—','people-outline',colors.gold],
    ['Active Loans',data?.activeLoans??'—','cash-outline',colors.teal],
    ['Inventory',data?.carsInInventory??'—','car-sport-outline',colors.burgundy],
    ['Follow-ups',data?.openFollowUps??'—','call-outline',colors.royal]
  ];

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{setRefreshing(true);load();}}
            tintColor={colors.gold}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Logo width={126}/>
            <Pressable
              onPress={()=>navigation.navigate('More')}
              style={styles.notification}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.goldLight}/>
            </Pressable>
          </View>

          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>BUSINESS DASHBOARD</Text>
            <Text style={styles.title}>Good morning.</Text>
            <Text style={styles.subtitle}>Your business at a glance.</Text>
          </View>

          <View style={styles.summaryStrip}>
            <View>
              <Text style={styles.summaryLabel}>OPERATIONS</Text>
              <Text style={styles.summaryText}>Everything is in one place</Text>
            </View>
            <View style={styles.summaryIcon}>
              <Ionicons name="arrow-up-outline" size={18} color={colors.midnight}/>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionCaption}>Today's business snapshot</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map(([label,value,icon,accent])=>(
            <View key={label} style={styles.metric}>
              <View style={[styles.metricIcon,{backgroundColor:accent}]}>
                <Ionicons name={icon} size={19} color={colors.white}/>
              </View>
              <Text style={styles.metricValue}>{value}</Text>
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <Text style={styles.sectionCaption}>Jump into your daily tasks</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Ionicons name="flash-outline" size={15} color={colors.midnight}/>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          {actions.map(([label,icon,screen])=>(
            <Pressable
              key={label}
              onPress={()=>navigation.navigate(screen)}
              style={styles.action}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={icon} size={20} color={colors.midnight}/>
              </View>
              <View style={styles.actionBody}>
                <Text style={styles.actionText}>{label}</Text>
                <Text style={styles.actionHint}>Open</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={colors.muted}/>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Loan pipeline</Text>
            <Text style={styles.sectionCaption}>Current application movement</Text>
          </View>
          <View style={styles.pipelineBadge}>
            <Ionicons name="trending-up-outline" size={16} color={colors.teal}/>
          </View>
        </View>

        <View style={styles.pipelineCard}>
          <PipelineRow name="Entered" value={loanPipeline.ENTERED} first/>
          <PipelineRow name="Documents pending" value={loanPipeline.DOCUMENTS_PENDING}/>
          <PipelineRow name="Submitted" value={loanPipeline.SUBMITTED}/>
          <PipelineRow name="Under review" value={loanPipeline.UNDER_REVIEW}/>
          <PipelineRow name="Approved" value={loanPipeline.APPROVED} last/>
        </View>

        <View style={styles.bottomSpace}/>
      </ScrollView>
    </View>
  );
}

function PipelineRow({name,value,first,last}){
  return (
    <View style={[styles.pipelineRow,!first&&styles.pipelineBorder,last&&styles.pipelineLast]}>
      <View style={styles.pipelineDot}/>
      <Text style={styles.pipelineName}>{name}</Text>
      <View style={styles.pipelineValueBox}>
        <Text style={styles.pipelineValue}>{value??0}</Text>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:colors.ivory},
  scroll:{flex:1},
  content:{paddingBottom:20},
  header:{
    backgroundColor:colors.midnight,
    paddingHorizontal:20,
    paddingTop:18,
    paddingBottom:20,
    borderBottomLeftRadius:34,
    borderBottomRightRadius:34
  },
  headerRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  notification:{
    width:44,
    height:44,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(255,255,255,0.08)',
    borderWidth:1,
    borderColor:'rgba(232,216,173,0.22)'
  },
  greeting:{marginTop:28},
  eyebrow:{
    color:colors.goldLight,
    fontSize:9,
    fontWeight:'900',
    letterSpacing:2
  },
  title:{
    color:colors.white,
    fontSize:32,
    lineHeight:38,
    fontWeight:'900',
    marginTop:5
  },
  subtitle:{
    color:'rgba(255,255,255,0.62)',
    fontSize:14,
    marginTop:4
  },
  summaryStrip:{
    marginTop:22,
    paddingTop:14,
    borderTopWidth:1,
    borderTopColor:'rgba(232,216,173,0.15)',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  summaryLabel:{
    color:'rgba(255,255,255,0.4)',
    fontSize:8,
    fontWeight:'900',
    letterSpacing:1.5
  },
  summaryText:{
    color:colors.white,
    fontSize:13,
    fontWeight:'800',
    marginTop:3
  },
  summaryIcon:{
    width:34,
    height:34,
    borderRadius:12,
    backgroundColor:colors.goldLight,
    alignItems:'center',
    justifyContent:'center'
  },
  sectionHeader:{
    marginHorizontal:18,
    marginTop:24,
    marginBottom:12,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  sectionTitle:{
    color:colors.ink,
    fontSize:19,
    fontWeight:'900'
  },
  sectionCaption:{
    color:colors.muted,
    fontSize:11,
    marginTop:3
  },
  sectionBadge:{
    width:34,
    height:34,
    borderRadius:12,
    backgroundColor:colors.goldLight,
    alignItems:'center',
    justifyContent:'center'
  },
  pipelineBadge:{
    width:34,
    height:34,
    borderRadius:12,
    backgroundColor:'rgba(38,166,154,0.12)',
    alignItems:'center',
    justifyContent:'center'
  },
  metricsGrid:{
    marginHorizontal:18,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  metric:{
    width:'48%',
    minHeight:132,
    backgroundColor:colors.white,
    borderRadius:22,
    padding:15,
    marginBottom:10,
    borderWidth:1,
    borderColor:'rgba(17,26,35,0.06)',
    justifyContent:'space-between'
  },
  metricIcon:{
    width:38,
    height:38,
    borderRadius:13,
    alignItems:'center',
    justifyContent:'center'
  },
  metricValue:{
    color:colors.ink,
    fontSize:27,
    fontWeight:'900',
    marginTop:10
  },
  metricLabel:{
    color:colors.muted,
    fontSize:12,
    fontWeight:'700'
  },
  actionsGrid:{
    marginHorizontal:18,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  action:{
    width:'48%',
    minHeight:76,
    backgroundColor:colors.white,
    borderRadius:19,
    padding:11,
    marginBottom:10,
    flexDirection:'row',
    alignItems:'center',
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
  actionBody:{
    flex:1,
    marginLeft:9
  },
  actionText:{
    color:colors.ink,
    fontSize:12,
    fontWeight:'900'
  },
  actionHint:{
    color:colors.muted,
    fontSize:9,
    marginTop:2
  },
  pipelineCard:{
    marginHorizontal:18,
    backgroundColor:colors.white,
    borderRadius:22,
    paddingHorizontal:15,
    borderWidth:1,
    borderColor:'rgba(17,26,35,0.06)'
  },
  pipelineRow:{
    minHeight:58,
    flexDirection:'row',
    alignItems:'center'
  },
  pipelineBorder:{
    borderTopWidth:1,
    borderTopColor:'#EFF0EE'
  },
  pipelineLast:{},
  pipelineDot:{
    width:9,
    height:9,
    borderRadius:5,
    backgroundColor:colors.gold
  },
  pipelineName:{
    flex:1,
    color:colors.ink,
    fontSize:13,
    fontWeight:'700',
    marginLeft:10
  },
  pipelineValueBox:{
    minWidth:36,
    height:30,
    paddingHorizontal:9,
    borderRadius:10,
    backgroundColor:colors.ivory,
    alignItems:'center',
    justifyContent:'center'
  },
  pipelineValue:{
    color:colors.midnight,
    fontSize:13,
    fontWeight:'900'
  },
  bottomSpace:{height:20}
});
