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
import {colors} from '../theme/colors';

const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();

function MainTabs(){
  return <Tabs.Navigator screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:colors.teal,
    tabBarInactiveTintColor:'rgba(255,255,255,0.72)',
    tabBarStyle:{
      position:'absolute',
      left:14,
      right:14,
      bottom:14,
      height:68,
      paddingTop:8,
      paddingBottom:8,
      paddingHorizontal:6,
      borderTopWidth:1,
      borderTopColor:'rgba(255,255,255,0.32)',
      borderWidth:1,
      borderColor:'rgba(255,255,255,0.24)',
      borderRadius:24,
      backgroundColor:'rgba(255,255,255,0.10)',
      shadowColor:'#000',
      shadowOffset:{width:0,height:8},
      shadowOpacity:0.24,
      shadowRadius:18,
      elevation:14,
    },
    tabBarLabelStyle:{
      fontSize:10,
      fontWeight:'700',
      marginTop:2,
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
      return <Ionicons name={icons[route.name]} size={focused?21:size} color={color}/>;
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