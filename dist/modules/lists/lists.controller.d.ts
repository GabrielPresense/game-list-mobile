import { ListsService } from './lists.service';
import { CreateListDto } from '../../common/dto/create-list.dto';
import { UpdateListDto } from '../../common/dto/update-list.dto';
import { List } from '../../common/entities/list.entity';
export declare class ListsController {
    private readonly listsService;
    constructor(listsService: ListsService);
    create(createListDto: CreateListDto): Promise<List>;
    findAll(type?: string): Promise<List[]>;
    findOne(id: number): Promise<List>;
    update(id: number, updateListDto: UpdateListDto): Promise<List>;
    remove(id: number): Promise<void>;
}
