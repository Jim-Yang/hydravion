import React from 'react';
import { StyleSheet, View } from 'react-native';
import { VideoPlayer } from './src/components/VideoPlayer';

export default function App() {
  const url = "https://cdn-vod-drm2.floatplane.com/Videos/ujMf1w9v4b/1080.mp4/chunk.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZVBhdGgiOiIvVmlkZW9zL3VqTWYxdzl2NGIvMTA4MC5tcDQvY2h1bmsubTN1OCIsInJlc3NvdXJjZVBhdGgiOiIvVmlkZW9zL3VqTWYxdzl2NGIvMTA4MC5tcDQvY2h1bmsubTN1OCIsInVzZXJJZCI6IjYxYTk1ZWZhZTlmYzE3NDBhYmQwMmRhMCIsImlhdCI6MTc0MTM3NDc0MiwiZXhwIjoxNzQxMzk2MzQyfQ.dLtGJdpYZmIEPn1hGzfXG7Qa2jY9FkcXXFyliBA6pXw";
  const headers = {
    'Cookie': 'sails.sid=s%3AtJwxOtJ1zunkOKfTTZiBwWL8Zd2g9Snd.7L2LbkccmY6%2BYTPO%2F92HCPGwVRzeplsDMAbWUkWC1yE'
  };

  return (
    <View style={styles.container}>
      <VideoPlayer url={url} headers={headers} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
