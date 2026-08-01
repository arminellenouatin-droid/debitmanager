"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTableDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_table_dto_1 = require("./create-table.dto");
class UpdateTableDto extends (0, mapped_types_1.PartialType)(create_table_dto_1.CreateTableDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTableDto = UpdateTableDto;
//# sourceMappingURL=update-table.dto.js.map