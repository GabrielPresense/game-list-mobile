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

  async create(createItemDto: CreateItemDto, userId: number): Promise<Item> {
    const item = this.itemsRepository.create({
      ...createItemDto,
      userId,
    });
    return await this.itemsRepository.save(item);
  }

  async findAll(userId: number): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { userId },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id, userId },
      relations: ['list'],
    });

    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`);
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto, userId: number): Promise<Item> {
    const item = await this.findOne(id, userId);
    
    Object.assign(item, updateItemDto);
    return await this.itemsRepository.save(item);
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.findOne(id, userId);
    await this.itemsRepository.remove(item);
  }

  async findByList(listId: number, userId: number): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { listId, userId },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: string, userId: number): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { type: type as any, userId },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string, userId: number): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { status: status as any, userId },
      relations: ['list'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string, userId: number): Promise<Item[]> {
    return await this.itemsRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.list', 'list')
      .where('item.userId = :userId', { userId })
      .andWhere(
        '(item.title LIKE :query OR item.description LIKE :query OR item.genre LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }
}

