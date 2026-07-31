import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Table, TableStatus } from '../entities/table.entity';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto, tenantId: string) {
    const table = this.tablesRepository.create({
      number: createTableDto.name,
      capacity: createTableDto.capacity,
      name: createTableDto.location,
      tenantId,
      status: createTableDto.status ? createTableDto.status as TableStatus : TableStatus.AVAILABLE,
    });

    return this.tablesRepository.save(table);
  }

  async findAll(tenantId: string) {
    return this.tablesRepository.find({
      where: { tenantId },
      order: { number: 'ASC' },
    });
  }

  async findAvailable(tenantId: string) {
    return this.tablesRepository.find({
      where: { tenantId, status: TableStatus.AVAILABLE },
      order: { number: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const table = await this.tablesRepository.findOne({
      where: { id, tenantId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto, tenantId: string) {
    const table = await this.findOne(id, tenantId);

    const updateData: any = {};
    if (updateTableDto.name) updateData.number = updateTableDto.name;
    if (updateTableDto.capacity) updateData.capacity = updateTableDto.capacity;
    if (updateTableDto.location) updateData.name = updateTableDto.location;
    if (updateTableDto.status) updateData.status = updateTableDto.status as TableStatus;

    await this.tablesRepository.update(id, updateData);

    return this.findOne(id, tenantId);
  }

  async updateStatus(id: string, status: TableStatus, tenantId: string) {
    const table = await this.findOne(id, tenantId);

    await this.tablesRepository.update(id, { status });

    return this.tablesRepository.findOne({ where: { id } });
  }

  async remove(id: string, tenantId: string) {
    const table = await this.findOne(id, tenantId);

    await this.tablesRepository.softDelete(id);

    return { message: 'Table deleted successfully' };
  }
}
