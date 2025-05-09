import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";

interface Comment {
  id: string;
  userName: string;
  text: string;
  userId: string;
  createdAt: any;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  apartmentId: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  apartmentId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apartmentId) return;

    setLoading(true);

    const commentsRef = collection(db, "Apartments", apartmentId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [apartmentId]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.modalContent}>
        <Text style={styles.title}>Comments</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.user}>{item.userName}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTime}>
                  {item.createdAt.toDate().toLocaleString()}
                </Text>
              </View>
            )}
          />
        )}

        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  comment: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  commentText: {
    margin: 4,
    color: "black",
    fontSize: 24,
  },
  commentTime: {
    color: "#999",
    fontSize: 12,
  },
  user: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});
