import React, { Component } from 'react';
import './List.css';
import LevelCard from '../LevelCard.jsx';

class List extends Component {
    
    constructor() {
        super();

        this.state = {
            peppaList: [],
            listInfo: [],
            sortedList: [],
            sortedData: [],
            generatedList: []
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
        
        if (sortingCriteria === "aredl") {
            const listCopy = this.state.peppaList.map(value => value);
            let data = listCopy.map((level, index) => {
                return {level: level, aredlSpot: this.state.listInfo[index].position}
            })

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

            const listComponents = listCopy.map((level, index) => {
                return <LevelCard level={level} placement={index + 1} key={index + 1} />
            });

            this.setState({ sortedList: listCopy });
            this.setState({ sortedData: data });
            this.setState({ generatedList: listComponents });
        }
    }


    render() {
        if (this.state.peppaList.length === 0 || this.state.listInfo.length === 0 || this.state.sortedList.length === 0 || this.state.generatedList.length === 0) {
            return <h1>Loading...</h1>
        } else {

            console.log(this.state.generatedList);
            
            return (
                <>
                    {/* <LevelCard level={this.state.peppaList[0]} placement={this.state.listInfo[0].position}/>
                    <LevelCard level={this.state.peppaList[1]} placement={this.state.listInfo[1].position} />
                    {this.state.sortedList} */}
                    {this.state.generatedList}
                </>
            );
        }
    }

}

export default List;