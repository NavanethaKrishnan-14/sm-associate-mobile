import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
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

function MainTabs(){
  return <Tabs.Navigator screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:'#0F766E',
    tabBarInactiveTintColor:'#1F3038',
    tabBarStyle:{
      position:'absolute',
      left:28,
      right:28,
      bottom:12,
      height:56,
      paddingTop:4,
      paddingBottom:4,
      paddingHorizontal:4,
      borderTopWidth:1,
      borderTopColor:'rgba(255,255,255,0.95)',
      borderWidth:1,
      borderColor:'rgba(255,255,255,0.78)',
      borderRadius:20,
      backgroundColor:'rgba(255,255,255,0.88)',
      shadowColor:'#000',
      shadowOffset:{width:0,height:6},
      shadowOpacity:0.18,
      shadowRadius:14,
      elevation:12,
    },
    tabBarLabelStyle:{
      fontSize:9,
      fontWeight:'800',
      marginTop:1,
    },
    tabBarIconStyle:{
      marginTop:0,
    },
    tabBarIcon:({color,size,focused})=>{
      const icons={
        Dashboard:focused?'grid':'grid-outline',
        Customers:focused?'people':'people-outline',
        Cars:focused?'car-sport':'car-sport-outline',
        Loans:focused?'cash':'cash-outline',
        More:focused?'menu':'menu-outline'
      };
      return <Ionicons name={icons[route.name]} size={focused?21:20} color={color}/>;
    }
  })}>
    <Tabs.Screen name="Dashboard" component={DashboardScreen}/>
    <Tabs.Screen name="Customers" component={CustomersScreen}/>
    <Tabs.Screen name="Cars" component={CarsScreen}/>
    <Tabs.Screen name="Loans" component={LoansScreen}/>
    <Tabs.Screen name="More" component={MoreScreen}/>
  </Tabs.Navigator>
}

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