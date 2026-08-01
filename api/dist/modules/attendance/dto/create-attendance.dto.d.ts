export declare class CreateAttendanceDto {
    employeeId: string;
    type: 'CHECK_IN' | 'CHECK_OUT';
    latitude?: number;
    longitude?: number;
    notes?: string;
}
