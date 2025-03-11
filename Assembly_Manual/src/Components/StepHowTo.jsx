import { useContext, useState, useEffect } from 'react'
import { ModelContext } from '/Components/ModelContext.jsx';
import { Link } from "react-router-dom";
import useInterface from '/stores/useInterface.jsx';

let counter = 1;
let stepArray = new Array();
let filteredArr = new Array();
import axios from 'axios';

//Get data from the machine Workbook
axios.get('https://sheets.googleapis.com/v4/spreadsheets/1lhb7-A0hI_tJ6aedruDEQmPhXl1srPcLZE5VFaaI6rA/values/Workbook?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
    .then(response => {

        let ourData = response.data.values;
        let bufferArray = new Array();

        for (const row of ourData) {
            if (counter > 2 && row[1] != '') {
                stepArray.push(bufferArray);
                bufferArray = new Array();
                bufferArray.push(row);
            } else {
                bufferArray.push(row);
            }
            ++counter;
        }
    })

export default function StepHowTo() {
    const [stepHowToArray, setStepHowToArray] = useState();
    const [stepHowToTitleArray, setStepHowToTitleArray] = useState();
    const [howToTitleArray, setHowToTitleArray] = useState();
    const isNotVisibleToggle = useInterface((state) => { return state.isNotVisibleToggle })
    const isVisibleToggle = useInterface((state) => { return state.isVisibleToggle })

    const visibility = useInterface((state) => { return state.isVisible })

    let { stepCount, howToData, setHowToWorkbook, setClickedPath, path } = useContext(ModelContext)

    useEffect(() => {
        let howTosArray = new Array();

        //Get data from the HowToWorkbook 
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
                setHowToWorkbook(howTosArray)

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

    }, [])


    useEffect(() => {

        let tempArray = new Array();

        //make an array of the step How Tos
        for (const row of stepArray[stepCount + 1]) {
            if (row[12] != '' && row[12] != undefined) {
                filteredArr = new Array();
                filteredArr.push(row[12]);
                tempArray.push(filteredArr);
            }
            ++counter;
        };
        setStepHowToArray(tempArray);

    }, [stepCount])


    useEffect(() => {
        let tempArray = [];

        if (howToTitleArray != undefined) {
            for (const H of stepHowToArray) {
                for (const row of howToTitleArray) {
                    const arr = row.includes(`${H}`)
                    if (arr) {
                        tempArray.push(row)
                    }
                }
            }
            setStepHowToTitleArray(tempArray)
            if (stepHowToArray.length === 0) {
                isNotVisibleToggle()
            }
            else {
                isVisibleToggle()
            }

        }
    }, [howToTitleArray, stepHowToArray])

    return <>
        <div>
            <ul>
                {stepHowToTitleArray ? stepHowToTitleArray.map((name, index) => <li key={index}>
                    <Link
                        to={`/HowTo/${name[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button type="button" className='stepNaviBtn' /* onClick={setClickedPath('H1')} */>
                            {name[0]}. {name[1]}
                        </button>
                    </Link> </li>) : null}

            </ul>
        </div>
    </>
}