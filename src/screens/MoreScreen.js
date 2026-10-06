import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

const items=[
 ['Car Sold','car-sport-outline','CarSale','Automotive','Vehicle sales'],
 ['User Management','people-outline','Users','Administration','People & access'],
 ['Vehicle Expenses','receipt-outline','Expenses','Finance','Cost tracking'],
 ['Car Profit','trending-up-outline','CarProfit','Analytics','Profit overview'],
 ['Loan Revenue','cash-outline','LoanRevenue','Analytics','Revenue overview'],
 ['Operational Reports','document-text-outline','OperationalReports','Analytics','Business insights']
];

export default function MoreScreen({navigation}){
 const {top,bottom}=useSafeAreaInsets();
 const go=section=>section==='CarSale'?navigation.navigate('CarSale'):['CarProfit','LoanRevenue','OperationalReports'].includes(section)?navigation.navigate(section):navigation.navigate('AdminTools',{section});
 return <View style={s.page}>
   <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingTop:top+18,paddingBottom:bottom+96}]}>
     <View style={s.hero}>
       <View style={s.heroAccent}/>
       <View style={s.heroOrb}/>
       <View style={s.heroTop}>
         <View style={s.brand}><Logo width={112}/><View style={s.brandRule}/><Text style={s.brandLabel}>BUSINESS MANAGEMENT</Text></View>
         <View style={s.heroBadge}><Ionicons name="sparkles-outline" size={15} color={colors.goldLight}/><Text style={s.heroBadgeText}>PREMIUM</Text></View>
       </View>
       <View style={s.heroBottom}>
         <View style={{flex:1}}>
           <Text style={s.eyebrow}>BUSINESS HUB</Text>
           <Text style={s.heroTitle}>Your business,{"\n"}under control.</Text>
           <Text style={s.heroSub}>Finance · Mobility · Operations</Text>
         </View>
         <View style={s.heroMark}><Ionicons name="grid-outline" size={25} color={colors.teal}/></View>
       </View>
     </View>

     <View style={s.sectionHead}>
       <View style={{flex:1}}>
         <View style={s.sectionKicker}><View style={s.kickerDot}/><Text style={s.kickerText}>MANAGEMENT SUITE</Text></View>
         <Text style={s.sectionTitle}>Business modules</Text>
         <Text style={s.sectionSub}>Access your operational tools and insights</Text>
       </View>
       <View style={s.moduleCount}><Text style={s.moduleCountValue}>06</Text><Text style={s.moduleCountLabel}>MODULES</Text></View>
     </View>

     <View style={s.grid}>
       {items.map(([label,icon,section,group,desc],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.tile,pressed&&s.tilePressed]}>
         <View style={s.tileHeader}>
           <View style={s.icon}><Ionicons name={icon} size={22} color={colors.teal}/></View>
           <View style={s.number}><Text style={s.numberText}>{String(i+1).padStart(2,'0')}</Text></View>
         </View>
         <View style={s.tileCopy}>
           <Text style={s.group}>{group}</Text>
           <Text style={s.tileTitle}>{label}</Text>
           <Text style={s.tileDesc}>{desc}</Text>
         </View>
         <View style={s.tileBottom}><Text style={s.open}>OPEN MODULE</Text><View style={s.arrow}><Ionicons name="arrow-forward" size={14} color={colors.white}/></View></View>
       </Pressable>)}
     </View>

     <View style={s.secure}>
       <View style={s.secureIcon}><Ionicons name="shield-checkmark" size={19} color={colors.teal}/></View>
       <View style={{flex:1}}><Text style={s.secureTitle}>Protected workspace</Text><Text style={s.secureSub}>Administrative tools and financial reports are secured</Text></View>
       <View style={s.secureStatus}><View style={s.statusDot}/><Text style={s.statusText}>SECURE</Text></View>
     </View>

     <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.signOut,pressed&&{opacity:.8}]}>
       <Ionicons name="log-out-outline" size={18} color={colors.danger}/><Text style={s.signText}>Sign out securely</Text>
     </Pressable>
   </ScrollView>
 </View>
}

