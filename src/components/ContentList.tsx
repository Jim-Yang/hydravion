import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, RefreshControl, Modal } from 'react-native';
import { useCreatorContent } from '../hooks/useFPAPI';
import { FPContent } from '../types/FPListContentResponse';
import { ContentListSkeleton } from './ContentListSkeleton';
import { ContentView } from './ContentView';
import { Ionicons } from '@expo/vector-icons';

const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else if (diffInHours < 720) { // 30 days
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  } else {
    return `${Math.floor(diffInHours / 720)} months ago`;
  }
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface ContentListProps {
  creatorId: string;
}

export function ContentList({ creatorId }: ContentListProps) {
  const [page, setPage] = useState(1);
  const [allContent, setAllContent] = useState<FPContent[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<FPContent | null>(null);
  const ITEMS_PER_PAGE = 20;
  
  const { data, loading, error, refetch } = useCreatorContent({
    id: creatorId,
    limit: ITEMS_PER_PAGE,
    fetchAfter: (page - 1) * ITEMS_PER_PAGE,
  });

  useEffect(() => {
    if (!data || loading) return;

    if (data.length === 0) {
      setHasMore(false);
      return;
    }

    if (refreshing) {
      setAllContent(data);
      setRefreshing(false);
      return;
    }

    // Check for duplicates before adding new content
    const newContent = data.filter(
      newItem => !allContent.some(existingItem => existingItem.id === newItem.id)
    );

    if (newContent.length === 0) {
      setHasMore(false);
      return;
    }

    setAllContent(prev => [...prev, ...newContent]);
  }, [data, loading]);

  const loadMore = () => {
    if (hasMore && !loading && data?.length === ITEMS_PER_PAGE) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setAllContent([]);
    setHasMore(true);
    await refetch();
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!loading) {
      return hasMore ? null : (
        <View style={styles.footer}>
          <Text style={styles.endMessage}>No more content</Text>
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: FPContent }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => setSelectedContent(item)}
    >
      <Image 
        source={{ uri: item.thumbnail.childImages[0]?.path ?? item.creator.cover.childImages[0]?.path }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.creatorTitle}>{item.channel.title}</Text>
          <Text style={styles.releaseDate}>{getRelativeTimeString(item.releaseDate)}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Image 
            source={{ uri: item.channel.icon?.path }} 
            style={styles.channelIcon}
          />
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.duration}>{formatDuration(item.metadata.videoDuration)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Posts</Text>
      {loading && allContent.length === 0 ? (
        <ContentListSkeleton itemCount={8} />
      ) : (
        <FlatList
          data={allContent}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']}
              tintColor="#0000ff"
            />
          }
          ListEmptyComponent={null}
        />
      )}
      <Modal
        visible={selectedContent !== null}
        animationType="slide"
        onRequestClose={() => setSelectedContent(null)}
      >
        {selectedContent && (
          <ContentView 
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  creatorTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  releaseDate: {
    fontSize: 10,
    color: '#666',
  },
  thumbnail: {
    width: 144,
    height: 81,
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  endMessage: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  channelIcon: {
    width: 18,
    height: 18,
    borderRadius: 8,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
}); 