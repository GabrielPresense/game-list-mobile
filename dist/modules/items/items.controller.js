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
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const items_service_1 = require("./items.service");
const create_item_dto_1 = require("../../common/dto/create-item.dto");
const update_item_dto_1 = require("../../common/dto/update-item.dto");
const item_entity_1 = require("../../common/entities/item.entity");
let ItemsController = class ItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    create(createItemDto) {
        return this.itemsService.create(createItemDto);
    }
    findAll(listId, type, status, search) {
        if (search) {
            return this.itemsService.search(search);
        }
        if (listId) {
            return this.itemsService.findByList(parseInt(listId));
        }
        if (type) {
            return this.itemsService.findByType(type);
        }
        if (status) {
            return this.itemsService.findByStatus(status);
        }
        return this.itemsService.findAll();
    }
    findOne(id) {
        return this.itemsService.findOne(id);
    }
    update(id, updateItemDto) {
        return this.itemsService.update(id, updateItemDto);
    }
    remove(id) {
        return this.itemsService.remove(id);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar um novo item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item criado com sucesso', type: item_entity_1.Item }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar todos os itens' }),
    (0, swagger_1.ApiQuery)({ name: 'listId', required: false, description: 'Filtrar por ID da lista' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filtrar por tipo (game, movie, series)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filtrar por status' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Buscar por título, descrição ou gênero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Itens encontrados', type: [item_entity_1.Item] }),
    __param(0, (0, common_1.Query)('listId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um item por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item encontrado', type: item_entity_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar um item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item atualizado com sucesso', type: item_entity_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar um item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item deletado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "remove", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('items'),
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map