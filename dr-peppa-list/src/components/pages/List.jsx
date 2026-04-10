import React, { Component } from 'react';
import './List.css';
import LevelCard from '../LevelCard.jsx';
import SearchBar from '../SearchBar.jsx';
import { BrowserRouter, Route, Routes, NavLink, Outlet } from 'react-router-dom';

class List extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            peppaList: [], // The unordered list of levels to go on the list
            listInfo: [], // Parallel to peppaList, except containing the extra information for the levels
            sortedList: [], // The list of levels to go on the list, but sorted based on the selected criteria, default is AREDL
            aredlSortedList: [], // The list of levels sorted by AREDL placements, needed for the scoring algorithm
            sortedData: [], // A parallel list to sortedList, except containing the extra information of all the levels, needed for the Info page
            generatedList: [], // Parallel to sortedList and sortedData, just mapped to have the CardList components so the list can actually load. This is then filtered by the search query
            searchField: '', // Updates to contain the text in the search bar and then filters the generatedList based on this
            hoistListToState: props.hoistFunction // Function passed down from TopBar, allowing this component to send the lists up to TopBar and then passed as props down to Info
        }
    }

    componentDidMount() {
        

        // This gets the peppa list levels from the _list.json file
        try {
            fetch("../../../list/_list.json").then(resp => resp.json()).then(async (resp2) => {

                const levelInfoPromises = resp2.map((level) => {
                    return this.grabLevelsFromAPI(level);
                });

                await Promise.all(levelInfoPromises).then(values => this.setState({ listInfo: values }));
                
                await this.setState({ peppaList: resp2 });

                this.sortList("aredl");

                this.setState({ aredlSortedList: this.sortList("aredl") });

                
            });

        } catch (err) {
            console.log(`There was an error fetching the peppa list: ${err}`);
        }


        
    }

    async grabLevelsFromAPI(level) {
        const request = await fetch("../../../list/" + level + ".json");
        const response = await request.json();
        const id = response.id;
        const requestToAREDL = await fetch("https://api.aredl.net/v2/api/aredl/levels/" + id);
        const responseFromAREDL = await requestToAREDL.json();
        return responseFromAREDL;
    }

    sortList(sortingCriteria) {
        
        const listCopy = this.state.peppaList.map(value => value);
        let data = listCopy.map((level, index) => {
            return {level: level, aredlSpot: this.state.listInfo[index].position, edelEnjoyment: this.state.listInfo[index].edel_enjoyment, gddlTier: this.state.listInfo[index].gddl_tier}
        })

        if (sortingCriteria === "aredl") {
            // Insertion sort simultaneously on data and listCopy
            for (let i = 1; i < data.length; i++) {
                let j = i;
                while (j > 0 && (data[j].aredlSpot < data[j - 1].aredlSpot)) {
                    let dataTemp = data[j];
                    let listCopyTemp = listCopy[j];
                    data[j] = data[j - 1];
                    listCopy[j] = listCopy[j - 1];
                    data[j - 1] = dataTemp;
                    listCopy[j - 1] = listCopyTemp;
                    j--;
                }
            }    
        }

        if (sortingCriteria === "edel") {
            for (let i = 1; i < data.length; i++) {
                let j = i;
                while (j > 0 && (data[j].edelEnjoyment > data[j - 1].edelEnjoyment)) {
                    let dataTemp = data[j];
                    let listCopyTemp = listCopy[j];
                    data[j] = data[j - 1];
                    listCopy[j] = listCopy[j - 1];
                    data[j - 1] = dataTemp;
                    listCopy[j - 1] = listCopyTemp;
                    j--;
                }
            }
        }

        if (sortingCriteria === "gddl") {
            for (let i = 1; i < data.length; i++) {
                let j = i;
                while (j > 0 && (data[j].gddlTier > data[j - 1].gddlTier)) {
                    let dataTemp = data[j];
                    let listCopyTemp = listCopy[j];
                    data[j] = data[j - 1];
                    listCopy[j] = listCopy[j - 1];
                    data[j - 1] = dataTemp;
                    listCopy[j - 1] = listCopyTemp;
                    j--;
                }
            }
        }

        const listComponents = listCopy.map((level, index) => {
            return <LevelCard level={level} placement={index + 1} key={index + 1} />
        });

        this.setState({ sortedList: listCopy });
        this.setState({ sortedData: data });
        this.state.hoistListToState(this.state.listInfo, this.state.peppaList);
        this.setState({ generatedList: listComponents });
    }

    onSearchChange = (event) => {
        this.setState({ searchField: event.target.value });
    }

    render() {
        if (this.state.peppaList.length === 0 || this.state.listInfo.length === 0 || this.state.sortedList.length === 0 || this.state.generatedList.length === 0) {
            return <h1>Loading...</h1>
        } else {

            const filteredList = this.state.generatedList.filter((level) => {
                return level.props.level.toLowerCase().includes(this.state.searchField.toLowerCase());
            });
  
            return (
                <div className="page">
                    <div className="cardContainer">
                        <SearchBar placeholder="Search Levels" searchChange={this.onSearchChange} />
                        {filteredList}
                    </div>
                    <div className="infoContainer">
                        <Outlet />
                    </div>
                </div>
            );
        }
    }

}

export default List;