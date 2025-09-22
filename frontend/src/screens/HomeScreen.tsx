import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { listsService, itemsService, authService } from '../services/api';
import { List, Item, ListType, ItemType, ItemStatus } from '../types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface Stats {
  totalLists: number;
  totalItems: number;
  gamesPlayed: number;
  gamesToPlay: number;
  moviesWatched: number;
  moviesToWatch: number;
  seriesWatched: number;
  seriesToWatch: number;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [stats, setStats] = useState<Stats>({
    totalLists: 0,
    totalItems: 0,
    gamesPlayed: 0,
    gamesToPlay: 0,
    moviesWatched: 0,
    moviesToWatch: 0,
    seriesWatched: 0,
    seriesToWatch: 0,
  });
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [lists, items] = await Promise.all([
        listsService.getAll(),
        itemsService.getAll(),
      ]);

      // Calcular estatísticas
      const newStats: Stats = {
        totalLists: lists.length,
        totalItems: items.length,
        gamesPlayed: items.filter(item => item.type === ItemType.GAME && item.status === 'completed').length,
        gamesToPlay: items.filter(item => item.type === ItemType.GAME && item.status === 'want_to_play_watch').length,
        moviesWatched: items.filter(item => item.type === ItemType.MOVIE && item.status === 'completed').length,
        moviesToWatch: items.filter(item => item.type === ItemType.MOVIE && item.status === 'want_to_play_watch').length,
        seriesWatched: items.filter(item => item.type === ItemType.SERIES && item.status === 'completed').length,
        seriesToWatch: items.filter(item => item.type === ItemType.SERIES && item.status === 'want_to_play_watch').length,
      };

      setStats(newStats);
      
      // Pegar os 5 itens mais recentes
      const sortedItems = items.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentItems(sortedItems.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Deseja fazer logout?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            // O App.tsx vai detectar automaticamente e mostrar a tela de login
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, onPress }: {
    title: string;
    value: number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      style={{ flex: 1 }}
    >
      <View style={[styles.statCard, { borderLeftColor: color }]}> 
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
            <Text style={styles.subtitleText}>Gerencie suas listas de jogos, filmes e séries</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total de Listas"
            value={stats.totalLists}
            icon="list"
            color="#007AFF"
          />
          <StatCard
            title="Total de Itens"
            value={stats.totalItems}
            icon="library"
            color="#34C759"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jogos</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Jogados"
            value={stats.gamesPlayed}
            icon="game-controller"
            color="#FF9500"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.GAME, initialStatus: ItemStatus.COMPLETED })}
          />
          <StatCard
            title="Quero Jogar"
            value={stats.gamesToPlay}
            icon="time"
            color="#FF3B30"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.GAME, initialStatus: ItemStatus.WANT_TO_PLAY_WATCH })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filmes</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Assistidos"
            value={stats.moviesWatched}
            icon="film"
            color="#5856D6"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.MOVIE, initialStatus: ItemStatus.COMPLETED })}
          />
          <StatCard
            title="Quero Assistir"
            value={stats.moviesToWatch}
            icon="bookmark"
            color="#AF52DE"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.MOVIE, initialStatus: ItemStatus.WANT_TO_PLAY_WATCH })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Séries</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Assistidas"
            value={stats.seriesWatched}
            icon="tv"
            color="#32D74B"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.SERIES, initialStatus: ItemStatus.COMPLETED })}
          />
          <StatCard
            title="Quero Assistir"
            value={stats.seriesToWatch}
            icon="bookmark-outline"
            color="#007AFF"
            onPress={() => navigation.navigate('Items', { initialType: ItemType.SERIES, initialStatus: ItemStatus.WANT_TO_PLAY_WATCH })}
          />
        </View>
      </View>

      {recentItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionados Recentemente</Text>
          {recentItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recentItem}
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            >
              <View style={styles.recentItemContent}>
                <Text style={styles.recentItemTitle}>{item.title}</Text>
                <Text style={styles.recentItemType}>
                  {item.type === ItemType.GAME ? 'Jogo' : 
                   item.type === ItemType.MOVIE ? 'Filme' : 'Série'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditList', {})}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Nova Lista</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditItem', {})}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Novo Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  recentItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recentItemType: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 0.45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

