import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private employeesRepository;
    constructor(attendanceRepository: Repository<Attendance>, employeesRepository: Repository<Employee>);
    create(createAttendanceDto: CreateAttendanceDto, tenantId: string): Promise<Attendance>;
    findByEmployee(employeeId: string, tenantId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]>;
    findByDate(tenantId: string, date: Date): Promise<Attendance[]>;
    getDailyReport(tenantId: string, date: Date): Promise<{
        date: Date;
        totalEmployees: number;
        present: number;
        absent: number;
        late: number;
        attendances: Attendance[];
    }>;
}
