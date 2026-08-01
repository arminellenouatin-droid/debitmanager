import { EmployeesService } from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto, tenantId: string): Promise<import("../entities/employee.entity").Employee>;
    findAll(tenantId: string): Promise<import("../entities/employee.entity").Employee[]>;
    findOne(id: string, tenantId: string): Promise<import("../entities/employee.entity").Employee>;
    update(id: string, updateData: Partial<CreateEmployeeDto>, tenantId: string): Promise<import("../entities/employee.entity").Employee>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
