import { ItemType, ItemStatus } from '../entities/item.entity';
export declare class CreateItemDto {
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
