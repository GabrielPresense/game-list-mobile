import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { authService } from './src/services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      console.log('Status de autenticação:', authenticated);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.log('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    // Forçar re-render para mostrar tela de login
    setShowRegister(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <SafeAreaProvider>
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
          <StatusBar style="light" />
        </SafeAreaProvider>
      );
    }

    return (
      <SafeAreaProvider>
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setShowRegister(true)}
        />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator onLogout={handleLogout} />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
});
