import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {getCurrentUser,getStoredUser,login as apiLogin,logout as apiLogout,setUnauthorizedHandler} from '../api/client';

const AuthContext=createContext(null);

export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let mounted=true;
    setUnauthorizedHandler(()=>{if(mounted)setUser(null);});
    (async()=>{
      const cached=await getStoredUser();
      if(mounted&&cached)setUser(cached);
      try{
        const current=await getCurrentUser();
        if(mounted)setUser(current);
      }catch{
        await apiLogout();
        if(mounted)setUser(null);
      }finally{
        if(mounted)setLoading(false);
      }
    })();
    return()=>{mounted=false;setUnauthorizedHandler(null);};
  },[]);

  const signIn=async(email,password)=>{
    const result=await apiLogin(email,password);
    const nextUser=result?.data?.user||null;
    setUser(nextUser);
    return nextUser;
  };
  const signOut=async()=>{await apiLogout();setUser(null);};
  const value=useMemo(()=>({user,loading,signIn,signOut,isAdmin:user?.role==='ADMIN'}),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const value=useContext(AuthContext);
  if(!value)throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
