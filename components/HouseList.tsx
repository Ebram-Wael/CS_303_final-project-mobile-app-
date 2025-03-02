import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const houses = [
  { id: '1', name: 'House A', description: ' ', price: '$10', image: 'homepic5.jpg' },
  { id: '2', name: 'House B', description: ' ', price: '$20' },
  { id: '3', name: 'House C', description: ' ', price: '$15', image: 'homepic6.jpg' },
  { id: '4', name: 'House D', description: ' ', price: '$30', image: 'homepic7.jpg' },
];

const defaultImage = "default.jpg";

const HouseItem = ({ house } ) => (
  <View style={styles.card}>
    <Image source={{ uri: house.image ? house.image : defaultImage  }} style={styles.image} />
    <Text style={styles.name}>{house.name}</Text>
    <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
      {house.description || 'No description available'}
    </Text>
    <Text style={styles.price}>{house.price}</Text>
  </View>
);

export default function HouseList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>houses</Text>
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseItem house={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    card: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    image: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
      borderRadius: 10,
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    description: {
      fontSize: 14,
      color: '#555',
      marginBottom: 5,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007bff',
    },
  });

 