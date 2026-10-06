import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

const items=[
 ['Car Sold','car-sport-outline','CarSale','AUTOMOTIVE','Vehicle sales'],
 ['User Management','people-outline','Users','ADMIN','People & access'],
 ['Vehicle Expenses','receipt-outline','Expenses','FINANCE','Cost tracking'],
 ['Car Profit','trending-up-outline','CarProfit','ANALYTICS','Profit overview'],
 ['Loan Revenue','cash-outline','LoanRevenue','ANALYTICS','Revenue overview'],
 ['Operational Reports','document-text-outline','OperationalReports','REPORTING','Business insights']
];

export default function MoreScreen({navigation}){
 const {top,bottom}=useSafeAreaInsets();
 const go=section=>section==='CarSale'?navigation.navigate('CarSale'):['CarProfit','LoanRevenue','OperationalReports'].includes(section)?navigation.navigate(section):navigation.navigate('AdminTools',{section});
 return <View style={s.page}>
   <ScrollView bounces={false} alwaysBounceVertical={false} overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingBottom:bottom+100}]}>
     <View style={[s.topBar,{paddingTop:top+16}]}>
       <View style={s.topRow}>
         <View style={s.brand}>
           <View style={s.logoPanel}><Logo width={78}/></View>
           <View style={s.brandCopy}>
             <Text style={s.brandEyebrow}>SM ASSOCIATE</Text>
             <Text style={s.brandName}>BUSINESS HUB</Text>
             <View style={s.brandLine}><View style={s.brandLineMark}/><Text style={s.brandSub}>MANAGEMENT CONSOLE</Text></View>
           </View>
         </View>
         <Pressable style={({pressed})=>[s.headerButton,pressed&&s.pressed]}><Ionicons name="options-outline" size={19} color={colors.white}/></Pressable>
       </View>
       <View style={s.headerBottom}>
         <View style={s.metaLeft}><View style={s.metaIcon}><Ionicons name="grid-outline" size={12} color={colors.teal}/></View><Text style={s.metaLabel}>EXECUTIVE WORKSPACE</Text></View>
         <View style={s.online}><View style={s.onlineDot}/><Text style={s.onlineText}>SYSTEM ONLINE</Text></View>
       </View>
     </View>

     <View style={s.body}>
       <View style={s.heroIntro}>
         <View style={s.introBadge}><Text style={s.introBadgeText}>CONTROL • 06</Text></View>
         <Text style={s.introTitle}>Run the business.<Text style={s.introAccent}> Your way.</Text></Text>
         <Text style={s.introSub}>One premium workspace for finance, automotive and operational decisions.</Text>
       </View>

       <View style={s.commandCard}>
         <View style={s.commandTop}>
           <View style={s.commandIcon}><Ionicons name="pulse-outline" size={22} color={colors.teal}/></View>
           <View style={s.commandStatus}><View style={s.statusDot}/><Text style={s.statusText}>ACTIVE</Text></View>
         </View>
         <View style={s.commandMain}>
           <Text style={s.commandOverline}>BUSINESS COMMAND</Text>
           <Text style={s.commandTitle}>Your operations,<Text style={s.commandAccent}> connected.</Text></Text>
           <Text style={s.commandDesc}>Access every management function from a single control surface.</Text>
         </View>
         <View style={s.commandMetrics}>
           <View style={s.metric}><Text style={s.metricValue}>06</Text><Text style={s.metricLabel}>MODULES</Text></View>
           <View style={s.metricDivider}/>
           <View style={s.metric}><Text style={s.metricValue}>24/7</Text><Text style={s.metricLabel}>ACCESS</Text></View>
           <View style={s.metricDivider}/>
           <View style={s.metric}><Text style={s.metricValue}>01</Text><Text style={s.metricLabel}>HUB</Text></View>
         </View>
       </View>

       <View style={s.sectionHead}>
         <View><Text style={s.sectionOverline}>MANAGEMENT</Text><Text style={s.sectionTitle}>Business tools</Text></View>
         <View style={s.sectionCount}><Text style={s.sectionCountValue}>06</Text><Text style={s.sectionCountLabel}>ACTIVE</Text></View>
       </View>

       <View style={s.list}>{items.map(([label,icon,section,group,desc],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.module,pressed&&s.modulePressed]}>
         <View style={s.moduleNumber}><Text style={s.moduleNumberText}>{String(i+1).padStart(2,'0')}</Text></View>
         <View style={s.moduleIcon}><Ionicons name={icon} size={20} color={colors.teal}/></View>
         <View style={s.moduleCopy}><Text style={s.moduleGroup}>{group}</Text><Text style={s.moduleTitle}>{label}</Text><Text style={s.moduleDesc}>{desc}</Text></View>
         <View style={s.moduleArrow}><Ionicons name="arrow-forward" size={14} color={colors.white}/></View>
       </Pressable>)}</View>

       <View style={s.security}>
         <View style={s.securityIcon}><Ionicons name="shield-checkmark-outline" size={19} color={colors.teal}/></View>
         <View style={s.securityCopy}><Text style={s.securityTitle}>Protected workspace</Text><Text style={s.securitySub}>Administrative access is secured</Text></View>
         <View style={s.securityBadge}><View style={s.securityDot}/><Text style={s.securityText}>SECURE</Text></View>
       </View>

       <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.signOut,pressed&&s.pressed]}>
         <Ionicons name="log-out-outline" size={17} color={colors.danger}/><Text style={s.signText}>Sign out of workspace</Text><Ionicons name="arrow-forward" size={15} color={colors.danger}/>
       </Pressable>
     </View>
   </ScrollView>
 </View>
}

