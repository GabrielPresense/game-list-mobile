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
exports.Item = exports.ItemStatus = exports.ItemType = void 0;
const typeorm_1 = require("typeorm");
const list_entity_1 = require("./list.entity");
var ItemType;
(function (ItemType) {
    ItemType["GAME"] = "game";
    ItemType["MOVIE"] = "movie";
    ItemType["SERIES"] = "series";
})(ItemType || (exports.ItemType = ItemType = {}));
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["COMPLETED"] = "completed";
    ItemStatus["WANT_TO_PLAY_WATCH"] = "want_to_play_watch";
    ItemStatus["IN_PROGRESS"] = "in_progress";
    ItemStatus["DROPPED"] = "dropped";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
let Item = class Item {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Item.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ItemType,
    }),
    __metadata("design:type", String)
], Item.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ItemStatus,
    }),
    __metadata("design:type", String)
], Item.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "genre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "releaseYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => list_entity_1.List, list => list.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'listId' }),
    __metadata("design:type", list_entity_1.List)
], Item.prototype, "list", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item.prototype, "listId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Item.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Item.prototype, "updatedAt", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)('items')
], Item);
//# sourceMappingURL=item.entity.js.map