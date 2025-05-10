import { db } from "@/services/firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import EditApartmentModal from "@/components/EditApartmentModal";
import Colors from "@/components/colors";
import { useThemes } from "@/components/themeContext";

export default function MyRoom() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [rooms, setRooms] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { theme } = useThemes();
  const isDark = theme === "dark";

  useEffect(() => {
    if (user) fetchApartments();
  }, [user]);

  const fetchApartments = async () => {
    setLoading(true);
    const room = await getApartment();
    setRooms(room);
    setLoading(false);
  };

  const getApartment = async () => {
    try {
      const ApartRef = collection(db, "Apartments");
      const q = query(ApartRef, where("seller_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const rooms = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        rooms.push({ id: doc.id, ...data });
      });
      return rooms;
    } catch (error) {
      console.log("error");
      return [];
    }
  };

  const handleDelete = (apartmentId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this apartment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const apartmentDoc = doc(db, "Apartments", apartmentId);
              await deleteDoc(apartmentDoc);
              fetchApartments();
            } catch (error) {
              console.log("Error deleting apartment", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container,{backgroundColor:isDark?Colors.darkModeBackground:Colors.background}]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={'green'} />
      ) : rooms.length === 0 ? (
        <View style={[styles.noApartments,{backgroundColor:isDark?Colors.darkModeBackground:Colors.background}]}>
          <Text style={[styles.noText,{color:isDark?Colors.darkModeText:Colors.assestGray}]}>No Apartments</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card,{backgroundColor:isDark?Colors.darkModePrimary:Colors.assestWhite}]}>
              <Image source={{ uri: item.image[0] }} style={styles.image} />
              <Text style={[styles.title,{color:isDark?Colors.darkModeText:Colors.text}]}>Unit Number: {item.unit_number}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Price: {item.rent}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Location: {item.location}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Bedrooms: {item.num_bedrooms}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Features: {item.features}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Floor: {item.floor}</Text>
              <Text style={[styles.text,{color:isDark?Colors.darkModeText:Colors.text}]}>Nearby: {item.nearby}</Text>
              <Pressable
                onPress={() => {
                  setSelectedApartment(item);
                  setModalVisible(true);
                }}
                style={[styles.button,{backgroundColor:isDark?Colors.darkModeSecondary:Colors.assestGreenTwo}]}
              >
                <Text style={{ color: "#fff" }}>Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item.id)}
                style={[styles.button, { backgroundColor: "red" }]}
              >
                <Text style={{ color: "#fff" }}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}
      {selectedApartment && (
        <EditApartmentModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          apartment={selectedApartment}
          onSave={() => {
            setModalVisible(false);
            fetchApartments();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  noApartments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noText: {
    fontSize: 20,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: "#2c3e50",
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
});
