import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { listsService } from '../services/api';
import { ListType, CreateListDto, UpdateListDto } from '../types';
import SafeScreen from '../components/SafeScreen';

type AddEditListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditList'>;
type AddEditListScreenRouteProp = RouteProp<RootStackParamList, 'AddEditList'>;

export default function AddEditListScreen() {
  const navigation = useNavigation<AddEditListScreenNavigationProp>();
  const route = useRoute<AddEditListScreenRouteProp>();
  const { listId } = route.params;
  
  const [name, setName] = useState('');
  const [type, setType] = useState<ListType>(ListType.GAMES_PLAYED);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const listTypes = [
    { value: ListType.GAMES_PLAYED, label: 'Jogos Jogados' },
    { value: ListType.GAMES_TO_PLAY, label: 'Jogos para Jogar' },
    { value: ListType.MOVIES_WATCHED, label: 'Filmes Assistidos' },
    { value: ListType.MOVIES_TO_WATCH, label: 'Filmes para Assistir' },
    { value: ListType.SERIES_WATCHED, label: 'Séries Assistidas' },
    { value: ListType.SERIES_TO_WATCH, label: 'Séries para Assistir' },
  ];

  useEffect(() => {
    if (listId) {
      setIsEditing(true);
      loadList();
    }
  }, [listId]);

  const loadList = async () => {
    if (!listId) return;
    
    try {
      setLoading(true);
      const list = await listsService.getById(listId);
      setName(list.name);
      setType(list.type);
      setDescription(list.description || '');
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da lista.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && listId) {
        const updateData: UpdateListDto = {
          name: name.trim(),
          type,
          description: description.trim() || undefined,
        };
        await listsService.update(listId, updateData);
        Alert.alert('Sucesso', 'Lista atualizada com sucesso!');
      } else {
        const createData: CreateListDto = {
          name: name.trim(),
          type,
          description: description.trim() || undefined,
        };
        await listsService.create(createData);
        Alert.alert('Sucesso', 'Lista criada com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      Alert.alert('Erro', 'Não foi possível salvar a lista.');
    } finally {
      setLoading(false);
    }
  };

  const renderTypeOption = (option: { value: ListType; label: string }) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.typeOption,
        type === option.value && styles.typeOptionSelected,
      ]}
      onPress={() => setType(option.value)}
    >
      <View style={styles.typeOptionContent}>
        <Text
          style={[
            styles.typeOptionText,
            type === option.value && styles.typeOptionTextSelected,
          ]}
        >
          {option.label}
        </Text>
        {type === option.value && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeScreen>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Lista *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Meus jogos favoritos"
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo da Lista *</Text>
            <View style={styles.typeContainer}>
              {listTypes.map(renderTypeOption)}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione uma descrição para sua lista..."
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {description.length}/500 caracteres
            </Text>
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
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Lista'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  typeContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  typeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  typeOptionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 60, // Espaço extra para evitar conflito com botões do sistema
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    // Adicionar sombra sutil para destacar os botões
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
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

