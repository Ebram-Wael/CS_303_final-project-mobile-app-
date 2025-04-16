import { Slot, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth =getAuth();
    const check =async()=>{
      try{
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
        if(user){
          setUser(u);
          setLoading(false);
        }

        else{
            try{
                const userdata= await AsyncStorage.getItem('userData');
                if(userdata){
                  const useer=JSON.parse(userdata);
                  setUser(useer);
                  
                }
                else{
                  console.log("no data in storage");
                  setUser(null);
                }
            }
            catch(Error){
              console.log("error");

            }
            setLoading(false);
        }
        });
        return unsubscribe;
  

      }catch(error){
        console.error("Auth state error:", error);
        setLoading(false);
        return () => {};
      }
  }
    const unsubscribe = check();
      return () => {
        if (unsubscribe) {
          unsubscribe.then(unsub => unsub());
        }
      };

  }, []);

  useEffect(() => {
    
    if (!loading && !user) {
      router.replace("/(auth)/firstpage");
    }
    else if(!loading &&user){
      router.replace("/(drawer)/(tabs)/profile")
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
