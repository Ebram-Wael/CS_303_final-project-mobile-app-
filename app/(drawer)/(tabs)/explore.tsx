import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

const Explore = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Apartments"));
      const apartmentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApartments(apartmentList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching apartments:", err);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Apartments</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={apartments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.address}</Text>
              <Text>{item.price} EGP</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold" },
});

export default Explore;
