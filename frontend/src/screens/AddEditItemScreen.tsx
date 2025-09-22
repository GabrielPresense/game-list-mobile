import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { itemsService, listsService } from '../services/api';
import { ItemType, ItemStatus, CreateItemDto, UpdateItemDto, List } from '../types';

type AddEditItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditItem'>;
type AddEditItemScreenRouteProp = RouteProp<RootStackParamList, 'AddEditItem'>;

export default function AddEditItemScreen() {
  const navigation = useNavigation<AddEditItemScreenNavigationProp>();
  const route = useRoute<AddEditItemScreenRouteProp>();
  const { itemId, listId } = route.params;
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ItemType>(ItemType.GAME);
  const [status, setStatus] = useState<ItemStatus>(ItemStatus.WANT_TO_PLAY_WATCH);
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [selectedListId, setSelectedListId] = useState<number | null>(listId || null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const itemTypes = [
    { value: ItemType.GAME, label: 'Jogo' },
    { value: ItemType.MOVIE, label: 'Filme' },
    { value: ItemType.SERIES, label: 'Série' },
  ];

  const itemStatuses = [
    { value: ItemStatus.WANT_TO_PLAY_WATCH, label: 'Quero jogar/assistir' },
    { value: ItemStatus.IN_PROGRESS, label: 'Em progresso' },
    { value: ItemStatus.COMPLETED, label: 'Concluído' },
    { value: ItemStatus.DROPPED, label: 'Abandonado' },
  ];

  useEffect(() => {
    loadLists();
    if (itemId) {
      setIsEditing(true);
      loadItem();
    }
  }, [itemId]);

  const loadLists = async () => {
    try {
      const data = await listsService.getAll();
      setLists(data);
      if (!selectedListId && data.length > 0) {
        setSelectedListId(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
    }
  };

  const loadItem = async () => {
    if (!itemId) return;
    
    try {
      setLoading(true);
      const item = await itemsService.getById(itemId);
      setTitle(item.title);
      setType(item.type);
      setStatus(item.status);
      setDescription(item.description || '');
      setGenre(item.genre || '');
      setReleaseYear(item.releaseYear?.toString() || '');
      setRating(item.rating?.toString() || '');
      setNotes(item.notes || '');
      setImageUrl(item.imageUrl || '');
      setPlatform(item.platform || '');
      setSelectedListId(item.listId);
    } catch (error) {
      console.error('Erro ao carregar item:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do item.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return;
    }

    if (!selectedListId) {
      Alert.alert('Erro', 'Selecione uma lista para o item.');
      return;
    }

    const yearNum = releaseYear ? parseInt(releaseYear) : undefined;
    const ratingNum = rating ? parseFloat(rating) : undefined;

    if (yearNum && (yearNum < 1900 || yearNum > 2030)) {
      Alert.alert('Erro', 'Ano de lançamento deve estar entre 1900 e 2030.');
      return;
    }

    if (ratingNum && (ratingNum < 0 || ratingNum > 10)) {
      Alert.alert('Erro', 'Avaliação deve estar entre 0 e 10.');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && itemId) {
        const updateData: UpdateItemDto = {
          title: title.trim(),
          type,
          status,
          description: description.trim() || undefined,
          genre: genre.trim() || undefined,
          releaseYear: yearNum,
          rating: ratingNum,
          notes: notes.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          platform: platform.trim() || undefined,
          listId: selectedListId,
        };
        await itemsService.update(itemId, updateData);
        Alert.alert('Sucesso', 'Item atualizado com sucesso!');
      } else {
        const createData: CreateItemDto = {
          title: title.trim(),
          type,
          status,
          description: description.trim() || undefined,
          genre: genre.trim() || undefined,
          releaseYear: yearNum,
          rating: ratingNum,
          notes: notes.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          platform: platform.trim() || undefined,
          listId: selectedListId,
        };
        await itemsService.create(createData);
        Alert.alert('Sucesso', 'Item criado com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      Alert.alert('Erro', 'Não foi possível salvar o item.');
    } finally {
      setLoading(false);
    }
  };

  const renderSelectOption = (
    options: Array<{ value: any; label: string }>,
    selectedValue: any,
    onSelect: (value: any) => void,
    placeholder: string
  ) => (
    <View style={styles.selectContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.selectOption,
            selectedValue === option.value && styles.selectOptionSelected,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.selectOptionText,
              selectedValue === option.value && styles.selectOptionTextSelected,
            ]}
          >
            {option.label}
          </Text>
          {selectedValue === option.value && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: The Legend of Zelda"
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo *</Text>
            {renderSelectOption(itemTypes, type, setType, 'Selecione o tipo')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            {renderSelectOption(itemStatuses, status, setStatus, 'Selecione o status')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lista *</Text>
            {lists.length === 0 ? (
              <View style={styles.emptyListContainer}>
                <Text style={styles.helperText}>Nenhuma lista encontrada. Crie uma lista primeiro.</Text>
                <TouchableOpacity
                  style={styles.createListButton}
                  onPress={() => navigation.navigate('AddEditList', {})}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                  <Text style={styles.createListButtonText}>Criar Lista</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectContainer}>
                {lists.map((list) => (
                  <TouchableOpacity
                    key={list.id}
                    style={[
                      styles.selectOption,
                      selectedListId === list.id && styles.selectOptionSelected,
                    ]}
                    onPress={() => setSelectedListId(list.id)}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        selectedListId === list.id && styles.selectOptionTextSelected,
                      ]}
                    >
                      {list.name}
                    </Text>
                    {selectedListId === list.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Gênero</Text>
              <TextInput
                style={styles.input}
                value={genre}
                onChangeText={setGenre}
                placeholder="Ex: RPG, Ação"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                value={releaseYear}
                onChangeText={setReleaseYear}
                placeholder="2023"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Avaliação (0-10)</Text>
              <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                placeholder="8.5"
                keyboardType="decimal-pad"
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Plataforma</Text>
              <TextInput
                style={styles.input}
                value={platform}
                onChangeText={setPlatform}
                placeholder="PS5, Netflix"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL da Imagem</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://exemplo.com/imagem.jpg"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione uma descrição..."
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas Pessoais</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Suas anotações pessoais..."
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Item'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectOptionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

