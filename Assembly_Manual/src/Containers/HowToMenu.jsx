import { useState, useEffect, useContext } from 'react'
import { ModelContext } from '/Components/ModelContext.jsx';
import { NavLink, Link } from "react-router-dom";
import axios from 'axios';


let counter = 0;
let howTosArray = new Array();
let howToTitleArray = new Array();
let arrayNumber = 0;
let filteredArr = new Array();
let howTos;



export default function HowToMenu() {

    const [howToTitleArray, setHowToTitleArray] = useState([]);
    let { howToTitle } = useContext(ModelContext)

    useEffect(() => {
        //Get data from the Workbook 
        axios.get('https://sheets.googleapis.com/v4/spreadsheets/1grTucZ2sqLgZ4AtJq8EkyO__kLg-pazRVl3sbLNMaIY/values/Blad1?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
            .then(response => {

                let ourData = response.data.values;
                let bufferArray = new Array();
                let tempTitleArray = [];

                for (const row of ourData) {
                    if (counter > 0 && row[0] != '') {
                        bufferArray = new Array();
                        bufferArray.push(row);
                        howTosArray.push(bufferArray);

                    } else {
                        bufferArray.push(row);
                    }

                    ++counter;
                }

                for (const row of howTosArray) {
                    if (row[0] != '') {
                        filteredArr = new Array();
                        //howToTitleArray.push(row[0][1]);
                        filteredArr.push(row[0][0], row[0][1]);
                        tempTitleArray.push(filteredArr);
                    }
                }
                setHowToTitleArray(tempTitleArray);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        console.log(howToTitle)
    }, [])

    return <>
        <aside className="stepNavi" style={{ width: '350px' }}>
            <ul>
                {howToTitleArray ? howToTitleArray.map((name, index) => <li key={index}>
                    <NavLink to={`/HowTo/${name[0]}`} >
                        {howToTitle && howToTitle == name[1] ?
                            <button type="button" className='stepNaviBtn' style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                                {name[0]}. {name[1]}
                            </button> :
                            <button type="button" className='stepNaviBtn'>
                                {name[0]}. {name[1]}
                            </button>}
                    </NavLink>
                    {/*      <button
                        id={`${name}`}
                        onClick={() => {
                            console.log('ok');
                        }}
                        className={'stepNaviBtn'}
                    >
                        {name[0]}. {name[1]}
                    </button> */}
                </li>) : null}
            </ul>
        </aside>
    </>


}