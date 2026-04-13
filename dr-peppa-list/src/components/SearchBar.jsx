import React, { useState } from 'react';
import Filter from '../assets/Filter.png';
import './SearchBar.css';

function SearchBar(props) {
    const { searchChange, placeholder, handleSubmit } = props;

    const [ show, setShow ] = useState(false);

    const [ sortType, setSortType ] = useState("aredl");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nlwTiers = ["Beginner", "Easy", "Medium", "Hard", "Very Hard", "Insane", "Remorseless", "Relentless", "Terrifying", "Catastrophic", "Inexorable", "Excruciating", "Fuck"];
    const tagsList = ["2.2", "2.1", "2.0", "1.9PS", "1.9", "1.8", "1.7", "1.6PS", "1.6", "1.5", "Medium", "Long", "XL", "XXL", "XXL+", "NONG", "2P", "Circles", "Clicksync", "Fast-Paced", "Timings", "Chokepoints", "Learny", "Memory", "High CPS", "Gimmicky", "Flow", "Slow-Paced", "Precision", "Bossfight", "Mirror", "Nerve Control", "Cube", "Ship", "Ball", "UFO", "Wave", "Robot", "Spider", "Old Swing", "New Swing", "Duals", "Overall"];

    const nlwTierCheckboxes = nlwTiers.map((tier) => {
        const paramTier = tier.replaceAll(' ', '');
        return (
            <div className="nlwCheckboxesContainer" key={paramTier + "Container"}>
                <input type="checkbox" key={paramTier} value={paramTier} id={paramTier} name="nlwTier"></input>
                <label htmlFor={paramTier} key={paramTier + "Label"}>{tier}</label>
            </div>
        );
    })

    const tagsCheckboxes = tagsList.map((tag) => {
        const paramTag = tag.replaceAll(' ', '');
        return (
            <div className="tagSelectorContainer" key={paramTag}>
                
            </div>
        );
    });

    return (
        <>
            <div className="searchBarContainer">
                <input type="search" placeholder={placeholder} onChange={searchChange} className="searchBar" />
                <button onClick={handleShow} className="modalShow"><img src={Filter} width="30" height="30"/></button>


                <div className={"modal " + show}>
                    <div className={"modalContent " + show}>
                        <form onSubmit={(e) => {
                            handleClose();
                            handleSubmit(e);
                        }}>
                            <h1>List Search Settings</h1>
                            <div className="filterSettingsContainer">
                                <div className="filterListOrder">
                                    <h2>Sort Type</h2>
                                    <label htmlFor="aredl">AREDL Rank</label>
                                    <input type="radio" name="sortType" value="aredl" id="aredl" checked={sortType === "aredl"} onChange={(e) => setSortType(e.target.value)}></input>
                                    <br />
                                    <label htmlFor="edel">EDEL Enjoyment</label>
                                    <input type="radio" name="sortType" value="edel" id="edel" checked={sortType === "edel"} onChange={(e) => setSortType(e.target.value)}></input>
                                    <br />
                                    <label htmlFor="gddl">GDDL Tier</label>
                                    <input type="radio" name="sortType" value="gddl" id="gddl" checked={sortType === "gddl"} onChange={(e) => setSortType(e.target.value)}></input>
                                    
                                </div>
                                <div className="otherFilters">
                                    <h2>Filter</h2>
                                    <h3>NLW Tiers:</h3>
                                    {nlwTierCheckboxes}            
                                </div>
                                <div className="tagFilters">
                                    <h2>Tags</h2>
                                </div>
                            </div>
                            <button type="submit" className="submit">Apply</button>
                            <button type="button" className="close" onClick={handleClose}>Close</button>
                            <button type="reset" className="reset">Reset All</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchBar;