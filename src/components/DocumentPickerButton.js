import {AppText,AppTextInput} from './AppText';
import React from 'react';
import {Alert, Pressable, View} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';

export async function pickDocument(){
  const result=await DocumentPicker.getDocumentAsync({
    type:['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/octet-stream'],
    copyToCacheDirectory:true,
    multiple:false
  });
  if(result.canceled)return null;
  return result.assets?.[0]||null;
}

export default function DocumentPickerButton({label='Upload Document',file,uploaded,onPick}){
  async function choose(){
    if(file){
      onPick?.(null);
      return;
    }
    // An already uploaded document can be replaced by selecting a new file.
    // Do not treat the existing server-side document as a selected local file.

    try{
      const asset=await pickDocument();
      if(asset)onPick?.(asset);
    }catch(error){
      Alert.alert('Document','Unable to select the document.');
    }
  }

  return <Pressable onPress={choose} style={({pressed})=>[
    styles.dropZone,
    pressed&&styles.pressed,
    file&&styles.selected
  ]}>
    <View style={styles.iconBox}>
      <Ionicons name={file?'document-text-outline':'cloud-upload-outline'} size={25} color={colors.teal}/>
    </View>
    <View style={styles.content}>
      <AppText style={styles.title} numberOfLines={1}>{file?.name||label}</Text>
      <AppText style={styles.hint} numberOfLines={2}>
        {file?'New document selected • Tap again to remove':uploaded?'Uploaded • Tap Replace to choose a new file':'Click here or drag & drop your document'}
      </Text>
      <AppText style={styles.supported}>PDF, JPG, PNG, WEBP, DOC or DOCX • Max 10 MB</Text>
    </View>
    <View style={[styles.action,file&&styles.removeAction]}>
      <Ionicons name={file?'close-circle-outline':'add-circle-outline'} size={18} color={file?colors.white:colors.midnight}/>
      <AppText style={[styles.actionText,file&&styles.removeText]}>{file?'Remove':uploaded?'Replace':'Choose'}</Text>
    </View>
  </Pressable>;
}

const styles={
  dropZone:{
    minHeight:86,
    borderRadius:17,
    borderWidth:1.5,
    borderStyle:'dashed',
    borderColor:'rgba(39,168,154,.35)',
    backgroundColor:'#FBFCFB',
    padding:13,
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    marginTop:6,
    marginBottom:6
  },
  selected:{
    borderColor:colors.teal,
    backgroundColor:colors.goldLight
  },
  pressed:{backgroundColor:'#E4F5F1',borderColor:colors.teal},
  iconBox:{
    width:46,height:46,borderRadius:14,
    backgroundColor:colors.goldLight,
    alignItems:'center',justifyContent:'center'
  },
  content:{flex:1,minWidth:0,justifyContent:'center'},
  title:{fontSize:13,fontFamily:'Manrope_800ExtraBold',color:colors.ink},
  hint:{fontSize:11,lineHeight:16,color:colors.muted,marginTop:4},
  supported:{fontSize:9,color:'#9AA4AD',marginTop:3},
  action:{
    minWidth:66,height:38,paddingHorizontal:9,borderRadius:12,
    borderRadius:12,
    backgroundColor:colors.gold,
    alignItems:'center',justifyContent:'center',
    flexDirection:'row',gap:4
  },
  removeAction:{backgroundColor:colors.midnight},
  actionText:{fontSize:10,fontFamily:'Manrope_800ExtraBold',color:colors.midnight},
  removeText:{color:colors.white}
};