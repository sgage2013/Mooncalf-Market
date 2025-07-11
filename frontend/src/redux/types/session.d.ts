
export interface SessionInitialState {
    user: null | IUser;
    loading: boolean;
}

export interface IUser {
    id: number;
    username: string;
    email: string;
}
export interface IFullUser {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface IPublicUser {
    id: number;
    username: string;
}

export interface IUserState {
    user: IFullUser | null;
    allUsers: { [id: number]: IPublicUser}
    errors: string | null
}

export interface ISignUpUser{
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}


export interface ICredentials {
    credential?: string;
    email?: string;
    password: string;

}
