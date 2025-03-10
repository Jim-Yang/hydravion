import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { HomeScreen } from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function NavigationContent() {
  const { cookie } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerShadowVisible: true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      {!cookie ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            title: 'Login',
          }}
        />
      ) : (
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <NavigationContent />
      </AuthProvider>
    </NavigationContainer>
  );
}
