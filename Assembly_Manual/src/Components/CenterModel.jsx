import { useBounds } from '@react-three/drei'
import { useEffect, useContext, useRef } from 'react'
import { ModelContext } from "./ModelContext.jsx"
import { useFrame, useThree } from '@react-three/fiber'
import useInterface from '/stores/useInterface.jsx'
import * as THREE from "three"


export default function CenterModel({ cameraControlsRef }) {

    let { visibleObj, modelProperties, selectedPartsModel, selectedParts, currentObject, setCamera, partBtnState, currentStepObject } = useContext(ModelContext)
    const api = useBounds()

    const cameraPositionTag = useInterface((state) => { return state.cameraPositionTag })


    useEffect(() => {
        if (visibleObj) {
            api.refresh(visibleObj).fit()
        }
        else {
            api.refresh(currentStepObject).fit()
        }
        //console.log(currentStepObject, visibleObj, cameraPositionTag)

    }, [currentStepObject, cameraPositionTag])

    useEffect(() => {
        if (selectedPartsModel) {
            api.refresh(selectedPartsModel).fit()
        }
        else if (!selectedPartsModel) {
            api.refresh(visibleObj).fit()
        }
    }, [selectedPartsModel])

}