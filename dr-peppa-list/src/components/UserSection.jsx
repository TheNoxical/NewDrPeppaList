import React from 'react';
import { useAuth } from './useAuth.js';

function UserSection() {
    const { user, login, logout } = useAuth();
    console.log(user);

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
                <img src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`} alt="avatar" height="50px" width="50px" className="userProfile" />
                <strong><p className="displayNameText">{user.display_name}</p></strong>
            </div>
        </div>
    );
}

export default UserSection;