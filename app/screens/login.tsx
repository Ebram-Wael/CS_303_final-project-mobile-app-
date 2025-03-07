import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [borderColor, setBorderColor] = useState("#999999");
  const [borderColor1, setBorderColor1] = useState("#999999");

  const handleSignIN = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("you have signed in");
      setTimeout(() => router.push("/(tabs)/explore"), 2000);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login Here</Text>
      <View style={styles.txt}>
        <Text>Welcome Back You've Been Missed!</Text>
      </View>
      <View>
        <TextInput
          onFocus={() => setBorderColor("#5C5470")}
          onBlur={() => setBorderColor("#999999")}
          style={[styles.input, { borderColor }]}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          onFocus={() => setBorderColor1("#5C5470")}
          onBlur={() => setBorderColor1("#999999")}
          style={[styles.input, { borderColor: borderColor1 }]}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Pressable style={styles.btn} onPress={handleSignIN}>
        <Text style={{ color: "white", fontSize: 18 }}>Sign In Now</Text>
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
    </View>
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
    color: "#2A2438",
  },
  txt: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 40,
    fontSize: 13,
  },
  btn: {
    backgroundColor: "#5C5470",
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
});

export default Login;
