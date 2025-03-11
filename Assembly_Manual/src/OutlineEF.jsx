import OutlineDrawing from "./OutlineDrawing.jsx"
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js"
import { extend, useThree } from "@react-three/fiber";

extend({ OutlineEffect })

export default function OutlineEF(props) {

    const { gl, camera, scene } = useThree() //finds the renderer

    const effect = new OutlineEffect(gl, props)

    return <primitive object={effect} />
}

