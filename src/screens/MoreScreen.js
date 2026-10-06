import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

const items=[
 ['Car Sold','car-sport-outline','CarSale','Automotive','Sell vehicles'],
 ['User Management','people-outline','Users','Administration','Manage access'],
 ['Vehicle Expenses','receipt-outline','Expenses','Finance','Track costs'],
 ['Car Profit','trending-up-outline','CarProfit','Analytics','View profit'],
 ['Loan Revenue','cash-outline','LoanRevenue','Analytics','Revenue'],
 ['Operational Reports','document-text-outline','OperationalReports','Reports','Business insights']
];

export default function MoreScreen({navigation}){
 const {top,bottom}=useSafeAreaInsets();
 const go=section=>section==='CarSale'?navigation.navigate('CarSale'):['CarProfit','LoanRevenue','OperationalReports'].includes(section)?navigation.navigate(section):navigation.navigate('AdminTools',{section});
 return <View style={s.page}>
   <ScrollView bounces={false} alwaysBounceVertical={false} overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingBottom:bottom+105}]}>
     <View style={[s.header,{paddingTop:top+12}]}>
       <View style={s.headerTop}>
         <View style={s.headerBrand}>
           <View style={s.logo}><Logo width={58}/></View>
           <View style={s.headerText}><Text style={s.eyebrow}>SM ASSOCIATE</Text><Text style={s.title}>MORE</Text></View>
         </View>
         <View style={s.headerChip}><Ionicons name="ellipsis-horizontal" size={18} color={colors.white}/></View>
       </View>
       <View style={s.headerNav}>
         <Text style={s.navActive}>WORKSPACE</Text>
         <Text style={s.navText}>MANAGEMENT</Text>
         <Text style={s.navText}>REPORTS</Text>
       </View>
     </View>

     <View style={s.body}>
       <View style={s.welcome}>
         <View><Text style={s.welcomeKicker}>QUICK ACCESS</Text><Text style={s.welcomeTitle}>What do you want to manage?</Text></View>
         <View style={s.countCircle}><Text style={s.countNumber}>06</Text><Text style={s.countLabel}>TOOLS</Text></View>
       </View>

       <View style={s.featureRow}>
         <View style={s.featureMain}>
           <View style={s.featureIcon}><Ionicons name="business-outline" size={25} color={colors.teal}/></View>
           <Text style={s.featureKicker}>BUSINESS CONTROL</Text>
           <Text style={s.featureTitle}>Everything your business needs.</Text>
           <Text style={s.featureDesc}>Move between operations, finance and insights without leaving the workspace.</Text>
         </View>
         <View style={s.featureSide}><View style={s.sideLine}/><Text style={s.sideTop}>SM</Text><Text style={s.sideBottom}>01</Text></View>
       </View>

       <View style={s.sectionBar}>
         <Text style={s.sectionTitle}>Management</Text>
         <View style={s.sectionLine}/>
         <Text style={s.sectionHint}>SELECT</Text>
       </View>

       <View style={s.grid}>
         {items.map(([label,icon,section,group,desc],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.card,pressed&&s.cardPressed]}>
           <View style={s.cardTop}><Text style={s.cardNumber}>{String(i+1).padStart(2,'0')}</Text><Ionicons name="arrow-up-right" size={16} color={colors.muted}/></View>
           <View style={s.cardIcon}><Ionicons name={icon} size={21} color={colors.teal}/></View>
           <Text style={s.cardGroup}>{group.toUpperCase()}</Text>
           <Text style={s.cardTitle}>{label}</Text>
           <Text style={s.cardDesc}>{desc}</Text>
         </Pressable>)}
       </View>

       <View style={s.bottomPanel}>
         <View style={s.bottomIcon}><Ionicons name="shield-checkmark-outline" size={20} color={colors.teal}/></View>
         <View style={s.bottomCopy}><Text style={s.bottomTitle}>Private management area</Text><Text style={s.bottomText}>Your administrative tools are protected.</Text></View>
         <View style={s.secure}><View style={s.secureDot}/><Text style={s.secureText}>SECURE</Text></View>
       </View>

       <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.logout,pressed&&s.cardPressed]}>
         <View style={s.logoutIcon}><Ionicons name="log-out-outline" size={17} color={colors.danger}/></View>
         <View style={{flex:1}}><Text style={s.logoutTitle}>Sign out</Text><Text style={s.logoutSub}>End your current session</Text></View>
         <Ionicons name="arrow-forward" size={16} color={colors.danger}/>
       </Pressable>
     </View>
   </ScrollView>
 </View>
}

