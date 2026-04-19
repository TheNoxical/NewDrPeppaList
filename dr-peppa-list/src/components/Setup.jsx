import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Setup.css';

function Setup() {
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (displayName.trim() === '') {
            setError('Please enter a username');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/setup', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: displayName })
            });

            if (res.ok) {
                navigate('/');
            } else {
                setError('Something went wrong, please try again');
            }


        } catch (err) {
            setError('Something went wrong, please try again');
        }
    }

    return (
        <div className="setupForm">
            <h1>Please choose a display name</h1>
            <p>This is the name that will appear on the site for completions, it doesn't have to match your discord username. If you have a name from the old Dr Peppa List, use that one</p>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter a display name" />
            <button onClick={handleSubmit}>Continue</button>
            {error && <p className="submitError">{error}</p>}
        </div>
    );

}

export default Setup;