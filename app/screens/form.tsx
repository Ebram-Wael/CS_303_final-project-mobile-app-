import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  query,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";
import { useThemes } from "@/components/themeContext";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";

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

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

  const { theme } = useThemes();
  const isDark = theme === "dark";

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

    if (paymentMethod === "Credit Card" && (!cardNumber || !cvv)) {
      return Alert.alert("⚠️ Error", "Please enter card details.");
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "rented"), {
        sellerid: sellerid,
        buyerid: user?.uid,
        apartmentid: apartmentid,
        rent: rent,
        semester: semester,
        startDate: startDate,
        endDate: endDate,
        name: name,
        address: address,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod,
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

      Alert.alert("Success", "Purchase completed successfully!");
      router.push({
        pathname: "/screens/LeaseAgreementScreen",

        params: {
          sellerid: sellerid,
          name: name,
          apartmentid: apartmentid,
          totalPrice: rent,
          semester: semester,
          startDate: startDate,
          endDate: endDate,
          paymentMethod: paymentMethod,
        },
      });
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    "Credit Card",
    "PayPal",
    "Cash on Delivery",
    "Bank Transfer",
  ];
  const semesterOptions = ["First Semester", "Second Semester"];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.darkModeBackground
            : Colors.background,
        },
      ]}
    >
      <Text
        style={[styles.title, { color: isDark ? Colors.darkModeText : "#333" }]}
      >
        🛒 Checkout
      </Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
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
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? Colors.darkModeText : "#555" },
        ]}
      >
        Select Semester
      </Text>
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
        <View>
          <Text style={styles.label}>Start Date</Text>{" "}
          <Pressable
            style={styles.dateInputContainer}
            onPress={() => setShowStartDateCalendar(!showStartDateCalendar)}
          >
            {" "}
            <TextInput
              style={styles.dateInput}
              placeholder="Select Start Date"
              value={startDate}
              editable={false}
            />{" "}
            <Icon
              name="calendar"
              size={20}
              color="#5E5E5E"
              style={styles.calendarIcon}
            />{" "}
          </Pressable>{" "}
          {showStartDateCalendar && (
            <Calendar
              onDayPress={(day) => {
                setStartDate(day.dateString);

                setShowStartDateCalendar(false);
              }}
              markedDates={{
                [startDate]: { selected: true, disableTouchEvent: true },
              }}
            />
          )}
          <Text style={styles.label}>End Date</Text>{" "}
          <Pressable
            style={styles.dateInputContainer}
            onPress={() => setShowEndDateCalendar(!showEndDateCalendar)}
          >
            {" "}
            <TextInput
              style={styles.dateInput}
              placeholder="Select End Date"
              value={endDate}
              editable={false}
            />{" "}
            <Icon
              name="calendar"
              size={20}
              color="#5E5E5E"
              style={styles.calendarIcon}
            />{" "}
          </Pressable>{" "}
          {showEndDateCalendar && (
            <Calendar
              onDayPress={(day) => {
                setEndDate(day.dateString);
                setShowEndDateCalendar(false);
              }}
              markedDates={{
                [endDate]: { selected: true, disableTouchEvent: true },
              }}
            />
          )}{" "}
        </View>
      )}
      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? Colors.darkModeText : "#555" },
        ]}
      >
        Select Payment Method
      </Text>
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
            onChangeText={setCardNumber}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="CVV"
            style={[styles.input, styles.cardInput]}
            value={cvv}
            onChangeText={setCvv}
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
        <Pressable
          style={[
            styles.confirmButton,
            { backgroundColor: isDark ? Colors.darkModeSecondary : "#333" },
          ]}
          onPress={handlePurchase}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
  },
  picker: {
    // height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: Colors.assestGreen,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  dateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
  },
  calendarIcon: {
    marginLeft: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInput: {
    width: "49%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
});

export default PurchaseForm;
