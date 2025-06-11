export interface IUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IUserState {
    currentUser: User | null;
    loading: boolean;
    error: string | null
}