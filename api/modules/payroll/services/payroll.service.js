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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_entity_1 = require("../entities/payroll.entity");
const employee_entity_1 = require("../entities/employee.entity");
let PayrollService = class PayrollService {
    constructor(payrollRepository, employeesRepository) {
        this.payrollRepository = payrollRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(createPayrollDto, tenantId) {
        const { employeeId, startDate, endDate, baseSalary, hoursWorked, overtimeHours, bonuses, deductions, advances } = createPayrollDto;
        const employee = await this.employeesRepository.findOne({
            where: { id: employeeId, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const hourlyRate = baseSalary / 160;
        const regularPay = hoursWorked * hourlyRate;
        const overtimePay = overtimeHours * hourlyRate * 1.5;
        const totalBonuses = bonuses || 0;
        const totalDeductions = deductions || 0;
        const totalAdvances = advances?.reduce((sum, a) => sum + a.amount, 0) || 0;
        const grossPay = regularPay + overtimePay + totalBonuses;
        const netPay = grossPay - totalDeductions - totalAdvances;
        const payroll = this.payrollRepository.create({
            tenantId,
            employeeId,
            startDate,
            endDate,
            baseSalary,
            hoursWorked,
            overtimeHours,
            regularPay,
            overtimePay,
            bonuses: totalBonuses,
            deductions: totalDeductions,
            advances: totalAdvances,
            grossPay,
            netPay,
            status: payroll_entity_1.PayrollStatus.PENDING,
        });
        return this.payrollRepository.save(payroll);
    }
    async findAll(tenantId, startDate, endDate) {
        const where = { tenantId };
        if (startDate && endDate) {
            where.startDate = () => `startDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
        }
        return this.payrollRepository.find({
            where,
            relations: ['employee'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByEmployee(employeeId, tenantId) {
        return this.payrollRepository.find({
            where: { tenantId, employeeId },
            relations: ['employee'],
            order: { createdAt: 'DESC' },
        });
    }
    async approve(id, tenantId) {
        const payroll = await this.payrollRepository.findOne({
            where: { id, tenantId },
        });
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        await this.payrollRepository.update(id, {
            status: payroll_entity_1.PayrollStatus.APPROVED,
            approvedAt: new Date(),
        });
        return this.payrollRepository.findOne({ where: { id } });
    }
    async processPayment(id, tenantId) {
        const payroll = await this.payrollRepository.findOne({
            where: { id, tenantId },
        });
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        if (payroll.status !== payroll_entity_1.PayrollStatus.APPROVED) {
            throw new Error('Payroll must be approved before payment');
        }
        await this.payrollRepository.update(id, {
            status: payroll_entity_1.PayrollStatus.PAID,
            paidAt: new Date(),
        });
        return this.payrollRepository.findOne({ where: { id } });
    }
    async getPayrollSummary(tenantId, month) {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const payrolls = await this.findAll(tenantId, startOfMonth, endOfMonth);
        const summary = {
            month,
            totalEmployees: payrolls.length,
            totalGrossPay: payrolls.reduce((sum, p) => sum + p.grossPay, 0),
            totalNetPay: payrolls.reduce((sum, p) => sum + p.netPay, 0),
            totalBonuses: payrolls.reduce((sum, p) => sum + p.bonuses, 0),
            totalDeductions: payrolls.reduce((sum, p) => sum + p.deductions, 0),
            totalAdvances: payrolls.reduce((sum, p) => sum + p.advances, 0),
            pending: payrolls.filter(p => p.status === payroll_entity_1.PayrollStatus.PENDING).length,
            approved: payrolls.filter(p => p.status === payroll_entity_1.PayrollStatus.APPROVED).length,
            paid: payrolls.filter(p => p.status === payroll_entity_1.PayrollStatus.PAID).length,
        };
        return summary;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_entity_1.Payroll)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map