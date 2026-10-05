import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {StyleSheet, Pressable, Text, View} from 'react-native';
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

const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();

function CustomTabBar({state,descriptors,navigation}){
  const {bottom}=useSafeAreaInsets();
  const tabRoutes=state.routes;

  const renderTab=(route,index)=>{
    const {options}=descriptors[route.key];
    const focused=state.index===index;
    const color=focused?'#27A89A':'#71808A';
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
      <Pressable key={route.key} accessibilityRole="button" onPress={onPress} style={styles.tabItem}>
        <Ionicons name={icons[route.name]} size={18} color={color}/>
        <Text style={[styles.tabLabel,{color}]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={[styles.bottomBarWrap,{bottom:Math.max(bottom,10)}]}>
      <View style={styles.glassPill}>
        <BlurView tint="light" intensity={72} style={styles.glassFill}/>
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
    width:300,
    height:52,
    borderRadius:26,
    overflow:'hidden',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:5,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.55)',
    backgroundColor:'rgba(255,255,255,0.18)',
    shadowColor:'#14232B',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.16,
    shadowRadius:14,
    elevation:10,
  },
  glassFill:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:26,
  },
  tabItem:{
    flex:1,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    gap:1,
  },
  tabLabel:{
    fontSize:8,
    fontWeight:'700',
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
    </Stack.Navigator>
  </NavigationContainer>
}