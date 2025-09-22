import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Item, CreateListDto, UpdateListDto, CreateItemDto, UpdateItemDto } from '../types';

// Configure a URL base da API - para produção, use a URL da nuvem
const API_BASE_URL = 'https://game-list-mobile-production.up.railway.app';  // ✅ Sempre usar a nuvem

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviços para Listas
export const listsService = {
  // Buscar todas as listas
  getAll: async (): Promise<List[]> => {
    const response = await api.get<List[]>('/lists');
    return response.data;
  },

  // Buscar lista por ID
  getById: async (id: number): Promise<List> => {
    const response = await api.get<List>(`/lists/${id}`);
    return response.data;
  },

  // Buscar listas por tipo
  getByType: async (type: string): Promise<List[]> => {
    const response = await api.get<List[]>(`/lists?type=${type}`);
    return response.data;
  },

  // Criar nova lista
  create: async (data: CreateListDto): Promise<List> => {
    const response = await api.post<List>('/lists', data);
    return response.data;
  },

  // Atualizar lista
  update: async (id: number, data: UpdateListDto): Promise<List> => {
    const response = await api.patch<List>(`/lists/${id}`, data);
    return response.data;
  },

  // Deletar lista
  delete: async (id: number): Promise<void> => {
    await api.delete(`/lists/${id}`);
  },
};

// Serviços para Itens
export const itemsService = {
  // Buscar todos os itens
  getAll: async (): Promise<Item[]> => {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },

  // Buscar item por ID
  getById: async (id: number): Promise<Item> => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  // Buscar itens por lista
  getByList: async (listId: number): Promise<Item[]> => {
    const response = await api.get<Item[]>(`/items?listId=${listId}`);
    return response.data;
  },

  // Buscar itens por tipo
  getByType: async (type: string): Promise<Item[]> => {
    const response = await api.get<Item[]>(`/items?type=${type}`);
    return response.data;
  },

  // Buscar itens por status
  getByStatus: async (status: string): Promise<Item[]> => {
    const response = await api.get<Item[]>(`/items?status=${status}`);
    return response.data;
  },

  // Buscar itens por texto
  search: async (query: string): Promise<Item[]> => {
    const response = await api.get<Item[]>(`/items?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Criar novo item
  create: async (data: CreateItemDto): Promise<Item> => {
    const response = await api.post<Item>('/items', data);
    return response.data;
  },

  // Atualizar item
  update: async (id: number, data: UpdateItemDto): Promise<Item> => {
    const response = await api.patch<Item>(`/items/${id}`, data);
    return response.data;
  },

  // Deletar item
  delete: async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

// Serviços de Autenticação
export const authService = {
  // Registrar usuário
  register: async (data: { email: string; name: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // Fazer login
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // Obter perfil do usuário
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Fazer logout
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // Verificar se está logado
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      
      // Verificar se o token é válido fazendo uma requisição
      const response = await api.get('/auth/profile');
      return response.status === 200;
    } catch (error) {
      // Se der erro, limpar o token e retornar false
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return false;
    }
  },

  // Obter token
  getToken: async () => {
    return await AsyncStorage.getItem('authToken');
  },

  // Obter usuário
  getUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;

