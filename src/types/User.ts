type UserRole = "admin" | "user";

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    rol: UserRole
    
}


