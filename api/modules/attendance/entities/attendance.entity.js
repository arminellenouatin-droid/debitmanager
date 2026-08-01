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
exports.Attendance = exports.AttendanceStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employees/entities/employee.entity");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["ON_TIME"] = "ON_TIME";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["EXCEPTION"] = "EXCEPTION";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
let Attendance = class Attendance {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, employeeId: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, checkInAt: { required: true, type: () => Date }, checkInLat: { required: true, type: () => Number }, checkInLng: { required: true, type: () => Number }, status: { required: true, enum: require("./attendance.entity").AttendanceStatus }, exceptionReason: { required: true, type: () => String }, exceptionGrantedByUserId: { required: true, type: () => String }, checkOutAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, employee: { required: true, type: () => require("../../employees/entities/employee.entity").Employee } };
    }
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], Attendance.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Attendance.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkInAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_lat', type: 'decimal', precision: 9, scale: 6 }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkInLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_lng', type: 'decimal', precision: 9, scale: 6 }),
    __metadata("design:type", Number)
], Attendance.prototype, "checkInLng", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AttendanceStatus,
        default: AttendanceStatus.ON_TIME,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255, name: 'exception_reason' }),
    __metadata("design:type", String)
], Attendance.prototype, "exceptionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'exception_granted_by_user_id' }),
    __metadata("design:type", String)
], Attendance.prototype, "exceptionGrantedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'check_out_at' }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOutAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.attendances),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Attendance.prototype, "employee", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendance'),
    (0, typeorm_1.Index)(['tenantId'])
], Attendance);
//# sourceMappingURL=attendance.entity.js.map