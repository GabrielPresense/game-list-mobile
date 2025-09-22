import { Item } from './item.entity';
import { User } from './user.entity';
export declare enum ListType {
    GAMES_PLAYED = "games_played",
    GAMES_TO_PLAY = "games_to_play",
    MOVIES_WATCHED = "movies_watched",
    MOVIES_TO_WATCH = "movies_to_watch",
    SERIES_WATCHED = "series_watched",
    SERIES_TO_WATCH = "series_to_watch"
}
export declare class List {
    id: number;
    name: string;
    type: ListType;
    description: string;
    items: Item[];
    user: User;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
