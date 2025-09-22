import { Repository } from 'typeorm';
import { List } from '../../common/entities/list.entity';
import { CreateListDto } from '../../common/dto/create-list.dto';
import { UpdateListDto } from '../../common/dto/update-list.dto';
export declare class ListsService {
    private listsRepository;
    constructor(listsRepository: Repository<List>);
    create(createListDto: CreateListDto): Promise<List>;
    findAll(): Promise<List[]>;
    findOne(id: number): Promise<List>;
    update(id: number, updateListDto: UpdateListDto): Promise<List>;
    remove(id: number): Promise<void>;
    findByType(type: string): Promise<List[]>;
}
