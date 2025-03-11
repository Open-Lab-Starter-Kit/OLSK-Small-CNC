import axios from "axios"
import { useState, useEffect, useContext } from "react";
import { ModelContext } from "/Components/ModelContext";


let filteredArr = new Array();
let tempArray = [];


export default function HowToText() {

    const [howToTextArray, setHowToTextArray] = useState([]);
    //const [howToTitle, setHowToTitle] = useState()
    let { path, setHowToTitle, howToTitle } = useContext(ModelContext)

    useEffect(() => {
        let counter = 0;
        let howTosArray = new Array();
        axios.get('https://sheets.googleapis.com/v4/spreadsheets/1grTucZ2sqLgZ4AtJq8EkyO__kLg-pazRVl3sbLNMaIY/values/Blad1?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
            .then(response => {
                let bufferArray = new Array();

                const ourData = response.data.values || [];
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
                let tempArray = []
                const tempHowToTitle = howTosArray.reduce((title, arr) => {
                    if (arr[0].includes(`${path}`)) {
                        const currentTitle = arr[0][1]
                        title.push(currentTitle)
                    }
                    return title
                }, [])
                tempArray = howTosArray.reduce((acc, arr) => {
                    if (arr[0].includes(`${path}`)) {
                        for (const row of arr) {
                            const howToText = row[3]
                            acc.push(howToText)
                        }
                    }
                    return acc

                }, [])
                setHowToTitle(tempHowToTitle)
                setHowToTextArray(tempArray);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, [path]);

    return <>
        <div >
            <h1 className='HowToTitle'>{howToTitle ? `${howToTitle}` : null}</h1>
            <ul>
                {howToTextArray ? howToTextArray.map((name, index) => <li key={index} className="HowToTextAreaList"> {name}</li>) : null}
            </ul>
        </div>
    </>
}