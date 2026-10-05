import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {StyleSheet} from 'react-native';
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
    tabBarInactiveTintColor:'#6B7780',
    tabBarStyle:{
      position:'absolute',
      left:'14%',
      right:'14%',
      bottom:16,
      height:52,
      paddingTop:3,
      paddingBottom:3,
      paddingHorizontal:4,
      borderTopWidth:0,
      borderWidth:1,
      borderColor:'rgba(20,34,42,0.08)',
      borderRadius:26,
      backgroundColor:'transparent',
      shadowColor:'#14232B',
      shadowOffset:{width:0,height:6},
      shadowOpacity:0.18,
      shadowRadius:16,
      elevation:12,
    },
    tabBarBackground:()=> (
      <BlurView
        tint="light"
        intensity={72}
        style={styles.glassTabBar}
      />
    ),
    tabBarLabelStyle:{
      fontSize:8,
      fontWeight:'700',
      marginTop:0,
    },
    tabBarIconStyle:{
      marginTop:0,
    },
    tabBarItemStyle:{
      borderRadius:22,
      marginHorizontal:1,
    },
    tabBarIcon:({color,size,focused})=>{
      const icons={
        Dashboard:focused?'grid':'grid-outline',
        Customers:focused?'people':'people-outline',
        Cars:focused?'car-sport':'car-sport-outline',
        Loans:focused?'cash':'cash-outline',
        More:focused?'menu':'menu-outline'
      };
      return (
        <Ionicons
          name={icons[route.name]}
          size={focused?20:18}
          color={color}
        />
      );
    }
  })}>
    <Tabs.Screen name="Dashboard" component={DashboardScreen}/>
    <Tabs.Screen name="Customers" component={CustomersScreen}/>
    <Tabs.Screen name="Cars" component={CarsScreen}/>
    <Tabs.Screen name="Loans" component={LoansScreen}/>
    <Tabs.Screen name="More" component={MoreScreen}/>
  </Tabs.Navigator>
}

const styles=StyleSheet.create({
  glassTabBar:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:26,
    overflow:'hidden',
    backgroundColor:'rgba(255,255,255,0.20)',
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