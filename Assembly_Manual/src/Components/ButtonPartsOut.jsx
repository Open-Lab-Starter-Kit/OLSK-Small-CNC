import { useContext, useState, useEffect } from 'react'
import { ModelContext } from './ModelContext.jsx'
import useInterface from '../stores/useInterface.jsx'

export default function ButtonPartsOut() {

    const { setModelInOut, selectedParts } = useContext(ModelContext)
    const [partsOut, setPartsOut] = useState(false)
    const wiringStep = useInterface((state) => { return state.wiringStep })

    const buttonClickPartsOut = () => {

        if (partsOut == false) {
            document.getElementById("partsOut").innerHTML = "Assemble";
            setPartsOut(true)
            setModelInOut(partsOut)
        }
        else if (partsOut == true) {
            document.getElementById("partsOut").innerHTML = "Explode";
            setPartsOut(false)
            setModelInOut(partsOut)
        }

    }

    return <>
        {!wiringStep ?
            <button onClick={buttonClickPartsOut} className="btn" id="partsOut">Explode</button> : null
        }
    </>
}