const s={
 page:{flex:1,backgroundColor:'#F1F3F1'},
 content:{paddingBottom:110},
 topBar:{backgroundColor:colors.midnight,paddingHorizontal:18,paddingBottom:15,borderBottomLeftRadius:30,borderBottomRightRadius:30,shadowColor:'#172027',shadowOffset:{width:0,height:10},shadowOpacity:.22,shadowRadius:18,elevation:8},
 topRow:{minHeight:88,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 brand:{flex:1,flexDirection:'row',alignItems:'center',gap:12},
 logoPanel:{width:86,height:78,borderRadius:22,backgroundColor:'#202D34',alignItems:'center',justifyContent:'center',overflow:'hidden',borderWidth:1,borderColor:'#3A4A52'},
 brandCopy:{flex:1,minWidth:0},
 brandEyebrow:{fontSize:7.5,fontWeight:'900',letterSpacing:2,color:colors.teal},
 brandName:{fontSize:19,fontWeight:'900',letterSpacing:.3,color:colors.white,marginTop:2},
 brandLine:{flexDirection:'row',alignItems:'center',marginTop:5,gap:6},
 brandLineMark:{width:18,height:2,backgroundColor:colors.teal},
 brandSub:{fontSize:6.5,fontWeight:'900',letterSpacing:1.1,color:'#87959A'},
 headerButton:{width:42,height:42,borderRadius:14,backgroundColor:'#202D34',borderWidth:1,borderColor:'#3A4A52',alignItems:'center',justifyContent:'center'},
 headerBottom:{height:30,marginTop:3,paddingTop:9,borderTopWidth:1,borderTopColor:'#354149',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 metaLeft:{flexDirection:'row',alignItems:'center',gap:7},
 metaIcon:{width:22,height:22,borderRadius:7,backgroundColor:'#24383B',alignItems:'center',justifyContent:'center'},
 metaLabel:{fontSize:6.8,fontWeight:'900',letterSpacing:1.3,color:'#A7B1B5'},
 online:{flexDirection:'row',alignItems:'center',gap:5},
 onlineDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success},
 onlineText:{fontSize:6.5,fontWeight:'900',letterSpacing:.9,color:colors.success},
 body:{paddingHorizontal:18},
 heroIntro:{paddingTop:22,paddingBottom:18},
 introBadge:{alignSelf:'flex-start',height:23,paddingHorizontal:9,borderRadius:8,backgroundColor:'#DDEAE7',justifyContent:'center',marginBottom:9},
 introBadgeText:{fontSize:7,fontWeight:'900',letterSpacing:1.15,color:colors.teal},
 introTitle:{fontSize:29,lineHeight:33,fontWeight:'900',letterSpacing:-.9,color:colors.ink,maxWidth:350},
 introAccent:{color:colors.teal},
 introSub:{fontSize:11.5,lineHeight:17,color:colors.muted,marginTop:7,maxWidth:335},
 commandCard:{minHeight:205,borderRadius:28,backgroundColor:colors.midnight,padding:17,overflow:'hidden',shadowColor:'#172027',shadowOffset:{width:0,height:14},shadowOpacity:.18,shadowRadius:22,elevation:8},
 commandTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 commandIcon:{width:46,height:46,borderRadius:15,backgroundColor:'#243139',borderWidth:1,borderColor:'#3A4A52',alignItems:'center',justifyContent:'center'},
 commandStatus:{height:25,paddingHorizontal:9,borderRadius:13,backgroundColor:'#243B3B',borderWidth:1,borderColor:'#39766E',flexDirection:'row',alignItems:'center',gap:5},
 statusDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success},
 statusText:{fontSize:6.5,fontWeight:'900',letterSpacing:1,color:colors.success},
 commandMain:{flex:1,justifyContent:'center',paddingVertical:13},
 commandOverline:{fontSize:7.5,fontWeight:'900',letterSpacing:1.7,color:colors.teal},
 commandTitle:{fontSize:23,fontWeight:'900',letterSpacing:-.4,color:colors.white,marginTop:3},
 commandAccent:{color:colors.teal},
 commandDesc:{fontSize:10,color:'#AEB8BC',lineHeight:15,marginTop:5,maxWidth:290},
 commandMetrics:{height:50,borderTopWidth:1,borderTopColor:'#354149',flexDirection:'row',alignItems:'center'},
 metric:{flex:1},
 metricValue:{fontSize:15,fontWeight:'900',color:colors.white},
 metricLabel:{fontSize:6,fontWeight:'900',letterSpacing:1,color:'#7E8B90',marginTop:2},
 metricDivider:{width:1,height:25,backgroundColor:'#354149'},
 sectionHead:{marginTop:28,marginBottom:12,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
 sectionOverline:{fontSize:7.5,fontWeight:'900',letterSpacing:1.7,color:colors.teal},
 sectionTitle:{fontSize:21,fontWeight:'900',color:colors.ink,marginTop:3},
 sectionCount:{alignItems:'flex-end',marginBottom:2},
 sectionCountValue:{fontSize:13,fontWeight:'900',color:colors.ink},
 sectionCountLabel:{fontSize:5.8,fontWeight:'900',letterSpacing:1,color:colors.muted,marginTop:1},
 list:{gap:9},
 module:{minHeight:86,borderRadius:20,backgroundColor:colors.white,borderWidth:1,borderColor:'#DDE3E0',padding:11,flexDirection:'row',alignItems:'center',shadowColor:'#172027',shadowOffset:{width:0,height:4},shadowOpacity:.05,shadowRadius:10,elevation:2},
 modulePressed:{transform:[{scale:.985}],opacity:.9},
 moduleNumber:{width:27,height:27,borderRadius:8,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center',marginRight:8},
 moduleNumberText:{fontSize:7,fontWeight:'900',color:'#A9B4B8'},
 moduleIcon:{width:44,height:44,borderRadius:14,backgroundColor:'#E1F1EE',alignItems:'center',justifyContent:'center',marginRight:10},
 moduleCopy:{flex:1,minWidth:0},
 moduleGroup:{fontSize:6.3,fontWeight:'900',letterSpacing:1.05,color:colors.teal},
 moduleTitle:{fontSize:14.5,fontWeight:'900',color:colors.ink,marginTop:2},
 moduleDesc:{fontSize:9.3,color:colors.muted,marginTop:2},
 moduleArrow:{width:32,height:32,borderRadius:11,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},
 security:{marginTop:15,minHeight:65,paddingHorizontal:11,paddingVertical:10,borderRadius:19,backgroundColor:'#E5F1EE',borderWidth:1,borderColor:'#C9DFDA',flexDirection:'row',alignItems:'center'},
 securityIcon:{width:39,height:39,borderRadius:13,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',marginRight:10},
 securityCopy:{flex:1},
 securityTitle:{fontSize:11.5,fontWeight:'900',color:colors.ink},
 securitySub:{fontSize:8.5,color:colors.muted,marginTop:2},
 securityBadge:{alignItems:'center',marginLeft:7},
 securityDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success,marginBottom:3},
 securityText:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:colors.success},
 signOut:{height:50,borderRadius:17,borderWidth:1,borderColor:'#E8CACA',backgroundColor:'#FFF9F9',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:11},
 signText:{color:colors.danger,fontWeight:'900',fontSize:12},
 pressed:{opacity:.78}
};