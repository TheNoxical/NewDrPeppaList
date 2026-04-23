import React from 'react';
import TopBar from './components/TopBar.jsx';
import { useAuth } from './components/useAuth.js';
import { useState, useEffect } from 'react';

function AppContent() {
    useAuth();

    const [ aredlSortedList, setAredlSortedList ] = useState(undefined);
    const [ peppaSortedList, setPeppaSortedList ] = useState(undefined);

    useEffect(() => {
        fetchData();
        async function fetchData() {
            const peppaList = await fetch('/list/_list.json').then(res => res.json());
            const peppaListDataPromises = peppaList.map((levelName) => {
                return fetch(`/list/${levelName}.json`).then(res => res.json());
            })
            const peppaListData = await Promise.all(peppaListDataPromises);

            const aredlListDataPromises = peppaListData.map((levelData) => {
                return fetch(`https://api.aredl.net/v2/api/aredl/levels/${levelData.id}`).then(res => res.json())
            })
            const aredlListData = await Promise.all(aredlListDataPromises);


            for (let i = 1; i < aredlListData.length; i++) {
                let j = i;
                while (j > 0 && aredlListData[j].position < aredlListData[j - 1].position) {
                    let temp = aredlListData[j];
                    aredlListData[j] = aredlListData[j - 1];
                    aredlListData[j - 1] = temp;
                    let temp2 = peppaListData[j];
                    peppaListData[j] = peppaListData[j - 1];
                    peppaListData[j - 1] = temp2;
                    j--;
                }
            }


            setAredlSortedList(aredlListData);
            setPeppaSortedList(peppaListData)
        }
        
    }, []);

    return (
        <div>
            <TopBar aredlSortedList={aredlSortedList} peppaSortedList={peppaSortedList} />
        </div>
    );
}

export default AppContent;