import { Repository } from 'typeorm';
import { Table, TableStatus } from '../entities/table.entity';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
export declare class TablesService {
    private tablesRepository;
    constructor(tablesRepository: Repository<Table>);
    create(createTableDto: CreateTableDto, tenantId: string): Promise<Table>;
    findAll(tenantId: string): Promise<Table[]>;
    findAvailable(tenantId: string): Promise<Table[]>;
    findOne(id: string, tenantId: string): Promise<Table>;
    update(id: string, updateTableDto: UpdateTableDto, tenantId: string): Promise<Table>;
    updateStatus(id: string, status: TableStatus, tenantId: string): Promise<Table>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
