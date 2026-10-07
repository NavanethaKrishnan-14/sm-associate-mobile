import React,{forwardRef,useImperativeHandle,useRef,useState} from 'react';
import {Modal,Pressable,StyleSheet,Text,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';

let controller=null;

export function showPremiumAlert(title,message,buttons){
  if(controller) return controller.open(title,message,buttons);
  return null;
}

export const PremiumAlertHost=forwardRef(function PremiumAlertHost(_,ref){
  const [state,setState]=useState({visible:false,title:'',message:'',buttons:[]});
  const timer=useRef(null);
  useImperativeHandle(ref,()=>({
    open(title,message,buttons){
      const normalized=Array.isArray(buttons)&&buttons.length
        ? buttons
        : [{text:'OK',style:'default'}];
      setState({visible:true,title:String(title||''),message:String(message||''),buttons:normalized});
    }
  }));
  React.useEffect(()=>{
    controller={open:(...args)=>ref.current?.open(...args)};
    return()=>{controller=null;if(timer.current)clearTimeout(timer.current)};
  },[]);
  const close=()=>setState(s=>({...s,visible:false}));
  const run=(button)=>{
    close();
    setTimeout(()=>button?.onPress?.(),80);
  };
  const destructive=state.buttons.some(b=>b?.style==='destructive');
  const icon=destructive?'trash-outline':/success|saved|complete|updated|created/i.test(state.title)?'checkmark-circle-outline':'information-circle-outline';
  return <Modal transparent visible={state.visible} animationType="fade" onRequestClose={close}>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={[styles.icon,{backgroundColor:destructive?'#FCECEC':'#E4F5F0'}]}>
          <Ionicons name={icon} size={28} color={destructive?colors.danger:colors.teal}/>
        </View>
        <Text style={styles.title}>{state.title}</Text>
        <Text style={styles.message}>{state.message}</Text>
        <View style={styles.actions}>
          {state.buttons.map((b,i)=><Pressable key={String(b.text)+i} onPress={()=>run(b)} style={[styles.button,i===state.buttons.length-1&&styles.primaryButton,b.style==='destructive'&&styles.dangerButton]}>
            <Text style={[styles.buttonText,i===state.buttons.length-1&&styles.primaryText,b.style==='destructive'&&styles.dangerText]}>{b.text||'OK'}</Text>
          </Pressable>)}
        </View>
      </View>
    </View>
  </Modal>;
});

export function installPremiumAlert(){
  const original=require('react-native').Alert.alert;
  if(original.__premiumInstalled) return;
  const wrapped=function(title,message,buttons,options){
    showPremiumAlert(title,message,buttons);
  };
  wrapped.__premiumInstalled=true;
  require('react-native').Alert.alert=wrapped;
}

const styles=StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(7,15,20,0.58)',alignItems:'center',justifyContent:'center',padding:24},
  card:{width:'100%',maxWidth:390,backgroundColor:'#FAFCFA',borderRadius:30,padding:24,borderWidth:1,borderColor:'rgba(39,168,154,.16)',shadowColor:'#07151B',shadowOffset:{width:0,height:18},shadowOpacity:.24,shadowRadius:30,elevation:18},
  icon:{width:58,height:58,borderRadius:19,alignItems:'center',justifyContent:'center',marginBottom:17},
  title:{fontSize:20,fontFamily:'Manrope_800ExtraBold',color:colors.ink,letterSpacing:-.3},
  message:{fontSize:13.5,lineHeight:20,color:colors.muted,marginTop:7},
  actions:{flexDirection:'row',justifyContent:'flex-end',gap:9,marginTop:23,flexWrap:'wrap'},
  button:{minHeight:45,paddingHorizontal:17,borderRadius:14,borderWidth:1,borderColor:'#DDE5E1',backgroundColor:'#F5F7F5',alignItems:'center',justifyContent:'center'},
  primaryButton:{backgroundColor:colors.midnight,borderColor:colors.midnight},
  dangerButton:{backgroundColor:'#FFF0F0',borderColor:'#F1CACA'},
  buttonText:{fontSize:12.5,fontFamily:'Manrope_800ExtraBold',color:colors.ink},
  primaryText:{color:colors.goldLight},
  dangerText:{color:colors.danger}
});