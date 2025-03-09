import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, AppState, Button } from 'react-native';
import Video from 'react-native-video';

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [key, setKey] = useState(0);
  const videoRef = useRef<React.ElementRef<typeof Video> | null>(null);

  const exitPiP = () => {
    try {
      if (!videoRef.current) {
        console.log('No video ref available');
        return;
      }
      
      videoRef.current?.exitPictureInPicture?.();
      setIsPaused(true);
      
      setTimeout(() => {
        setKey(prev => prev + 1);
        setShowControls(true);
        setIsPaused(false);
      }, 100);
    } catch (err) {
      console.error('Error exiting PiP:', err);
      setShowControls(true);
      setIsPaused(false);
    }
  };

  const enterPiP = () => {
    if (!videoRef.current) return;
    videoRef.current.enterPictureInPicture?.();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      if (nextAppState === 'active') {
        exitPiP();
      }
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.exitPictureInPicture?.();
      }
      subscription.remove();
    };
  }, []);

  const handleError = (error: any) => {
    console.error('Video Error:', JSON.stringify(error, null, 2));
    const errorMessage = `Video Error: ${error?.error?.errorString || error?.error?.errorCode || JSON.stringify(error)}`;
    setError(errorMessage);
  };

  const url = "https://cdn-vod-drm2.floatplane.com/Videos/ujMf1w9v4b/1080.mp4/chunk.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZVBhdGgiOiIvVmlkZW9zL3VqTWYxdzl2NGIvMTA4MC5tcDQvY2h1bmsubTN1OCIsInJlc3NvdXJjZVBhdGgiOiIvVmlkZW9zL3VqTWYxdzl2NGIvMTA4MC5tcDQvY2h1bmsubTN1OCIsInVzZXJJZCI6IjYxYTk1ZWZhZTlmYzE3NDBhYmQwMmRhMCIsImlhdCI6MTc0MTM3NDc0MiwiZXhwIjoxNzQxMzk2MzQyfQ.dLtGJdpYZmIEPn1hGzfXG7Qa2jY9FkcXXFyliBA6pXw";

  return (
    <View style={styles.container}>
      <Video
        key={key}
        ref={videoRef}
        source={{
          uri: url,
          headers: {
            'Cookie': 'sails.sid=s%3AtJwxOtJ1zunkOKfTTZiBwWL8Zd2g9Snd.7L2LbkccmY6%2BYTPO%2F92HCPGwVRzeplsDMAbWUkWC1yE'
          }
        }}
        style={styles.video}
        controls={showControls}
        paused={isPaused}
        onError={handleError}
        playWhenInactive={true}
        enterPictureInPictureOnLeave
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Enter PiP Mode"
          onPress={enterPiP}
          color="#007AFF"
        />
        <Button
          title="Exit PiP Mode"
          onPress={exitPiP}
          color="#007AFF"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    marginVertical: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
});
