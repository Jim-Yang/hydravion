import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { FPContent } from '../types/FPListContentResponse';
import { useVideoDelivery } from '../hooks/useFPAPI';
import { VideoPlayer } from './VideoPlayer';
import { useAuth } from '../contexts/AuthContext';

interface ContentViewProps {
  content: FPContent;
  onClose?: () => void;
}

const constructVideoUrl = (cdn: string, uri: string, qualityLevel: string, params: Record<string, string>) => {
  let formattedUri = uri;
  // Replace the placeholder parameters in the URI with actual values
  formattedUri = formattedUri.replace('{qualityLevelParams.2}', params['2']);
  formattedUri = formattedUri.replace('{qualityLevelParams.4}', params['4']);
  return `${cdn}${formattedUri}`;
};

export function ContentView({ content, onClose }: ContentViewProps) {
  const { width } = useWindowDimensions();
  const { cookie } = useAuth();
  const { data } = useVideoDelivery({
    guid: content.videoAttachments[0],
  });
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');

  // Create a map of resolution labels to video URLs
  const videoUrls = React.useMemo(() => {
    if (!data) return {};

    const urls: Record<string, string> = {};
    data.resource.data.qualityLevels.forEach(level => {
      const params = data.resource.data.qualityLevelParams[level.name];
      if (params) {
        urls[level.label] = constructVideoUrl(
          data.cdn,
          data.resource.uri,
          level.name,
          params
        );
      }
    });
    return urls;
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.backButton} />
      </View>
      <View style={styles.videoContainer}>
        <VideoPlayer 
          url={videoUrls[selectedQuality] || videoUrls['1080p']} 
          headers={{ 'Cookie': cookie || '' }}
          qualityOptions={videoUrls}
          currentQuality={selectedQuality}
          onQualityChange={setSelectedQuality}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <RenderHtml
            contentWidth={width - 32} // Account for horizontal padding
            source={{ html: content.text }}
            baseStyle={{
              fontSize: 15,
              lineHeight: 20,
              color: '#333',
            }}
            tagsStyles={{
              p: {
                fontSize: 12,
                marginBottom: 2,
              },
              a: {
                color: '#007AFF',
                textDecorationLine: 'none',
              },
              ul: {
                fontSize: 12,
                marginBottom: 1,
              },
              ol: {
                fontSize: 12,
                marginBottom: 1,
              },
              li: {
                fontSize: 12,
                marginBottom: 1,
              },
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
  },
}); 