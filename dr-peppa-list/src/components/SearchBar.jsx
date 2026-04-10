import React from 'react';
import './SearchBar.css';

function SearchBar(props) {
    const { searchChange, placeholder } = props;

    return (
        <>
            <div className="searchBarContainer">
                <input type="search" placeholder={placeholder} onChange={searchChange} className="searchBar" />
            </div>
        </>
    );
}

export default SearchBar;