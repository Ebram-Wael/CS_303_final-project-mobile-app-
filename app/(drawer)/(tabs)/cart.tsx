import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "@/components/colors";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/services/firebase";
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

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [seller_id, setSellerId] = useState("");
  const [apartmentid, setApartmentId] = useState("");
  const [price, setPrice] = useState(0);
  const auth =getAuth();
  const user =auth.currentUser;

  useEffect(()=>{
    const fetch = async () => {
      try {
       const cartRef =collection(db ,'cart')
       const q =query(cartRef ,where ('user_id' ,'==' ,user.uid))
       const querySnapshot =await getDocs(q)
       const items : CartItem []=[];
       querySnapshot.forEach((item)=>{
        items.push({id :item.id ,... item.data()} as CartItem)
       })
       setCartItems(items);
      } catch (err) {
        console.error('error fetching');
      }
    }
    fetch();
  } ,[user])
  const handleRemoveItem =async (id)=>{
    try{
      const cartRef =collection(db,'cart');
      const q =query(cartRef ,where('id' ,'==' ,id))
      const querySnapshot =await getDocs(q);
      const newCart = cartItems.filter(item => item.id !== id); 
      setCartItems(newCart);

      querySnapshot.forEach(async (item)=>{
        await deleteDoc(doc(db ,'cart' ,item.id));
      })
      
    console.log("item removed from cart")

    }
    catch{
      console.log('error to remove item from cart')
    }
    
  }

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
    router.push({
      pathname: '../../screens/form',
      params: {
        apartmentid: apartmentid,
        price: price,
        seller_id: seller_id,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
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

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContainer: { padding: 10, paddingBottom: 120 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 18, color: "#999" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 4,
  },
  image: { width: 90, height: 90, borderRadius: 6, marginRight: 12 },
  details: { flex: 1 },
  location: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "600", color: Colors.assestGreen, marginBottom: 4 },
  trashButton: { padding: 8 },
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
  checkoutButton: {
    backgroundColor: Colors.assestGreen,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
