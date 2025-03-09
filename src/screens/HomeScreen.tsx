import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ContentList } from '../components/ContentList';

export function HomeScreen() {
  const { setCookie } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.debugContainer}>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => setCookie('sails.sid=s%3AtJwxOtJ1zunkOKfTTZiBwWL8Zd2g9Snd.7L2LbkccmY6%2BYTPO%2F92HCPGwVRzeplsDMAbWUkWC1yE')}
        >
          <Text style={styles.debugButtonText}>Set Cookie (Debug)</Text>
        </TouchableOpacity>
      </View>
      <ContentList creatorId="59f94c0bdd241b70349eb72b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  debugContainer: {
    padding: 8,
  },
  debugButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
}); 