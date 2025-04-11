import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const segments = useSegments();
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const checked = onAuthStateChanged(auth, async (cur) => {
      setUser(cur);
      if(!check) {
        setCheck(true);
      }
    });
    return () => checked();
  }, [auth]);


  useEffect(() => {
    if (!check) return;
    
    const inScreen=segments[0]==="screens";
    
    if (!user && !inScreen) {
      router.replace("/screens/firstpage");
    } else if (user && inScreen) {
      router.replace("/(drawer)/(tabs)/profile");
    }
  }, [user, segments, check]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? <Stack.Screen name="screens"/> : <Stack.Screen name="(drawer)" />}
      </Stack>
    </>
  );
}