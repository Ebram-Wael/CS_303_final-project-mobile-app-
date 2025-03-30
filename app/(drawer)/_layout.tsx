import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity, View } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';

export default function Drawernav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          drawerPosition: "left",
          drawerStyle: { width: 250, paddingTop:20 },
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
            >
            </TouchableOpacity>
          ),
        })}
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            <DrawerItemList {...props} />
          </View>
        )}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="FavoritesScreen"
          options={{
            drawerLabel: "Favorites",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="setting"
          options={{
            drawerLabel: "Setting",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="AboutUs"
          options={{
            drawerLabel: "About Us",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
