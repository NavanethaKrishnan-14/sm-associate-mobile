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
import {CarProfitScreen,LoanRevenueScreen,OperationalReportsScreen} from '../screens/ReportScreens';

const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();

function CustomTabBar({state,descriptors,navigation}){
  const {bottom}=useSafeAreaInsets();

  const tabRoutes=state.routes;

  const renderTab=(route,index)=>{
    const {options}=descriptors[route.key];
    const focused=state.index===index;
    const color=focused?'#17313A':'#26343A';
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
        <Ionicons name={icons[route.name]} size={22} color={color}/>
        <Text allowFontScaling={false} maxFontSizeMultiplier={1} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.tabLabel,{color}]}>{label}</Text>
      </>
    );

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.tabItem,focused&&styles.activeTabItem]}
      >
        {focused ? (
          <BlurView tint="light" intensity={85} style={styles.activeGlass}>
            <View pointerEvents="none" style={styles.activeGlassHighlight}/>
            {tabContent}
          </BlurView>
        ) : tabContent}
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
    height:76,
    borderRadius:38,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:7,
    paddingVertical:7,
    backgroundColor:'#FFFFFF',
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
    borderRadius:30,
    overflow:'visible',
  },
  activeTabItem:{
    backgroundColor:'transparent',
    paddingHorizontal:2,
    paddingVertical:2,
  },
  activeGlass:{
    position:'absolute',
    top:2,
    bottom:2,
    left:2,
    right:2,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:30,
    overflow:'visible',
  },
  activeGlassHighlight:{
    ...StyleSheet.absoluteFillObject,
    borderRadius:30,
    backgroundColor:'rgba(255,255,255,0.42)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.95)',
    shadowColor:'#7A8790',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.22,
    shadowRadius:8,
    elevation:5,
    opacity:1,
  },
  tabLabel:{
    marginTop:2,
    fontSize:9.5,
    fontWeight:'800',
    lineHeight:12,
    textAlign:'center',
    includeFontPadding:false,
    flexShrink:1,
    width:'100%',
  },
});

export default function AppNavigator(){
  return (
    <NavigationContainer>
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
  );
}