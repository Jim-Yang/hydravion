import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, RefreshControl, Modal } from 'react-native';
import { useCreatorContent } from '../hooks/useFPAPI';
import { FPContent } from '../types/FPListContentResponse';
import { ContentListSkeleton } from './ContentListSkeleton';
import { ContentView } from './ContentView';

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
    if (data) {
      if (data.length === 0) {
        setHasMore(false);
      } else if (refreshing) {
        setAllContent(data);
      } else {
        setAllContent(prev => [...prev, ...data]);
      }
      setRefreshing(false);
    }
  }, [data, loading]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const clearList = () => {
    setAllContent([]);
    setPage(1);
    setHasMore(true);
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
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text} numberOfLines={3}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={clearList} style={styles.debugButton}>
        <Text style={styles.debugButtonText}>Clear List (Debug)</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  thumbnail: {
    width: 180,
    height: 101,
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
  debugButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    margin: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
}); 