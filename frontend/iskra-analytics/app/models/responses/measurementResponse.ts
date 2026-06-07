import { StudentShortResponse } from "./StudentShortResponse";

export interface MeasurementResponse {
    student: StudentShortResponse;
    value: number;
    unit: string;
}