import { UserResponse } from "./userResponse";

export interface UserPagedResponse{
    users: UserResponse[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}