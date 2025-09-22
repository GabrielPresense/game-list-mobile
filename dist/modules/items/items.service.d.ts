import { Repository } from 'typeorm';
import { Item } from '../../common/entities/item.entity';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';
export declare class ItemsService {
    private itemsRepository;
    constructor(itemsRepository: Repository<Item>);
    create(createItemDto: CreateItemDto): Promise<Item>;
    findAll(): Promise<Item[]>;
    findOne(id: number): Promise<Item>;
    update(id: number, updateItemDto: UpdateItemDto): Promise<Item>;
    remove(id: number): Promise<void>;
    findByList(listId: number): Promise<Item[]>;
    findByType(type: string): Promise<Item[]>;
    findByStatus(status: string): Promise<Item[]>;
    search(query: string): Promise<Item[]>;
}
