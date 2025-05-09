import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { useThemes } from '@/components/themeContext';
import Colors from '@/components/colors';

export default function EditProfile() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const auth = getAuth();

    const { theme } = useThemes();
    const isDark = theme === 'dark';

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem("userData");
                if (storedUserData) {
                    const userData = JSON.parse(storedUserData);
                    setName(userData.name || "");
                    setPhone(userData.phone || "");
                    setEmail(userData.email || "");
                }
            } catch (error) {
                console.log("Failed to load user data:", error);
            }
        };

        getUserDetails();
    }, []);

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
        if (!auth.currentUser) {
            Alert.alert("Not Logged In", "Please log in to update your profile.");
            return;
        }

        if (!validateInputs()) return;

        try {
            setLoading(true);
            const userDocRef = doc(db, "Users", auth.currentUser.uid);
            await updateDoc(userDocRef, { name, phone, email });

            await AsyncStorage.setItem("userData", JSON.stringify({ name, phone, email }));
            Alert.alert("Success", "Profile updated successfully!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/profile"),
                },
            ]);
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
            <Text style={[styles.label, { color: isDark ? Colors.darkModeText : "#555" }]}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Text style={[styles.label, , { color: isDark ? Colors.darkModeText : "#555" }]}>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
            <Text style={[styles.label, , { color: isDark ? Colors.darkModeText : "#555" }]}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <Pressable onPress={handleUpdate} style={[styles.button, { backgroundColor: isDark ? Colors.darkModeSecondary : Colors.primary }]}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.indicator} />
                ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                )}
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
