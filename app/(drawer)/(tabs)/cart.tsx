import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "@/components/colors";
interface CartItem {
  id: string;
  image: string;
  rent: number;
  location: string;
  features?: string;
  floor?: string;
  unit_number?: string;
  num_bedrooms?: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await AsyncStorage.getItem("cart");
        if (cart) {
          const parsedCart = JSON.parse(cart);
          
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart", error);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveItem = async (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          setCartItems([]);
          await AsyncStorage.removeItem("cart");
        },
      },
    ]);
  };

  const handleCheckout = () => {
    Alert.alert("Proceed to Checkout", "Navigating to payment screen...");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={{
                  uri: item.image ,
                }}
                style={styles.image}
              />
              <View style={styles.details}>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.price}>{item.rent} EGP</Text>
                {item.floor && <Text>Floor: {item.floor}</Text>}
                {item.unit_number && <Text>Unit: {item.unit_number}</Text>}
                {item.num_bedrooms !== undefined && (
                  <Text>Bedrooms: {item.num_bedrooms}</Text>
                )}
                {item.features && <Text>Features: {item.features}</Text>}
              </View>
              <Pressable
                style={styles.trashButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Icon name="trash" size={25} color="black" />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 120, 
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,fontSize: 18,
    color: "#999",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  location: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.assestGreen,
    marginBottom: 4,
  },
  trashButton: {
    padding: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  clearButton: {
    backgroundColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: Colors.assestGreen,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});