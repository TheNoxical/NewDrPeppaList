import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Router, NavLink, useParams } from 'react-router-dom';
import './Info.css'
import { calculateMaxScore } from './score.js';

function Info(props) {
    const { level } = useParams();
    const { levelInfo, levelsList, aredlSortedList } = props;

    const scoreIndex = aredlSortedList.indexOf(level) + 1;

    const levelIndex = levelsList.indexOf(level);

    const [ levelValues, setLevelValues ] = useState(null);

    const [ levelCreators, setLevelCreators ] = useState(null);

    useEffect(() => {
        fetch(`/list/${level}.json`)
        .then(res => res.json())
        .then(data => setLevelValues(data));
    }, [level]);


    useEffect(() => {
        fetch(`https://api.aredl.net/v2/api/aredl/levels/${levelInfo[levelIndex].id}/creators`)
        .then(res => res.json())
        .then(data => setLevelCreators(data));
    }, [level]);

    const mappedTags = levelInfo[levelIndex].tags.map((tag) => {
        return <h3 key={tag} className="tag">{tag}</h3>
    });

    if (!levelValues) {
        return <h1>Loading...</h1>
    } else {

        return (
            <>
                <h1 className="levelName">{level}</h1>
                <p className="levelDescription">{levelInfo[levelIndex].description ? levelInfo[levelIndex].description : "This level has no description."}</p>
                <div className="levelTags">{mappedTags}</div>
                <iframe src={levelValues.verification} ></iframe>
                <div className="extraInfoContainer">
                    <div className="levelID">
                        <h2>Level ID</h2>
                        <h1>{levelInfo[levelIndex].level_id}</h1>
                    </div>
                    <div className="listPoints">
                        <h2>List Points</h2>
                        <h1>{calculateMaxScore(scoreIndex)}</h1>
                    </div>
                    <div className="edelEnjoyment">
                        <h2>EDEL Enjoyment</h2>
                        <h1>{Math.round(levelInfo[levelIndex].edel_enjoyment* 100) / 100}</h1>
                    </div>
                    <div className="peppaEnjoyment">
                        <h2>Peppa Enjoyment</h2>
                        <h1>{peppaEnjoyment(levelValues.records)}</h1>
                    </div>
                    <div className="nlwTier">
                        <h2>NLW Tier</h2>
                        <h1>{(levelInfo[levelIndex].nlw_tier) ? levelInfo[levelIndex].nlw_tier : "-" }</h1>
                    </div>
                    <div className="gddlTier">
                        <h2>GDDL Tier</h2>
                        <h1><a className="underlineEffect" target="_blank" href={"https://gdladder.com/level/" + levelInfo[levelIndex].level_id}>{Math.round(levelInfo[levelIndex].gddl_tier * 100) / 100}</a></h1>
                    </div>
                    <div>
                        <h1></h1>
                    </div>
                    <div className="aredlSpot">
                        <h2>AREDL Placement</h2>
                        <h1><a className="underlineEffect" target="_blank" href={"https://aredl.net/list/" + levelInfo[levelIndex].level_id}>#{levelInfo[levelIndex].position}</a></h1>
                    </div>
                </div>
                <div className="publisherInfoContainer">
                    <div id="publisher">
                        <h3 style={{color: "#338129"}}>Publisher: </h3>
                        <h3>{levelInfo[levelIndex].publisher.global_name}</h3>
                    </div>
                    <div id="verifiers">
                        <h3 style={{color: "#338129"}}>Verifiers:</h3>
                        <h3>{mapVerifiers(levelInfo[levelIndex].verifications)}</h3>
                    </div>
                    <div id="creators">
                        <h3 style={{color: "#338129"}}>Creators:</h3>
                        <h3>{mapLevelCreators(levelCreators, levelInfo[levelIndex].publisher.global_name)}</h3>
                    </div> 
                    <div id="peppaVerifier">
                        <h3 style={{color: "#338129"}}>First Peppa Victor:</h3>    
                        <h3>{levelValues.records[0].user}</h3>
                    </div>   
                </div>
            </>
        );
    }

}

// function checkSongInfo(songReturnValue) {
//     if (songReturnValue === null) {
//         return "NONG";
//     } else if (songReturnValue < 0) {
//         return "DEFAULT";
//     } else {
//         return songReturnValue;
//     }
// }

function peppaEnjoyment(victorsData) {
    let totalEnjoymentCount = 0;
    const enjoymentSum = victorsData.reduce((accumulator, victor) => {
        if (victor?.enjoyment === undefined) {
            return accumulator;
        }
        totalEnjoymentCount++;
        return accumulator + victor?.enjoyment;
    }, 0)

    if (enjoymentSum === 0) {
        return "-";
    }

    if (totalEnjoymentCount === 0) {
        return "-";
    }
    let average = enjoymentSum / totalEnjoymentCount;
    average = Math.round(average * 100) / 100;
    return average;
}

function mapLevelCreators(levelCreators, publisherFallback) {
    if (!levelCreators) {
        return "Loading...";
    } else if (levelCreators.length === 0) {
        return publisherFallback;
    } else {
        let mappedCreators = "";
        for (let i = 0; i < levelCreators.length; i++) {
            if (i != levelCreators.length - 1) {
                mappedCreators += (`${levelCreators[i].global_name}, `);
            } else {
                mappedCreators += (`${levelCreators[i].global_name}`);
            }
        }
        return mappedCreators;
    }
}

function mapVerifiers(levelVerifiers) {
    if (!levelVerifiers) {
        return "Loading...";
    } else {
        let mappedVerifiers = "";
        for (let i = 0; i < levelVerifiers.length; i++) {
            if (i != levelVerifiers.length - 1) {
                mappedVerifiers += (`${levelVerifiers[i].submitted_by.global_name}, `);
            } else {
                mappedVerifiers += (`${levelVerifiers[i].submitted_by.global_name}`);
            }
        }
        return mappedVerifiers;
    }
}


export default Info;