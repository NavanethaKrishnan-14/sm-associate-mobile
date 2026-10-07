import {AppText,AppTextInput} from '../components/AppText';
import React,{useEffect,useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View, StyleSheet, useWindowDimensions} from 'react-native';
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
            <View style={styles.logoFrame}><Logo width={84}/></View>
            <View style={styles.brandCopy}>
              <AppText style={styles.brandKicker}>SM ASSOCIATE</AppText>
              <AppText style={styles.brandTitle}>Business</AppText>
              <AppText style={styles.brandTitle}>Management</AppText>
            </View>
          </View>
          <View style={styles.commandActions}>
            <Pressable onPress={()=>navigation.navigate('More')} style={({pressed})=>[styles.iconButton,pressed&&styles.pressed]} accessibilityRole="button" accessibilityLabel="Open notifications">
              <Ionicons name="notifications-outline" size={23} color={colors.white}/><View style={styles.notificationDot}/>
            </Pressable>
            <Pressable onPress={()=>navigation.navigate('More')} style={({pressed})=>[styles.iconButton,pressed&&styles.pressed]} accessibilityRole="button" accessibilityLabel="Open settings">
              <Ionicons name="settings-outline" size={23} color={colors.white}/>
            </Pressable>
          </View>
        </View>
        <View style={styles.commandDivider}/>
        <View style={styles.commandMeta}>
          <View style={styles.metaLeft}><Ionicons name="pulse-outline" size={12} color={colors.teal}/><AppText style={styles.metaText}>BUSINESS OPERATIONS</AppText></View>
          <View style={styles.metaRight}><AppText style={styles.metaHint}>SYSTEM ONLINE</AppText><View style={styles.metaIndicator}/></View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} tintColor={colors.gold}/>}
      >
        <View style={[styles.editorialGreeting,{marginHorizontal:horizontalPadding,minHeight:isCompact?205:218}]}>
          <View style={styles.editorialAccent}/><View style={styles.editorialTop}><View><AppText style={styles.editorialKicker}>GOOD MORNING</AppText><AppText style={styles.editorialDate}>Your business at a glance</AppText></View><View style={styles.editorialStatus}><View style={styles.editorialStatusDot}/><AppText style={styles.editorialStatusText}>ONLINE</AppText></View></View>
          <View style={styles.editorialContent}><AppText style={[styles.editorialTitle,{fontSize:isCompact?28:32,lineHeight:isCompact?34:38}]}>Welcome back.</AppText><AppText style={styles.editorialDescription}>Keep track of your customers, loans and vehicle operations from one dashboard.</AppText></View>
          <View style={styles.editorialBottom}><View><AppText style={styles.editorialBottomLabel}>TODAY'S FOCUS</AppText><AppText style={styles.editorialBottomText}>Manage your daily operations</AppText></View><Pressable onPress={()=>navigation.navigate('More')} style={({pressed})=>[styles.editorialAction,pressed&&styles.pressed]} accessibilityRole="button" accessibilityLabel="Open more management options"><Ionicons name="arrow-forward" size={17} color={colors.white}/></Pressable></View>
        </View>

        {loadError ? <View style={styles.loadErrorCard}><Ionicons name="cloud-offline-outline" size={20} color={colors.danger}/><View style={styles.loadErrorBody}><AppText style={styles.loadErrorTitle}>Unable to load dashboard</AppText><AppText style={styles.loadErrorText}>{loadError}</AppText><Pressable onPress={load} style={styles.retryButton}><AppText style={styles.retryText}>Retry</AppText></Pressable></View></View> : null}

        <View style={styles.sectionHeader}><View><AppText style={styles.sectionTitle}>Overview</AppText><AppText style={styles.sectionCaption}>Today's business snapshot</AppText></View></View>
        <View style={[styles.metricsGrid,{marginHorizontal:horizontalPadding}]}>{metrics.map(([label,value,icon,accent])=><View key={label} style={styles.metric}><View style={[styles.metricIcon,{backgroundColor:accent}]}><Ionicons name={icon} size={19} color={colors.white}/></View><AppText style={styles.metricValue}>{value}</AppText><AppText style={styles.metricLabel}>{label}</AppText></View>)}</View>

        <View style={styles.sectionHeader}><View><AppText style={styles.sectionTitle}>Quick actions</AppText><AppText style={styles.sectionCaption}>Jump into your daily tasks</AppText></View><View style={styles.sectionBadge}><Ionicons name="flash-outline" size={15} color={colors.midnight}/></View></View>
        <View style={[styles.actionsGrid,{marginHorizontal:horizontalPadding}]}>{actions.map(([label,icon,screen])=><Pressable key={label} onPress={()=>navigation.navigate(screen)} style={styles.action}><View style={styles.actionIcon}><Ionicons name={icon} size={20} color={colors.midnight}/></View><View style={styles.actionBody}><AppText style={styles.actionText}>{label}</AppText><AppText style={styles.actionHint}>Open</AppText></View><Ionicons name="chevron-forward" size={17} color={colors.muted}/></Pressable>)}</View>

        <View style={styles.sectionHeader}><View><AppText style={styles.sectionTitle}>Loan pipeline</AppText><AppText style={styles.sectionCaption}>Current application movement</AppText></View><View style={styles.pipelineBadge}><Ionicons name="trending-up-outline" size={16} color={colors.teal}/></View></View>
        <View style={styles.pipelineCard}><PipelineRow name="Entered" value={loanPipeline.ENTERED} first/><PipelineRow name="Documents pending" value={loanPipeline.DOCUMENTS_PENDING}/><PipelineRow name="Submitted" value={loanPipeline.SUBMITTED}/><PipelineRow name="Under review" value={loanPipeline.UNDER_REVIEW}/><PipelineRow name="Approved" value={loanPipeline.APPROVED} last/></View>
        <View style={styles.bottomSpace}/>
      </ScrollView>
    </View>
  );
}

