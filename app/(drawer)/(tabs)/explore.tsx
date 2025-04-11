import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {db} from "@/services/firebase"
import {collection, onSnapshot, doc ,getDoc} from "firebase/firestore";
import colors from '@/components/colors' 

const defaultImage = "default.jpg";

const HouseItem = ({ house }) => {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  
  useEffect(() => {
    const fetchOwner = async () => {
      if (house.seller_id) {
        try {
          const userDocRef = doc(db, "Users", house.seller_id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setOwner(userDoc.data().name);
          } else {
            setOwner("Unknown");
          }
        } catch (error) {
          console.error("Error fetching owner:", error);
          setOwner("Error");
        }
      } else {
        setOwner("No seller");
      }
    };

    fetchOwner();
  }, [house.seller_id]);

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
        <Text style={styles.title}>{house.availability_status || "No Title"}</Text>
        <Text style={styles.address}>{house.location || "Unknown Location"}</Text>
        <View style={styles.ownerContainer}>
          <Text style={styles.owner}>Owner: </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/screens/owner",
                params: { ownerName: owner },
              })
            }
          >
            <Text style={{ color: colors.blue }}>{owner || "Unknown"}</Text>
          </Pressable>
        </View>
        <Image
          source={{ uri: house.image[0] || defaultImage }}
          style={styles.image}
        />
        <Text style={styles.description} numberOfLines={2}>
          Description: {house.features || "No description available"}
        </Text>
        <Text style={styles.price}>
          Price: {house.rent > 0 ? `${house.rent}` : "Invalid Price"} EGP
        </Text>
      </View>
    </Pressable>
  );
};

export default function HouseList() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const colRef = collection(db,"Apartments");
    const fetchHouses = onSnapshot(colRef ,(snapshot)=> {
      const houseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(houseList);
    })
    return () => fetchHouses();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Houses</Text>
        {houses.length > 0 ? (
          houses.map((house) => <HouseItem key={house.id} house={house} />)
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
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    marginBottom: 15,
    borderRadius: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 3 },
    // shadowRadius: 5,
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
    color: colors.black,
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.blue,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.gray,
    marginTop: 20,
  },
});
