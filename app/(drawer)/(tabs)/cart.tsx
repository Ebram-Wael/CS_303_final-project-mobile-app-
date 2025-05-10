import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "@/components/colors";
import { router, useRouter } from "expo-router";
import { db } from "@/services/firebase";
import { useThemes } from "@/components/themeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface CartItem {
  id: string;
  image: string;
  rent: number;
  location: string;
  features?: string;
  floor?: string;
  unit_number?: string;
  num_bedrooms?: number;
  seller_id: string;
}

const windowWidth = Dimensions.get("window").width;

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { theme } = useThemes();
  const isDark = theme === "dark";
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetch = async () => {
      try {
        const cartRef = collection(db, "cart");
        const q = query(cartRef, where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const items: CartItem[] = [];
        querySnapshot.forEach((item) => {
          items.push({ id: item.id, ...item.data() } as CartItem);
        });
        setCartItems(items);
      } catch (err) {
        console.error("error fetching");
      }
    };
    fetch();
  }, [user]);

  const handleRemoveItem = async (id) => {
    try {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const newCart = cartItems.filter((item) => item.id !== id);
      setCartItems(newCart);

      querySnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "cart", item.id));
      });

      console.log("item removed from cart");
    } catch {
      console.log("error to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("cart");
            setCartItems([]);
          } catch (error) {
            console.error("Error clearing cart", error);
            Alert.alert("Error", "Failed to clear cart");
          }
        },
      },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Cart Empty",
        "Please add items to your cart before checking out"
      );
      return;
    }

    router.push({
      pathname: "../../screens/form",
      params: {
        apartmentid: cartItems[0]?.id || "",
        price: cartItems[0]?.rent || 0,
        seller_id: cartItems[0]?.seller_id || "",
      },
    });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.rent) || 0),
    0
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.darkModeBackground : "#f5f5f5" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? Colors.darkModeText : Colors.text },
          ]}
        >
          My Cart
        </Text>
        {cartItems.length > 0 && (
          <Pressable style={styles.clearButton} onPress={handleClearCart}>
            <Text
              style={[
                styles.clearButtonText,
                { color: isDark ? Colors.assestGreenTwo : Colors.assestGreen },
              ]}
            >
              Clear All
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Icon
              name="shopping-cart"
              size={50}
              color={isDark ? "#555" : "#999"}
            />
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? Colors.darkModeText : "#777" },
              ]}
            >
              Your cart is empty
            </Text>
            <Pressable
              style={[
                styles.browseButton,
                {
                  backgroundColor: isDark
                    ? Colors.darkModeSecondary
                    : Colors.assestGreen,
                },
              ]}
              onPress={() =>
                router.push({ pathname: "/(drawer)/(tabs)/explore" })
              }
            >
              <Text
                style={[
                  styles.browseButtonText,
                  isDark ? { color: Colors.darkModeText } : { color: "#fff" },
                ]}
              >
                Browse Properties
              </Text>
            </Pressable>
          </View>
        ) : (
          cartItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? Colors.darkModePrimary : "#fff",
                  shadowColor: isDark ? "#000" : "#000",
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text
                  style={[
                    styles.location,
                    { color: isDark ? Colors.darkModeText : "#222" },
                  ]}
                  numberOfLines={1}
                >
                  {item.location}
                </Text>
                <Text
                  style={[
                    styles.price,
                    {
                      color: isDark
                        ? Colors.assestGreenThree
                        : Colors.assestGreen,
                    },
                  ]}
                >
                  {item.rent} EGP
                </Text>
                <View style={styles.infoContainer}>
                  {item.num_bedrooms !== undefined && (
                    <View style={styles.infoItem}>
                      <Icon
                        name="bed"
                        size={14}
                        color={
                          isDark ? Colors.darkModeText : Colors.darkModeText
                        }
                      />
                      <Text
                        style={[
                          styles.infoText,
                          {
                            color: isDark
                              ? Colors.darkModeText
                              : Colors.darkModeText,
                          },
                        ]}
                      >
                        {item.num_bedrooms}
                      </Text>
                    </View>
                  )}
                  {item.floor && (
                    <View style={styles.infoItem}>
                      <Icon
                        name="building"
                        size={14}
                        color={
                          isDark ? Colors.darkModeText : Colors.darkModeText
                        }
                      />
                      <Text
                        style={[
                          styles.infoText,
                          {
                            color: isDark
                              ? Colors.darkModeText
                              : Colors.darkModeText,
                          },
                        ]}
                      >
                        Floor {item.floor}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Pressable
                style={[
                  styles.trashButton,
                  {
                    backgroundColor: isDark ? "#393939" : "#fce4e4",
                  },
                ]}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Icon
                  name="trash"
                  size={20}
                  color={isDark ? "#e74c3c" : "#c0392b"}
                />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDark ? Colors.darkModeBackground : "#fff",
              borderTopColor: isDark ? "#333" : "#ddd",
            },
          ]}
        >
          <View style={styles.summaryContainer}>
            <Text
              style={[
                styles.summaryText,
                { color: isDark ? Colors.darkModeText : Colors.text },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                styles.totalPrice,
                {
                  color: isDark ? Colors.assestGreenThree : Colors.assestGreen,
                },
              ]}
            >
              {totalPrice} EGP
            </Text>
          </View>

          <Pressable
            style={[
              styles.checkoutButton,
              {
                backgroundColor: isDark
                  ? Colors.darkModeSecondary
                  : Colors.assestGreen,
              },
            ]}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  browseButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.assestGreenTwo,
  },
  browseButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 14,
  },
  details: {
    flex: 1,
    paddingRight: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  trashButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    // justifyContent: 'space-around',
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    paddingLeft: 30,
  },
  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
