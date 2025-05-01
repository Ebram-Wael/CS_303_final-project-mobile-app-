import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import RedHeart from "@/assets/icons/heart-svgrepo-com (1).svg";
import * as Notifications from "expo-notifications";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
import { useRouter } from "expo-router";
async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Notification permissions not granted");
  }
}

const { width } = Dimensions.get("window");

interface HouseData {
  id: string;
  image: string[];
  rent: number;
  location: string;
}

interface FavoriteItemProps {
  favoriteId: string;
  onRemove: (id: string) => void;
  onPress: (id: string) => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  favoriteId,
  onRemove,
  onPress,
}) => {
  const [house, setHouse] = useState<HouseData | null>(null);

  useEffect(() => {
    requestNotificationPermissions();
    const fetchFavoriteHouse = async () => {
      const docRef = doc(db, "Apartments", favoriteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<HouseData, "id">;
        setHouse({ id: docSnap.id, ...data } as HouseData);
      } else {
        console.log("No such document!");
      }
    };

    fetchFavoriteHouse();
  }, [favoriteId]);

  const handleRemoveFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray: string[] = favorites ? JSON.parse(favorites) : [];
      favoritesArray = favoritesArray.filter((id) => id !== favoriteId);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      onRemove(favoriteId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Removed from Favorites",
          body: "Item removed from favorites.",
          sound: "default",
          data: { type: "favorite_removed" },
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to update favorites", error);
    }
  };

  if (!house) {
    return null;
  }

  return (
    <SafeAreaView>
      <Pressable onPress={() => onPress(house.id)} style={styles.favoriteItem}>
        {house.image && Array.isArray(house.image) && house.image.length > 0 ? (
          <Image
            source={{ uri: house.image[0] }}
            style={styles.favoriteImage}
          />
        ) : (
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.favoriteImage}
          />
        )}
        <View style={styles.favoriteDetails}>
          <Text style={styles.favoriteLocation} ellipsizeMode="tail">
            {house.location || "Unknown Location"}
          </Text>
          <Text style={styles.favoritePrice}>
            {house.rent > 0 ? `${house.rent} EGP` : "Invalid Price"}
          </Text>
        </View>
        <Pressable onPress={handleRemoveFavorite} style={styles.removeButton}>
          <RedHeart width={25} height={25} />
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
};

const FavoriteScreen: React.FC = () => {
  const { theme } = useThemes();
  const isDark = theme === "dark";
  const router = useRouter();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        setFavoriteIds(JSON.parse(favorites));
      } else {
        setFavoriteIds([]);
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemoveFavorite = (removedId: string) => {
    setFavoriteIds((prevIds) => prevIds.filter((id) => id !== removedId));
  };
  const handlePress = (id: string) => {
    router.push({
      pathname: "/screens/[moreview]",
      params: { moreview: id },
    });
  };
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark
            ? Colors.darkModeBackground
            : Colors.background,
        },
      ]}
    >
      <FlatList
        data={favoriteIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FavoriteItem
            favoriteId={item}
            onRemove={handleRemoveFavorite}
            onPress={handlePress}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    alignItems: "center",
    elevation: 6,
  },
  favoriteImage: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 12,
  },
  favoriteDetails: {
    flex: 1,
    justifyContent: "center",
  },
  favoritePrice: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: Colors.assestGreen,
  },
  favoriteLocation: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 5,
  },
  removeButton: {
    padding: 8,
  },
});

export default FavoriteScreen;
