import React, { Component } from 'react';
import './TopBar.css';
import placeholder from '../assets/placeholder.png'
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom'
import List from './pages/List.jsx';
import './Tab.css';
import Info from './Info.jsx';


class TopBar extends Component {

    constructor() {
        super();

        this.state = {
            listData: [],
            peppaList: []
        };
    }

    hoistListToState = (listData, peppaList) => {
        this.setState({ listData: listData });
        this.setState({ peppaList: peppaList });
    }
    

    render() {
        return (
            <BrowserRouter>
                <div id="topbar">
                    <div id="imageStuff">
                        <img src={placeholder} alt="logo" height="50px" width="50px" />
                        <h1>DPL</h1>
                            <code>v0.0.1</code>
                    </div>
                    <div id="tabs">
                        <NavLink to="/List" className="tab">List</NavLink>
                        <NavLink to="/Leaderboard" className="tab">Leaderboard</NavLink>
                        <NavLink to="/Packs" className="tab">Packs</NavLink>
                    </div>
                    <div id="userStuff">
                        <button className="submit">Submit A Record</button>
                        <img src={placeholder} alt="discord icon" height="50px" width="50px" />
                        <img src={placeholder} alt="user icon" height="50px" width="50px" />
                    </div>
                </div>
                <Routes>
                    <Route path="/List" element={<List hoistFunction={this.hoistListToState} />}>
                        <Route path="/List/:level" element={<Info levelInfo={this.state.listData} levelsList={this.state.peppaList} />} />
                    </Route>
                    <Route path="/Leaderboard" element={<h1>AHHHHHHHHH</h1>} />
                    <Route path="/Packs" element={<h1>AHHHHHHHHH</h1>} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default TopBar;