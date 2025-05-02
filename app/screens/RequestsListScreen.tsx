import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import auth from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
interface Request {
  id: string;
  issueType: string;
  description: string;
  imageUrl: string;
  preferredDate: string;
  userId: string;
  userName: string;
  createdAt: string;
}

interface RequestsListScreenProps {
  onNavigateToNewRequest: () => void;
}

const RequestsListScreen: React.FC<RequestsListScreenProps> = ({
  onNavigateToNewRequest,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchRequests(user.uid);
      }
      else{
        setCurrentUser(null);
        setRequests([]);
      }
    });
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    if (isFocused && currentUser) {
      fetchRequests(currentUser.uid);
    }
  }, [isFocused]);

  const fetchRequests = async (userId: string): Promise<void> => {
    try {
      setLoadingRequests(true);
      const q = query(
        collection(db, "requests"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const requestsData: Request[] = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() } as Request);
      });
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const cancelRequest = (requestId: string): void => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "requests", requestId));
              setRequests((prevRequests) =>
                prevRequests.filter((req) => req.id !== requestId)
              );
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "deleted request",
                  body: "Item deleted from requests.",
                  sound: "default",
                  data: { type: "request_deleted" },
                },
                trigger: null,
              });
            } catch (error) {
              console.error("Error deleting request:", error);
              alert("Failed to delete request. Please try again.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loadingRequests) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DA674" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Maintenance Requests</Text>
      <Pressable
        style={styles.newRequestButton}
        onPress={onNavigateToNewRequest}
      >
        <Text style={styles.buttonText}>Report New Issue</Text>
      </Pressable>

      {requests.length === 0 ? (
        <Text style={styles.noRequests}>No requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <Text style={styles.requestId}>
                Request ID:{" "}
                <Text style={styles.cardValue}>{item.id.substring(0, 8)}</Text>
              </Text>
              <Text style={styles.issueType}>
                Issue Type:{" "}
                <Text style={styles.cardValue}>{item.issueType}</Text>
              </Text>
              <Text style={styles.date}>
                Request Date:{" "}
                <Text style={styles.cardValue}>
                  {new Date(item.createdAt).toLocaleDateString("en-US")}
                </Text>
              </Text>
              <Text style={styles.issueType}>
                Describtion:{" "}
                <Text style={styles.cardValue}>{item.description}</Text>
              </Text>
              <Text style={styles.issueType}>
                Preferred Date:{" "}
                <Text style={styles.cardValue}>{item.preferredDate}</Text>
              </Text>
              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => cancelRequest(item.id)}
                >
                  <Text style={styles.buttonText}>Cancel Request</Text>
                </Pressable>
              </View>
            </View>
          )}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
    color: "#333",
  },
  requestCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowRadius: 4,
    elevation: 3,
  },
  requestId: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  issueType: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  date: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 5,
    marginLeft: "53%",
  },
  newRequestButton: {
    backgroundColor: "#023336",
    padding: 15,
    borderRadius: 5,
    margin: 10,
    marginBottom: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    alignContent: "center",
    fontSize: 11,
    fontWeight: "bold",
  },
  requestImage: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 5,
  },
  noRequests: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  cardValue: {
    fontWeight: "normal",
    color: "#333",
  },
});

export default RequestsListScreen;
