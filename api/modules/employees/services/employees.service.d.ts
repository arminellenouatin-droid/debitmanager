import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
export declare class EmployeesService {
    private employeesRepository;
    constructor(employeesRepository: Repository<Employee>);
    create(createEmployeeDto: CreateEmployeeDto, tenantId: string): Promise<Employee>;
    findAll(tenantId: string): Promise<Employee[]>;
    findOne(id: string, tenantId: string): Promise<Employee>;
    update(id: string, updateData: Partial<CreateEmployeeDto>, tenantId: string): Promise<Employee>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
