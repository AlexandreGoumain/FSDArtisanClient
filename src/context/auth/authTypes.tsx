export interface IStateAuth {
    isAuthenticated: boolean;
    authInfo?: {
        token: string;
        user: IAuthUser;
    };
}
export type IActionAuth = IActionLogin | IActionLogout;

export interface IActionLogin {
    type: "login" | "auth-check";
    payload: IAuthPayload;
}

export interface IAuthPayload {
    token: string;
    user: IAuthUser;
}
export interface IAuthUser {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface IActionLogout {
    type: "logout";
}
