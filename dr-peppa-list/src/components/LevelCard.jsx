import React from 'react';
import './LevelCard.css';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';

function LevelCard(props) {
    
    const { level, placement } = props
    
    return (
        <>
            <div className="card">
                <NavLink to={"/List/" + level}>{"#" + placement + ". " + level}</NavLink>
            </div>
        </>
    );
}

export default LevelCard;