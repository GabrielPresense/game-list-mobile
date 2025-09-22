import { List } from './list.entity';
export declare enum ItemType {
    GAME = "game",
    MOVIE = "movie",
    SERIES = "series"
}
export declare enum ItemStatus {
    COMPLETED = "completed",
    WANT_TO_PLAY_WATCH = "want_to_play_watch",
    IN_PROGRESS = "in_progress",
    DROPPED = "dropped"
}
export declare class Item {
    id: number;
    title: string;
    type: ItemType;
    status: ItemStatus;
    description: string;
    genre: string;
    releaseYear: number;
    rating: number;
    notes: string;
    imageUrl: string;
    platform: string;
    list: List;
    listId: number;
    createdAt: Date;
    updatedAt: Date;
}
