import React, { useEffect, useState } from "react";
import HouseData from "@/services/data.json";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const defaultImage = "default.jpg";

const HouseItem = ({ house }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/[moreview]",
          params: { moreview: house.id },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.title}>{house.title || "No Title"}</Text>
        <Text style={styles.address}>{house.address || "Unknown Address"}</Text>
        <View style={styles.ownerContainer}>
          <Text style={styles.owner}>Owner: </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/screens/owner",
                params: { ownerName: house.owner },
              })
            }
          >
            <Text style={{ color: "#007bff" }}>{house.owner || "Unknown"}</Text>
          </Pressable>
        </View>
        <Image
          source={{ uri: house.image || defaultImage }}
          style={styles.image}
        />
        <Text style={styles.description} numberOfLines={2}>
          Description: {house.description || "No description available"}
        </Text>
        <Text style={styles.price}>
          Price: {house.price > 0 ? `${house.price}` : "Invalid Price"} EGP
        </Text>
      </View>
    </Pressable>
  );
};

export default function HouseList() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    setHouses(HouseData);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Houses</Text>
        {houses.length > 0 ? (
          houses.map((house) => <HouseItem key={house.title} house={house} />)
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});
