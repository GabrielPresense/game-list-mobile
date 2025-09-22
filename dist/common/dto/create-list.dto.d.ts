import { ListType } from '../entities/list.entity';
export declare class CreateListDto {
    name: string;
    type: ListType;
    description?: string;
}