function PipelineRow({name,value,first}){return <View style={[styles.pipelineRow,first?null:styles.pipelineBorder]}><View style={styles.pipelineDot}/><AppText style={styles.pipelineName}>{name}</AppText><View style={styles.pipelineValueBox}><AppText style={styles.pipelineValue}>{value??0}</AppText></View></View>;}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:colors.midnight},scroll:{flex:1},content:{paddingBottom:20,backgroundColor:colors.ivory},
  commandBar:{backgroundColor:'#0E1A22',paddingLeft:14,paddingRight:14,paddingBottom:18,borderBottomLeftRadius:48,borderBottomRightRadius:48,borderWidth:1,borderTopWidth:0,borderColor:'rgba(255,255,255,0.08)',overflow:'hidden'},
  commandTop:{minHeight:158,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brandCluster:{flex:1,flexDirection:'row',alignItems:'center',minWidth:0,paddingRight:10},
  logoFrame:{width:88,height:88,alignItems:'center',justifyContent:'center',overflow:'hidden'},brandCopy:{marginLeft:12,minWidth:0,flex:1,flexShrink:1,paddingRight:2},brandKicker:{color:'#53D3D1',fontSize:10,lineHeight:14,fontWeight:'700',letterSpacing:2.1,marginBottom:7},brandTitle:{color:colors.white,fontSize:32,lineHeight:39,fontWeight:'700',letterSpacing:-0.7,includeFontPadding:false},
  commandActions:{flexDirection:'row',alignItems:'center',gap:8},
  iconButton:{width:56,height:56,borderRadius:18,backgroundColor:'rgba(31,49,60,0.88)',borderWidth:1,borderColor:'rgba(120,178,190,0.18)',alignItems:'center',justifyContent:'center',position:'relative'},notificationDot:{position:'absolute',top:10,right:10,width:9,height:9,borderRadius:5,backgroundColor:'#53D3D1',borderWidth:1.5,borderColor:'#1A2A34'},commandDivider:{height:1,backgroundColor:'rgba(255,255,255,0.10)',marginTop:2,marginBottom:17},
  commandMeta:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},metaLeft:{flex:1,flexDirection:'row',alignItems:'center',minWidth:0},metaText:{color:'rgba(255,255,255,0.74)',fontSize:12,letterSpacing:1.55,fontWeight:'600',marginLeft:8},metaRight:{height:46,minWidth:146,paddingHorizontal:16,borderRadius:23,backgroundColor:'rgba(39,168,154,0.16)',flexDirection:'row',alignItems:'center',justifyContent:'center'},metaHint:{color:'#5BE0D1',fontSize:12,letterSpacing:0.05,fontWeight:'700'},metaIndicator:{width:12,height:12,borderRadius:6,backgroundColor:'#53D3D1',marginLeft:9,marginRight:0},pressed:{opacity:0.72,transform:[{scale:0.97}]},
  editorialGreeting:{marginTop:20,padding:20,backgroundColor:'#F8F7F2',borderRadius:26,borderWidth:1,borderColor:'rgba(24,32,39,0.08)',overflow:'hidden'},editorialAccent:{position:'absolute',left:0,top:0,bottom:0,width:5,backgroundColor:colors.teal},editorialTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginLeft:4},editorialKicker:{color:colors.teal,fontSize:9,letterSpacing:1.8},editorialDate:{color:colors.muted,fontSize:10,marginTop:3},editorialStatus:{height:27,paddingHorizontal:9,borderRadius:9,flexDirection:'row',alignItems:'center',backgroundColor:'rgba(39,168,154,0.08)',borderWidth:1,borderColor:'rgba(39,168,154,0.16)'},editorialStatusDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.teal,marginRight:5},editorialStatusText:{color:colors.teal,fontSize:7,letterSpacing:1.1},
  editorialContent:{flex:1,justifyContent:'center',marginLeft:4,paddingRight:8},editorialTitle:{color:colors.ink,fontSize:32,lineHeight:38,letterSpacing:-0.8},editorialDescription:{color:'#68747B',fontSize:12,lineHeight:18,marginTop:7,maxWidth:315},editorialBottom:{marginLeft:4,paddingTop:13,borderTopWidth:1,borderTopColor:'rgba(24,32,39,0.09)',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},editorialBottomLabel:{color:colors.muted,fontSize:7,letterSpacing:1.5},editorialBottomText:{color:colors.ink,fontSize:10,marginTop:3},editorialAction:{width:35,height:35,borderRadius:11,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},
  loadErrorCard:{marginHorizontal:18,marginTop:16,padding:14,borderRadius:18,backgroundColor:'#FFF5F3',borderWidth:1,borderColor:'rgba(198,83,83,0.20)',flexDirection:'row',alignItems:'flex-start'},loadErrorBody:{flex:1,marginLeft:10},loadErrorTitle:{color:colors.ink,fontSize:13,},loadErrorText:{color:colors.muted,fontSize:10,lineHeight:15,marginTop:3},retryButton:{alignSelf:'flex-start',marginTop:9,paddingHorizontal:12,paddingVertical:7,borderRadius:9,backgroundColor:colors.midnight},retryText:{color:colors.white,fontSize:10,},
  sectionHeader:{marginHorizontal:18,marginTop:24,marginBottom:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{color:colors.ink,fontSize:19,},sectionCaption:{color:colors.muted,fontSize:11,marginTop:3},sectionBadge:{width:34,height:34,borderRadius:12,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},pipelineBadge:{width:34,height:34,borderRadius:12,backgroundColor:'rgba(38,166,154,0.12)',alignItems:'center',justifyContent:'center'},
  metricsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},metric:{width:'48%',minHeight:132,backgroundColor:colors.white,borderRadius:22,padding:15,marginBottom:10,borderWidth:1,borderColor:'rgba(17,26,35,0.06)',justifyContent:'space-between'},metricIcon:{width:38,height:38,borderRadius:13,alignItems:'center',justifyContent:'center'},metricValue:{color:colors.ink,fontSize:27,marginTop:10},metricLabel:{color:colors.muted,fontSize:12,},
  actionsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},action:{width:'48%',minHeight:76,backgroundColor:colors.white,borderRadius:19,padding:11,marginBottom:10,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'rgba(17,26,35,0.06)'},actionIcon:{width:38,height:38,borderRadius:13,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},actionBody:{flex:1,marginLeft:9},actionText:{color:colors.ink,fontSize:12,},actionHint:{color:colors.muted,fontSize:9,marginTop:2},
  pipelineCard:{marginHorizontal:18,backgroundColor:colors.white,borderRadius:22,paddingHorizontal:15,borderWidth:1,borderColor:'rgba(17,26,35,0.06)'},pipelineRow:{minHeight:58,flexDirection:'row',alignItems:'center'},pipelineBorder:{borderTopWidth:1,borderTopColor:'#EFF0EE'},pipelineDot:{width:9,height:9,borderRadius:5,backgroundColor:colors.gold},pipelineName:{flex:1,color:colors.ink,fontSize:13,marginLeft:10},pipelineValueBox:{minWidth:36,height:30,paddingHorizontal:9,borderRadius:10,backgroundColor:colors.ivory,alignItems:'center',justifyContent:'center'},pipelineValue:{color:colors.midnight,fontSize:13,},bottomSpace:{height:110}
});