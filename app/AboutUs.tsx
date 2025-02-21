import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutUs() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Student Housing App</Text>

        <Text style={styles.paragraph}>
          The Student Housing App is a mobile application designed to help students find and rent rooms easily. Sellers can list available rooms for rent, while students can browse, view details, and book accommodations. The platform aims to simplify the housing search process and provide a user-friendly experience.
        </Text>

        <Text style={styles.subheading}>Features</Text>

        <Text style={styles.paragraph}>
          User Authentication (Signup/Login) {'\n'}
          Room Listings (Sellers can post available rooms with details and images) {'\n'}
          Search & Filters (Students can search for rooms based on location, price, and amenities) {'\n'}
          Booking System (Students can request to book a room) {'\n'}
          Real-Time Updates (Listings update dynamically) {'\n'}
          Chat System (Optional: Buyers & sellers can communicate)
        </Text>
        <Text style={styles.para}>Team Leader :</Text>
        <Text style={styles.member}>Malak Sobhy </Text>
        <Text style={styles.para}>Team Members : </Text>
        <Text style={styles.member}>
        1- Esraa Hassan{'\n'}
        2- Abanoub Refaat{'\n'}
        3- Ebram Wael{'\n'}
        4- Aya Ali{'\n'}
       5- Walaa Tarek{'\n'}
      6- Youstina Agaiby {'\n'}
       7- Julia Milad

        </Text>
       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  content: {
    marginVertical: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 10,
  },
  para: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  member: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontWeight: 'normal', 
  }
});
