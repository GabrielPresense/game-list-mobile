import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../../common/entities/list.entity';
import { CreateListDto } from '../../common/dto/create-list.dto';
import { UpdateListDto } from '../../common/dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listsRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto, userId: number): Promise<List> {
    const list = this.listsRepository.create({
      ...createListDto,
      userId,
    });
    return await this.listsRepository.save(list);
  }

  async findAll(): Promise<List[]> {
    return await this.listsRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<List> {
    const list = await this.listsRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!list) {
      throw new NotFoundException(`Lista com ID ${id} não encontrada`);
    }

    return list;
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.findOne(id);
    
    Object.assign(list, updateListDto);
    return await this.listsRepository.save(list);
  }

  async remove(id: number): Promise<void> {
    const list = await this.findOne(id);
    await this.listsRepository.remove(list);
  }

  async findByType(type: string): Promise<List[]> {
    return await this.listsRepository.find({
      where: { type: type as any },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}

