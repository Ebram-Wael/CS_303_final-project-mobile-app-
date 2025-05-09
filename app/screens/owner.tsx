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
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from '@/components/colors';
import { useEffect, useState } from "react";
import { db } from '@/services/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { useThemes } from '@/components/themeContext';

export default function OwnerDetails() {
  const { ownerId } = useLocalSearchParams<{ ownerId: string }>();
  const router = useRouter();
  const [owner, setOwner] = useState<any>(null);
  const [ownedHouses, setOwnedHouses] = useState<any[]>([]);
  const { theme } = useThemes();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const userDocRef = doc(db, "Users", ownerId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const ownerData = docSnap.data();
          setOwner(ownerData);

          const seller_id = docSnap.id;
          const apartmentsRef = collection(db, "Apartments");
          const houseQuery = query(apartmentsRef, where("seller_id", "==", seller_id));

          const unsubscribe = onSnapshot(houseQuery, (snapshot) => {
            const houseList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOwnedHouses(houseList);
          });

          return () => unsubscribe();
        } else {
          console.warn("Owner not found in Users collection.");
          setOwner(null);
          setOwnedHouses([]);
        }
      } catch (err) {
        alert(err.message);
      }
    };

    fetchOwner();
  }, [ownerId]);

  return (
    <ScrollView style={[styles.container,{backgroundColor:isDark?Colors.darkModeBackground:Colors.background}]}>
      <Text style={[styles.header,{color:isDark?Colors.darkModeText:Colors.text}]}>Owner Details</Text>
      {owner ? (
        <View style={styles.card}>
          {owner.image && (
            <Image
              source={{ uri: owner.imageurl[0] }}
              style={styles.ownerImage}
            />
          )}
          <Text style={styles.name}>{owner.name}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <Icon
                name="phone"
                size={20}
                color={Colors.assestGray}
                style={styles.icon}
              />
              <Text style={styles.info}>{owner.phone || "Not Available"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon
                name="envelope"
                size={20}
                color={Colors.assestGray}
                style={styles.icon}
              />
              <Text style={styles.info}>{owner.email || "Not Available"}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Owner details not found.</Text>
      )}

      <Text style={[styles.subHeader,{color:isDark?Colors.darkModeText:Colors.text}]}>Properties Listed</Text>
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
              <Image source={{ uri: house.image[0] }} style={styles.image} />
              <View style={styles.houseInfo}>
                <Text style={[styles.title,{color:isDark?Colors.text:Colors.text}]}>{house.availability_status}</Text>
                <Text style={[styles.address,{color:isDark?Colors.assestGray:Colors.assestGray}]}>{house.location}</Text>
                <Text style={[styles.price,{color:isDark?Colors.assestGreenTwo:Colors.assestBlue}]}>{house.rent} EGP</Text>
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
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.text,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
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
    color: Colors.text,
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
    color: Colors.warning,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: Colors.text,
  },
  houseCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
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
    color: Colors.assestBlue,
  },
  noHousesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});
