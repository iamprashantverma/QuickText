import React, { createContext, useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginService } from "../../services/api/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const initialToken = localStorage.getItem("token");
    
    const initialUser = (() => {
        if (!initialToken) return null;
        try {
            const decoded = jwtDecode(initialToken);
            return decoded;
        } catch {
            return null;
        }
    })();

    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);

   
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);
            } catch (error) {
                console.error("Invalid token:", error);
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);

            const data  =  await loginService(credentials);

            setToken(data.data.data.token);

            localStorage.setItem("token",data.data.data.token);
            
            return data

        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    }, []);

    const value = {
        user,
        token,
        login,
        logout,
        loading
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

export default AuthContext;
