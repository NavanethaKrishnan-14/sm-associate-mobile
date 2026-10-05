import React,{useEffect,useState} from 'react';
import {Pressable,RefreshControl,ScrollView,Text,View,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../api/client';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import MetricCard from '../components/MetricCard';
import Surface from '../components/Surface';

const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);
const lerp=(from,to,progress)=>from+(to-from)*progress;
const range=(value,start,end)=>{
  if(value<=start)return 0;
  if(value>=end)return 1;
  return (value-start)/(end-start);
};

export default function DashboardScreen({navigation}){
  const [data,setData]=useState(null);
  const [refreshing,setRefreshing]=useState(false);
  const [scrollY,setScrollY]=useState(0);

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

  const y=clamp(scrollY,0,160);
  const collapse=range(y,0,160);
  const headerHeight=lerp(190,72,collapse);
  const logoScale=lerp(1,0.62,collapse);
  const topPadding=lerp(58,10,collapse);
  const largeOpacity=1-range(y,35,95);
  const compactOpacity=range(y,55,120);
  const largeTranslateY=lerp(0,-18,collapse);

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
      <View style={[styles.hero,{height:headerHeight}]}>
        <LinearGradient
          colors={[colors.midnight,colors.navy]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={[styles.headerInner,{paddingTop:topPadding}]}>
          <View style={styles.topRow}>
            <View style={{transform:[{scale:logoScale}]}}>
              <Logo width={142}/>
            </View>

            <Text style={[styles.compactTitle,{opacity:compactOpacity}]}>
              Dashboard
            </Text>

            <Pressable
              onPress={()=>navigation.navigate('More')}
              style={styles.notificationButton}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.goldLight}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.largeContent,
              {
                opacity:largeOpacity,
                transform:[{translateY:largeTranslateY}]
              }
            ]}
          >
            <Text style={styles.kicker}>OPERATIONS OVERVIEW</Text>
            <Text style={styles.title}>Good morning.</Text>
            <Text style={styles.sub}>
              A sharper view of your business, all from your phone.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event)=>{
          const offset=event.nativeEvent.contentOffset.y;
          setScrollY(offset<0?0:offset);
        }}
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
  hero:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    zIndex:20,
    elevation:20,
    overflow:'hidden',
    borderBottomLeftRadius:28,
    borderBottomRightRadius:28
  },
  headerInner:{
    paddingHorizontal:20,
    paddingBottom:14
  },
  topRow:{
    height:48,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  compactTitle:{
    position:'absolute',
    left:0,
    right:0,
    textAlign:'center',
    color:colors.white,
    fontSize:18,
    fontWeight:'900'
  },
  notificationButton:{
    width:42,
    height:42,
    borderRadius:14,
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
    paddingTop:208
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
