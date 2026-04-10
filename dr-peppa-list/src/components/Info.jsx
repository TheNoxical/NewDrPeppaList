import React from 'react';
import { BrowserRouter, Route, Router, NavLink, useParams } from 'react-router-dom';

function Info() {
    const { level }= useParams();

    return (
        <>
            <h1>{level}</h1>
        </>
    );

}

export default Info;