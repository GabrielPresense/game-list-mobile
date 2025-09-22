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
exports.List = exports.ListType = void 0;
const typeorm_1 = require("typeorm");
const item_entity_1 = require("./item.entity");
const user_entity_1 = require("./user.entity");
var ListType;
(function (ListType) {
    ListType["GAMES_PLAYED"] = "games_played";
    ListType["GAMES_TO_PLAY"] = "games_to_play";
    ListType["MOVIES_WATCHED"] = "movies_watched";
    ListType["MOVIES_TO_WATCH"] = "movies_to_watch";
    ListType["SERIES_WATCHED"] = "series_watched";
    ListType["SERIES_TO_WATCH"] = "series_to_watch";
})(ListType || (exports.ListType = ListType = {}));
let List = class List {
};
exports.List = List;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], List.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], List.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: ListType,
    }),
    __metadata("design:type", String)
], List.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], List.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => item_entity_1.Item, item => item.list, { cascade: true }),
    __metadata("design:type", Array)
], List.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.lists),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], List.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], List.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], List.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], List.prototype, "updatedAt", void 0);
exports.List = List = __decorate([
    (0, typeorm_1.Entity)('lists')
], List);
//# sourceMappingURL=list.entity.js.map