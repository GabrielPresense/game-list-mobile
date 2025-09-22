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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const item_entity_1 = require("../entities/item.entity");
const class_transformer_1 = require("class-transformer");
class CreateItemDto {
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título do item', maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo do item', enum: item_entity_1.ItemType }),
    (0, class_validator_1.IsEnum)(item_entity_1.ItemType),
    __metadata("design:type", String)
], CreateItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status do item', enum: item_entity_1.ItemStatus }),
    (0, class_validator_1.IsEnum)(item_entity_1.ItemStatus),
    __metadata("design:type", String)
], CreateItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descrição do item', maxLength: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gênero do item' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ano de lançamento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2030),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "releaseYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avaliação (0-10)', minimum: 0, maximum: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notas pessoais', maxLength: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL da imagem' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plataforma (console, streaming, etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID da lista à qual o item pertence' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "listId", void 0);
//# sourceMappingURL=create-item.dto.js.map