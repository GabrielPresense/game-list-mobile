import { ItemsService } from './items.service';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';
import { Item } from '../../common/entities/item.entity';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: CreateItemDto): Promise<Item>;
    findAll(listId?: string, type?: string, status?: string, search?: string): Promise<Item[]>;
    findOne(id: number): Promise<Item>;
    update(id: number, updateItemDto: UpdateItemDto): Promise<Item>;
    remove(id: number): Promise<void>;
}
