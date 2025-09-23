import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar as telas (vamos criar depois)
import HomeScreen from '../screens/HomeScreen';
import ListsScreen from '../screens/ListsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import AddEditListScreen from '../screens/AddEditListScreen';
import AddEditItemScreen from '../screens/AddEditItemScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  AddEditList: { listId?: number };
  AddEditItem: { itemId?: number; listId?: number };
  ItemDetail: { itemId: number };
};

export type TabParamList = {
  Home: undefined;
  Lists: undefined;
  Items: { initialType?: import('../types').ItemType; initialStatus?: import('../types').ItemStatus } | undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lists') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Items') {
            iconName = focused ? 'library' : 'library-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ title: 'Início' }}
      >
        {(props) => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Lists" 
        component={ListsScreen} 
        options={{ title: 'Listas' }}
      />
      <Tab.Screen 
        name="Items" 
        component={ItemsScreen} 
        options={{ title: 'Itens' }}
      />
    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  onLogout: () => void;
}

export default function AppNavigator({ onLogout }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          options={{ 
            headerShown: false,
          }}
        >
          {(props) => <TabNavigator {...props} onLogout={onLogout} />}
        </Stack.Screen>
        <Stack.Screen 
          name="AddEditList" 
          component={AddEditListScreen} 
          options={({ route }) => ({
            title: route.params?.listId ? 'Editar Lista' : 'Nova Lista',
          })}
        />
        <Stack.Screen 
          name="AddEditItem" 
          component={AddEditItemScreen} 
          options={({ route }) => ({
            title: route.params?.itemId ? 'Editar Item' : 'Novo Item',
          })}
        />
        <Stack.Screen 
          name="ItemDetail" 
          component={ItemDetailScreen} 
          options={{ title: 'Detalhes do Item' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

