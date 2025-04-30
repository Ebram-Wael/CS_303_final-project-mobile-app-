import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, View } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemes } from '@/components/themeContext'
import Colors from "@/components/colors";

export default function Layout() {
  const [seller, setSeller] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const auth = getAuth();
  const { theme } = useThemes();
  const isDark = theme === 'dark';

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setSeller(userData.role == "seller");
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    getUserDetails();
    getUser();
  }, []);
  const getUser = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setSeller(userDoc.data().role === "seller");
        }
      }
    })

  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          drawerPosition: "left",
          drawerStyle: { width: 250, paddingTop: 20, backgroundColor: isDark ? Colors.darkModeBackground : 'white' },
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
            ></TouchableOpacity>
          ),
        })}
        drawerContent={(props) => {
          const filteredProps = {
            ...props,
            state: {
              ...props.state,
              routes: props.state.routes.filter(
                (route) =>
                  !(seller
                    ? route.name === "FavoritesScreen"
                    : route.name === "addApartment")
              ),
            },
          };
          return (
            <View style={{ flex: 1 }}>
              <DrawerItemList {...filteredProps} />
            </View>
          );
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            drawerLabelStyle: { color: isDark ? Colors.darkModeText : Colors.text },
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: "Setting",
            drawerLabelStyle: { color: isDark ? Colors.darkModeText : Colors.text },
            drawerIcon: ({ size }) => (
              <Ionicons name="settings-outline" size={size} color={Colors.assestGray} />
            ),
          }}
        />
        <Drawer.Screen
          name="AboutUs"
          options={{
            drawerLabel: "About Us",
            drawerLabelStyle: { color: isDark ? Colors.darkModeText : Colors.text },
            drawerIcon: ({ size }) => (
              <Ionicons
                name="information-circle-outline"
                size={size}
                color={Colors.assestGray}
              />
            ),
          }}
        />

        {seller ? (
          <Drawer.Screen
            name="addApartment"
            options={{
              drawerLabel: "Add Apartment",
              drawerLabelStyle: { color: isDark ? Colors.darkModeText : Colors.text },
              drawerIcon: ({ size }) => (
                <Ionicons name="add-circle-outline" size={size} color={Colors.assestGray} />
              ),
            }}
          />
        ) : (
          <Drawer.Screen
            name="FavoritesScreen"
            options={{
              drawerLabel: "Favorites",
              drawerLabelStyle: { color: isDark ? Colors.darkModeText : Colors.text },
              drawerIcon: ({ size }) => (
                <Ionicons name="heart-outline" size={size} color={Colors.assestGray} />
              ),
            }}
          />
        )}
      </Drawer>
    </GestureHandlerRootView>
  );
}
