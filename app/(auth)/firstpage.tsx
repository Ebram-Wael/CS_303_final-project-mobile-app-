import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import logo from "../../assets/images/homeStudent.jpg";
import Colors from '@/components/colors';

const Firstpage = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <View style={styles.cont}>
      <Image style={styles.img} source={logo} />
      <View>
        <Text style={styles.title}>Welcome To Homy</Text>
      </View>
      <Text style={styles.txt}>Easily Find the Home That Fits You</Text>
      <View style={{ height: 300 }}>
        <Pressable
          style={styles.btn}
          onPress={() => router.replace("/login")}
        >
          <Text style={{ color: "white" }}>Login</Text>
        </Pressable>
        <Pressable
          style={styles.btnRegister}
          onPress={() => router.replace("/register")}
        >
          <Text style={{ color: "white" }}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 500,
  },
  cont: {
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  btn: {
    display: "flex",
    backgroundColor: Colors.secondary,
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    marginTop: -70,
  },
  txt: {
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  btnRegister: {
    display: "flex",
    backgroundColor: Colors.primary,
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default Firstpage;
