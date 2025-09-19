import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { itemsService } from '../services/api';
import { Item, ItemType, ItemStatus } from '../types';

type ItemsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ItemsScreen() {
  const navigation = useNavigation<ItemsScreenNavigationProp>();
  const route = useRoute<RouteProp<TabParamList, 'Items'>>();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | ItemType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ItemStatus>('all');

  const loadItems = async () => {
    try {
      const data = await itemsService.getAll();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      Alert.alert('Erro', 'Não foi possível carregar os itens.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Aplicar filtros iniciais vindos da Home
  useEffect(() => {
    if (route.params?.initialType) {
      setSelectedFilter(route.params.initialType);
    }
    if (route.params?.initialStatus) {
      setSelectedStatus(route.params.initialStatus);
    }
  }, [route.params]);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  // Filtrar itens quando mudar a busca, tipo ou status
  useEffect(() => {
    let filtered = items;

    // Filtrar por tipo
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.type === selectedFilter);
    }

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.genre?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedFilter, selectedStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    loadItems();
  };

  const handleDeleteItem = (item: Item) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${item.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await itemsService.delete(item.id);
              loadItems();
            } catch (error) {
              console.error('Erro ao excluir item:', error);
              Alert.alert('Erro', 'Não foi possível excluir o item.');
            }
          },
        },
      ]
    );
  };

  const getItemTypeLabel = (type: ItemType): string => {
    switch (type) {
      case ItemType.GAME:
        return 'Jogo';
      case ItemType.MOVIE:
        return 'Filme';
      case ItemType.SERIES:
        return 'Série';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: ItemStatus): string => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return 'Concluído';
      case ItemStatus.WANT_TO_PLAY_WATCH:
        return 'Quero jogar/assistir';
      case ItemStatus.IN_PROGRESS:
        return 'Em progresso';
      case ItemStatus.DROPPED:
        return 'Abandonado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: ItemStatus): string => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return '#34C759';
      case ItemStatus.WANT_TO_PLAY_WATCH:
        return '#007AFF';
      case ItemStatus.IN_PROGRESS:
        return '#FF9500';
      case ItemStatus.DROPPED:
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const getItemIcon = (type: ItemType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case ItemType.GAME:
        return 'game-controller';
      case ItemType.MOVIE:
        return 'film';
      case ItemType.SERIES:
        return 'tv';
      default:
        return 'library';
    }
  };

  const renderFilterButton = (filter: 'all' | ItemType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItemCard = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemIconContainer}>
            <Ionicons
              name={getItemIcon(item.type)}
              size={24}
              color="#007AFF"
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>{getItemTypeLabel(item.type)}</Text>
            {item.genre && (
              <Text style={styles.itemGenre}>{item.genre}</Text>
            )}
            {item.releaseYear && (
              <Text style={styles.itemYear}>{item.releaseYear}</Text>
            )}
          </View>
          <View style={styles.itemStatus}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
            {item.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            )}
          </View>
        </View>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditItem', { itemId: item.id })}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteItem(item)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatusFilter = (status: 'all' | ItemStatus, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedStatus(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando itens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, descrição ou gênero..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Todos')}
        {renderFilterButton(ItemType.GAME, 'Jogos')}
        {renderFilterButton(ItemType.MOVIE, 'Filmes')}
        {renderFilterButton(ItemType.SERIES, 'Séries')}
      </View>

      {/* Filtros de Status */}
      <View style={styles.filtersContainer}>
        {renderStatusFilter('all', 'Todos os status')}
        {renderStatusFilter(ItemStatus.WANT_TO_PLAY_WATCH, 'Quero jogar/assistir')}
        {renderStatusFilter(ItemStatus.IN_PROGRESS, 'Em progresso')}
        {renderStatusFilter(ItemStatus.COMPLETED, 'Concluído')}
        {renderStatusFilter(ItemStatus.DROPPED, 'Abandonado')}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItemCard}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Nenhum item encontrado'
                : 'Nenhum item cadastrado'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Toque no botão + para adicionar seu primeiro item'}
            </Text>
          </View>
        }
        contentContainerStyle={filteredItems.length === 0 ? styles.emptyList : undefined}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditItem', {})}
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
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  itemCard: {
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
  itemContent: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  itemGenre: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  itemYear: {
    fontSize: 12,
    color: '#999',
  },
  itemStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 3,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  itemActions: {
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

