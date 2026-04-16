import React, { Component } from 'react';
import './TopBar.css';
import placeholder from '../assets/placeholder.png'
import { BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import List from './pages/List.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import './Tab.css';
import Info from './Info.jsx';


class TopBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listData: [],
            peppaList: [],
            aredlSortedList: [],
            level: props.params
        };
    }

    hoistListToState = (listData, peppaList, aredlSortedList) => {
        this.setState({ listData: listData });
        this.setState({ peppaList: peppaList });
        this.setState({ aredlSortedList: aredlSortedList })
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
                        <button className="recordSubmit">Submit A Record</button>
                        <img src={placeholder} alt="discord icon" height="50px" width="50px" />
                        <img src={placeholder} alt="user icon" height="50px" width="50px" />
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={<Navigate replace to={`/List`} />} />
                    <Route path="/List" element={<List hoistFunction={this.hoistListToState} />}>
                        <Route path="/List/:level" element={<Info levelInfo={this.state.listData} levelsList={this.state.peppaList} aredlSortedList={this.state.aredlSortedList}/>} />
                    </Route>
                    <Route path="/Leaderboard" element={<Leaderboard />} />
                    <Route path="/Packs" element={<h1>AHHHHHHHHH</h1>} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default TopBar;