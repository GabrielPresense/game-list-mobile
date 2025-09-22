"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateListDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_list_dto_1 = require("./create-list.dto");
class UpdateListDto extends (0, swagger_1.PartialType)(create_list_dto_1.CreateListDto) {
}
exports.UpdateListDto = UpdateListDto;
//# sourceMappingURL=update-list.dto.js.map