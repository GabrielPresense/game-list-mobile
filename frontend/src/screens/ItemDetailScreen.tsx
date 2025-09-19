import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { itemsService } from '../services/api';
import { Item, ItemType, ItemStatus } from '../types';

type ItemDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ItemDetail'>;
type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

export default function ItemDetailScreen() {
  const navigation = useNavigation<ItemDetailScreenNavigationProp>();
  const route = useRoute<ItemDetailScreenRouteProp>();
  const { itemId } = route.params;
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      const data = await itemsService.getById(itemId);
      setItem(data);
    } catch (error) {
      console.error('Erro ao carregar item:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do item.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!item) return;
    
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
              Alert.alert('Sucesso', 'Item excluído com sucesso!');
              navigation.goBack();
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

  const openImageUrl = () => {
    if (item?.imageUrl) {
      Linking.openURL(item.imageUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Item não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header com imagem */}
      <View style={styles.header}>
        {item.imageUrl && !imageError ? (
          <TouchableOpacity onPress={openImageUrl}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.headerImage}
              onError={() => setImageError(true)}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons
              name={getItemIcon(item.type)}
              size={64}
              color="#666"
            />
          </View>
        )}
        
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.headerMeta}>
              <View style={styles.typeContainer}>
                <Ionicons
                  name={getItemIcon(item.type)}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.typeText}>
                  {getItemTypeLabel(item.type)}
                </Text>
              </View>
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
            </View>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Informações básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoGrid}>
            {item.genre && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gênero</Text>
                <Text style={styles.infoValue}>{item.genre}</Text>
              </View>
            )}
            
            {item.releaseYear && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ano</Text>
                <Text style={styles.infoValue}>{item.releaseYear}</Text>
              </View>
            )}
            
            {item.platform && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Plataforma</Text>
                <Text style={styles.infoValue}>{item.platform}</Text>
              </View>
            )}
            
            {item.rating && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Avaliação</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingValue}>{item.rating}/10</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Lista */}
        {item.list && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lista</Text>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{item.list.name}</Text>
              {item.list.description && (
                <Text style={styles.listDescription}>{item.list.description}</Text>
              )}
            </View>
          </View>
        )}

        {/* Descrição */}
        {item.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}

        {/* Notas */}
        {item.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas Pessoais</Text>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        )}

        {/* Datas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datas</Text>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Criado em:</Text>
            <Text style={styles.dateValue}>
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Atualizado em:</Text>
            <Text style={styles.dateValue}>
              {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddEditItem', { itemId: item.id })}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoGrid: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  notes: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
    color: '#666',
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

