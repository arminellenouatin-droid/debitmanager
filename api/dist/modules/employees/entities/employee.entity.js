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
exports.Employee = exports.EmployeeStatus = exports.PaymentMethod = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const schedule_entity_1 = require("./schedule.entity");
const attendance_entity_1 = require("../../attendance/entities/attendance.entity");
const payroll_entity_1 = require("../../payroll/entities/payroll.entity");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "ACTIVE";
    EmployeeStatus["ON_LEAVE"] = "ON_LEAVE";
    EmployeeStatus["TERMINATED"] = "TERMINATED";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
let Employee = class Employee {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, userId: { required: true, type: () => String }, position: { required: true, type: () => String }, hourlyRate: { required: true, type: () => Number }, monthlySalary: { required: true, type: () => Number }, paymentMethod: { required: true, enum: require("./employee.entity").PaymentMethod }, paymentAccountRef: { required: true, type: () => String }, idDocumentUrl: { required: true, type: () => String }, contractDocumentUrl: { required: true, type: () => String }, status: { required: true, enum: require("./employee.entity").EmployeeStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, user: { required: true, type: () => require("../../users/entities/user.entity").User }, schedules: { required: true, type: () => [require("./schedule.entity").Schedule] }, attendances: { required: true, type: () => [require("../../attendance/entities/attendance.entity").Attendance] }, payrolls: { required: true, type: () => [require("../../payroll/entities/payroll.entity").Payroll] } };
    }
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Employee.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 80 }),
    __metadata("design:type", String)
], Employee.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hourly_rate', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'monthly_salary', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "monthlySalary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
    }),
    __metadata("design:type", String)
], Employee.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, name: 'payment_account_ref' }),
    __metadata("design:type", String)
], Employee.prototype, "paymentAccountRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'id_document_url' }),
    __metadata("design:type", String)
], Employee.prototype, "idDocumentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'contract_document_url' }),
    __metadata("design:type", String)
], Employee.prototype, "contractDocumentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EmployeeStatus,
        default: EmployeeStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_entity_1.Schedule, (schedule) => schedule.employee),
    __metadata("design:type", Array)
], Employee.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_entity_1.Attendance, (attendance) => attendance.employee),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payroll_entity_1.Payroll, (payroll) => payroll.employee),
    __metadata("design:type", Array)
], Employee.prototype, "payrolls", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employees'),
    (0, typeorm_1.Index)(['tenantId'])
], Employee);
//# sourceMappingURL=employee.entity.js.map