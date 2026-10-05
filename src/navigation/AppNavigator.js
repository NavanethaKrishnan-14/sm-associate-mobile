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
import {colors} from '../theme/colors';

const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();

function MainTabs(){
  return <Tabs.Navigator screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:colors.gold,
    tabBarInactiveTintColor:'#81909D',
    tabBarStyle:{height:72,paddingTop:7,paddingBottom:9,borderTopWidth:0,backgroundColor:colors.midnight},
    tabBarLabelStyle:{fontSize:11,fontWeight:'700'},
    tabBarIcon:({color,size})=>{
      const icons={Dashboard:'grid-outline',Customers:'people-outline',Cars:'car-sport-outline',Loans:'cash-outline',More:'menu-outline'};
      return <Ionicons name={icons[route.name]} size={size} color={color}/>;
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
    </Stack.Navigator>
  </NavigationContainer>
}