import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Colors from "@/components/colors";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

const PurchaseForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [semester, setSemester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const search = useLocalSearchParams();
  const apartmentid = search?.apartmentid;
  const rent = search?.price;
  const sellerid = search?.seller_id;

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePurchase = async () => {
    if (
      !name ||
      !address ||
      !phoneNumber ||
      !paymentMethod ||
      !semester ||
      !startDate ||
      !endDate
    ) {
      return Alert.alert("⚠️ Error", "Please fill all the fields.");
    }

   if (!/^\d{11}$/.test(phoneNumber)) {
  return Alert.alert("⚠️ Error", "Phone number must be exactly 11 digits.");
}


    if (/\d/.test(name)) {
      return Alert.alert("⚠️ Error", "Name should not contain numbers.");
    }

    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return Alert.alert("⚠️ Error", "Dates must be in the format DD/MM/YYYY.");
    }

    if (paymentMethod === "Credit Card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        return Alert.alert("⚠️ Error", "Card number must be 16 digits.");
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        return Alert.alert("⚠️ Error", "CVV must be 3 or 4 digits.");
      }
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "rented"), {
        sellerid,
        buyerid: user?.uid,
        apartmentid,
        rent,
        semester,
        startDate,
        endDate,
        name,
        address,
        phoneNumber,
        paymentMethod,
      });

      if (typeof apartmentid === "string") {
        const apartdocRef = doc(db, "Apartments", apartmentid);
        await updateDoc(apartdocRef, { availability_status: "rented" });
      }

      const q = query(
        collection(db, "cart"),
        where("id", "==", apartmentid),
        where("user_id", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "cart", item.id));
      });

      Alert.alert("✅ Success", "Purchase completed successfully!");
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("❌ Error", "Something went wrong during the purchase.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = ["Credit Card", "PayPal", "Cash on Delivery", "Bank Transfer"];
  const semesterOptions = ["First Semester", "Second Semester"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛒 Checkout</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          const clean = text.replace(/[0-9]/g, "");
          setName(clean);
        }}
      />
      <TextInput
        placeholder="Shipping Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => {
          const digitsOnly = text.replace(/[^0-9]/g, "");
          setPhoneNumber(digitsOnly);
        }}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Select Semester</Text>
      <Picker
        selectedValue={semester}
        onValueChange={(itemValue) => setSemester(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select semester" value="" />
        {semesterOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      {semester !== "" && (
        <View style={styles.dateContainer}>
          <TextInput
            placeholder="Start Date (e.g. 2/5/2025)"
            style={[styles.input, styles.dateInput]}
            value={startDate}
            onChangeText={(text) => {
              const formatted = text.replace(/[^0-9/]/g, "");
              setStartDate(formatted);
            }}
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            placeholder="End Date (e.g. 30/6/2025)"
            style={[styles.input, styles.dateInput]}
            value={endDate}
            onChangeText={(text) => {
              const formatted = text.replace(/[^0-9/]/g, "");
              setEndDate(formatted);
            }}
            keyboardType="numbers-and-punctuation"
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select payment method" value="" />
        {paymentMethods.map((method) => (
          <Picker.Item key={method} label={method} value={method} />
        ))}
      </Picker>

      {paymentMethod === "Credit Card" && (
        <View style={styles.cardContainer}>
          <TextInput
            placeholder="Card Number"
            style={[styles.input, styles.cardInput]}
            value={cardNumber}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/[^0-9]/g, "");
              setCardNumber(digitsOnly);
            }}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="CVV"
            style={[styles.input, styles.cardInput]}
            value={cvv}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/[^0-9]/g, "");
              setCvv(digitsOnly);
            }}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <Pressable style={styles.confirmButton} onPress={handlePurchase}>
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default PurchaseForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 4,
    marginBottom: 16,
    fontSize: 14,
    borderWidth: 0,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginVertical: 12,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#4DA674",
    paddingVertical: 13,
    borderRadius: 4,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    width: "49%",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInput: {
    width: "49%",
  },
});