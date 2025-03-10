import React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CookieManager from '@react-native-cookies/cookies';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const { setCookie } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    console.log(navState.title);
    if (navState.title.includes("Redirecting")) {
      console.log("Passed");
      try {
        const cookies = await CookieManager.get('https://www.floatplane.com');
        const sailsSidCookie = cookies['sails.sid'];
        
        if (sailsSidCookie) {
          const cookieString = `sails.sid=${sailsSidCookie.value}`;
          setCookie(cookieString);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } catch (error) {
        console.error('Failed to extract cookie:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView 
        sharedCookiesEnabled
        source={{ uri: 'https://www.floatplane.com/login' }}
        style={styles.webview}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default LoginScreen; 