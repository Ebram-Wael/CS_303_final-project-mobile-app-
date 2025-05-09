import { Pressable } from "react-native";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "@/components/colors";
export default function FloatingMenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      style={{
        position: "relative",
        top: "3%",
        left: "6%",
        backgroundColor: "transparent",
        width: 33,
        height: 33,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
      }}
      onPress={() => navigation.dispatch({ type: "OPEN_DRAWER" })}
    >
      <Icon name="bars" size={25} color={Colors.whiteText} />
    </Pressable>
  );
}
