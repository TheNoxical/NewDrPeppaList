import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [user, setUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/me`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setUser(data);
                if (data && !data.display_name) {
                    navigate('/setup');
                }
            })   
            .catch(() => setUser(null));
    }, []);

    const login = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
    const logout = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`;

    return { user, login, logout };
}