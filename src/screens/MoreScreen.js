import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

const groups=[
 {label:'OPERATE',title:'Daily Operations',items:[
  ['Car Sold','car-sport-outline','CarSale','Vehicle sales'],
  ['Vehicle Expenses','receipt-outline','Expenses','Cost tracking'],
  ['User Management','people-outline','Users','People & access']
 ]},
 {label:'INSIGHT',title:'Money & Performance',items:[
  ['Car Profit','trending-up-outline','CarProfit','Profit overview'],
  ['Loan Revenue','cash-outline','LoanRevenue','Revenue overview'],
  ['Operational Reports','document-text-outline','OperationalReports','Business insights']
 ]}
];

export default function MoreScreen({navigation}){
 const {top,bottom}=useSafeAreaInsets();
 const go=section=>section==='CarSale'?navigation.navigate('CarSale'):['CarProfit','LoanRevenue','OperationalReports'].includes(section)?navigation.navigate(section):navigation.navigate('AdminTools',{section});
 return <View style={s.page}>
  <ScrollView bounces={false} alwaysBounceVertical={false} overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,{paddingBottom:bottom+105}]}>
   <View style={[s.header,{paddingTop:top+14}]}>
    <View style={s.headerTop}>
     <View style={s.logo}><Logo width={60}/></View>
     <View style={s.headerCenter}><Text style={s.headerKicker}>SM ASSOCIATE</Text><Text style={s.headerTitle}>CONTROL ROOM</Text></View>
     <View style={s.headerCode}><Text style={s.headerCodeTop}>06</Text><Text style={s.headerCodeBottom}>TOOLS</Text></View>
    </View>
    <View style={s.headerBottom}><View style={s.headerStatus}><View style={s.liveDot}/><Text style={s.statusText}>OPERATIONS ACTIVE</Text></View><Text style={s.headerDate}>BUSINESS / MANAGEMENT</Text></View>
   </View>

   <View style={s.body}>
    <View style={s.hero}>
     <View style={s.heroLeft}><Text style={s.heroOverline}>MORE</Text><Text style={s.heroTitle}>Everything beyond the dashboard.</Text><Text style={s.heroSub}>Your control room for the decisions that keep SM Associate moving.</Text></View>
     <View style={s.heroMark}><Ionicons name="arrow-down-outline" size={20} color={colors.teal}/><Text style={s.heroMarkText}>EXPLORE</Text></View>
    </View>

    {groups.map((group,gi)=><View key={group.label} style={s.group}>
      <View style={s.groupHead}><View><Text style={s.groupLabel}>{group.label}</Text><Text style={s.groupTitle}>{group.title}</Text></View><Text style={s.groupNumber}>0{gi+1}</Text></View>
      <View style={s.groupLine}/>
      <View style={s.actions}>
       {group.items.map(([label,icon,section,desc],i)=><Pressable key={label} onPress={()=>go(section)} style={({pressed})=>[s.action,pressed&&s.pressed]}>
        <View style={s.actionNo}><Text style={s.actionNoText}>0{i+1}</Text></View>
        <View style={s.actionIcon}><Ionicons name={icon} size={21} color={colors.teal}/></View>
        <View style={s.actionCopy}><Text style={s.actionTitle}>{label}</Text><Text style={s.actionDesc}>{desc}</Text></View>
        <View style={s.actionArrow}><Ionicons name="arrow-up-right" size={16} color={colors.ink}/></View>
       </Pressable>)}
      </View>
    </View>)}

    <View style={s.adminCard}>
      <View style={s.adminTop}><View style={s.adminIcon}><Ionicons name="shield-checkmark" size={20} color={colors.teal}/></View><Text style={s.adminTag}>ADMIN AREA</Text></View>
      <Text style={s.adminTitle}>Protected workspace</Text>
      <Text style={s.adminDesc}>Management controls are available according to your account permissions.</Text>
      <View style={s.adminRule}/>
      <View style={s.adminBottom}><Text style={s.adminBottomText}>ACCESS CONTROLLED</Text><View style={s.adminDot}/></View>
    </View>

    <Pressable onPress={async()=>{await logout();navigation.replace('Login')}} style={({pressed})=>[s.logout,pressed&&s.pressed]}>
      <View style={s.logoutLeft}><View style={s.logoutIcon}><Ionicons name="log-out-outline" size={18} color={colors.danger}/></View><View><Text style={s.logoutTitle}>Sign out</Text><Text style={s.logoutSub}>End current session</Text></View></View>
      <Ionicons name="arrow-forward" size={17} color={colors.danger}/>
    </Pressable>
   </View>
  </ScrollView>
 </View>
}

