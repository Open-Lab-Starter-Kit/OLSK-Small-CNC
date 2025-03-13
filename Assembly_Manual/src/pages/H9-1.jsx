import React from 'react';
import { useGLTF, useAnimations, Text3D } from '@react-three/drei';
import { useEffect, useContext } from 'react';
import { ModelContext } from '/Components/ModelContext';
import { MeshBasicMaterial, EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';
import * as THREE from 'three';
import { ConditionalEdgesGeometry } from '../ConditionalEdgesGeometry.js';
import { ConditionalEdgesShader } from '../ConditionalEdgesShader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export default function H9() {

    const howToModel = useGLTF('./H9-1_Insert_The_Mirrors.glb')
    const animation = useAnimations(howToModel.animations, howToModel.scene)
    let { setClickedPath } = useContext(ModelContext)

    const machineMaterial = new MeshBasicMaterial({
        //metalness: 0,
        color: 0xffffff
    })

    var lineMat = new LineBasicMaterial({ color: 0x404040, linewidth: 10 });
    const material = new THREE.ShaderMaterial(ConditionalEdgesShader);
    material.uniforms.diffuse.value.set(0x000000);

    useEffect(() => {
        setClickedPath('H9')

        howToModel.scene.traverse((o) => {
            if (o.isMesh) { //Assigns material to the objects of the current step
                o.material = machineMaterial
                o.frustumCulled = false //fixes disappearing faces
                var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                var wireframe = new LineSegments(geo, lineMat);

                // Create the conditional edges geometry and associated material
                const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
                const line = new THREE.LineSegments(lineGeom, material);

                o.add(wireframe)
                o.add(line)
                geo.dispose()
                machineMaterial.dispose()
                o.geometry.dispose()
            }
        });

        const action = animation.actions.Animation;
        //action.setLoop(THREE.LoopOnce); // Ensure animation plays only once
        action.play();
    }, [])



    return <>
        <primitive object={howToModel.scene} />
        {/* <Text3D
            font='/helvetiker_regular.typeface.json'
            size={0.75}
            position-x={-4}>
            under construction
            <meshBasicMaterial color={0x000000} />
        </Text3D> */}
        {/*         <img src='../H1.svg'  style={{ height: '100%', width: 'auto' }}  />
 */}
    </>
}