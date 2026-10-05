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
    const color=focused?'#138F84':'#53636D';
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
    <View pointerEvents="box-none" style={[styles.bottomBarWrap,{bottom:Math.max(bottom,22)}]}>
      <View style={styles.shadowWrap}>
        <View style={styles.glassPill}>
          <BlurView
            tint="light"
            intensity={72}
            experimentalBlurMethod="dimezisBlurView"
            style={styles.glassFill}
          />
          <View pointerEvents="none" style={styles.glassTint}/>
          {tabRoutes.map(renderTab)}
        </View>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  bottomBarWrap:{
    position:'absolute',
    left:0,
    right:0,
    alignItems:'center',
  },
  glassPill:{
    width:320,
    height:54,
    borderRadius:26,
    overflow:'hidden',
    flexDiconst styles=StyleSheet.create({
  bottomBarWrap:{
    position:'absolute',
    left:0,
    right:0,
    alignItems:'center',
  },
  shadowWrap:{
    width:320,
    height:54,
    borderRadius:27,
    shadowColor:'#14232B',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.16,
    shadowRadius:14,
  },
  glassPill:{
    flex:1,
    borderRadius:27,
    overflow:'hidden',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:5,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.38)',
  },
  glassFill:{
    ...StyleSheet.absoluteFillObject,
  },
  glassTint:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'rgba(255,255,255,0.18)',
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
    backgroundColor:'rgba(39,168,154,0.20)',
    borderWidth:1,
    borderColor:'rgba(39,168,154,0.42)',
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
    </Stack.Navigator>
  </NavigationContainer>
}