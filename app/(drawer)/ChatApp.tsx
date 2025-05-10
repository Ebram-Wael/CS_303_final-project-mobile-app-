import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import Colors from "@/components/colors";

const ChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

 
  const fetchUserNames = async (userIds: string[]) => {
    const names: { [key: string]: string } = {};
    for (const userId of userIds) {
      try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          names[userId] = userDoc.data().name || "user";
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        names[userId] = "user";
      }
    }
    return names;
  };

  useEffect(() => {
    if (!user?.uid) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      async (querySnapshot) => {
        const chatsList: any[] = [];
        const userIds = new Set<string>();

        querySnapshot.forEach((doc) => {
          const chatData = doc.data();
          chatsList.push({ id: doc.id, ...chatData });

          chatData.participants.forEach((id: string) => {
            if (id !== user.uid) userIds.add(id);
          });
        });

        const names = await fetchUserNames(Array.from(userIds));
        setUserNames(names);

        const uniqueChats = chatsList.reduce((acc, current) => {
          const existingChat = acc.find(
            (chat: any) => chat.houseid === current.houseid
          );
          if (!existingChat) {
            acc.push(current);
          } else if (
            current.timestamp?.seconds > existingChat.timestamp?.seconds ||
            (current.timestamp?.toDate && existingChat.timestamp?.toDate &&
              current.timestamp.toDate() > existingChat.timestamp.toDate())
          ) {
            acc = acc.filter((chat: any) => chat.houseid !== current.houseid);
            acc.push(current);
          }
          return acc;
        }, []);

        setChats(uniqueChats);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const navigateToChat = (houseid: string, sellerId: string, userId: string) => {
    const otherUserId = sellerId === user?.uid ? userId : sellerId;
    router.push({
      pathname: "/screens/Chat",
      params: {
        houseid,
        sid: sellerId,
        userid: userId,
        userName: userNames[otherUserId] || "user",
      },
    });
  };

  const getChatDisplayName = (chat: any) => {
    const otherParticipantId = chat.participants.find(
      (id: string) => id !== user?.uid
    );
    return userNames[otherParticipantId] || chat.sellerName || "user";
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";

    const messageDate = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (isNaN(messageDate.getTime())) return "";

    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "yesterday";
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString("ar-SA", { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString("ar-SA", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const displayName = getChatDisplayName(item);
    const otherParticipantId = item.participants.find(
      (id: string) => id !== user?.uid
    );

    return (
      <Pressable
        style={styles.chatItem}
        onPress={() =>
          navigateToChat(item.houseid, item.sellerId, otherParticipantId)
        }
        android_ripple={{ color: Colors.assestGray }}
      >
        {/* <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.imageUri || "https://via.placeholder.com/50" }}
            style={styles.avatar}
          />
        </View> */}
        <View style={styles.chatContent}>
          <Text style={styles.sellerName}>{displayName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.message
              ? item.senderId === user?.uid
                ? `you: ${item.message}`
                : item.message
              : "image"}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.assestBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Chats Available</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

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
  listContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: Colors.assestWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.assestGray,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.assestGray,
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  sellerName: {
  fontSize: 16,
  fontWeight: "600",
  color: Colors.assest,
  textAlign: "left", 
  flex: 1,
},
lastMessage: {
  fontSize: 14,
  color: "#555",
  textAlign: "left", 
  flex: 2,
},

  timeContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: Colors.assestGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.assestGray,
  },
});

export default ChatList;