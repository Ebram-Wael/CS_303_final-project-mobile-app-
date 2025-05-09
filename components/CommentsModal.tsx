import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  apartmentId: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose, apartmentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState('');
  useEffect(() => {
    if (!apartmentId) return;

    const commentsRef = collection(db, 'Apartments', apartmentId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, 'id'>),
      }));
      setComments(newComments);
    });

    return unsubscribe;
  }, [apartmentId]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.modalContent}>
        <Text style={styles.title}>Comments</Text>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.user}>{item.userId}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentTime}>{item.createdAt.toDate().toLocaleString()}</Text>
            </View>
          )}
        />

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
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  comment: {
    backgroundColor: '#f2f2f2',
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
    color: '#999',
    fontSize: 12,
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});
