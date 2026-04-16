import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import './Victors.css';
import Youtube_Icon from '../assets/Youtube_Icon.png';

function Victors(props) {

    const { level } = useParams();

    const [ victorsList, setVictorsList ] = useState(null);

    useEffect(() => {
        fetch(`/list/${level}.json`)
        .then(res => res.json())
        .then(data => setVictorsList(data.records));
    }, [level]);

    if (!victorsList) {
        return <h1>Loading...</h1>
    }

    for (let i = 1; i < victorsList.length; i++) {
        let j = i;
        while (j > 0 && victorsList[j].percent > victorsList[j - 1].percent) {
            let temp = victorsList[j];
            victorsList[j] = victorsList[j - 1];
            victorsList[j - 1] = temp;
        }
    }

    const mappedVictors = victorsList.map((record) => {
        return (
            <div className="victorCard" key={record.user}>
                <div className="tooltip">
                    <h3>{record.percent + "%\t\t" + record.user}</h3>
                    <div className={((record.wf != undefined || record.enjoyment != undefined) && (record.percent === 100)) ? "tooltipText" : ""}>
                        {(record.percent === 100 && record.wf != undefined) ? <h4>{"Worst Fail: " + record.wf + "%"}</h4> : ""}
                        {(record.percent === 100 && record.enjoyment != undefined) ? <h4>{"Enjoyment: " + record.enjoyment}</h4> : ""}
                    </div>
                    
                </div>
                <a target="_blank" href={record.link} className={record.percent < 100 ? "hidden" : ""}>
                    <img className="ytLogo" src={Youtube_Icon} alt="Youtube" height="31.275" width="43.825" />
                </a>
            </div>
        );
    });

    return (
        <>
            <div className="recordsContainer">
                <h1>Records</h1>
                <div className="victors">
                    {mappedVictors}
                </div>
            </div>
        </>
    );
}

export default Victors