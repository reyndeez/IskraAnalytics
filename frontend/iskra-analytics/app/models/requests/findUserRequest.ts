export interface FindUserRequest{
    search?: string;
    roleId?: string;
    sortId?: string;
    isDescending: boolean;
    page: number;
    pageSize: number;
}