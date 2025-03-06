import { View, Text } from "react-native";
import React, { useState } from "react";
import  auth  from '../../firebase'; 
import {  doc, getDoc } from 'firebase/firestore';
import {db} from '../../firebase'
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileProps {
  name: string;
  email: string;
}


const Profile = () => {
  const [details,setDetails] =useState(null)
  const handleuserdetails =async ()=>{
    auth.onAuthStateChanged(async (user)=>{ 
      const docRef = doc(db ,'Users',user.uid)
      const docSnap = await getDoc(docRef) 
      if(docSnap.exists()){
        setDetails(docSnap.data())
      }else{
        console.log('No such document!');
      }

    } )
  }
  return (
    <SafeAreaView >
      
    </SafeAreaView>  
  );
};

export default Profile;
