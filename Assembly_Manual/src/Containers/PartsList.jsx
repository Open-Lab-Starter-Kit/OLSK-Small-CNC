import { useState, useContext, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom/client'
import Model from "/Components/Model.jsx";
import { useThree } from "@react-three/fiber";
import { ModelContext } from "/Components/ModelContext.jsx";
import { Group, MeshBasicMaterial } from "three";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { selectionContext } from "@react-three/postprocessing";
import useInterface from "../stores/useInterface";

export default function PartsList() {

    /*     let composer, effectFXAA, outlinePass;
        const { gl, camera, scene } = useThree() //finds the renderer (gl)
        composer = new EffectComposer(gl);
    
        outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        composer.addPass(outlinePass);
     */


    let partsHighlight = []
    let highlightedGroup = new Group()
    const { modelProperties, visibleObj, currentStepObject, setClickedParts, selectedParts, partsInOut, setCurrentPartsModel, currentObject, partBtnState, setPartButtonState } = useContext(ModelContext)
    const [selectedName, setSelectedName] = useState(null)

    const [btnState, setBtnState] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)


    const wiringStep = useInterface((state) => { return state.wiringStep })


    const partsHighlightFunc = useCallback(() => {
        highlightedGroup = new Group()
        partsHighlight = []
        if (selectedName) {
            console.log(selectedName)
            for (let i = 0; i < currentObject.children.length; i++) {
                if (currentObject.children[i].userData.name === selectedName) {
                    const clonePart = currentObject.children[i].clone()
                    highlightedGroup.add(clonePart)
                    partsHighlight.push(currentObject.children[i].userData.name)
                    //partsHighlight.push(currentStepObject.children[i])
                }
            }
            setClickedParts(partsHighlight)
            setCurrentPartsModel(highlightedGroup)
        }
        //outlinePass.highlightedGroup = highlightedGroup
    })
    useEffect(() => {
        partsHighlight = []
        setClickedParts(partsHighlight)
        partsHighlightFunc()
    }, [currentStepObject, selectedName])

    useEffect(() => {
        setPartButtonState(false)
        partsHighlight = []
        setClickedParts(partsHighlight)
        setCurrentPartsModel(null)
    }, [currentStepObject])

    const btnStateChange = () => {
        if (partBtnState === true) {
            setPartButtonState(false)
            partsHighlight = []
            setClickedParts(partsHighlight)
            setCurrentPartsModel(null)
        }
        if (partBtnState === false) {
            setPartButtonState(true)
            partsHighlightFunc()
        }
    }
    const disableHighlight = () => {
        console.log("disable")
        setPartButtonState(false)
        partsHighlight = []
        setClickedParts(partsHighlight)
        setCurrentPartsModel(null)
        setSelectedName(null)
    }
    return <>
        <div >
            <ul>
                {modelProperties ? modelProperties.partsNames.map(([number, name], index) =>
                    <li key={index}>
                        {name === selectedName ?
                            <button
                                id={`${name}`}
                                style={{ backgroundColor: '#669999', color: '#ffffff' }}
                                //className={'parts'}
                                disabled={buttonDisabled}
                                onClick={() => {
                                    //setSelectedName(name)
                                    //partsHighlightFunc()
                                    //setBtnState(true)
                                    if (partBtnState === true) {
                                        disableHighlight()
                                    }

                                }
                                }
                                className={'parts'}
                            ><b> {number}x</b>  {name}</button> :
                            wiringStep ? <p style={{ paddingBottom: 10 }}><b> {number}x</b>  {name}</p> :
                                <button
                                    id={`${name}`}
                                    //style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                    //className={'parts'}
                                    disabled={buttonDisabled}
                                    onClick={() => {
                                        setSelectedName(name)
                                        btnStateChange()
                                    }
                                    }
                                    className={'parts'}
                                ><b> {number}x </b>  {name}</button>
                        }
                    </li>) : null}

            </ul>
        </div>
    </>


}