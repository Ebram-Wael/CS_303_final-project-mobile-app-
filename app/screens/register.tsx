import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../services/firebase";
import { db } from "../../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { RadioButton } from "react-native-paper";

const Rgister = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errorName, setErrorName] = useState("");
  const [errorLast, setErrorLast] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorEm, setErrorEm] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [borderColor, setBorderColor] = useState("#999999");
  const [borderColor1, setBorderColor1] = useState("#999999");
  const [borderColor2, setBorderColor2] = useState("#999999");
  const [borderColor3, setBorderColor3] = useState("#999999");
  const [borderColor4, setBorderColor4] = useState("#999999");
  const [borderColor5, setBorderColor5] = useState("#999999");

  const [selectRole, setSelectRole] = useState("buyer");

  const validateInputs = () => {
    let isValid = true;

    setErrorName("");
    setErrorLast("");
    setErrorEm("");
    setErrorPhone("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    if (!name) {
      setErrorName("First name is required");
      isValid = false;
    }
    if (!last) {
      setErrorLast("Last name is required");
      isValid = false;
    }
    if (!email) {
      setErrorEm("Email is required");
      isValid = false;
    }
    if (!phone) {
      setErrorPhone("Phone number is required");
      isValid = false;
    } else if (phone.length < 11) {
      setErrorPhone("Please enter a valid phone number");
      isValid = false;
    }
    if (!password) {
      setErrorPassword("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setErrorPassword("Password must be at least 8 characters");
      isValid = false;
    }
    if (!confirmPassword) {
      setErrorConfirmPassword("Confirm password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    Keyboard.dismiss();
    if (!validateInputs()) {
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: `${name} ${last}`,
          phone: phone,
          role: selectRole,
        });
        Alert.alert("Your account has been created");
        setTimeout(() => router.push("/(tabs)/profile"), 2000);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setTimeout(() => router.push("/screens/login"), 2000);
        Alert.alert("you already have an account");
      } else {
        Alert.alert("The email address you entered is incorrect, try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Create Account</Text>
        <View style={styles.txt}>
          <Text>Create an Account So You Can Explore Our Apartment </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 100 }}>
          <View style={styles.select}>
            <RadioButton.Android
              value="buyer"
              status={selectRole === "buyer" ? "checked" : "unchecked"}
              onPress={() => setSelectRole("buyer")}
              style={{ flex: 0.5 }}
            />
            <Text style={styles.label}> I'm Buyer</Text>
          </View>

          <View style={styles.select}>
            <RadioButton.Android
              value="seller"
              status={selectRole === "seller" ? "checked" : "unchecked"}
              onPress={() => setSelectRole("seller")}
            />
            <Text style={styles.label}>I'm Seller</Text>
          </View>
        </View>
        <View>
          <TextInput
            onFocus={() => setBorderColor("#5C5470")}
            onBlur={() => setBorderColor("#999999")}
            style={[styles.input, { borderColor }]}
            placeholder="First Name"
            onChangeText={(text) => {
              setName(text);
            }}
          />
          {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}
          <TextInput
            onFocus={() => setBorderColor1("#5C5470")}
            onBlur={() => setBorderColor1("#999999")}
            style={[styles.input, { borderColor: borderColor1 }]}
            placeholder="Last Name"
            onChangeText={(text) => {
              setLast(text);
            }}
          />
          {errorLast ? <Text style={styles.errorText}>{errorLast}</Text> : null}

          <TextInput
            onFocus={() => setBorderColor5("#5C5470")}
            onBlur={() => setBorderColor5("#999999")}
            style={[styles.input, { borderColor: borderColor5 }]}
            placeholder="phone"
            onChangeText={(text) => {
              setPhone(text);
            }}
            keyboardType="numeric"
          />
          {errorPhone ? (
            <Text style={styles.errorText}>{errorPhone}</Text>
          ) : null}

          <TextInput
            onFocus={() => setBorderColor2("#5C5470")}
            onBlur={() => setBorderColor2("#999999")}
            style={[styles.input, { borderColor: borderColor2 }]}
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          {errorEm ? <Text style={styles.errorText}>{errorEm}</Text> : null}

          <TextInput
            onFocus={() => setBorderColor3("#5C5470")}
            onBlur={() => setBorderColor3("#999999")}
            style={[styles.input, { borderColor: borderColor3 }]}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          {errorPassword ? (
            <Text style={styles.errorText}>{errorPassword}</Text>
          ) : null}

          <TextInput
            onFocus={() => setBorderColor4("#5C5470")}
            onBlur={() => setBorderColor4("#999999")}
            style={[styles.input, { borderColor: borderColor4 }]}
            secureTextEntry={true}
            placeholder="Confirm Password"
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
          {errorConfirmPassword ? (
            <Text style={styles.errorText}>{errorConfirmPassword}</Text>
          ) : null}
        </View>

        <Pressable style={styles.btn} onPress={handleSignup}>
          <Text style={{ color: "white", fontSize: 18 }}> Sign Up</Text>
        </Pressable>

        <View style={styles.join}>
          <Text> Already Have an Account?</Text>
          <Pressable onPress={() => router.push("/screens/login")}>
            <Text style={{ color: "#2A2438", textDecorationLine: "underline" }}>
              {" "}
              Sign In{" "}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "white",
    width: 320,
    borderRadius: 5,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    fontSize: 13,
  },
  screen: {
    display: "none",
    width: 300,
    height: 300,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    position: "absolute",
    bottom: 20,

    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginLeft: 12,
    marginBottom: 5,
  },
  label: {
    color: "#2A2438",
    fontSize: 16,
    marginLeft: 5,
  },
  select: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlignVertical: "center",
  },
  join: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default Rgister;
