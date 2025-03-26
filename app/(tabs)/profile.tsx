import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    getUserDetails();
    getUser();
  }, []);

  const getUser = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
          setName(userDoc.data().name);
          setPhone(userDoc.data().phone);
          setEmail(userDoc.data().email);
          setLoading(false);
        }
      }
    });
  };

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return false;
    }
    if (!phone.match(/^\d{11}$/)) {
      Alert.alert("Validation Error", "Phone number must be 11 digits.");
      return false;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      Alert.alert("Validation Error", "Invalid email format.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!userDetails || !validateInputs()) return;
    try {
      const userDocRef = doc(db, "Users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name,
        phone,
        email,
      });
      Alert.alert("Success", "Profile updated successfully!");
      setUserDetails({ ...userDetails, name, phone, email });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text style={styles.role}>{userDetails?.role}</Text>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={editing}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={editing}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            keyboardType="phone-pad"
          />

          {editing ? (
            <Pressable style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.button1} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  role: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  label: {
    width: 300,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  button1: {
    backgroundColor: "rgb(8 50 106)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