const s={
 page:{flex:1,backgroundColor:colors.midnight},
 content:{paddingBottom:110},
 header:{backgroundColor:colors.midnight,paddingHorizontal:18,paddingBottom:15},
 headerTop:{height:78,flexDirection:'row',alignItems:'center'},
 logo:{width:64,height:64,borderRadius:19,backgroundColor:'#243139',borderWidth:1,borderColor:'#3A4A52',alignItems:'center',justifyContent:'center'},
 headerCenter:{flex:1,marginLeft:12},
 headerKicker:{fontSize:7,fontWeight:'900',letterSpacing:2,color:colors.teal},
 headerTitle:{fontSize:20,fontWeight:'900',letterSpacing:.5,color:colors.white,marginTop:3},
 headerCode:{width:48,height:48,borderLeftWidth:1,borderLeftColor:'#3A484E',alignItems:'flex-end',justifyContent:'center'},
 headerCodeTop:{fontSize:18,fontWeight:'900',color:colors.white,lineHeight:19},
 headerCodeBottom:{fontSize:5.5,fontWeight:'900',letterSpacing:1.1,color:'#839095',marginTop:2},
 headerBottom:{height:29,borderTopWidth:1,borderTopColor:'#354149',flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',paddingTop:8},
 headerStatus:{flexDirection:'row',alignItems:'center',gap:6},
 liveDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success},
 statusText:{fontSize:6.5,fontWeight:'900',letterSpacing:1,color:colors.success},
 headerDate:{fontSize:6.5,fontWeight:'800',letterSpacing:1,color:'#75848A'},
 body:{backgroundColor:'#F2F3F1',borderTopLeftRadius:30,borderTopRightRadius:30,paddingHorizontal:18,paddingTop:23,minHeight:650},
 hero:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:25},
 heroLeft:{flex:1},
 heroOverline:{fontSize:8,fontWeight:'900',letterSpacing:2,color:colors.teal},
 heroTitle:{fontSize:29,lineHeight:32,fontWeight:'900',letterSpacing:-.8,color:colors.ink,marginTop:5,maxWidth:320},
 heroSub:{fontSize:10.5,lineHeight:16,color:colors.muted,marginTop:7,maxWidth:315},
 heroMark:{width:57,height:57,borderRadius:18,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center',marginLeft:10},
 heroMarkText:{fontSize:5.5,fontWeight:'900',letterSpacing:.9,color:'#93A0A4',marginTop:4},
 group:{marginBottom:27},
 groupHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
 groupLabel:{fontSize:7,fontWeight:'900',letterSpacing:1.8,color:colors.teal},
 groupTitle:{fontSize:19,fontWeight:'900,color:colors.ink,marginTop:3},
 groupNumber:{fontSize:24,fontWeight:'900',color:'#D7DCDA'},
 groupLine:{height:1,backgroundColor:'#D8DDDA',marginTop:9,marginBottom:7},
 actions:{gap:1},
 action:{minHeight:70,backgroundColor:colors.white,borderBottomWidth:1,borderBottomColor:'#E1E5E3',paddingHorizontal:7,flexDirection:'row',alignItems:'center'},
 actionNo:{width:29,height:29,alignItems:'center',justifyContent:'center'},
 actionNoText:{fontSize:7,fontWeight:'900',letterSpacing:.5,color:'#9AA5A9'},
 actionIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#E2F1EE',alignItems:'center',justifyContent:'center',marginRight:11},
 actionCopy:{flex:1,minWidth:0},
 actionTitle:{fontSize:14,fontWeight:'900',color:colors.ink},
 actionDesc:{fontSize:8.5,color:colors.muted,marginTop:2},
 actionArrow:{width:31,height:31,borderRadius:11,backgroundColor:'#F0F2F0',alignItems:'center',justifyContent:'center'},
 pressed:{opacity:.78,transform:[{scale:.99}]},
 adminCard:{marginTop:-2,borderRadius:23,backgroundColor:colors.midnight,padding:16},
 adminTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 adminIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#24383B',alignItems:'center',justifyContent:'center'},
 adminTag:{fontSize:6.5,fontWeight:'900',letterSpacing:1.2,color:'#8E9BA0'},
 adminTitle:{fontSize:20,fontWeight:'900',color:colors.white,marginTop:15},
 adminDesc:{fontSize:9.5,lineHeight:15,color:'#AAB5B8',marginTop:5,maxWidth:300},
 adminRule:{height:1,backgroundColor:'#354149',marginTop:16},
 adminBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:9},
 adminBottomText:{fontSize:6,fontWeight:'900',letterSpacing:1.1,color:'#77858A'},
 adminDot:{width:6,height:6,borderRadius:3,backgroundColor:colors.success},
 logout:{height:57,marginTop:10,borderRadius:18,backgroundColor:'#FFF9F9',borderWidth:1,borderColor:'#E7CACA',paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 logoutLeft:{flexDirection:'row',alignItems:'center',gap:10},
 logoutIcon:{width:37,height:37,borderRadius:12,backgroundColor:'#FCEFEF',alignItems:'center',justifyContent:'center'},
 logoutTitle:{fontSize:11.5,fontWeight:'900',color:colors.danger},
 logoutSub:{fontSize:8,color:'#9B7C7C',marginTop:2}
};