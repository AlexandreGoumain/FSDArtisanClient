import React, { type ReactNode, createContext, useReducer } from "react";

import { initialState, reducer } from "./authReducer";
import { type IActionAuth, type IStateAuth } from "./authTypes";

interface ContextProps {
    state: IStateAuth;
    dispatch: React.Dispatch<IActionAuth>;
}

export const AuthContext = createContext<ContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
