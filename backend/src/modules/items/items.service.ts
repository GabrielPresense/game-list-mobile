import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../common/entities/item.entity';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemsRepository.create(createItemDto);
    return await this.itemsRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find({
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: ['list'],
    });

    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`);
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    
    Object.assign(item, updateItemDto);
    return await this.itemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);
  }

  async findByList(listId: number): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { listId },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: string): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { type: type as any },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { status: status as any },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Item[]> {
    return await this.itemsRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.list', 'list')
      .where('item.title LIKE :query', { query: `%${query}%` })
      .orWhere('item.description LIKE :query', { query: `%${query}%` })
      .orWhere('item.genre LIKE :query', { query: `%${query}%` })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }
}