const s={
 page:{flex:1,backgroundColor:'#F2F4F2'},
 content:{paddingHorizontal:18,paddingBottom:110},
 hero:{height:220,borderRadius:30,backgroundColor:colors.midnight,padding:19,overflow:'hidden',borderWidth:1,borderColor:'rgba(39,168,154,.28)',shadowColor:'#172027',shadowOffset:{width:0,height:12},shadowOpacity:.16,shadowRadius:24,elevation:7},
 heroAccent:{position:'absolute',left:-30,top:106,width:210,height:1,backgroundColor:'rgba(39,168,154,.55)',transform:[{rotate:'-13deg'}]},
 heroOrb:{position:'absolute',width:230,height:230,borderRadius:115,right:-105,bottom:-120,backgroundColor:'rgba(39,168,154,.14)',borderWidth:1,borderColor:'rgba(39,168,154,.18)'},
 heroTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 brand:{flexDirection:'row',alignItems:'center',minWidth:0,flex:1},
 brandRule:{width:1,height:22,backgroundColor:'rgba(255,255,255,.2)',marginHorizontal:10},
 brandLabel:{fontSize:8,fontWeight:'900',letterSpacing:1.15,color:'rgba(255,255,255,.55)',flexShrink:1},
 heroBadge:{height:28,paddingHorizontal:10,borderRadius:14,backgroundColor:'rgba(255,255,255,.08)',borderWidth:1,borderColor:'rgba(255,255,255,.13)',flexDirection:'row',alignItems:'center',gap:5},
 heroBadgeText:{fontSize:8,fontWeight:'900',letterSpacing:1,color:colors.goldLight},
 heroBottom:{flex:1,marginTop:16,flexDirection:'row',alignItems:'flex-end'},
 eyebrow:{fontSize:9,fontWeight:'900',letterSpacing:2.2,color:colors.teal},
 heroTitle:{fontSize:29,lineHeight:32,fontWeight:'900',letterSpacing:-.5,color:colors.white,marginTop:5},
 heroSub:{fontSize:11,color:'rgba(255,255,255,.56)',marginTop:7},
 heroMark:{width:48,height:48,borderRadius:17,backgroundColor:'rgba(255,255,255,.08)',borderWidth:1,borderColor:'rgba(255,255,255,.12)',alignItems:'center',justifyContent:'center',marginBottom:2},
 sectionHead:{marginTop:25,marginBottom:14,flexDirection:'row',alignItems:'flex-end'},
 sectionKicker:{flexDirection:'row',alignItems:'center',gap:6,marginBottom:5},
 kickerDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.teal},
 kickerText:{fontSize:8,fontWeight:'900',letterSpacing:1.3,color:colors.teal},
 sectionTitle:{fontSize:22,fontWeight:'900',letterSpacing:-.2,color:colors.ink},
 sectionSub:{fontSize:11,color:colors.muted,marginTop:3},
 moduleCount:{width:52,height:48,borderRadius:15,backgroundColor:colors.white,borderWidth:1,borderColor:'#E2E8E5',alignItems:'center',justifyContent:'center'},
 moduleCountValue:{fontSize:15,fontWeight:'900',color:colors.ink,lineHeight:17},
 moduleCountLabel:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:colors.muted},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:11},
 tile:{width:'48%',minHeight:183,backgroundColor:colors.white,borderRadius:23,padding:14,borderWidth:1,borderColor:'#E3E8E5',justifyContent:'space-between',shadowColor:'#172027',shadowOffset:{width:0,height:7},shadowOpacity:.07,shadowRadius:14,elevation:3},
 tilePressed:{transform:[{scale:.975}],opacity:.88},
 tileHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 icon:{width:48,height:48,borderRadius:16,backgroundColor:'#E3F3F0',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(39,168,154,.12)'},
 number:{width:25,height:25,borderRadius:9,backgroundColor:'#F2F4F2',alignItems:'center',justifyContent:'center'},
 numberText:{fontSize:8,fontWeight:'900',color:colors.muted},
 tileCopy:{marginTop:12,flex:1},
 group:{fontSize:7.5,fontWeight:'900',color:colors.teal,textTransform:'uppercase',letterSpacing:.8},
 tileTitle:{fontSize:15.5,fontWeight:'900',color:colors.ink,marginTop:4},
 tileDesc:{fontSize:9.5,color:colors.muted,marginTop:4,lineHeight:13},
 tileBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:10,borderTopWidth:1,borderTopColor:'#EEF1EF'},
 open:{fontSize:7.5,fontWeight:'900',letterSpacing:.8,color:colors.muted},
 arrow:{width:27,height:27,borderRadius:10,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center'},
 secure:{marginTop:17,padding:13,borderRadius:20,backgroundColor:'#E8F4F1',borderWidth:1,borderColor:'rgba(39,168,154,.16)',flexDirection:'row',alignItems:'center'},
 secureIcon:{width:39,height:39,borderRadius:13,backgroundColor:colors.white,alignItems:'center',justifyContent:'center'},
 secureTitle:{fontSize:12.5,fontWeight:'900',color:colors.ink},
 secureSub:{fontSize:9.5,color:colors.muted,marginTop:3,lineHeight:13},
 secureStatus:{alignItems:'flex-end',marginLeft:8},
 statusDot:{width:7,height:7,borderRadius:4,backgroundColor:colors.success,marginBottom:4},
 statusText:{fontSize:6.5,fontWeight:'900',letterSpacing:.8,color:colors.success},
 signOut:{height:52,borderRadius:18,borderWidth:1,borderColor:'#E8CACA',backgroundColor:'#FFF8F8',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:13},
 signText:{color:colors.danger,fontWeight:'900',fontSize:12.5}
};