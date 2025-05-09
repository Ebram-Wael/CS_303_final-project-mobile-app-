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
import { useThemes } from '@/components/themeContext';
import Colors from '@/components/colors';

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
  const { theme } = useThemes();
  const isDark = theme === 'dark';

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

      <View style={[styles.modalContent, { backgroundColor: isDark ? Colors.darkModePrimary : "rgba(255,255,255,0.95)" }]}>
        <Text style={[styles.title,{color: isDark ? Colors.darkModeText : Colors.text }]}>Comments</Text>

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

        <Pressable onPress={onClose} style={[styles.closeButton , {backgroundColor: isDark ? Colors.darkModeSecondary : Colors.assestGreenTwo }]}>
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
    marginTop: 80,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  comment: {
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
  },
  user: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 6,
  },
  commentTime: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
