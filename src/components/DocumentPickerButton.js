import React from 'react';
import {Alert,Pressable,Text,View} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {colors} from '../theme/colors';

export async function pickDocument(){
  const result=await DocumentPicker.getDocumentAsync({
    type:'*/*',
    copyToCacheDirectory:true,
    multiple:false
  });
  if(result.canceled)return null;
  return result.assets?.[0]||null;
}

export default function DocumentPickerButton({label='Upload Document',file,onPick}){
  async function choose(){
    try{
      const asset=await pickDocument();
      if(asset)onPick?.(asset);
    }catch(error){
      Alert.alert('Document','Unable to select the document.');
    }
  }
  return <Pressable onPress={choose} style={({pressed})=>({
    minHeight:48,borderRadius:14,borderWidth:1,borderColor:'#D9DDE0',
    backgroundColor:pressed?'#F1F2F0':colors.white,paddingHorizontal:14,
    flexDirection:'row',alignItems:'center',justifyContent:'space-between'
  })}>
    <View style={{flex:1}}>
      <Text style={{fontWeight:'800',color:colors.ink}}>{file?.name||label}</Text>
      <Text style={{fontSize:11,color:colors.muted,marginTop:3}}>{file?'Ready to upload':'PDF, image or any supported document'}</Text>
    </View>
    <Text style={{color:colors.midnight,fontWeight:'900',marginLeft:12}}>{file?'Change':'Choose'}</Text>
  </Pressable>;
}
