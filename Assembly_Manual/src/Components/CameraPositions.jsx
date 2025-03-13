import { useFrame } from "@react-three/fiber"
import { useContext, useState } from "react"
import { ModelContext } from "./ModelContext"
import * as THREE from "three"
import useInterface from "/stores/useInterface"
import { useBounds } from '@react-three/drei'
import { invalidate } from "@react-three/fiber"

export default function CameraPositions() {
    let { visibleObj, selectedParts, stepSVG } = useContext(ModelContext)
    const cameraPositionTag = useInterface((state) => { return state.cameraPositionTag })
    const freeControls = useInterface((state) => { return state.freeControls })
    const wiringStep = useInterface((state) => { return state.wiringStep })
    const api = useBounds()
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3())
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const cameraCurrentPosition = new THREE.Vector3(4, 1, 8)

    useFrame((state, delta) => {
        if (cameraPositionTag === 'initial' && wiringStep === false) {

            smoothedCameraPosition.lerp(cameraCurrentPosition, 0.1)
            smoothedCameraTarget.lerp([0, 0, 0], 0.1)
            state.camera.position.copy(smoothedCameraPosition)
            state.camera.lookAt(smoothedCameraTarget)

            freeControls()
            api.refresh(visibleObj).fit()
            invalidade()
        }

        if (cameraPositionTag === 'initial' && wiringStep === true) {
            console.log(stepSVG)
            stepSVG.reset()
            freeControls()
            invalidate()
        }
    })

    /*     useFrame((state, delta) => {
            if (cameraPositionTag === 'initial') {
                smoothedCameraPosition.lerp(cameraCurrentPosition, 0.1)
                smoothedCameraTarget.lerp([0, 0, 0], 0.1)
                state.camera.position.copy(smoothedCameraPosition)
                state.camera.lookAt(smoothedCameraTarget)
    
                freeControls()
                api.refresh(visibleObj).fit()
                // console.log(cameraPositionTag)
            }
        }) */
    return <>
    </>
}