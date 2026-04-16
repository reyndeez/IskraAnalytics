export type Role = 'admin' | 'coach' | 'user';

export interface User {
    name: string;
    role: Role;
}
