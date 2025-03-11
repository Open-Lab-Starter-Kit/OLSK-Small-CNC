import { useRef, useEffect } from "react";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js"
import { extend, useFrame, useThree } from "@react-three/fiber";

extend({ OutlineEffect })


export default function CustomEffectComposer({ children, outlineEnabled, selectedObjects }) {
    const composer = useRef();
    const { scene, camera, gl, size } = useThree();

    useEffect(() => {
        composer.current = new OutlineEffect(gl, selectedObjects, {
            defaultThickness: 0.01,
            defaultColor: new THREE.Color(1, 0, 0),
            defaultAlpha: 1,
            defaultKeepAlive: false,
        });

        return () => {
            composer.current.dispose();
        };
    }, [gl, selectedObjects]);

    useFrame(() => {
        composer.current.render();
    }, 1);

    return <primitive object={composer.current} dispose={null} />;
}
