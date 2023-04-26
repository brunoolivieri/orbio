import * as React from "react";
import axios from '../services/AxiosApi';

const AuthenticationContext = React.createContext({});

export function AuthProvider({ children }) {

    const [user, setUser] = React.useState(null);
    const isAuthenticated = !!user;

    async function verifyAuthentication() {
        try {
            const response = await axios.get("api/user-data");
            setUser(response.data);
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async function login(formData) {
        try {
            await axios.post("api/login", formData);
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async function logout() {
        try {
            await axios.post("api/logout");
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    return (
        <AuthenticationContext.Provider value={{ user, login, logout, verifyAuthentication, isAuthenticated }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

export function useAuth() {
    return React.useContext(AuthenticationContext);
}