const s={
 page:{flex:1,backgroundColor:'#F4F5F3'},
 content:{paddingBottom:110},
 header:{backgroundColor:colors.midnight,paddingHorizontal:18,paddingBottom:0,borderBottomLeftRadius:28,borderBottomRightRadius:28},
 headerTop:{height:76,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 headerBrand:{flexDirection:'row',alignItems:'center',gap:11},
 logo:{width:64,height:64,borderRadius:18,backgroundColor:'#243139',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#3B4B53'},
 headerText:{justifyContent:'center'},
 eyebrow:{fontSize:7,fontWeight:'900',letterSpacing:2,color:colors.teal},
 title:{fontSize:27,fontWeight:'900',letterSpacing:1,color:colors.white,marginTop:1},
 headerChip:{width:42,height:42,borderRadius:13,backgroundColor:'#243139',borderWidth:1,borderColor:'#3B4B53',alignItems:'center',justifyContent:'center'},
 headerNav:{height:39,flexDirection:'row',alignItems:'center',gap:23,borderTopWidth:1,borderTopColor:'#354149'},
 navActive:{fontSize:7,fontWeight:'900',letterSpacing:1.2,color:colors.teal},
 navText:{fontSize:7,fontWeight:'800',letterSpacing:1,color:'#7F8D92'},
 body:{paddingHorizontal:18},
 welcome:{paddingTop:23,paddingBottom:18,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
 welcomeKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1.8,color:colors.teal},
 welcomeTitle:{fontSize:25,lineHeight:29,fontWeight:'900',letterSpacing:-.6,color:colors.ink,marginTop:4,maxWidth:285},
 countCircle:{width:55,height:55,borderRadius:18,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center',marginBottom:1},
 countNumber:{fontSize:17,fontWeight:'900',color:colors.white,lineHeight:18},
 countLabel:{fontSize:5.5,fontWeight:'900',letterSpacing:1,color:'#91A0A5',marginTop:2},
 featureRow:{height:177,borderRadius:25,backgroundColor:'#202C32',flexDirection:'row',overflow:'hidden',shadowColor:'#172027',shadowOffset:{width:0,height:10},shadowOpacity:.16,shadowRadius:18,elevation:6},
 featureMain:{flex:1,padding:16},
 featureIcon:{width:44,height:44,borderRadius:14,backgroundColor:'#29383E',borderWidth:1,borderColor:'#3C4D54',alignItems:'center',justifyContent:'center',marginBottom:12},
 featureKicker:{fontSize:6.5,fontWeight:'900',letterSpacing:1.6,color:colors.teal},
 featureTitle:{fontSize:20,lineHeight:23,fontWeight:'900',color:colors.white,marginTop:4,maxWidth:245},
 featureDesc:{fontSize:9.2,lineHeight:14,color:'#A8B3B7',marginTop:5,maxWidth:255},
 featureSide:{width:62,backgroundColor:'#182126',alignItems:'center',justifyContent:'space-between',paddingVertical:17,borderLeftWidth:1,borderLeftColor:'#34434A'},
 sideLine:{width:18,height:2,backgroundColor:colors.teal},
 sideTop:{fontSize:8,fontWeight:'900',letterSpacing:1.5,color:'#819096'},
 sideBottom:{fontSize:25,fontWeight:'900',color:colors.white},
 sectionBar:{marginTop:27,marginBottom:11,flexDirection:'row',alignItems:'center'},
 sectionTitle:{fontSize:19,fontWeight:'900',color:colors.ink},
 sectionLine:{height:1,backgroundColor:'#D9DEDC',flex:1,marginHorizontal:11},
 sectionHint:{fontSize:6.5,fontWeight:'900',letterSpacing:1.2,color:colors.muted},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
 card:{width:'48.5%',minHeight:153,borderRadius:20,backgroundColor:colors.white,borderWidth:1,borderColor:'#DEE3E1',padding:13,shadowColor:'#172027',shadowOffset:{width:0,height:4},shadowOpacity:.045,shadowRadius:10,elevation:2},
 cardPressed:{transform:[{scale:.985}],opacity:.86},
 cardTop:{height:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 cardNumber:{fontSize:7,fontWeight:'900',letterSpacing:.5,color:colors.muted},
 cardIcon:{width:40,height:40,borderRadius:13,backgroundColor:'#E3F1EE',alignItems:'center',justifyContent:'center',marginTop:7},
 cardGroup:{fontSize:5.8,fontWeight:'900',letterSpacing:1.05,color:colors.teal,marginTop:9},
 cardTitle:{fontSize:13.2,fontWeight:'900',color:colors.ink,marginTop:2},
 cardDesc:{fontSize:8.2,color:colors.muted,marginTop:3},
 bottomPanel:{marginTop:14,minHeight:67,borderRadius:19,backgroundColor:'#E7F1EF',borderWidth:1,borderColor:'#C9DFDA',padding:10,flexDirection:'row',alignItems:'center'},
 bottomIcon:{width:40,height:40,borderRadius:13,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',marginRight:10},
 bottomCopy:{flex:1},
 bottomTitle:{fontSize:11,fontWeight:'900',color:colors.ink},
 bottomText:{fontSize:8.2,color:colors.muted,marginTop:2},
 secure:{alignItems:'center',marginLeft:7},
 secureDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success,marginBottom:3},
 secureText:{fontSize:6,fontWeight:'900',letterSpacing:.8,color:colors.success},
 logout:{height:57,borderRadius:18,backgroundColor:'#FFF9F9',borderWidth:1,borderColor:'#E9CCCC',marginTop:10,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:10},
 logoutIcon:{width:36,height:36,borderRadius:12,backgroundColor:'#FDEEEE',alignItems:'center',justifyContent:'center'},
 logoutTitle:{fontSize:11.5,fontWeight:'900',color:colors.danger},
 logoutSub:{fontSize:8,color:'#9B7C7C',marginTop:2}
};