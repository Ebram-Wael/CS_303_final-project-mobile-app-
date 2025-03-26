import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => (
                <Ionicons name='home-outline' size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="screens/FavoritesScreen" 
          options={{
            drawerLabel: 'Favorites',
            drawerIcon: ({ size, color }) => (
                <Ionicons name='heart-outline' size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}