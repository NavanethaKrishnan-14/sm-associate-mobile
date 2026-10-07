import {AppText,AppTextInput} from '../components/AppText';
import React,{useCallback,useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {api} from '../api/client';
import {colors} from '../theme/colors';

const sourceIcon={ "Car Buying":"car-sport-outline", "Car Sold":"checkmark-circle-outline", "Loan":"document-text-outline" };

export default function DocumentsScreen({navigation}){
  const {top,bottom}=useSafeAreaInsets();
  const [documents,setDocuments]=useState([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [compactHeader,setCompactHeader]=useState(false);
  const load=useCallback(async()=>{
    try{
      const r=await api.get('/documents');
      setDocuments(Array.isArray(r.data?.data)?r.data.data:[]);
    }catch(e){
      setDocuments([]);
    }finally{setLoading(false);setRefreshing(false);}
  },[]);
  useFocusEffect(useCallback(()=>{load()},[load]));
  const q=search.trim().toLowerCase();
  const filtered=documents.filter(d=>[d.name,d.originalName,d.source,d.recordLabel].some(v=>String(v||'').toLowerCase().includes(q)));
  const formatDate=value=>value?new Date(value).toLocaleDateString():'—';
  const formatSize=value=>{
    const n=Number(value||0);
    if(!n)return '';
    if(n<1024)return n+' B';
    if(n<1024*1024)return (n/1024).toFixed(1)+' KB';
    return (n/1024/1024).toFixed(1)+' MB';
  };

  return <View style={styles.page}>
    <View style={[styles.topBar,compactHeader&&styles.topBarCompact,{paddingTop:top+26}]}>
      <Pressable onPress={()=>navigation.goBack()} style={[styles.back,compactHeader&&styles.backCompact]}><Ionicons name="arrow-back" size={compactHeader?19:22} color={colors.ink}/></Pressable>
      <View style={{flex:1,marginLeft:compactHeader?8:10}}>
        <AppText style={[styles.title,compactHeader&&styles.titleCompact]}>Documents</Text>
        {!compactHeader&&<AppText style={styles.subtitle}>All uploaded documents</Text>}
      </View>
      <View style={[styles.count,compactHeader&&styles.countCompact]}><AppText style={styles.countText}>{documents.length}</Text></View>
    </View>

    <View style={styles.searchBox}>
      <Ionicons name="search-outline" size={19} color={colors.muted}/>
      <AppTextInput value={search} onChangeText={setSearch} placeholder="Search by document name, source or record" placeholderTextColor={colors.muted} style={styles.search}/>
    </View>

    <ScrollView onScroll={event=>setCompactHeader(event.nativeEvent.contentOffset.y>35)} scrollEventThrottle={16} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={colors.gold}/>}>
      {loading?<View style={styles.center}><ActivityIndicator size="large" color={colors.midnight}/></View>:
       filtered.length===0?<View style={styles.empty}><Ionicons name="folder-open-outline" size={44} color={colors.muted}/><AppText style={styles.emptyTitle}>{documents.length?'No matching documents':'No uploaded documents'}</Text><AppText style={styles.emptyText}>{documents.length?'Try another document name or record.':'Uploaded Car Buying, Car Sold and Loan documents will appear here.'}</Text></View>:
       filtered.map(d=><View key={d.id} style={styles.card}>
         <View style={styles.icon}><Ionicons name={sourceIcon[d.source]||'document-outline'} size={21} color={colors.midnight}/></View>
         <View style={{flex:1}}>
           <AppText style={styles.name}>{d.name}</Text>
           <AppText style={styles.file}>{d.originalName}{d.size?' • '+formatSize(d.size):''}</Text>
           <View style={styles.metaRow}><AppText style={styles.source}>{d.source}</Text><AppText style={styles.date}>{formatDate(d.uploadedAt)}</Text></View>
           <AppText style={styles.record} numberOfLines={2}>{d.recordLabel}</Text>
         </View>
       </View>)
      }
    </ScrollView>
  </View>
}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:'#F4F6F3'},
  topBar:{paddingTop:0,paddingHorizontal:18,paddingBottom:15,flexDirection:'row',alignItems:'center',backgroundColor:'#182027',borderBottomWidth:0,borderBottomColor:'#ECEDEB'},
  topBarCompact:{paddingTop:10,paddingBottom:10,shadowOpacity:0.08,shadowRadius:5,elevation:3},
  back:{width:40,height:40,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.10)'},
  backCompact:{width:34,height:34,borderRadius:11},
  title:{fontSize:20,color:colors.ink},
  titleCompact:{fontSize:16},
  subtitle:{fontSize:12,color:'rgba(255,255,255,.62)',marginTop:2},
  count:{minWidth:36,height:32,borderRadius:12,backgroundColor:colors.midnight,alignItems:'center',justifyContent:'center',paddingHorizontal:9},
  countCompact:{minWidth:32,height:28,borderRadius:10},
  countText:{color:colors.white,},
  searchBox:{margin:16,marginBottom:4,minHeight:48,borderRadius:16,borderWidth:1,borderColor:'rgba(39,168,154,0.18)',backgroundColor:colors.white,flexDirection:'row',alignItems:'center',paddingHorizontal:14},
  search:{flex:1,paddingHorizontal:9,color:colors.ink,fontSize:13},
  content:{padding:16,paddingTop:10,paddingBottom:30},
  card:{backgroundColor:'#FFFFFF',borderRadius:22,padding:17,marginBottom:12,flexDirection:'row',borderWidth:1,borderColor:'rgba(17,26,35,.06)'},
  icon:{width:44,height:44,borderRadius:14,backgroundColor:colors.goldLight,alignItems:'center',justifyContent:'center',marginRight:12},
  name:{fontSize:15,color:colors.ink},
  file:{fontSize:11,color:colors.muted,marginTop:3},
  metaRow:{flexDirection:'row',alignItems:'center',marginTop:8,gap:8},
  source:{fontSize:10,color:colors.midnight,backgroundColor:'#EEF1EF',paddingHorizontal:8,paddingVertical:4,borderRadius:8},
  date:{fontSize:11,color:colors.muted},
  record:{fontSize:11,color:colors.ink,marginTop:7,},
  center:{paddingTop:80,alignItems:'center'},
  empty:{alignItems:'center',paddingTop:75,paddingHorizontal:30},
  emptyTitle:{fontSize:18,color:colors.ink,marginTop:12},
  emptyText:{fontSize:13,color:colors.muted,textAlign:'center',marginTop:6,lineHeight:19}
});
