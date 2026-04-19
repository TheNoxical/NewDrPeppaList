import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [user, setUser] = useState(undefined);
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log('API URL: ', import.meta.env.VITE_API_URL);
    //     fetch(`${import.meta.env.VITE_API_URL}/api/me`, { credentials: 'include' })
    //         .then(res => res.ok ? res.json() : null)
    //         .then(data => {
    //             setUser(data);
    //             if (data && !data.display_name) {
    //                 navigate('/setup');
    //             }
    //         })   
    //         .catch(() => setUser(null));
    // }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
            localStorage.setItem('token', urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setUser(null);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}`}
        })
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
    // const logout = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`;
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`;
    };

    return { user, login, logout };
}