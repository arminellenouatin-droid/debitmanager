import { TablesService } from '../services/tables.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(createTableDto: CreateTableDto, tenantId: string): Promise<import("../entities/table.entity").Table>;
    findAll(tenantId: string): Promise<import("../entities/table.entity").Table[]>;
    findAvailable(tenantId: string): Promise<import("../entities/table.entity").Table[]>;
    findOne(id: string, tenantId: string): Promise<import("../entities/table.entity").Table>;
    update(id: string, updateTableDto: UpdateTableDto, tenantId: string): Promise<import("../entities/table.entity").Table>;
    updateStatus(id: string, body: {
        status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
    }, tenantId: string): Promise<import("../entities/table.entity").Table>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
