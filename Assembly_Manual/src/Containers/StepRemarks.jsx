import { useContext, useState, useEffect } from 'react'
import { ModelContext } from '/Components/ModelContext.jsx';
import axios from 'axios';
import { LuAlertCircle } from "react-icons/lu";


let counter = 1;
let stepArray = new Array();
let stepRemarksArray = new Array();
let arrayNumber = 0;
let filteredArr = new Array();
let stepRemarks;

//Get data from the Workbook
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

export default function StepRemarks() {

    let { stepCount } = useContext(ModelContext)

    useEffect(() => {

        stepRemarks = new Array();

        //Change list of remarks
        for (const row of stepArray[stepCount + 1]) {
            if (row[10] != '' && row[10] != undefined) {
                filteredArr = new Array();
                filteredArr.push(row[10]);
                stepRemarks.push(filteredArr);
            }
            ++counter;
        };

    }, [stepCount])

    return <>
        {stepRemarks ? <div>
            <div id='RemarksTitle' style={{ margin: 'auto', display: 'inline', alignContent: 'baseline' }} >
                <h3> <LuAlertCircle /> Remarks</h3> <br />
            </div>
            <ul>
                {stepRemarks.map((name, index) => <li key={index}> {name}</li>)}

            </ul>
        </div> : null}
    </>


}