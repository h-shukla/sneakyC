import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./authContext";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export interface AuthContextType {
    isLoggedIn: () => boolean;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    const checkAuth = useCallback(async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/me`,
                {
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                setLoggedIn(true);
                return true;
            } else {
                setLoggedIn(false);
                return false;
            }
        } catch (err) {
            setLoggedIn(false);
            console.error("Failed to check auth status:", err);
            return false;
        }
    }, []);

    // On mount, check if user is logged in
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const isLoggedIn = useCallback(() => loggedIn, [loggedIn]);

    const refreshAuth = useCallback(async () => {
        await checkAuth();
    }, [checkAuth]);

    const logout = useCallback(async () => {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
            withCredentials: true,
        });
        localStorage.removeItem("role");
        setLoggedIn(false);
        navigate("/");
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
