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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const table_entity_1 = require("../entities/table.entity");
let TablesService = class TablesService {
    constructor(tablesRepository) {
        this.tablesRepository = tablesRepository;
    }
    async create(createTableDto, tenantId) {
        const table = this.tablesRepository.create({
            number: createTableDto.name,
            capacity: createTableDto.capacity,
            name: createTableDto.location,
            tenantId,
            status: createTableDto.status ? createTableDto.status : table_entity_1.TableStatus.AVAILABLE,
        });
        return this.tablesRepository.save(table);
    }
    async findAll(tenantId) {
        return this.tablesRepository.find({
            where: { tenantId },
            order: { number: 'ASC' },
        });
    }
    async findAvailable(tenantId) {
        return this.tablesRepository.find({
            where: { tenantId, status: table_entity_1.TableStatus.AVAILABLE },
            order: { number: 'ASC' },
        });
    }
    async findOne(id, tenantId) {
        const table = await this.tablesRepository.findOne({
            where: { id, tenantId },
        });
        if (!table) {
            throw new common_1.NotFoundException('Table not found');
        }
        return table;
    }
    async update(id, updateTableDto, tenantId) {
        const table = await this.findOne(id, tenantId);
        const updateData = {};
        if (updateTableDto.name)
            updateData.number = updateTableDto.name;
        if (updateTableDto.capacity)
            updateData.capacity = updateTableDto.capacity;
        if (updateTableDto.location)
            updateData.name = updateTableDto.location;
        if (updateTableDto.status)
            updateData.status = updateTableDto.status;
        await this.tablesRepository.update(id, updateData);
        return this.findOne(id, tenantId);
    }
    async updateStatus(id, status, tenantId) {
        const table = await this.findOne(id, tenantId);
        await this.tablesRepository.update(id, { status });
        return this.tablesRepository.findOne({ where: { id } });
    }
    async remove(id, tenantId) {
        const table = await this.findOne(id, tenantId);
        await this.tablesRepository.softDelete(id);
        return { message: 'Table deleted successfully' };
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TablesService);
//# sourceMappingURL=tables.service.js.map