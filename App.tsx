import {useEffect,useState} from "react";
import {SafeAreaView,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,ActivityIndicator} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL=process.env.EXPO_PUBLIC_API_URL||"http://10.0.2.2:5000/api/v1";
const api=axios.create({baseURL:API_URL});
type User={id:string;name:string;email:string;role:"ADMIN"|"STAFF"};
type Dashboard={customers:number;activeLoans:number;carsInInventory:number;carsSold:number;totalProfit:number};

export default function App(){
 const[user,setUser]=useState<User|null>(null); const[checking,setChecking]=useState(true);
 useEffect(()=>{SecureStore.getItemAsync("sm_token").then(async token=>{if(!token)return;try{const r=await api.get("/auth/me",{headers:{Authorization:`Bearer ${token}`}});setUser(r.data.data)}catch{await SecureStore.deleteItemAsync("sm_token")}}).finally(()=>setChecking(false))},[]);
 if(checking)return <SafeAreaView style={s.safe}><View style={s.center}><ActivityIndicator/><Text style={s.muted}>Loading...</Text></View></SafeAreaView>;
 if(!user)return <Login onLogin={setUser}/>;
 return <Dashboard user={user} onLogout={async()=>{await SecureStore.deleteItemAsync("sm_token");setUser(null)}}/>;
}

function Login({onLogin}:{onLogin:(u:User)=>void}){
 const[email,setEmail]=useState(""); const[password,setPassword]=useState(""); const[error,setError]=useState(""); const[busy,setBusy]=useState(false);
 async function submit(){setError("");setBusy(true);try{const r=await api.post("/auth/login",{email,password});await SecureStore.setItemAsync("sm_token",r.data.data.token);onLogin(r.data.data.user)}catch(e:any){setError(e?.response?.data?.message||"Unable to sign in.")}finally{setBusy(false)}}
 return <SafeAreaView style={s.login}><View style={s.loginCard}><Text style={s.brand}>SM ASSOCIATE</Text><Text style={s.loginTitle}>Management System</Text><Text style={s.muted}>Secure mobile access</Text><Text style={s.inputLabel}>Email</Text><TextInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="admin@example.com" style={s.input}/><Text style={s.inputLabel}>Password</Text><TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="Password" style={s.input}/>{error?<Text style={s.error}>{error}</Text>:null}<TouchableOpacity style={s.button} onPress={submit} disabled={busy}><Text style={s.buttonText}>{busy?"Signing in...":"Sign in"}</Text></TouchableOpacity></View></SafeAreaView>
}

function Dashboard({user,onLogout}:{user:User;onLogout:()=>void}){
 const[data,setData]=useState<Dashboard|null>(null); const[error,setError]=useState("");
 useEffect(()=>{SecureStore.getItemAsync("sm_token").then(token=>api.get("/reports/dashboard",{headers:{Authorization:`Bearer ${token}`}}).then(r=>setData(r.data.data)).catch(e=>setError(e?.response?.data?.message||"Unable to load dashboard.")) )},[]);
 return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.container}><View style={s.top}><View><Text style={s.brand}>SM ASSOCIATE</Text><Text style={s.title}>Dashboard</Text><Text style={s.subtitle}>Welcome, {user.name}</Text></View><TouchableOpacity onPress={onLogout}><Text style={s.signout}>Sign out</Text></TouchableOpacity></View>{error?<Text style={s.error}>{error}</Text>:null}<View style={s.grid}><Stat title="Customers" value={data?.customers??0}/><Stat title="Active Loans" value={data?.activeLoans??0}/><Stat title="Cars in Stock" value={data?.carsInInventory??0}/><Stat title="Cars Sold" value={data?.carsSold??0}/></View><View style={s.profitBox}><Text style={s.label}>NET CAR PROFIT</Text><Text style={s.profit}>₹{(data?.totalProfit??0).toLocaleString("en-IN")}</Text></View><Text style={s.section}>Modules</Text>{["Loan Management","Car Buying","Car Sold","Customer Management","Profit & Reports"].map(item=><View style={s.module} key={item}><Text style={s.moduleText}>{item}</Text><Text style={s.arrow}>›</Text></View>)}</ScrollView></SafeAreaView>
}
function Stat({title,value}:{title:string;value:number}){return <View style={s.stat}><Text style={s.label}>{title}</Text><Text style={s.statValue}>{value}</Text></View>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:"#f5f6f8"},login:{flex:1,justifyContent:"center",padding:22,backgroundColor:"#111b2d"},loginCard:{backgroundColor:"#fff",borderRadius:18,padding:24},brand:{fontSize:15,fontWeight:"800",letterSpacing:2,color:"#111b2d"},loginTitle:{fontSize:28,fontWeight:"800",marginTop:18,color:"#18202a"},muted:{color:"#64748b",marginTop:5},inputLabel:{fontSize:13,fontWeight:"700",marginTop:20,marginBottom:7},input:{borderWidth:1,borderColor:"#d6dbe3",borderRadius:9,padding:12,fontSize:15},button:{backgroundColor:"#243653",padding:14,borderRadius:9,marginTop:20,alignItems:"center"},buttonText:{color:"#fff",fontWeight:"800"},error:{backgroundColor:"#fff1f2",color:"#b42318",padding:10,borderRadius:8,marginTop:14},center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:22,paddingBottom:40},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start"},title:{fontSize:30,fontWeight:"800",marginTop:24,color:"#18202a"},subtitle:{color:"#64748b",marginTop:4,marginBottom:22},signout:{color:"#243653",fontWeight:"700"},grid:{flexDirection:"row",flexWrap:"wrap",gap:12},stat:{width:"47%",backgroundColor:"#fff",borderRadius:14,padding:18},label:{color:"#64748b",fontSize:12},statValue:{fontSize:28,fontWeight:"800",marginTop:8,color:"#18202a"},profitBox:{backgroundColor:"#111b2d",borderRadius:16,padding:22,marginTop:14},profit:{color:"#fff",fontSize:30,fontWeight:"800",marginTop:8},section:{fontSize:19,fontWeight:"800",marginTop:28,marginBottom:10},module:{backgroundColor:"#fff",padding:18,borderRadius:12,marginBottom:10,flexDirection:"row",justifyContent:"space-between"},moduleText:{fontSize:15,fontWeight:"600"},arrow:{fontSize:24,color:"#64748b"}});
