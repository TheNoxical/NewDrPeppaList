import React from 'react';
import './Tab.css';

function Tab(props) {
    
    const { text, isActive, changeActive } = props;
    let active;

    if (isActive) {
        active = "active";
    } else {
        active = "";
    }
    return (
        <button className={"tab " + active} onClick={changeActive}>
            {text}
        </button>
    )
}

export default Tab;