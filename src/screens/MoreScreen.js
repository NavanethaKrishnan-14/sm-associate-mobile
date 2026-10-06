import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

const items=[
 ['Car Sold','car-sport-outline','CarSale','Automotive'],
 ['User Management','people-outline','Users','Administration'],
 ['Vehicle Expenses','receipt-outline','Expenses','Finance'],
 ['Car Profit','trending-up-outline','CarProfit','Analytics'],
 ['Loan Revenue','cash-outline','LoanRevenue','Analytics'],
 ['Operational Reports','document-text-outline','OperationalReports','Analytics']
];

export default function MoreScreen({navigation}){
 const {top,bottom}=useSafeAreaInsets();
 const go=section=>section==='CarSale'?navigation.navigate('CarSale'):['CarProfit','LoanRevenue','OperationalReports'].includes(section)?navigation.navigate(section):navigation.navigate('AdminTools',{section});
 return <View style={s.page}>
   <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingTop:top+18,paddingBottom:bottom+90}]}>
     <View style={s.hero}>
       <View style={s.heroGlow}/>
       <Logo width={148}/>
       <View style={s.heroRow}>
         <View><Text style={s.eyebrow}>SM ASSOCIATE</Text><Text style={s.heroTitle}>Business Hub</Text><Text style={s.heroSub}>Finance · Mobility · Assistance</Text></View>
         <View style={s.heroIcon}><Ionicons name="sparkles-outline" size={22} color={colors.goldLight}/></View>
       </View>
     </View>
     <View style={s.sectionHead}><View><Text style={s.sectionTitle}>Workspace</Text><Text style={s.sectionSub}>Everything you need to manage the business</Text></View></View>
     <View style={s.grid}>
       {items.map(([label,icon,section,group],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.tile,pressed&&{transform:[{scale:.98}],opacity:.9}]}>
         <View style={s.tileTop}><View style={s.icon}><Ionicons name={icon} size={22} color={colors.teal}/></View><Text style={s.group}>{group}</Text></View>
         <Text style={s.tileTitle}>{label}</Text>
         <View style={s.tileBottom}><Text style={s.open}>Open module</Text><Ionicons name="arrow-forward" size={16} color={colors.midnight}/></View>
       </Pressable>)}
     </View>
     <View style={s.secure}><View style={s.secureIcon}><Ionicons name="shield-checkmark-outline" size={21} color={colors.teal}/></View><View style={{flex:1}}><Text style={s.secureTitle}>Admin workspace</Text><Text style={s.secureSub}>Protected management tools and reports</Text></View><Ionicons name="lock-closed-outline" size={17} color={colors.muted}/></View>
     <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.signOut,pressed&&{opacity:.8}]}><Ionicons name="log-out-outline" size={19} color={colors.danger}/><Text style={s.signText}>Sign out securely</Text></Pressable>
   </ScrollView>
 </View>
}
const s={
 page:{flex:1,backgroundColor:'#F4F6F3'},
 content:{paddingTop:0,paddingHorizontal:18,paddingBottom:110},
 hero:{height:188,borderRadius:30,backgroundColor:colors.midnight,padding:20,overflow:'hidden',borderWidth:1,borderColor:'rgba(39,168,154,.28)'},
 heroGlow:{position:'absolute',width:190,height:190,borderRadius:95,right:-75,bottom:-95,backgroundColor:'rgba(39,168,154,.20)'},
 heroRow:{flex:1,marginTop:18,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
 eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.8,color:colors.goldLight},
 heroTitle:{fontSize:27,fontWeight:'900',color:colors.white,marginTop:4},
 heroSub:{fontSize:12,color:'rgba(255,255,255,.60)',marginTop:5},
 heroIcon:{width:46,height:46,borderRadius:16,backgroundColor:'rgba(255,255,255,.09)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(255,255,255,.12)'},
 sectionHead:{marginTop:25,marginBottom:13},
 sectionTitle:{fontSize:22,fontWeight:'900',color:colors.ink},
 sectionSub:{fontSize:12,color:colors.muted,marginTop:4},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:11},
 tile:{width:'48%',minHeight:155,backgroundColor:colors.white,borderRadius:24,padding:15,borderWidth:1,borderColor:'rgba(39,168,154,.13)',justifyContent:'space-between',shadowColor:'#172027',shadowOffset:{width:0,height:5},shadowOpacity:.05,shadowRadius:12,elevation:2},
 tileTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 icon:{width:46,height:46,borderRadius:16,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center'},
 group:{fontSize:8,fontWeight:'900',color:colors.muted,textTransform:'uppercase',letterSpacing:.7},
 tileTitle:{fontSize:16,fontWeight:'900',color:colors.ink,marginTop:15},
 tileBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:10,borderTopWidth:1,borderTopColor:'#EEF1EF'},
 open:{fontSize:10,fontWeight:'900',color:colors.muted},
 secure:{marginTop:16,padding:15,borderRadius:21,backgroundColor:'#EAF6F3',borderWidth:1,borderColor:'rgba(39,168,154,.15)',flexDirection:'row',alignItems:'center'},
 secureIcon:{width:40,height:40,borderRadius:14,backgroundColor:colors.white,alignItems:'center',justifyContent:'center'},
 secureTitle:{fontSize:13,fontWeight:'900',color:colors.ink},
 secureSub:{fontSize:10,color:colors.muted,marginTop:3},
 signOut:{height:52,borderRadius:18,borderWidth:1,borderColor:'#E8CACA',backgroundColor:'#FFF8F8',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:14},
 signText:{color:colors.danger,fontWeight:'900',fontSize:13}
};