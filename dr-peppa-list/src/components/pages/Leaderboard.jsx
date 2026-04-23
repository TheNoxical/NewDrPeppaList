import React from 'react';
import './Leaderboard.css';
import { calculateScore } from '../score.js';
import { useUser } from '../useUser.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Leaderboard(props) {
    
    const aredlList = props.aredlSortedList;
    const peppaList = props.peppaSortedList;


    if (aredlList === undefined || aredlList === undefined) {
        return (<h1>Loading...</h1>)
    }

    // Makes a users array storing an object for each user with all the information needed for the leaderboard
    let users = [];
    peppaList.map((level, index) => {
        level.records.map(record => {
            
            const userIndex = users.findIndex(user => user?.user === record.user)
            
            if (userIndex === -1) {
                users.push({
                    user: record.user,
                    totalPoints: calculateScore(index + 1, record.percent),
                    completions: [{
                        position: index + 1,
                        percent: record.percent,
                        level: aredlList[index].name,
                        points: calculateScore(index + 1, record.percent)
                    }]
                })
            } else {
                users[userIndex].totalPoints += calculateScore(index + 1, record.percent);
                users[userIndex].completions.push({
                    position: index + 1,
                    percent: record.percent,
                    level: aredlList[index].name,
                    points: calculateScore(index + 1, record.percent)
                })
            }
        })
    })


    // Sorts users by total points
    for (let i = 1; i < users.length; i++) {
        let j = i;
        while (j > 0 && users[j].totalPoints > users[j - 1].totalPoints) {
            let temp = users[j];
            users[j] = users[j - 1];
            users[j - 1] = temp;
            j--;
        }
    }


    const [ active, setActive ] = useState(users[0].user)
    const [ activeIndex, setActiveIndex ] = useState(0);
    
    

    let userCards = users.map((user, index) => {
        return (
            <button className={`noBtnStyles userCard ${(active === user.user) ? "activeUser" : ""}`} onClick={() => {setActive(user.user); setActiveIndex(index)}} key={user.user}>
                <h1>{`#${index + 1}`}</h1>
                <h1>{`${Math.round(user.totalPoints * 100) / 100}`}</h1>
                <h1>{`${user.user}`}</h1>
            </button>
        );
    })


    let completedList = users[activeIndex].completions.filter(level => level.percent === 100);
    let progressedList = users[activeIndex].completions.filter(level => level.percent !== 100);

    let mappedCompletions = completedList.map(completion => {
        return <div key={completion.position} className="mappedCompletion">
            <h1>{`#${completion.position} ${completion.level}`}</h1>
            <h1>{`+${completion.points}`}</h1>
        </div>
    });

    let mappedProgressions = progressedList.map(completion => {
        return <div key={completion.position} className="mappedCompletion">
            <h1>{`#${completion.position} ${completion.percent}% ${completion.level}`}</h1>
            <h1>{`+${completion.points}`}</h1>
        </div>
    });

    console.log("Completed", completedList, "Progressed", progressedList)

    let infoCard = <div className="leaderboardInfoCard">
        <Link to={`/User/${active}`} className="noBtnStyles"><h1 className="currentUserDisplay underlineEffect">{`#${activeIndex + 1} ${active}`}</h1></Link>
        <h1>{`${Math.round(users[activeIndex].totalPoints * 100) / 100} pts`}</h1>
        <br />
        <h1 className="bigLabel">{`Completed (${completedList.length})`}</h1>
        <div className="fullCompletions">
            {mappedCompletions}
        </div>
        <h1 className="bigLabel">{`Progressed (${progressedList.length})`}</h1>
        <div className="fullCompletions">
            {mappedProgressions}
        </div>
    </div>



    return (
        <div className="leaderboardContainer">
            <div className="rankingsContainer">
                <div>
                    {userCards}
                </div>
            </div>
            <div className="completionsContainer">
                {infoCard}
            </div>
        </div>
    );
}

export default Leaderboard;