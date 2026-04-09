import React from 'react';

function LevelCard(props) {
    
    const { level, placement } = props
    
    return (
        <>
            <h1>{"#" + placement + ". " + level}</h1>
        </>
    );
}

export default LevelCard;