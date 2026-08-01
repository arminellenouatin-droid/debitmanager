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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("../entities/attendance.entity");
const employee_entity_1 = require("../../employees/entities/employee.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, employeesRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(createAttendanceDto, tenantId) {
        const { employeeId, latitude, longitude, notes } = createAttendanceDto;
        const employee = await this.employeesRepository.findOne({
            where: { id: employeeId, tenantId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                employeeId,
                createdAt: () => `DATE(createdAt) = DATE('${today.toISOString()}')`,
            },
        });
        if (existingAttendance) {
            throw new common_1.BadRequestException('Employee already checked in today');
        }
        let isWithinGeofence = true;
        if (latitude && longitude) {
            isWithinGeofence = true;
        }
        const attendance = this.attendanceRepository.create({
            employeeId,
            checkInAt: new Date(),
            checkInLat: latitude || 0,
            checkInLng: longitude || 0,
            status: attendance_entity_1.AttendanceStatus.ON_TIME,
            exceptionReason: notes,
        });
        return this.attendanceRepository.save(attendance);
    }
    async findByEmployee(employeeId, tenantId, startDate, endDate) {
        const where = { tenantId, employeeId };
        if (startDate && endDate) {
            where.createdAt = () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
        }
        return this.attendanceRepository.find({
            where,
            relations: ['employee'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByDate(tenantId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.attendanceRepository.find({
            where: {
                tenantId,
                createdAt: () => `createdAt BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
            },
            relations: ['employee'],
            order: { createdAt: 'ASC' },
        });
    }
    async getDailyReport(tenantId, date) {
        const attendances = await this.findByDate(tenantId, date);
        const report = {
            date,
            totalEmployees: 0,
            present: 0,
            absent: 0,
            late: 0,
            attendances: attendances,
        };
        const employeeAttendance = new Map();
        for (const attendance of attendances) {
            if (!employeeAttendance.has(attendance.employeeId)) {
                employeeAttendance.set(attendance.employeeId, {
                    employee: attendance.employee,
                    checkIn: null,
                    checkOut: null,
                    status: 'ABSENT',
                });
            }
            const record = employeeAttendance.get(attendance.employeeId);
            if (attendance.checkOutAt) {
                record.checkOut = attendance.checkOutAt;
            }
            else {
                record.checkIn = attendance.checkInAt;
                record.status = 'PRESENT';
            }
        }
        report.totalEmployees = employeeAttendance.size;
        report.present = Array.from(employeeAttendance.values()).filter(r => r.status === 'PRESENT').length;
        report.absent = report.totalEmployees - report.present;
        return report;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map