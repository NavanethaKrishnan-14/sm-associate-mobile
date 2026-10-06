import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet,useWindowDimensions} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function DashboardScreen({navigation}){
  const [data,setData]=useState(null);
  const [refreshing,setRefreshing]=useState(false);
  const [loadError,setLoadError]=useState('');
  const {width}=useWindowDimensions();
  const {top:topInset}=useSafeAreaInsets();
  const isCompact=width<380;
  const horizontalPadding=Math.max(14,Math.min(20,width*0.045));

  async function load(){
    try{
      setLoadError('');
      const response=await api.get('/reports/dashboard');
      setData(response.data?.data||{});
    }catch(error){
      setData({});
      setLoadError(error?.response?.data?.message || error?.message || 'Unable to load dashboard data.');
    }finally{setRefreshing(false);}
  }

  useEffect(()=>{load();},[]);

  const loanPipeline=data?.loanPipeline||{};
  const actions=[
    ['Car Buying','car-sport-outline','Cars'],['Car Sold','car-sport-outline','CarSale'],
    ['Customer','people-outline','Customers'],['Loan','cash-outline','Loans'],
    ['Documents','folder-open-outline','Documents'],['Reports','bar-chart-outline','More']
  ];
  const metrics=[
    ['Customers',data?.customers??'—','people-outline',colors.gold],
    ['Active Loans',data?.activeLoans??'—','cash-outline',colors.teal],
    ['Inventory',data?.carsInInventory??'—','car-sport-outline',colors.burgundy],
    ['Follow-ups',data?.openFollowUps??'—','call-outline',colors.royal]
  ];

  return (
    <View style={styles.page}>
      <View style={[styles.commandBar,{paddingTop:Math.max(10,topInset)}]}>
        <View style={styles.commandTop}>
          <View style={styles.brandCluster}>
            <View style={styles.logoFrame}><Logo width={72}/></View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandKicker}>SM ASSOCIATE</Text>
              <Text style={styles.brandTitle}>BUSINESS MANAGEMENT</Text>
            </View>
          </View>
          <View style={styles.commandActions}>
            <Pressable onPress={()=>navigation.navigate('More')} style={({pressed})=>[styles.iconButton,pressed&&styles.pressed]} accessibilityRole="button" accessibilityLabel="Open notifications">
              <Ionicons name="notifications-outline" size={20} color={colors.white}/><View style={styles.notificationDot}/>
            </Pressable>
          </View>
        </View>
        <View style={styles.commandDivider}/>
        <View style={styles.commandMeta}>
          <View style={styles.metaLeft}><Ionicons name="pulse-outline" size={14} color={colors.teal}/><Text style={styles.metaText}>BUSINESS OPERATIONS</Text></View>
          <View style={styles.metaRight}><Text style={styles.metaHint}>SYSTEM ONLINE</Text><View style={styles.metaIndicator}/></View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} tintColor={colors.gold}/>}
      >
        <View style={[styles.editorialGreeting,{marginHorizontal:horizontalPadding,minHeight:isCompact?205:218}]}>
          <View style={styles.editorialAccent}/><View style={styles.editorialTop}><View><Text style={styles.editorialKicker}>GOOD MORNING</Text><Text style={styles.editorialDate}>Your business at a glance</Text></View><View style={styles.editorialStatus}><View style={styles.editorialStatusDot}/><Text style={styles.editorialStatusText}>ONLINE</Text></View></View>
          <View style={styles.editorialContent}><Text style={[styles.editorialTitle,{fontSize:isCompact?28:32,lineHeight:isCompact?34:38}]}>Welcome back.</Text><Text style={styles.editorialDescription}>Keep track of your customers, loans and vehicle operations from one dashboard.</Text></View>
          <View style={styles.editorialBottom}><View><Text style={styles.editorialBottomLabel}>TODAY'S FOCUS</Text><Text style={styles.editorialBottomText}>Manage your daily operations</Text></View><View style={styles.editorialAction}><Ionicons name="arrow-forward" size={17} color={colors.white}/></View></View>
        </View>

        {loadError ? <View style={styles.loadErrorCard}><Ionicons name="cloud-offline-outline" size={20} color={colors.danger}/><View style={styles.loadErrorBody}><Text style={styles.loadErrorTitle}>Unable to load dashboard</Text><Text style={styles.loadErrorText}>{loadError}</Text><Pressable onPress={load} style={styles.retryButton}><Text style={styles.retryText}>Retry</Text></Pressable></View></View> : null}

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Overview</Text><Text style={styles.sectionCaption}>Today's business snapshot</Text></View></View>
        <View style={[styles.metricsGrid,{marginHorizontal:horizontalPadding}]}>{metrics.map(([label,value,icon,accent])=><View key={label} style={styles.metric}><View style={[styles.metricIcon,{backgroundColor:accent}]}><Ionicons name={icon} size={19} color={colors.white}/></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>)}</View>

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Quick actions</Text><Text style={styles.sectionCaption}>Jump into your daily tasks</Text></View><View style={styles.sectionBadge}><Ionicons name="flash-outline" size={15} color={colors.midnight}/></View></View>
        <View style={[styles.actionsGrid,{marginHorizontal:horizontalPadding}]}>{actions.map(([label,icon,screen])=><Pressable key={label} onPress={()=>navigation.navigate(screen)} style={styles.action}><View style={styles.actionIcon}><Ionicons name={icon} size={20} color={colors.midnight}/></View><View style={styles.actionBody}><Text style={styles.actionText}>{label}</Text><Text style={styles.actionHint}>Open</Text></View><Ionicons name="chevron-forward" size={17} color={colors.muted}/></Pressable>)}</View>

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Loan pipeline</Text><Text style={styles.sectionCaption}>Current application movement</Text></View><View style={styles.pipelineBadge}><Ionicons name="trending-up-outline" size={16} color={colors.teal}/></View></View>
        <View style={styles.pipelineCard}><PipelineRow name="Entered" value={loanPipeline.ENTERED} first/><PipelineRow name="Documents pending" value={loanPipeline.DOCUMENTS_PENDING}/><PipelineRow name="Submitted" value={loanPipeline.SUBMITTED}/><PipelineRow name="Under review" value={loanPipeline.UNDER_REVIEW}/><PipelineRow name="Approved" value={loanPipeline.APPROVED} last/></View>
        <View style={styles.bottomSpace}/>
      </ScrollView>
    </View>
  );
}

