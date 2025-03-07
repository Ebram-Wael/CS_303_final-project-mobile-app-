import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import HouseData from "@/services/data.json";
import Icon from "react-native-vector-icons/FontAwesome";

export default function OwnerDetails() {
  const { ownerName } = useLocalSearchParams<{ ownerName: string }>();
  const router = useRouter();
  const owner = HouseData.find(
    (house) => house.owner === ownerName
  )?.ownerDetails;
  const ownedHouses = HouseData.filter((house) => house.owner === ownerName);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Owner Details</Text>
      {owner ? (
        <View style={styles.card}>
          {owner.owner_image && (
            <Image
              source={{ uri: owner.owner_image }}
              style={styles.ownerImage}
            />
          )}
          <Text style={styles.name}>{owner.name}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <Icon
                name="phone"
                size={20}
                color="#007bff"
                style={styles.icon}
              />
              <Text style={styles.info}>{owner.phone || "Not Available"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon
                name="envelope"
                size={20}
                color="#007bff"
                style={styles.icon}
              />
              <Text style={styles.info}>{owner.email || "Not Available"}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Owner details not found.</Text>
      )}

      <Text style={styles.subHeader}>Properties Listed</Text>
      {ownedHouses.length > 0 ? (
        ownedHouses.map((house) => (
          <Pressable
            key={house.id}
            onPress={() =>
              router.push({
                pathname: "/screens/[moreview]",
                params: { moreview: house.id },
              })
            }
          >
            <View key={house.id} style={styles.houseCard}>
              <Image source={{ uri: house.image }} style={styles.image} />
              <View style={styles.houseInfo}>
                <Text style={styles.title}>{house.title}</Text>
                <Text style={styles.address}>{house.address}</Text>
                <Text style={styles.price}>{house.price} EGP</Text>
              </View>
            </View>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noHousesText}>
          No properties listed by this owner.
        </Text>
      )}
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
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  ownerImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: "black",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  detailsContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  houseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  houseInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  noHousesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});
