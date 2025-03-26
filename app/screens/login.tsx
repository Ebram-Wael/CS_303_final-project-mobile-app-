import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [borderColor, setBorderColor] = useState("#26326E");
  const [borderColor1, setBorderColor1] = useState("#26326E");
  const [showPassword, setShowPassword] = useState(true);
  const [load, setLoad] = useState(false);

  const ChangePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogIN = async (e) => {
    e.preventDefault();
    if (load) return;
    setLoad(true);
    try {
      const cardinality = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = cardinality.user;
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );
      setTimeout(() => router.push("/(tabs)/explore"), 2000);
      setLoad(false);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Invalid Password or email");
      } else if (error.code === "auth/missing-password") {
        Alert.alert("password is required");
      } else Alert.alert("email is required");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login Here</Text>
      <View style={styles.txt}>
        <Text style={{ color: "#26326E" }}>
          Welcome Back You've Been Missed!
        </Text>
      </View>
      <View>
        <TextInput
          onFocus={() => setBorderColor("#F36F27")}
          onBlur={() => setBorderColor("#26326E")}
          style={[styles.input, { borderColor }]}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <View style={[styles.inputContainer, { borderColor: borderColor1 }]}>
          <TextInput
            onFocus={() => setBorderColor1("#F36F27")}
            onBlur={() => setBorderColor1("#26326E")}
            style={[styles.inputField]}
            secureTextEntry={showPassword}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            onPress={ChangePassword}
          />
        </View>
      </View>
      <Pressable style={styles.btn} onPress={handleLogIN}>
        {load ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontSize: 18 }}>Sign In</Text>
        )}
      </Pressable>

      <View style={styles.join}>
        <Text> Create an Account?</Text>
        <Pressable onPress={() => router.push("/screens/register")}>
          <Text style={{ color: "#2A2438", textDecorationLine: "underline" }}>
            {" "}
            Sign Up{" "}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
    borderColor: "#FFFE91",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#F36F27",
  },
  txt: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 40,
    fontSize: 13,
  },
  btn: {
    backgroundColor: "#F36F27",
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    alignSelf: "center",
  },
  join: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputField: {
    flex: 1,
    height: "100%",
  },
});

export default Login;
