import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, tenantId: string) {
    const { employeeId, latitude, longitude, notes } = createAttendanceDto;

    // Validate employee
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        createdAt: () => `DATE(createdAt) = DATE('${today.toISOString()}')`,
      } as any,
    });

    if (existingAttendance) {
      throw new BadRequestException('Employee already checked in today');
    }

    // Calculate distance from workplace if coordinates provided
    let isWithinGeofence = true;
    if (latitude && longitude) {
      // TODO: Implement geofence check against company location
      isWithinGeofence = true;
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      checkInAt: new Date(),
      checkInLat: latitude || 0,
      checkInLng: longitude || 0,
      status: AttendanceStatus.ON_TIME,
      exceptionReason: notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  async findByEmployee(employeeId: string, tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId, employeeId };

    if (startDate && endDate) {
      where.createdAt = () => `createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
    }

    return this.attendanceRepository.find({
      where,
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDate(tenantId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.attendanceRepository.find({
      where: {
        tenantId,
        createdAt: () => `createdAt BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'`,
      } as any,
      relations: ['employee'],
      order: { createdAt: 'ASC' },
    });
  }

  async getDailyReport(tenantId: string, date: Date) {
    const attendances = await this.findByDate(tenantId, date);

    const report = {
      date,
      totalEmployees: 0,
      present: 0,
      absent: 0,
      late: 0,
      attendances: attendances,
    };

    // Group by employee and calculate stats
    const employeeAttendance = new Map<string, any>();

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
      } else {
        record.checkIn = attendance.checkInAt;
        record.status = 'PRESENT';
      }
    }

    report.totalEmployees = employeeAttendance.size;
    report.present = Array.from(employeeAttendance.values()).filter(r => r.status === 'PRESENT').length;
    report.absent = report.totalEmployees - report.present;

    return report;
  }
}
