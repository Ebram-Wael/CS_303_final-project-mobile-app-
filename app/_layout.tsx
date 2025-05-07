import { Slot, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@/components/themeContext"; // Adjust the import as necessary
import Colors from '@/components/colors';
import { useThemes } from '@/components/themeContext'

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { theme } = useThemes();
  const isDark = theme === 'dark';

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        try {
          const storedUser = await AsyncStorage.getItem("userData");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.log("Error reading AsyncStorage:", err);
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAsyncStorage = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser && !getAuth().currentUser) {
        setUser(null);
      }
    };

    const interval = setInterval(checkAsyncStorage, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(drawer)/(tabs)/profile");
      } else {
        router.replace("/(auth)/firstpage");
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <ThemeProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={isDark ? Colors.darkIndicator : Colors.indicator} />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )
}
