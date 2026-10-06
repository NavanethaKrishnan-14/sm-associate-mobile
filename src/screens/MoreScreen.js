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
   <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingTop:top+18,paddingBottom:bottom+100}]}>
     <View style={s.header}>
       <View style={s.headerLine}>
         <View style={s.brand}><Logo width={76}/><View><Text style={s.brandName}>SM ASSOCIATE</Text><Text style={s.brandSub}>BUSINESS MANAGEMENT</Text></View></View>
         <View style={s.headerButton}><Ionicons name="ellipsis-horizontal" size={18} color={colors.ink}/></View>
       </View>
       <View style={s.headerRule}/>
       <View style={s.headerMeta}><Text style={s.metaLabel}>EXECUTIVE WORKSPACE</Text><View style={s.online}><View style={s.onlineDot}/><Text style={s.onlineText}>ONLINE</Text></View></View>
     </View>

     <View style={s.intro}>
       <Text style={s.introOverline}>BUSINESS HUB</Text>
       <Text style={s.introTitle}>Everything in one place.</Text>
       <Text style={s.introSub}>A focused workspace for your finance, automotive and business operations.</Text>
     </View>

     <View style={s.feature}>
       <View style={s.featureGlow}/>
       <View style={s.featureTop}>
         <View style={s.featureIcon}><Ionicons name="speedometer-outline" size={23} color={colors.teal}/></View>
         <View style={s.featureTag}><Text style={s.featureTagText}>CONTROL CENTER</Text></View>
       </View>
       <View style={s.featureBody}>
         <View style={{flex:1}}>
           <Text style={s.featureKicker}>OPERATIONS</Text>
           <Text style={s.featureTitle}>Business Command</Text>
           <Text style={s.featureDesc}>Move from customers to revenue with a single workflow.</Text>
         </View>
         <View style={s.featureStat}><Text style={s.featureStatValue}>06</Text><Text style={s.featureStatLabel}>TOOLS</Text></View>
       </View>
       <View style={s.featureFooter}><View style={s.featureFooterLine}/><Text style={s.featureFooterText}>FINANCE  /  MOBILITY  /  REPORTING</Text></View>
     </View>

     <View style={s.sectionHead}>
       <View><Text style={s.sectionOverline}>YOUR WORKSPACE</Text><Text style={s.sectionTitle}>Management tools</Text></View>
       <Text style={s.sectionCount}>06 MODULES</Text>
     </View>

     <View style={s.list}>
       {items.map(([label,icon,section,group,desc],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.module,pressed&&s.modulePressed]}>
         <View style={s.moduleIndex}><Text style={s.moduleIndexText}>{String(i+1).padStart(2,'0')}</Text></View>
         <View style={s.moduleIcon}><Ionicons name={icon} size={21} color={colors.teal}/></View>
         <View style={s.moduleCopy}><Text style={s.moduleGroup}>{group}</Text><Text style={s.moduleTitle}>{label}</Text><Text style={s.moduleDesc}>{desc}</Text></View>
         <View style={s.moduleArrow}><Ionicons name="arrow-up-outline" size={15} color={colors.ink}/></View>
       </Pressable>)}
     </View>

     <View style={s.security}>
       <View style={s.securityMark}><Ionicons name="shield-checkmark-outline" size={19} color={colors.teal}/></View>
       <View style={{flex:1}}><Text style={s.securityTitle}>Secure management space</Text><Text style={s.securitySub}>Administrative access protected</Text></View>
       <View style={s.securityPill}><View style={s.securityDot}/><Text style={s.securityText}>SECURE</Text></View>
     </View>

     <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.signOut,pressed&&{opacity:.78}]}>
       <Ionicons name="log-out-outline" size={18} color={colors.danger}/><Text style={s.signText}>Sign out</Text><Ionicons name="arrow-forward" size={15} color={colors.danger}/>
     </Pressable>
   </ScrollView>
 </View>
}

