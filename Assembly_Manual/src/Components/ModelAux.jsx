import React, { useMemo, useEffect } from 'react';
import { BackSide, Mesh, Box3, Group, BufferGeometry, MeshBasicMaterial, EdgesGeometry, LineBasicMaterial, LineSegments, BoxGeometry } from 'three'
import * as THREE from 'three';
import { ConditionalEdgesGeometry } from '../ConditionalEdgesGeometry.js';
import { ConditionalEdgesShader } from '../ConditionalEdgesShader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'


export default function ModelAuxTraverse({ modelInCopy }) {

    const machineMaterial = new MeshBasicMaterial({
        //metalness: 0,
        color: 0xebebeb
    })
    var lineBuiltMat = new LineBasicMaterial({ color: 0xa6a6a6, linewidth: 10 });

    const material = new THREE.ShaderMaterial(ConditionalEdgesShader);
    material.uniforms.diffuse.value.set(0x000000);

    useEffect(() => {
        //var geo = new EdgesGeometry(); // or WireframeGeometry
        const geometriesArray = []
        modelInCopy.traverse((o) => {
            o.frustumCulled = true //fixes disappearing faces
            if (o.isMesh) {
                o.material = machineMaterial
                o.frustumCulled = false //fixes disappearing faces
                var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                var wireframe = new LineSegments(geo, lineBuiltMat);
                geometriesArray.push(o.geometry)
                // Create the conditional edges geometry and associated material
                const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
                const line = new THREE.LineSegments(lineGeom, material);

                o.add(wireframe);
                o.add(line)
                //o.add(outline)
                geo.dispose()
                o.geometry.dispose()
                machineMaterial.dispose()
            }
        });

    }, [])


    return <>
        < primitive
            object={modelInCopy}
            scale={1}
        /* visible={false} */
        /* dispose={null}   */
        >
        </primitive ></>

}
export const MemoizedModelAux = React.memo(ModelAuxTraverse)