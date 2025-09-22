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
exports.ListsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lists_service_1 = require("./lists.service");
const create_list_dto_1 = require("../../common/dto/create-list.dto");
const update_list_dto_1 = require("../../common/dto/update-list.dto");
const list_entity_1 = require("../../common/entities/list.entity");
let ListsController = class ListsController {
    constructor(listsService) {
        this.listsService = listsService;
    }
    create(createListDto) {
        return this.listsService.create(createListDto);
    }
    findAll(type) {
        if (type) {
            return this.listsService.findByType(type);
        }
        return this.listsService.findAll();
    }
    findOne(id) {
        return this.listsService.findOne(id);
    }
    update(id, updateListDto) {
        return this.listsService.update(id, updateListDto);
    }
    remove(id) {
        return this.listsService.remove(id);
    }
};
exports.ListsController = ListsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova lista' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lista criada com sucesso', type: list_entity_1.List }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_list_dto_1.CreateListDto]),
    __metadata("design:returntype", Promise)
], ListsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar todas as listas' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filtrar por tipo de lista' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listas encontradas', type: [list_entity_1.List] }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar uma lista por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da lista' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista encontrada', type: list_entity_1.List }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lista não encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar uma lista' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da lista' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista atualizada com sucesso', type: list_entity_1.List }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lista não encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_list_dto_1.UpdateListDto]),
    __metadata("design:returntype", Promise)
], ListsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar uma lista' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da lista' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista deletada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lista não encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListsController.prototype, "remove", null);
exports.ListsController = ListsController = __decorate([
    (0, swagger_1.ApiTags)('lists'),
    (0, common_1.Controller)('lists'),
    __metadata("design:paramtypes", [lists_service_1.ListsService])
], ListsController);
//# sourceMappingURL=lists.controller.js.map