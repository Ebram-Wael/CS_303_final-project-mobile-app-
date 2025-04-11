import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import HouseData from "@/services/data.json";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from '@/components/colors';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const favoriteHouses = HouseData.filter((house) =>
          favoriteIds.includes(house.id)
        );
        setFavorites(favoriteHouses);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
      setFavorites([]);
    }
  };

  const removeFromFavorites = async (itemId) => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        let favoriteIds = JSON.parse(storedFavorites);
        favoriteIds = favoriteIds.filter((id) => id !== itemId);
        await AsyncStorage.setItem("favorites", JSON.stringify(favoriteIds));
        loadFavorites();
        Alert.alert("Favorites", "Item removed from favorites.");
      }
    } catch (error) {
      console.error("Failed to remove from favorites", error);
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price} EGP</Text>
      </View>
      <TouchableOpacity
        onPress={() => removeFromFavorites(item.id)}
        style={styles.heartButton}
      >
        <Icon size={30} color={"red"} name={"heart"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={favorites}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorites added yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: "#DBD8E3",
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    margin: 8,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  price: {
    fontSize: 16,
    color: colors.lightGreen,
    marginVertical: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#555",
  },
  heartButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    marginLeft: 7,
    borderRadius: 10,
  },
});

export default FavoritesScreen;
