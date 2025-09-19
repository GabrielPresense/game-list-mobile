import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { listsService } from '../services/api';
import { List, ListType } from '../types';

type ListsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ListsScreen() {
  const navigation = useNavigation<ListsScreenNavigationProp>();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLists = async () => {
    try {
      const data = await listsService.getAll();
      setLists(data);
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as listas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadLists();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadLists();
  };

  const handleDeleteList = (list: List) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a lista "${list.name}"? Todos os itens da lista também serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await listsService.delete(list.id);
              loadLists();
            } catch (error) {
              console.error('Erro ao excluir lista:', error);
              Alert.alert('Erro', 'Não foi possível excluir a lista.');
            }
          },
        },
      ]
    );
  };

  const getListTypeLabel = (type: ListType): string => {
    switch (type) {
      case ListType.GAMES_PLAYED:
        return 'Jogos Jogados';
      case ListType.GAMES_TO_PLAY:
        return 'Jogos para Jogar';
      case ListType.MOVIES_WATCHED:
        return 'Filmes Assistidos';
      case ListType.MOVIES_TO_WATCH:
        return 'Filmes para Assistir';
      case ListType.SERIES_WATCHED:
        return 'Séries Assistidas';
      case ListType.SERIES_TO_WATCH:
        return 'Séries para Assistir';
      default:
        return type;
    }
  };

  const getListIcon = (type: ListType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case ListType.GAMES_PLAYED:
      case ListType.GAMES_TO_PLAY:
        return 'game-controller';
      case ListType.MOVIES_WATCHED:
      case ListType.MOVIES_TO_WATCH:
        return 'film';
      case ListType.SERIES_WATCHED:
      case ListType.SERIES_TO_WATCH:
        return 'tv';
      default:
        return 'list';
    }
  };

  const getListColor = (type: ListType): string => {
    switch (type) {
      case ListType.GAMES_PLAYED:
        return '#FF9500';
      case ListType.GAMES_TO_PLAY:
        return '#FF3B30';
      case ListType.MOVIES_WATCHED:
        return '#5856D6';
      case ListType.MOVIES_TO_WATCH:
        return '#AF52DE';
      case ListType.SERIES_WATCHED:
        return '#32D74B';
      case ListType.SERIES_TO_WATCH:
        return '#007AFF';
      default:
        return '#666';
    }
  };

  const renderListItem = ({ item }: { item: List }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.listContent}
        onPress={() => {
          // Navegar para a tela de itens filtrada por esta lista
          // Por enquanto, vamos apenas mostrar um alert
          Alert.alert('Lista', `Você clicou na lista: ${item.name}`);
        }}
      >
        <View style={styles.listHeader}>
          <View style={styles.listIconContainer}>
            <Ionicons
              name={getListIcon(item.type)}
              size={24}
              color={getListColor(item.type)}
            />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listType}>{getListTypeLabel(item.type)}</Text>
            {item.description && (
              <Text style={styles.listDescription}>{item.description}</Text>
            )}
          </View>
          <View style={styles.listStats}>
            <Text style={styles.itemCount}>
              {item.items?.length || 0} itens
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.listActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditList', { listId: item.id })}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteList(item)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando listas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar sua primeira lista
            </Text>
          </View>
        }
        contentContainerStyle={lists.length === 0 ? styles.emptyList : undefined}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditList', {})}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  listItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContent: {
    padding: 15,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  listType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  listStats: {
    alignItems: 'flex-end',
  },
  itemCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  listActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  actionButton: {
    padding: 10,
    marginRight: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

