import React from 'react';
import { useAuth } from './useAuth.js';
import { useNavigate } from 'react-router-dom';

function UserSection() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <button className="discordSignIn" onClick={login}>Sign in with Discord</button>
        );
    }

    return (
        <div>
            <button className="logoutButton" onClick={logout}>Log Out</button>
            <div className="profileDisplay">
                <button className="noBtnStyles hoverAnim" onClick={() => { navigate(`/User/${user.display_name}`) }}><img src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`} alt="avatar" height="50px" width="50px" className="userProfile" /></button>
            </div>
        </div>
    );
}

export default UserSection;