function PipelineRow({name,value,first}){return <View style={[styles.pipelineRow,first?null:styles.pipelineBorder]}><View style={styles.pipelineDot}/><Text style={styles.pipelineName}>{name}</Text><View style={styles.pipelineValueBox}><Text style={styles.pipelineValue}>{value??0}</Text></View></View>;}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:colors.midnight},scroll:{flex:1},content:{paddingBottom:20,backgroundColor:colors.ivory},
  commandBar:{backgroundColor:colors.midnight,paddingHorizontal:18,paddingBottom:12,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.08)'},
  commandTop:{minHeight:76,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brandCluster:{flex:1,flexDirection:'row',alignItems:'center',minWidth:0},
  logoFrame:{width:76,height:76,alignItems:'center',justifyContent:'center'},brandCopy:{marginLeft:8,minWidth:0},brandKicker:{color:colors.teal,fontSize:8,fontWeight:'900',letterSpacing:1.8},brandTitle:{color:colors.white,fontSize:15,fontWeight:'900',letterSpacing:0.5,marginTop:3},
  commandActions:{flexDirection:'row',alignItems:'center',gap:7},
  iconButton:{width:42,height:42,borderRadius:13,backgroundColor:'rgba(255,255,255,0.08)',borderWidth:1,borderColor:'rgba(255,255,255,0.11)',alignItems:'center',justifyContent:'center',position:'relative'},notificationDot:{position:'absolute',top:8,right:8,width:7,height:7,borderRadius:4,backgroundColor:colors.teal,borderWidth:1,borderColor:colors.midnight},commandDivider:{height:1,backgroundColor:'rgba(255,255,255,0.08)',marginTop:9},
  commandMeta:{minHeight:28,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},metaLeft:{flexDirection:'row',alignItems:'center'},metaText:{color:'rgba(255,255,255,0.72)',fontSize:8,fontWeight:'900',letterSpacing:1.2,marginLeft:6},metaRight:{flexDirection:'row',alignItems:'center'},metaHint:{color:'rgba(255,255,255,0.40)',fontSize:7,fontWeight:'900',letterSpacing:1},metaIndicator:{width:6,height:6,borderRadius:3,backgroundColor:colors.teal,marginLeft:6},pressed:{opacity:0.72,transform:[{scale:0.96}]},
  editorialGreeting:{marginTop:20,padding:20,backgroundColor:'#F8F7F2',borderRadius:26,borderWidth:1,borderColor:'rgba(24,32,39,0.08)',overflow:'hidden'},editorialAccent:{position:'absolute',left:0,top:0,bottom:0,width:5,backgroundColor:colors.teal},editorialTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginLeft:4},editorialKicker:{color:colors.teal,fontSize:9,fontWeight:'900',letterSpacing:1.8},editorialDate:{color:colors.muted,fontSize:10,fontWeight:'600',marginTop:3},editorialStatus:{height:27,paddingHorizontal:9,borderRadius:9,flexDirection:'row',alignItems:'center',backgroundColor:'rgba(39,168,154,0.08)',borderWidth:1,borderColor:'rgba(39,168,154,0.16)'},editorialStatusDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.teal,marginRight:5},editorialStatusText:{color:colors.teal,fontSize:7,fontWeight:'900',letterSpacing:1.1},
  editorialContent:{flex:1,justifyContent:'center',marginLeft:4,paddingRight:8},editorialTitle:{color:colors.ink,fontSize:32,lineHeight:38,fontWeight:'900',letterSpacing:-0.8},editorialDescription:{color:'#68747B',fontSize:12,lineHeight:18,marginTop:7,maxWidth:315},editorialBottom:{marginLeft:4,paddingTop:13,borderTopWidth:1,borderTopColor:'rgba(24,32,39,0.09)',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},editorialBottomLabel:{color:colors.muted,fontSize:7,fontWeight:'900',letterSpacing:1.5},editorialBottomText:{color:colors.ink,fontSize:10,fontWeight:'800',marginTop:3},editorialAction:{width:35,height:35,borderRadius:11,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},
  loadErrorCard:{marginHorizontal:18,marginTop:16,padding:14,borderRadius:18,backgroundColor:'#FFF5F3',borderWidth:1,borderColor:'rgba(198,83,83,0.20)',flexDirection:'row',alignItems:'flex-start'},loadErrorBody:{flex:1,marginLeft:10},loadErrorTitle:{color:colors.ink,fontSize:13,fontWeight:'900'},loadErrorText:{color:colors.muted,fontSize:10,lineHeight:15,marginTop:3},retryButton:{alignSelf:'flex-start',marginTop:9,paddingHorizontal:12,paddingVertical:7,borderRadius:9,backgroundColor:colors.midnight},retryText:{color:colors.white,fontSize:10,fontWeight:'900'},
  sectionHeader:{marginHorizontal:18,marginTop:24,marginBottom:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{color:colors.ink,fontSize:19,fontWeight:'900'},sectionCaption:{color:colors.muted,fontSize:11,marginTop:3},sectionBadge:{width:34,height:34,borderRadius:12,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},pipelineBadge:{width:34,height:34,borderRadius:12,backgroundColor:'rgba(38,166,154,0.12)',alignItems:'center',justifyContent:'center'},
  metricsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},metric:{width:'48%',minHeight:132,backgroundColor:colors.white,borderRadius:22,padding:15,marginBottom:10,borderWidth:1,borderColor:'rgba(17,26,35,0.06)',justifyContent:'space-between'},metricIcon:{width:38,height:38,borderRadius:13,alignItems:'center',justifyContent:'center'},metricValue:{color:colors.ink,fontSize:27,fontWeight:'900',marginTop:10},metricLabel:{color:colors.muted,fontSize:12,fontWeight:'700'},
  actionsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},action:{width:'48%',minHeight:76,backgroundColor:colors.white,borderRadius:19,padding:11,marginBottom:10,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'rgba(17,26,35,0.06)'},actionIcon:{width:38,height:38,borderRadius:13,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},actionBody:{flex:1,marginLeft:9},actionText:{color:colors.ink,fontSize:12,fontWeight:'900'},actionHint:{color:colors.muted,fontSize:9,marginTop:2},
  pipelineCard:{marginHorizontal:18,backgroundColor:colors.white,borderRadius:22,paddingHorizontal:15,borderWidth:1,borderColor:'rgba(17,26,35,0.06)'},pipelineRow:{minHeight:58,flexDirection:'row',alignItems:'center'},pipelineBorder:{borderTopWidth:1,borderTopColor:'#EFF0EE'},pipelineDot:{width:9,height:9,borderRadius:5,backgroundColor:colors.gold},pipelineName:{flex:1,color:colors.ink,fontSize:13,fontWeight:'700',marginLeft:10},pipelineValueBox:{minWidth:36,height:30,paddingHorizontal:9,borderRadius:10,backgroundColor:colors.ivory,alignItems:'center',justifyContent:'center'},pipelineValue:{color:colors.midnight,fontSize:13,fontWeight:'900'},bottomSpace:{height:110}
});