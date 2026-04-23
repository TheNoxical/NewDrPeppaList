import React from 'react';
import { useUser } from '../useUser.js';
import { useParams, useNavigate } from 'react-router-dom';
import './UserPage.css';
import { calculateScore } from '../score.js';
import { useState, useEffect } from 'react';
import Youtube_Icon from '../../assets/Youtube_Icon.png';

function UserPage() {
    const { displayName } = useParams();
    const { user, error } = useUser(displayName);
    const [ completions, setCompletions ] = useState(undefined);
    const [ levelData, setLevelData ] = useState(undefined);
    const [ aredlSortedList, setAredlSortedList ] = useState(undefined);
    const navigate = useNavigate();
    
    

    
    
    useEffect(() => {
        if (!user || completions !== undefined) {
            return;
        }

        grabCompletions(user).then(data => setCompletions(data));
    }, [user?.display_name]);

    useEffect(() => {
        if (!user || levelData !== undefined || completions === undefined) {
            return;
        }

        const mappedLevelPromises = completions.map((level) => {
                return fetch(`https://api.aredl.net/v2/api/aredl/levels/${level.id}`)
                    .then(res => res.json())
            });

        const data = Promise.all(mappedLevelPromises);

        data.then(res => setLevelData(res));

    }, [completions]);

    useEffect(() => {
        if (!user || aredlSortedList !== undefined || levelData === undefined) {
            return;
        }

        aredlSortList().then(data => setAredlSortedList(data));
    }, [levelData]);

    if (error) {
        return (
            <h1>User Not Found :(</h1>
        );
    }

    if (!user || completions === undefined || levelData === undefined || aredlSortedList === undefined) {
        return (
            <h1>Loading...</h1>
        );
    }


    for (let i = 1; i < levelData.length; i++) {
        let j = i;
        while (j > 0 && levelData[j].position < levelData[j - 1].position) {
            let temp = levelData[j];
            levelData[j] = levelData[j - 1];
            levelData[j - 1] = temp;
            let temp2 = completions[j];
            completions[j] = completions[j - 1];
            completions[j - 1] = temp2;
            j--;
        }
    }


    let totalPoints = 0;

    const levelThumbnails = levelData.map((level, index) => {
        const recordIndex = completions[index].records.findIndex(record => record.user === displayName)
        const percentage = completions[index].records[recordIndex].percent;
        const aredlIdMap = aredlSortedList.map(lvl => lvl.level_id);
        const rank = aredlIdMap.findIndex(id => id === level.level_id)
        
        const lvlPoints = calculateScore(rank + 1, percentage);
        totalPoints += lvlPoints;

        return (
            <button className="completionCard noBtnStyles hoverAnimSmall" key={level.name} percent={percentage} style={{ backgroundImage: `url(https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/cards/${level.level_id}.webp)`}} onClick={() => {navigate(`/List/${level.name}`)}}>
                <div>
                    <h1 className="lvlDisplay">{`#${rank + 1} ${(percentage === 100 ? "" : percentage + "%")} ${level.name}`}</h1>
                    <h2 className="pointsDisplay">{lvlPoints + "pts"}</h2>
                </div>
                <a className={`hoverAnim completionLink ${(percentage < 100 || !completions[index].records[recordIndex]?.link) ? "hidden" : ""}`} onClick={e => e.stopPropagation()}  href={completions[index].records[recordIndex].link} target="_blank" ><img src={Youtube_Icon} alt="yt-icon" height="39.09375" width="54.78125" /></a>
            </button>
        );
    });

    const fullCompleted = levelThumbnails.filter(lvl => lvl.props.percent === 100);
    const progressed = levelThumbnails.filter(lvl => lvl.props.percent < 100);


    return (
        <>
            <div className="userContainer">
                <div className="userProfile">
                    <img src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`} alt="profile photo" className="rounded" />
                    <h1>{displayName}</h1>
                    <h2>{`Completed Levels: ${fullCompleted.length}`}</h2>
                    <h2>{`Progressed Levels: ${progressed.length}`}</h2>
                    <h2>{`Total Points: ${Math.round(totalPoints * 100) / 100}`}</h2>
                </div>
                <div className="completionsContainer">
                    <h1>Levels</h1>
                    <h2>Completed</h2>
                    {fullCompleted}
                    <h2>Progressed</h2>
                    {progressed}
                </div>
            </div>
        </>
    );
}

async function grabCompletions(user) {
    const levelsList = await fetch('/list/_list.json').then(res => res.json());
    const levelData = await Promise.all(
        levelsList.map(level => fetch(`/list/${level}.json`).then(res => res.json()))
    );
    const completions = levelData.filter(level => {
        return level.records.some(record => {
            return user.display_name === record.user
        });
    });

    return completions;
}

async function aredlSortList() {
    const levelsList = await fetch('/list/_list.json').then(res => res.json());
    const levelData = await Promise.all(
        levelsList.map(level => fetch(`/list/${level}.json`).then(res => res.json()))
    );
    const aredlData = await Promise.all(
        levelData.map(level => fetch(`https://api.aredl.net/v2/api/aredl/levels/${level.id}`).then(res => res.json()))
    );

    for (let i = 1; i < aredlData.length; i++) {
        let j = i;
        while (j > 0 && aredlData[j].position < aredlData[j - 1].position) {
            let temp = aredlData[j];
            aredlData[j] = aredlData[j - 1];
            aredlData[j - 1] = temp;
            let temp2 = levelData[j];
            levelData[j] = levelData[j - 1];
            levelData[j - 1] = temp2;
            j--;
        }
    }

    return aredlData;

}

export default UserPage;