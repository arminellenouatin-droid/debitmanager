import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto, tenantId: string): Promise<import("../entities/attendance.entity").Attendance>;
    findByEmployee(employeeId: string, tenantId: string, startDate?: string, endDate?: string): Promise<import("../entities/attendance.entity").Attendance[]>;
    getDailyReport(tenantId: string, date?: string): Promise<{
        date: Date;
        totalEmployees: number;
        present: number;
        absent: number;
        late: number;
        attendances: import("../entities/attendance.entity").Attendance[];
    }>;
}
