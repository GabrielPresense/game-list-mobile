"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("../../common/entities/item.entity");
let ItemsService = class ItemsService {
    constructor(itemsRepository) {
        this.itemsRepository = itemsRepository;
    }
    async create(createItemDto) {
        const item = this.itemsRepository.create(createItemDto);
        return await this.itemsRepository.save(item);
    }
    async findAll() {
        return await this.itemsRepository.find({
            relations: ['list'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const item = await this.itemsRepository.findOne({
            where: { id },
            relations: ['list'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Item com ID ${id} não encontrado`);
        }
        return item;
    }
    async update(id, updateItemDto) {
        const item = await this.findOne(id);
        Object.assign(item, updateItemDto);
        return await this.itemsRepository.save(item);
    }
    async remove(id) {
        const item = await this.findOne(id);
        await this.itemsRepository.remove(item);
    }
    async findByList(listId) {
        return await this.itemsRepository.find({
            where: { listId },
            relations: ['list'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByType(type) {
        return await this.itemsRepository.find({
            where: { type: type },
            relations: ['list'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByStatus(status) {
        return await this.itemsRepository.find({
            where: { status: status },
            relations: ['list'],
            order: { createdAt: 'DESC' },
        });
    }
    async search(query) {
        return await this.itemsRepository
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.list', 'list')
            .where('item.title LIKE :query', { query: `%${query}%` })
            .orWhere('item.description LIKE :query', { query: `%${query}%` })
            .orWhere('item.genre LIKE :query', { query: `%${query}%` })
            .orderBy('item.createdAt', 'DESC')
            .getMany();
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemsService);
//# sourceMappingURL=items.service.js.map