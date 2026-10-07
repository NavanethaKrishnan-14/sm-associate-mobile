import {AppText,AppTextInput} from '../components/AppText';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {ActivityIndicator, StyleSheet, Pressable, View, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getCurrentUser} from '../api/client';
import {onAuthExpired} from '../api/authEvents';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CarsScreen from '../screens/CarsScreen';
import LoansScreen from '../screens/LoansScreen';
import MoreScreen from '../screens/MoreScreen';
import AdminToolsScreen from '../screens/AdminToolsScreen';
import CarSaleScreen from '../screens/CarSaleScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import {CarProfitScreen,LoanRevenueScreen,OperationalReportsScreen} from '../screens/ReportScreens';

const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();

function CustomTabBar({state,descriptors,navigation}){
  const {bottom}=useSafeAreaInsets();

  const tabRoutes=state.routes;

  const renderTab=(route,index)=>{
    const {options}=descriptors[route.key];
    const focused=state.index===index;
    const color=focused?'#27A89A':'#26343A';
    const icons={
      Dashboard:focused?'grid':'grid-outline',
      Customers:focused?'people':'people-outline',
      Cars:focused?'car-sport':'car-sport-outline',
      Loans:focused?'cash':'cash-outline',
      More:focused?'menu':'menu-outline'
    };
    const label=options.tabBarLabel??options.title??route.name;
    const onPress=()=>{
      const event=navigation.emit({type:'tabPress',target:route.key,canPreventDefault:true});
      if(!focused&&!event.defaultPrevented) navigation.navigate(route.name);
    };

    const tabContent=(
      <>
        <Ionicons name={icons[route.name]} size={20} color={color}/>
        <AppText allowFontScaling={false} maxFontSizeMultiplier={1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.tabLabel,{color}]}>{label}</Text>
      </>
    );

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.tabItem}
      >
        {focused ? (
          Platform.OS === 'ios' ? (
            <BlurView
              tint="light"
              intensity={80}
              style={styles.activeGlass}
            >
              <View pointerEvents="none" style={styles.glassSurface}/>
              <View pointerEvents="none" style={styles.glassEdge}/>
              <View pointerEvents="none" style={styles.glassInnerEdge}/>
              <View pointerEvents="none" style={styles.glassShine}/>
              <View style={styles.activeContent}>{tabContent}</View>
            </BlurView>
          ) : (
            <View style={styles.activeGlass}>
              <View pointerEvents="none" style={styles.glassSurface}/>
              <View pointerEvents="none" style={styles.glassEdge}/>
              <View pointerEvents="none" style={styles.glassInnerEdge}/>
              <View pointerEvents="none" style={styles.glassShine}/>
              <View style={styles.activeContent}>{tabContent}</View>
            </View>
          )
        ) : (
          tabContent
        )}
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={[styles.bottomBarWrap,{bottom:Math.max(bottom,18)}]}>
      <View style={styles.iosTabBar}>
        {tabRoutes.map(renderTab)}
      </View>
    </View>
  );
}
function MainTabs(){
  return <Tabs.Navigator
    tabBar={(props)=><CustomTabBar {...props}/>} 
    screenOptions={{headerShown:false}}
  >
    <Tabs.Screen name="Dashboard" component={DashboardScreen}/>
    <Tabs.Screen name="Customers" component={CustomersScreen}/>
    <Tabs.Screen name="Cars" component={CarsScreen}/>
    <Tabs.Screen name="Loans" component={LoansScreen}/>
    <Tabs.Screen name="More" component={MoreScreen}/>
  </Tabs.Navigator>
}
const styles=StyleSheet.create({
  bottomBarWrap:{
    position:'absolute',
    left:0,
    right:0,
    alignItems:'center',
    paddingHorizontal:12,
  },
  iosTabBar:{
    width:'100%',
    maxWidth:390,
    height:72,
    borderRadius:36,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:7,
    paddingVertical:7,
    backgroundColor:'rgba(255,255,255,0.48)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.58)',
    shadowColor:'#15242B',
    shadowOffset:{width:0,height:7},
    shadowOpacity:0.14,
    shadowRadius:18,
    elevation:10,
  },
  tabItem:{
    flex:1,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:28,
    overflow:'visible',
    paddingHorizontal:2,
  },
  activeTabItem:{
    backgroundColor:'transparent',
  },
  activeGlass:{
    position:'absolute',
    top:2,
    bottom:2,
    left:2,
    right:2,
    borderRadius:28,
    overflow:'hidden',
    backgroundColor:'rgba(238,239,243,0.82)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.96)',
    shadowColor:'#C4C8CE',
    shadowOffset:{width:0,height:1},
    shadowOpacity:0.20,
    shadowRadius:5,
    elevation:3,
    alignItems:'center',
    justifyContent:'center',
  },
  glassSurface:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:28,
    backgroundColor:'rgba(39,168,154,0.09)',
  },
  glassEdge:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:28,
    borderWidth:1.25,
    borderColor:'rgba(39,168,154,0.34)',
    shadowColor:'#FFFFFF',
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.34,
    shadowRadius:8,
    elevation:4,
  },
  glassInnerEdge:{
    position:'absolute',
    top:1,
    left:1,
    right:1,
    bottom:1,
    borderRadius:27,
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.18)',
  },
  glassShine:{
    position:'absolute',
    top:3,
    left:'14%',
    right:'14%',
    height:7,
    borderRadius:8,
    backgroundColor:'rgba(39,168,154,0.10)',
  },
  activeContent:{
    flex:1,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:2,
  },
  tabLabel:{
    marginTop:2,
    fontSize:9,
    
    lineHeight:11,
    textAlign:'center',
    includeFontPadding:false,
    flexShrink:1,
    width:'100%',
  },
});

export default function AppNavigator(){
  const [checkingSession,setCheckingSession]=React.useState(true);
  const [authenticated,setAuthenticated]=React.useState(false);

  React.useEffect(()=>{
    let active=true;
    (async()=>{
      try{
        const user=await getCurrentUser();
        if(active)setAuthenticated(Boolean(user));
      }catch{
        if(active)setAuthenticated(false);
      }finally{
        if(active)setCheckingSession(false);
      }
    })();

    const unsubscribe=onAuthExpired(()=>{
      if(active)setAuthenticated(false);
    });

    return()=>{
      active=false;
      unsubscribe();
    };
  },[]);

  if(checkingSession){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#0B1720'}}>
        <ActivityIndicator size="large" color="#D7B96E"/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator key={authenticated?'authenticated':'guest'} initialRouteName={authenticated?'Main':'Login'} screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Main" component={MainTabs}/>
        <Stack.Screen name="AdminTools" component={AdminToolsScreen}/>
        <Stack.Screen name="CarSale" component={CarSaleScreen}/>
        <Stack.Screen name="Documents" component={DocumentsScreen}/>
        <Stack.Screen name="CarProfit" component={CarProfitScreen}/>
        <Stack.Screen name="LoanRevenue" component={LoanRevenueScreen}/>
        <Stack.Screen name="OperationalReports" component={OperationalReportsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}