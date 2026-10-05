import React,{useState} from 'react';
import {Alert,KeyboardAvoidingView,Platform,Pressable,Text,TextInput,View,ActivityIndicator,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {login} from '../api/client';

export default function LoginScreen({navigation}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(){
    if(!email||!password) return Alert.alert('Sign in','Enter your email and password.');
    setBusy(true);
    try{
      await login(email.trim(),password);
      navigation.replace('Main');
    }catch(e){
      Alert.alert('Unable to sign in',e?.response?.data?.message||'Check your credentials and try again.');
    }finally{setBusy(false);}
  }

  return <LinearGradient colors={[colors.midnight,colors.navy,colors.ivory]} style={{flex:1}}>
    <KeyboardAvoidingView style={{flex:1,padding:24,justifyContent:'center'}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <View style={{alignItems:'center',marginBottom:38}}>
        <View style={{backgroundColor:colors.white,borderRadius:24,paddingHorizontal:18,paddingVertical:12,marginBottom:24}}>
          <Logo width={190}/>
        </View>
        <Text style={{color:colors.white,fontSize:27,fontWeight:'800',textAlign:'center'}}>Welcome back</Text>
        <Text style={{color:'rgba(255,255,255,.72)',fontSize:14,marginTop:7,textAlign:'center'}}>Manage finance, customers, loans and vehicles in one place.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Work email</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@company.com" placeholderTextColor="#98A3AD" style={styles.input}/>
        <Text style={[styles.label,{marginTop:18}]}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" placeholderTextColor="#98A3AD" style={styles.input}/>
        <Pressable onPress={submit} disabled={busy} style={({pressed})=>[styles.button,{opacity:pressed?.82:1}]}>
          {busy?<ActivityIndicator color={colors.midnight}/>:<Text style={styles.buttonText}>Sign in</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  </LinearGradient>
}
const styles=StyleSheet.create({
  card:{backgroundColor:'rgba(251,250,246,.98)',borderRadius:28,padding:22},
  label:{fontSize:12,fontWeight:'800',color:colors.ink,letterSpacing:.6},
  input:{backgroundColor:colors.white,borderWidth:1,borderColor:'#E3E6E3',borderRadius:16,paddingHorizontal:15,height:54,marginTop:8,color:colors.ink,fontSize:15},
  button:{height:56,borderRadius:17,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center',marginTop:24},
  buttonText:{color:colors.midnight,fontWeight:'900',fontSize:15}
});