const s={
 page:{flex:1,backgroundColor:'#F5F6F4'},
 content:{paddingHorizontal:18,paddingBottom:110},
 header:{paddingHorizontal:2},
 headerLine:{minHeight:62,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 brand:{flexDirection:'row',alignItems:'center',gap:10,flex:1},
 brandName:{fontSize:13,fontWeight:'900',letterSpacing:1.6,color:colors.ink},
 brandSub:{fontSize:7.5,fontWeight:'800',letterSpacing:1.15,color:colors.muted,marginTop:3},
 headerButton:{width:40,height:40,borderRadius:20,backgroundColor:colors.white,borderWidth:1,borderColor:'#E3E7E4',alignItems:'center',justifyContent:'center'},
 headerRule:{height:1,backgroundColor:'#DDE3DF'},
 headerMeta:{height:32,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 metaLabel:{fontSize:7.5,fontWeight:'900',letterSpacing:1.35,color:colors.muted},
 online:{flexDirection:'row',alignItems:'center',gap:5},
 onlineDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success},
 onlineText:{fontSize:7,fontWeight:'900',letterSpacing:1,color:colors.success},
 intro:{paddingTop:24,paddingBottom:18},
 introOverline:{fontSize:8,fontWeight:'900',letterSpacing:2.1,color:colors.teal},
 introTitle:{fontSize:30,lineHeight:34,fontWeight:'900',letterSpacing:-.8,color:colors.ink,marginTop:6},
 introSub:{fontSize:11.5,lineHeight:17,color:colors.muted,marginTop:7,maxWidth:330},
 feature:{height:190,borderRadius:27,backgroundColor:colors.midnight,padding:17,overflow:'hidden',shadowColor:'#172027',shadowOffset:{width:0,height:13},shadowOpacity:.16,shadowRadius:22,elevation:7},
 featureGlow:{position:'absolute',width:240,height:240,borderRadius:120,right:-125,top:-115,backgroundColor:'rgba(39,168,154,.18)',borderWidth:1,borderColor:'rgba(39,168,154,.18)'},
 featureTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 featureIcon:{width:46,height:46,borderRadius:15,backgroundColor:'rgba(255,255,255,.08)',borderWidth:1,borderColor:'rgba(255,255,255,.12)',alignItems:'center',justifyContent:'center'},
 featureTag:{paddingHorizontal:9,height:24,borderRadius:12,borderWidth:1,borderColor:'rgba(39,168,154,.38)',backgroundColor:'rgba(39,168,154,.09)',alignItems:'center',justifyContent:'center'},
 featureTagText:{fontSize:7,fontWeight:'900',letterSpacing:1.1,color:colors.goldLight},
 featureBody:{flex:1,flexDirection:'row',alignItems:'flex-end',paddingBottom:10},
 featureKicker:{fontSize:8,fontWeight:'900',letterSpacing:1.7,color:colors.teal},
 featureTitle:{fontSize:25,fontWeight:'900',letterSpacing:-.4,color:colors.white,marginTop:3},
 featureDesc:{fontSize:10,color:'rgba(255,255,255,.58)',lineHeight:14,marginTop:4,maxWidth:255},
 featureStat:{width:58,height:58,borderRadius:18,backgroundColor:'rgba(255,255,255,.07)',borderWidth:1,borderColor:'rgba(255,255,255,.11)',alignItems:'center',justifyContent:'center'},
 featureStatValue:{fontSize:20,fontWeight:'900',color:colors.white,lineHeight:22},
 featureStatLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:1,color:'rgba(255,255,255,.48)'},
 featureFooter:{height:18,flexDirection:'row',alignItems:'center',gap:8},
 featureFooterLine:{width:24,height:1,backgroundColor:colors.teal},
 featureFooterText:{fontSize:6.5,fontWeight:'900',letterSpacing:1.1,color:'rgba(255,255,255,.38)'},
 sectionHead:{marginTop:28,marginBottom:12,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
 sectionOverline:{fontSize:7.5,fontWeight:'900',letterSpacing:1.7,color:colors.teal},
 sectionTitle:{fontSize:21,fontWeight:'900',color:colors.ink,marginTop:3},
 sectionCount:{fontSize:7,fontWeight:'900',letterSpacing:1,color:colors.muted,marginBottom:3},
 list:{gap:9},
 module:{minHeight:88,borderRadius:21,backgroundColor:colors.white,borderWidth:1,borderColor:'#E1E6E3',padding:12,flexDirection:'row',alignItems:'center',shadowColor:'#172027',shadowOffset:{width:0,height:5},shadowOpacity:.045,shadowRadius:12,elevation:2},
 modulePressed:{transform:[{scale:.985}],opacity:.9},
 moduleIndex:{width:25,height:25,borderRadius:8,alignItems:'center',justifyContent:'center',backgroundColor:'#F0F3F1',marginRight:8},
 moduleIndexText:{fontSize:7,fontWeight:'900',color:colors.muted},
 moduleIcon:{width:45,height:45,borderRadius:15,backgroundColor:'#E4F3F0',alignItems:'center',justifyContent:'center',marginRight:11},
 moduleCopy:{flex:1,minWidth:0},
 moduleGroup:{fontSize:6.5,fontWeight:'900',letterSpacing:1.05,color:colors.teal},
 moduleTitle:{fontSize:14.5,fontWeight:'900',color:colors.ink,marginTop:2},
 moduleDesc:{fontSize:9.5,color:colors.muted,marginTop:2},
 moduleArrow:{width:32,height:32,borderRadius:11,backgroundColor:'#F2F4F2',alignItems:'center',justifyContent:'center',transform:[{rotate:'45deg'}]},
 security:{marginTop:15,minHeight:65,paddingHorizontal:12,paddingVertical:10,borderRadius:19,backgroundColor:'#E9F5F2',borderWidth:1,borderColor:'rgba(39,168,154,.14)',flexDirection:'row',alignItems:'center'},
 securityMark:{width:38,height:38,borderRadius:13,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',marginRight:10},
 securityTitle:{fontSize:11.5,fontWeight:'900',color:colors.ink},
 securitySub:{fontSize:8.5,color:colors.muted,marginTop:2},
 securityPill:{alignItems:'center',marginLeft:7},
 securityDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success,marginBottom:3},
 securityText:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:colors.success},
 signOut:{height:50,borderRadius:17,borderWidth:1,borderColor:'#E8CACA',backgroundColor:'#FFF9F9',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:11},
 signText:{color:colors.danger,fontWeight:'900',fontSize:12}
};