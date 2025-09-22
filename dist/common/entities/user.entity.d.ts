import { List } from './list.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    lists: List[];
    createdAt: string;
    updatedAt: string;
}
