import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
export default function RootLayout() {
  const router = useRouter();
  const auth = getAuth();
  useEffect(() => {
    const checkUser = async () => {
      const seenFirstPage = await AsyncStorage.getItem("userData");
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          router.replace('/(drawer)/(tabs)/profile');
        } else if (seenFirstPage !== "true") {
          await AsyncStorage.setItem("userData", "true");
          router.replace("/screens/firstpage");
        } else {
          router.replace("/screens/firstpage");
        }
      });
    };

    checkUser();
  }, []);
  return (
    <>
      {/* <Redirect href="/screens/firstpage" /> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
      </Stack>
    </>
  );
}
