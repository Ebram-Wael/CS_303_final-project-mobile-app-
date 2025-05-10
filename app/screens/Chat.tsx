import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Keyboard,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import Colors from "@/components/colors";
import { useLocalSearchParams } from "expo-router";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [uploading, setUploading] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { sid, houseid, userid } = useLocalSearchParams();

 
  const getRole = async () => {
    if (user) {
      try {
        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setIsSeller(snap.data().role === "seller");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        Alert.alert("Error", "Failed to fetch user role");
      }
    }
  };

  useEffect(() => {
    getRole();
  }, [user]);

 
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!sid) return;

      try {
        const sellerRef = doc(db, "Users", sid as string);
        const docSnap = await getDoc(sellerRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSellerName(data.name || "Seller");
        } else {
          console.warn("Seller document does not exist.");
          setSellerName("Seller");
        }
      } catch (error) {
        console.error("Error fetching seller info:", error);
        Alert.alert("Error", "Failed to load seller information");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [sid]);

 
  useEffect(() => {
    if (!houseid || !sid || !user?.uid) return;

    const chatQuery = query(
      collection(db, "chats"),
      where("houseid", "==", houseid),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      chatQuery,
      (querySnapshot) => {
        const messagesList: any[] = [];
        querySnapshot.forEach((doc) => {
          messagesList.push({ id: doc.id, ...doc.data() });
        });

      
        const localMessages = messages.filter((msg) => msg.local);
        const serverMessages = messagesList.filter(
          (msg) => !localMessages.some((local) => local.id === msg.id)
        );

        const combinedMessages = [...localMessages, ...serverMessages]
          .sort((a, b) => {
            const dateA = a.timestamp?.toDate?.() || a.timestamp;
            const dateB = b.timestamp?.toDate?.() || b.timestamp;
            return dateA - dateB;
          });

        setMessages(combinedMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        Alert.alert("Error", "Failed to load messages");
      }
    );

    return () => unsubscribe();
  }, [houseid, sid, user?.uid]);


  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!user?.uid || !houseid || !sid) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    const trimmedMessage = messageText.trim();
    const receiverId = isSeller ? userid : sid;

    const tempId = `msg-${Date.now()}`;
    const localMessage = {
      id: tempId,
      houseid,
      sellerId: sid,
      participants: [user.uid, receiverId],
      sellerName,
      message: trimmedMessage,
      imageUri: null,
      timestamp: new Date(),
      local: true,
      senderId: user.uid,
      receiverId,
      status: "sending",
    };

    setMessages((prev) => [...prev, localMessage]);
    setMessageText("");
    Keyboard.dismiss();

    try {
      const docRef = await addDoc(collection(db, "chats"), {
        houseid,
        sellerId: sid,
        participants: [user.uid, receiverId],
        sellerName,
        message: trimmedMessage,
        imageUri: null,
        timestamp: serverTimestamp(),
        senderId: user.uid,
        receiverId,
        status: "delivered",
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, id: docRef.id, local: false, status: "delivered" }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
      Alert.alert("Error", "Failed to send message");
    }
  };


  const handlePickImage = async () => {
    let tempId = '';
    
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos to send images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      const imageUri = result.assets[0].uri;
      tempId = `img-${Date.now()}`;
      const receiverId = isSeller ? userid : sid;

      const localImageMessage = {
        id: tempId,
        houseid,
        sellerId: sid,
        participants: [user?.uid, receiverId],
        sellerName,
        senderId: user?.uid,
        message: "",
        imageUri,
        timestamp: new Date(),
        local: true,
        status: "uploading",
      };

      setMessages((prev) => [...prev, localImageMessage]);

      const docRef = await addDoc(collection(db, "chats"), {
        houseid,
        sellerId: sid,
        participants: [user?.uid, receiverId],
        sellerName,
        senderId: user?.uid,
        message: "",
        imageUri,
        timestamp: serverTimestamp(),
        status: "delivered",
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, id: docRef.id, local: false, status: "delivered" }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending image:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
      Alert.alert("Error", "Failed to send image");
    } finally {
      setUploading(false);
    }
  };

 
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    
    const messageDate = timestamp?.toDate 
      ? timestamp.toDate() 
      : new Date(timestamp);
    
    if (isNaN(messageDate.getTime())) return "";

    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const renderMessageStatus = (status: string) => {
    switch (status) {
      case "sending":
      case "uploading":
        return <ActivityIndicator size="small" color={Colors.whiteText} />;
      case "failed":
        return <Text style={styles.errorText}>!</Text>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.assest} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isMyMessage = item.senderId === user?.uid;
            const messageTime = formatTimestamp(item.timestamp);

            return (
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage
                    ? styles.myMessage
                    : styles.otherMessage,
                ]}
              >
                {item.message ? (
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: isMyMessage
                          ? Colors.whiteText
                          : Colors.assest,
                      },
                    ]}
                  >
                    {item.message}
                  </Text>
                ) : null}

                {item.imageUri ? (
                  <Image
                    source={{ uri: item.imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : null}

                <View style={styles.messageFooter}>
                  {messageTime && (
                    <Text
                      style={[
                        styles.timestamp,
                        {
                          color: isMyMessage
                            ? Colors.whiteText
                            : Colors.assestGray,
                        },
                      ]}
                    >
                      {messageTime}
                    </Text>
                  )}
                  {isMyMessage && renderMessageStatus(item.status)}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <Pressable
            onPress={handlePickImage}
            style={styles.mediaButton}
            disabled={uploading}
            android_ripple={{ color: Colors.assest}}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={Colors.whiteText} />
            ) : (
              <Text style={styles.mediaButtonText}>📎</Text>
            )}
          </Pressable>

          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Write a message..."
            placeholderTextColor={Colors.assestGray}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
            multiline
            editable={!uploading}
          />

          <Pressable
            onPress={handleSendMessage}
            style={[
              styles.sendButton,
              (!messageText.trim() || uploading) && styles.disabledButton,
            ]}
            disabled={!messageText.trim() || uploading}
            android_ripple={{ color: Colors.assest }}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messagesList: {
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.assest,
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.assestWhite,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    marginRight: 4,
  },
  errorText: {
    color: Colors.assestGray,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.assestGray,
    backgroundColor: Colors.assestWhite,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.assestWhite,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.assestGray,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.assest,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  mediaButton: {
    backgroundColor: Colors.assest,
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaButtonText: {
    color: Colors.assestWhite,
    fontSize: 20,
  },
  sendButtonText: {
    color: Colors.assestWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});