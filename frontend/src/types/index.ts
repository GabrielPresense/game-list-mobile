export enum ListType {
  GAMES_PLAYED = 'games_played',
  GAMES_TO_PLAY = 'games_to_play',
  MOVIES_WATCHED = 'movies_watched',
  MOVIES_TO_WATCH = 'movies_to_watch',
  SERIES_WATCHED = 'series_watched',
  SERIES_TO_WATCH = 'series_to_watch',
}

export enum ItemType {
  GAME = 'game',
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum ItemStatus {
  COMPLETED = 'completed',
  WANT_TO_PLAY_WATCH = 'want_to_play_watch',
  IN_PROGRESS = 'in_progress',
  DROPPED = 'dropped',
}

export interface List {
  id: number;
  name: string;
  type: ListType;
  description?: string;
  items?: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: number;
  title: string;
  type: ItemType;
  status: ItemStatus;
  description?: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  notes?: string;
  imageUrl?: string;
  platform?: string;
  listId: number;
  list?: List;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDto {
  name: string;
  type: ListType;
  description?: string;
}

export interface UpdateListDto {
  name?: string;
  type?: ListType;
  description?: string;
}

export interface CreateItemDto {
  title: string;
  type: ItemType;
  status: ItemStatus;
  description?: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  notes?: string;
  imageUrl?: string;
  platform?: string;
  listId: number;
}

export interface UpdateItemDto {
  title?: string;
  type?: ItemType;
  status?: ItemStatus;
  description?: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  notes?: string;
  imageUrl?: string;
  platform?: string;
  listId?: number;
}

