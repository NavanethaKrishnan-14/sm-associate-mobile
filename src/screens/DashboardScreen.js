import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {BlurView} from 'expo-blur';
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
      <View style={styles.commandBar}>
        <View style={styles.commandTop}>
          <View style={styles.commandBrand}>
            <View style={styles.commandLogo}>
              <Logo width={64}/>
            </View>
            <View style={styles.commandIdentity}>
              <Text style={styles.commandOverline}>SM ASSOCIATE</Text>
              <Text style={styles.commandTitle}>Business Desk</Text>
            </View>
          </View>

          <View style={styles.commandRight}>
            <View style={styles.liveState}>
              <View style={styles.liveDot}/>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Pressable
              onPress={()=>navigation.navigate('More')}
              style={({pressed})=>[styles.commandBell,pressed&&styles.pressed]}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.white}/>
              <View style={styles.commandNotificationDot}/>
            </Pressable>
          </View>
        </View>

      </View>

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
        <View style={styles.editorialGreeting}>
          <View style={styles.editorialAccent}/>
          <View style={styles.editorialTop}>
            <Text style={styles.editorialKicker}>SM ASSOCIATE  /  01</Text>
            <View style={styles.editorialStatus}>
              <View style={styles.editorialStatusDot}/>
              <Text style={styles.editorialStatusText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.editorialMain}>
            <View style={styles.editorialCopy}>
              <Text style={styles.editorialGreetingText}>Good morning.</Text>
              <Text style={styles.editorialHeadline}>Stay ahead.</Text>
              <Text style={styles.editorialDescription}>
                Your key business activity, organised for a clearer day.
              </Text>
            </View>

            <View style={styles.editorialNumber}>
              <Text style={styles.editorialNumberText}>01</Text>
            </View>
          </View>

          <View style={styles.editorialBottom}>
            <Text style={styles.editorialBottomText}>BUSINESS CONTROL CENTER</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.midnight}/>
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
    <View style={[styles.pipelineRow, first ? null : styles.pipelineBorder]}>
      <View style={styles.pipelineDot}/>
      <Text style={styles.pipelineName}>{name}</Text>
      <View style={styles.pipelineValueBox}>
        <Text style={styles.pipelineValue}>{value??0}</Text>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:colors.midnight},
  scroll:{flex:1},
  content:{paddingBottom:20,backgroundColor:colors.ivory},
  commandBar:{
    backgroundColor:colors.midnight,
    paddingHorizontal:16,
    paddingTop:12,
    paddingBottom:11,
    borderBottomWidth:1,
    borderBottomColor:'rgba(255,255,255,0.08)'
  },
  commandTop:{
    minHeight:52,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  commandBrand:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  commandLogo:{
    width:62,
    height:44,
    borderRadius:12,
    backgroundColor:'#202B31',
    borderWidth:1,
    borderColor:'rgba(232,216,173,0.22)',
    alignItems:'center',
    justifyContent:'center'
  },
  commandIdentity:{
    marginLeft:11
  },
  commandOverline:{
    color:'rgba(232,216,173,0.62)',
    fontSize:7,
    fontWeight:'900',
    letterSpacing:2.4
  },
  commandTitle:{
    color:colors.white,
    fontSize:18,
    fontWeight:'900',
    marginTop:3,
    letterSpacing:-0.2
  },
  commandRight:{
    flexDirection:'row',
    alignItems:'center',
    gap:8
  },
  liveState:{
    height:30,
    paddingHorizontal:9,
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'rgba(39,168,154,0.10)',
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.24)'
  },
  liveDot:{
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal,
    marginRight:5
  },
  liveText:{
    color:colors.teal,
    fontSize:8,
    fontWeight:'900',
    letterSpacing:1.1
  },
  commandBell:{
    width:40,
    height:40,
    borderRadius:12,
    backgroundColor:'rgba(255,255,255,0.055)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.10)',
    alignItems:'center',
    justifyContent:'center',
    position:'relative'
  },
  commandNotificationDot:{
    position:'absolute',
    top:7,
    right:7,
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal,
    borderWidth:1,
    borderColor:colors.midnight
  },
  commandRule:{display:'none'},
  commandRuleAccent:{display:'none'},
  commandDate:{display:'none'},
  commandRuleLine:{display:'none'},
  commandRuleEnd:{display:'none'},
  editorialGreeting:{
    marginHorizontal:16,
    marginTop:20,
    minHeight:238,
    padding:20,
    backgroundColor:'#F8F7F2',
    borderRadius:26,
    borderWidth:1,
    borderColor:'rgba(24,32,39,0.08)',
    overflow:'hidden'
  },
  editorialAccent:{
    position:'absolute',
    left:0,
    top:0,
    bottom:0,
    width:5,
    backgroundColor:colors.teal
  },
  editorialTop:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginLeft:4
  },
  editorialKicker:{
    color:colors.muted,
    fontSize:8,
    fontWeight:'900',
    letterSpacing:1.8
  },
  editorialStatus:{
    height:25,
    paddingHorizontal:9,
    borderRadius:8,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'rgba(39,168,154,0.08)',
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.16)'
  },
  editorialStatusDot:{
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal,
    marginRight:5
  },
  editorialStatusText:{
    color:colors.teal,
    fontSize:7,
    fontWeight:'900',
    letterSpacing:1.2
  },
  editorialMain:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    marginLeft:4
  },
  editorialCopy:{
    flex:1,
    paddingRight:12
  },
  editorialGreetingText:{
    color:colors.muted,
    fontSize:13,
    fontWeight:'700',
    letterSpacing:0.2
  },
  editorialHeadline:{
    color:colors.ink,
    fontSize:38,
    lineHeight:42,
    fontWeight:'900',
    letterSpacing:-1.4,
    marginTop:1
  },
  editorialDescription:{
    color:'#68747B',
    fontSize:12,
    lineHeight:18,
    marginTop:9,
    maxWidth:255
  },
  editorialNumber:{
    width:70,
    height:92,
    borderRadius:20,
    backgroundColor:colors.midnight,
    alignItems:'center',
    justifyContent:'center',
    transform:[{rotate:'6deg'}]
  },
  editorialNumberText:{
    color:colors.goldLight,
    fontSize:25,
    fontWeight:'900',
    letterSpacing:-1
  },
  editorialBottom:{
    marginLeft:4,
    paddingTop:12,
    borderTopWidth:1,
    borderTopColor:'rgba(24,32,39,0.09)',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  editorialBottomText:{
    color:colors.muted,
    fontSize:7,
    fontWeight:'900',
    letterSpacing:1.6
  },
  dashboardIntro:{display:'none'},
  headerRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  brandGroup:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  logoCard:{
    width:82,
    height:52,
    borderRadius:16,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(255,255,255,0.07)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.11)'
  },
  brandCopy:{
    marginLeft:10,
    justifyContent:'center'
  },
  brandKicker:{
    color:colors.teal,
    fontSize:9,
    fontWeight:'900',
    letterSpacing:1.8
  },
  brandTitle:{
    color:colors.white,
    fontSize:17,
    fontWeight:'900',
    marginTop:2,
    letterSpacing:0.1
  },
  headerActions:{
    flexDirection:'row',
    alignItems:'center',
    gap:8
  },
  statusPill:{
    height:34,
    paddingHorizontal:9,
    borderRadius:12,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'rgba(39,168,154,0.10)',
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.22)'
  },
  statusDot:{
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal,
    marginRight:5
  },
  statusText:{
    color:'rgba(255,255,255,0.72)',
    fontSize:8,
    fontWeight:'900',
    letterSpacing:1
  },
  notification:{
    width:44,
    height:44,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(255,255,255,0.08)',
    borderWidth:1,
    borderColor:'rgba(232,216,173,0.22)',
    position:'relative'
  },
  notificationDot:{
    position:'absolute',
    top:9,
    right:9,
    width:6,
    height:6,
    borderRadius:3,
    backgroundColor:colors.teal,
    borderWidth:1,
    borderColor:colors.midnight
  },
  pressed:{
    opacity:0.72,
    transform:[{scale:0.96}]
  },
  greeting:{marginTop:0},
  eyebrow:{
    color:colors.teal,
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
  bottomSpace:{height:110}
});