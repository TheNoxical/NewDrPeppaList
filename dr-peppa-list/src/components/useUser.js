import { useState, useEffect } from 'react';

export function useUser(displayName) {
    const [ user, setUser ] = useState(undefined);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (!displayName) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/user/${displayName}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data) {
                    setError("User not found");
                } else {
                    setUser(data);
                }
            }).catch(() => setError("Failed to fetch user"));

    }, [displayName]);

    return { user, error };
}