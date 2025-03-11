import { useEffect, useRef, useContext, useState } from "react"
import svgPanZoom from "svg-pan-zoom"
import useInterface from "../stores/useInterface"
import { ModelContext } from "../Components/ModelContext"

export default function SvgContainer() {

    //<embed id="demo-tiger" type="image/svg+xml" style="width: 500px; height: 500px; border:1px solid black; " src="H1.svg" />
    const embedSvg = useRef()
    const wiringStep = useInterface((state) => { return state.wiringStep })
    let { currentStepObject, setCurrentSVG } = useContext(ModelContext)

    useEffect(() => {

        // const lala = document.getElementById('myEmbed')
        // console.log(mainLogo, myEmbed, lala)
        // const panZoomTiger = svgPanZoom(myEmbed)
        if (wiringStep) {
            document.getElementById('myEmbed').addEventListener('load', function () {
                // Will get called after embed element was loaded
                setCurrentSVG(svgPanZoom(document.getElementById('myEmbed')));
            })
        }

    }, [wiringStep])

    return <>
        {wiringStep ?
            <div id="svgContainer" style={{ position: 'absolute', width: '100%', height: '100%', bottom: '0px', left: '0px', padding: '10px' }}>
                <embed style={{ width: '100%', height: '100%', backgroundColor: '#e9e9e9' }} ref={embedSvg} type="image/svg+xml" src={`./${currentStepObject.name}.svg`} id="myEmbed" />
            </div>
            : null}
    </>
}
