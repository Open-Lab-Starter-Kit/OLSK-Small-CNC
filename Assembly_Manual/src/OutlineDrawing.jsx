import { Effect } from 'postprocessing'
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js"
import { extend, useThree } from "@react-three/fiber";

const fragmentShader = /* glsl */`
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
}
`

export default class OutlineDrawing extends Effect {
    constructor() {
        super(
            'OutlineDrawing',
            fragmentShader,
            {

            }
        )

    }
}