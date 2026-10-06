import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {StyleSheet, Pressable, Text, View, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const {width}=useWindowDimensions();
  const tabRoutes=state.routes;

  const renderTab=(route,index)=>{
    const {options}=descriptors[route.key];
    const focused=state.index===index;
    const color=focused?'#FFFFFF':'#53636D';
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
    return (
      <Pressable key={route.key} accessibilityRole="button" onPress={onPress} style={[styles.tabItem,focused&&styles.activeTabItem]}>
        <Ionicons name={icons[route.name]} size={22} color={color}/>
        <Text style={[styles.tabLabel,{color}]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={[styles.bottomBarWrap,{bottom:Math.max(bottom,22),paddingHorizontal:12}]}>
      <View style={styles.glassPill}>
        <BlurView tint="light" intensity={42} style={styles.glassFill}/>
        <View pointerEvents="none" style={styles.glassOverlay}/>
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
  },
  glassPill:{
    width:'100%',
    maxWidth:320,
    height:54,
    borderRadius:26,
    overflow:'hidden',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:5,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.16)',
    backgroundColor:'rgba(255,255,255,0.06)',
    shadowColor:'#14232B',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.16,
    shadowRadius:14,
    elevation:10,
  },
  glassFill:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:28,
  },
  glassOverlay:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:28,
    backgroundColor:'rgba(255,255,255,0.08)',
  },
  tabItem:{
    flex:1,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    gap:1,
    borderRadius:22,
  },
  activeTabItem:{
    backgroundColor:'rgba(39,168,154,0.22)',
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.30)',
    shadowColor:'#27A89A',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.18,
    shadowRadius:5,
    elevation:4,
    transform:[{scale:1.02}],
  },
  tabLabel:{
    fontSize:10,
    fontWeight:'900',
  },
});

export default function AppNavigator(){
  return <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}}>
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
}