import React, { createContext, useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginService } from "../../services/api/authService";
import { getUser } from "../../services/api/user";
import {toast} from "react-hot-toast";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const initialToken = localStorage.getItem("token");

    const initialUser = (() => {
        if (!initialToken) return null;
        try {
            return jwtDecode(initialToken);
        } catch {
            return null;
        }
    })();

    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
                try {
                    const { data } = await getUser();
                    setUser(data.data);
                } catch (error) {

                    console.error("Failed to fetch user:", error);
                const status = error.response?.status;

                if (status === 401 || status === 403) {
                    setUser(null);
                    setToken(null);
                    toast.error(error?.response.data?.error?.message)
                    localStorage.removeItem("token");
                } else {
                    console.warn("Server unreachable — keeping token in storage");
                }
            }
        };
        fetchUser();
        }, [token]);

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            const response = await loginService(credentials);
            const token = response.data.data.token;
            setToken(token);
            localStorage.setItem("token", token);
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    const updateUser = useCallback((user) => {
        setUser(user);
    }, []);

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthContext;
