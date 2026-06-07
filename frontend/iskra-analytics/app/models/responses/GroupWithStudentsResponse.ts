import { StudentShortResponse } from "./StudentShortResponse";

export interface GroupWithStudentsResponse {
    id: number,
    name: string,
    students: StudentShortResponse[]
}