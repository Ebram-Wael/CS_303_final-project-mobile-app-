import Colors from "@/components/colors";
import { db } from "@/services/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect ,useState } from "react";
import { View, Text, StyleSheet, Pressable ,FlatList ,Image } from "react-native";


export default function ApproveApart() {
    const [pendingApart, setPendingApart] = useState([]);

    useEffect(() => {
        const fetchPending = async () => {
            const orders = await getPendingAPart();
            setPendingApart(orders);
            console.log(orders);
        };
        fetchPending();
    }, []);

    const getPendingAPart = async () => {
        try {
            const apartmentRef = collection(db, "Apartments");
            const q = query(apartmentRef, where("status", "==", "pending"));
            const querySnapshot = await getDocs(q);
            const pending = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                pending.push({ id: doc.id, ...data });

            });
            return pending;
        } catch (error) {
            console.error("Error fetching pending orders: ", error);
            return [];
        }
    };

    const approve = async (id) => {
        try {
            const apartmentRef = doc(db, "Apartments", id);
            await updateDoc(apartmentRef, { status: "approved" });
            setPendingApart((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error approving apartment: ", error);
        }
    };

    return (
        <View style={styles.container}>
            {pendingApart.length === 0 && (
                <View >
                    <Text style={styles.text}>No pending apartments</Text>
                </View>
            )}
            <FlatList
                data={pendingApart}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image[0] }} style={styles.image} />
                        <Text style={styles.text}>Unit Number: {item.unit_number}</Text>
                        <Text style={styles.text}>Price: {item.rent}</Text>
                        <Text style={styles.text}>Location: {item.location}</Text>
                        <Text style={styles.text}>Number of Bedrooms: {item.num_bedrooms}</Text>
                        <Text style={styles.text}>Features: {item.features}</Text>
                        <Text style={styles.text}>Floor: {item.floor}</Text>
                        <Text style={styles.text}>Nearby: {item.nearby}</Text>
                        <Pressable onPress={() => approve(item.id)} style={styles.button}>
                            <Text style={styles.buttonText}>Approve</Text>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        
    },
    image: {
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    text: {
        fontSize: 24,
        color: Colors.assestGreen,
        marginBottom: 5,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});