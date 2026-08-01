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
exports.Schedule = exports.DayOfWeek = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MON"] = "MON";
    DayOfWeek["TUE"] = "TUE";
    DayOfWeek["WED"] = "WED";
    DayOfWeek["THU"] = "THU";
    DayOfWeek["FRI"] = "FRI";
    DayOfWeek["SAT"] = "SAT";
    DayOfWeek["SUN"] = "SUN";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
let Schedule = class Schedule {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, employeeId: { required: true, type: () => String }, dayOfWeek: { required: true, enum: require("./schedule.entity").DayOfWeek }, startTime: { required: true, type: () => Date }, endTime: { required: true, type: () => Date }, exceptionDate: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, employee: { required: true, type: () => require("./employee.entity").Employee } };
    }
};
exports.Schedule = Schedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Schedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], Schedule.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DayOfWeek,
        name: 'day_of_week',
    }),
    __metadata("design:type", String)
], Schedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time' }),
    __metadata("design:type", Date)
], Schedule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time' }),
    __metadata("design:type", Date)
], Schedule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'exception_date' }),
    __metadata("design:type", Date)
], Schedule.prototype, "exceptionDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Schedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Schedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.schedules),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Schedule.prototype, "employee", void 0);
exports.Schedule = Schedule = __decorate([
    (0, typeorm_1.Entity)('schedules')
], Schedule);
//# sourceMappingURL=schedule.entity.js.map