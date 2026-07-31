import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, tenantId: string) {
    const employee = this.employeesRepository.create({
      tenantId,
      position: createEmployeeDto.role,
      hourlyRate: createEmployeeDto.hourlyRate,
      paymentMethod: 'CASH' as any,
      paymentAccountRef: '',
      status: 'ACTIVE' as any,
    });

    return this.employeesRepository.save(employee);
  }

  async findAll(tenantId: string) {
    return this.employeesRepository.find({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, updateData: Partial<CreateEmployeeDto>, tenantId: string) {
    const employee = await this.findOne(id, tenantId);

    await this.employeesRepository.update(id, updateData);

    return this.employeesRepository.findOne({ where: { id } });
  }

  async remove(id: string, tenantId: string) {
    const employee = await this.findOne(id, tenantId);

    await this.employeesRepository.softDelete(id);

    return { message: 'Employee deleted successfully' };
  }
}
