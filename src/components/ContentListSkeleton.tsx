import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ContentListSkeletonProps {
  itemCount?: number;
}

export function ContentListSkeleton({ itemCount = 5 }: ContentListSkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();

    return () => animation.stop();
  }, []);

  const renderSkeletonItem = () => (
    <View style={styles.itemContainer}>
      <Animated.View 
        style={[
          styles.thumbnail,
          { opacity: animatedValue }
        ]} 
      />
      <View style={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.titleSkeleton,
            { opacity: animatedValue }
          ]} 
        />
        <Animated.View 
          style={[
            styles.textSkeleton,
            { opacity: animatedValue }
          ]} 
        />
        <Animated.View 
          style={[
            styles.textSkeleton,
            styles.shortTextSkeleton,
            { opacity: animatedValue }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index}>
          {renderSkeletonItem()}
        </View>
      ))}
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
    justifyContent: 'center',
  },
  thumbnail: {
    width: 180,
    height: 101,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  titleSkeleton: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 12,
    width: '80%',
  },
  textSkeleton: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  shortTextSkeleton: {
    width: '60%',
  },
}); 