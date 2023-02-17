import * as React from "react";
import axios from '../../services/AxiosApi';

const AuthenticationContext = React.createContext({});

export function AuthProvider({ children }) {

    const [user, setUser] = React.useState(null);
    const isAuthenticated = !!user;

    async function verifyAuthentication() {

        const response = await axios.get(`${process.env.MIX_APP_URL}/api/auth/user-data`);
        setUser(response.data);

    }

    async function login(formData) {

        try {

            const response = await axios.post(`${process.env.MIX_APP_URL}/api/auth/login`, formData);

            setUser(response.data.user);

            setTimeout(() => {
                window.location = "/internal";
            }, [1000]);

        } catch (error) {

            console.log(error);
            throw error;

        }
    }

    async function logout() {

        try {

            await axios.post(`${process.env.MIX_APP_URL}/api/auth/logout`);

            setTimeout(() => {
                window.location = `${process.env.MIX_APP_URL}/login`;
            }, [1000]);


        } catch (error) {

            console.log(error);
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