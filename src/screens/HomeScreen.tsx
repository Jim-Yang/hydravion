import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ContentList } from '../components/ContentList';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <ContentList creatorId="59f94c0bdd241b70349eb72b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 