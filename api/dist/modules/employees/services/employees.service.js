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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../entities/employee.entity");
let EmployeesService = class EmployeesService {
    constructor(employeesRepository) {
        this.employeesRepository = employeesRepository;
    }
    async create(createEmployeeDto, tenantId) {
        const employee = this.employeesRepository.create({
            tenantId,
            position: createEmployeeDto.role,
            hourlyRate: createEmployeeDto.hourlyRate,
            paymentMethod: 'CASH',
            paymentAccountRef: '',
            status: 'ACTIVE',
        });
        return this.employeesRepository.save(employee);
    }
    async findAll(tenantId) {
        return this.employeesRepository.find({
            where: { tenantId },
        });
    }
    async findOne(id, tenantId) {
        const employee = await this.employeesRepository.findOne({
            where: { id, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async update(id, updateData, tenantId) {
        const employee = await this.findOne(id, tenantId);
        await this.employeesRepository.update(id, updateData);
        return this.employeesRepository.findOne({ where: { id } });
    }
    async remove(id, tenantId) {
        const employee = await this.findOne(id, tenantId);
        await this.employeesRepository.softDelete(id);
        return { message: 'Employee deleted successfully' };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map