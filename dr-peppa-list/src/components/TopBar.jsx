import React, { Component } from 'react';
import './TopBar.css';
import Tab from './Tab.jsx';
import placeholder from '../assets/placeholder.png'

class TopBar extends Component {
    
    constructor() {
        super();
        this.state = {
            activeTab: "List"
        };
    }

    onChangeActive = (event) => {
        this.setState({ activeTab: event.target.textContent });
    }
    
    render() {
        return (
            <div id="topbar">
                <div id="imageStuff">
                    <img src={placeholder} alt="logo" height="50px" width="50px" />
                    <h1>DPL</h1>
                    <code>v0.0.1</code>
                </div>
                <div id="tabs">
                    <Tab text="List" isActive={(this.state.activeTab === "List") ? "true" : ""} changeActive={this.onChangeActive} />
                    <Tab text="Leaderboard" isActive={(this.state.activeTab === "Leaderboard") ? "true" : ""} changeActive={this.onChangeActive} />
                    <Tab text="Packs" isActive={(this.state.activeTab === "Packs") ? "true" : ""} changeActive={this.onChangeActive} />
                </div>
                <div id="userStuff">
                    <button className="submit">Submit A Record</button>
                    <img src={placeholder} alt="discord icon" height="50px" width="50px" />
                    <img src={placeholder} alt="user icon" height="50px" width="50px" />
                </div>
            </div>
        );
    }
}

export default TopBar;