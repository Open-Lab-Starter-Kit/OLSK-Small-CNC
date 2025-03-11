import { createContext, useState, useEffect } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
    const [modelProperties, setModelProperties] = useState(null)
    const [stepCount, setStepCount] = useState(0)
    const [stepList, setStepList] = useState(null)
    const [partsInOut, setPartsInOut] = useState(true)
    const [visibleObj, setVisibleObj] = useState()
    const [currentStepName, setCurrentStepName] = useState()
    const [currentStepObject, setCurrentStepModel] = useState()
    const [currentObject, setCurrentModel] = useState()
    const [selectedParts, setSelectedParts] = useState()
    const [selectedPartsModel, setSelectedPartsModel] = useState()
    const [cameraPosition, setCameraPosition] = useState()
    const [howToData, setHowToData] = useState()
    const [path, setPath] = useState()
    const [howToTitle, setCurrentHowToTitle] = useState()
    const [stepSVG, setStepSVG] = useState()
    const [partBtnState, setPartButton] = useState()

    const setProperties = (name) => {
        setModelProperties(name)
    }

    const setStepPosition = (number) => {
        setStepCount(number)
    }

    const setListOfStep = (names) => {
        setStepList(names)
    }

    const setModelInOut = (boolean) => {
        setPartsInOut(boolean)
    }

    const setVisibleModel = (obj) => {
        setVisibleObj(obj)
    }

    const setCurrentName = (name) => {
        setCurrentStepName(name)
    }

    const setCurrentStepObj = (obj) => {
        setCurrentStepModel(obj)
    }

    const setClickedParts = (name) => {
        setSelectedParts(name)
    }

    const setCurrentPartsModel = (obj) => {
        setSelectedPartsModel(obj)
    }

    const setCamera = (coordinates) => {
        setCameraPosition(coordinates)
    }

    const setHowToWorkbook = (array) => {
        setHowToData(array)
    }

    const setClickedPath = (name) => {
        setPath(name)
    }

    const setHowToTitle = (name) => {
        setCurrentHowToTitle(name)
    }

    const setCurrentSVG = (obj) => {
        setStepSVG(obj)
    }

    const setCurrentObject = (obj) => {
        setCurrentModel(obj)
    }

    const setPartButtonState = (state) => {
        setPartButton(state)
    }

    return (
        <ModelContext.Provider value={{
            modelProperties, setProperties,
            stepCount, setStepPosition,
            stepList, setListOfStep,
            partsInOut, setModelInOut,
            visibleObj, setVisibleModel,
            currentStepName, setCurrentName,
            currentStepObject, setCurrentStepObj,
            selectedParts, setClickedParts,
            selectedPartsModel, setCurrentPartsModel,
            cameraPosition, setCamera,
            howToData, setHowToWorkbook,
            path, setClickedPath,
            howToTitle, setHowToTitle,
            stepSVG, setCurrentSVG,
            currentObject, setCurrentObject,
            partBtnState, setPartButtonState
        }}>
            {children}
        </ModelContext.Provider>
    )
}

