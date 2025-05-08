
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { get, set } from "lodash";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/components/colors";


export default function amount() {

    const [totalAmount, setTotalAmount] = useState<Number>(0);
    const [payPal , setPayPal] = useState<Number>(0);
    const [creditCard , setCreditCard] = useState<Number>(0);
    const [cash, setCash] = useState<Number>(0);
    const [bank ,setBank] = useState<Number>(0);
    const getTotalAmount = async() => {
        const amountRef =collection(db ,"rented")
        const snap = await getDocs(amountRef);
        let total = 0;
        let c=0 ,p=0,d=0,b=0;
        snap.forEach((doc) => {
            const data = doc.data();
            const paymentMethod = get(data, "paymentMethod");
            const rent = Number(get(data, "rent"));
            total += rent;
            if (paymentMethod === "PayPal") {
                p+=rent;
            } else if (paymentMethod === "Credit Card") {
                c+=rent
            } else if (paymentMethod === "Cash on Delivery") {
                d+=rent
            } else if (paymentMethod === "Bank Transfer") {
                b+=rent
            }
        })
        setTotalAmount(total);
        setPayPal(p);
        setCreditCard(c);
        setCash(d);
        setBank(b);
        

    }
    useEffect(() => {
        getTotalAmount();
    }, []);

    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.totalText}>${totalAmount?.toString()}</Text>
            <Text style={styles.subText}>Total Earnings</Text>
        </View>

        <View style={styles.grid}>
            <View style={styles.card}>
            <Text style={styles.cardLabel}>PayPal</Text>
            <Text style={styles.cardAmount}>${payPal?.toString()}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.cardLabel}>Credit Card</Text>
            <Text style={styles.cardAmount}>${creditCard?.toString()}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.cardLabel}>Cash on Delivery</Text>
            <Text style={styles.cardAmount}>${cash?.toString()}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.cardLabel}>Bank Transfer</Text>
            <Text style={styles.cardAmount}>${bank?.toString()}</Text>
            </View>
        </View>
    </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor:Colors.background,
        alignItems: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    totalText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginTop: 10,
    },
    subText: {
        fontSize: 16,
        color: "#555",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20,
    },
    card: {
        width: 150,
        height: 120,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        margin: 10,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    cardLabel: {
        marginTop: 10,
        fontSize: 14,
        color: "#333",
    },
    cardAmount: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
  
    

})