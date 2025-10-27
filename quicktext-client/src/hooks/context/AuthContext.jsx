import React, { createContext, useEffect, useState, useCallback } from "react";

import jwtDecode from "jwt-decode";

import {loginService} from  '../../services/api';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            const  resp  = await loginService(credentials); 
            console.log(resp);
            // setToken(token); 
        } catch (err) {
            console.error("Login failed:", err);
            throw err; 
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
    login,
    logout,
    };
    if (loading) 
        return <div> loading </div>
        
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};

export default AuthContext;
