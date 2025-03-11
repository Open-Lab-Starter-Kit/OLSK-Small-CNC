import { useBounds, Clone, Outlines, Bvh, Edges } from "@react-three/drei"
import React, { useRef, useEffect, useContext, useState, useMemo } from "react";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js"
import { extend, useThree } from "@react-three/fiber";
import { BackSide, Mesh, Box3, Group, BufferGeometry, MeshBasicMaterial, EdgesGeometry, LineBasicMaterial, LineSegments, BoxGeometry } from 'three'
import MouseEvent from "./MouseEvent.jsx";
import { ModelContext } from "./ModelContext.jsx";
import { useCallback } from "react";
import { Select, Outline, EffectComposer, Selection, Glitch } from "@react-three/postprocessing";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import Highlight from "./Highlight.jsx";
import { BlendFunction, Resizer } from "postprocessing";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MemoizedModelAux } from "./ModelAux.jsx";
import useInterface from "/stores/useInterface"


//Added for EdgesGeometry attempt
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

import { OutsideEdgesGeometry } from '../OutsideEdgesGeometry.js';
import { ConditionalEdgesGeometry } from '../ConditionalEdgesGeometry.js';
import { ConditionalEdgesShader } from '../ConditionalEdgesShader.js';
import { ConditionalLineSegmentsGeometry } from '../Lines2/ConditionalLineSegmentsGeometry.js';
import { ConditionalLineMaterial } from '../Lines2/ConditionalLineMaterial.js';
import { ColoredShadowMaterial } from '../ColoredShadowMaterial.js';

extend({ OutlineEffect })

//Array of step names
const stepsNames = []
//Array of names for navigation menu
const stepsNamesNavi = []

export default function Model({ modelIn, modelOut, modelInCopy, modelInCopy2, modelOutCopy }) {

    //Bvh - for selecting parts by clicking on the 3d model
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;

    console.log("render count")    //counts how many times the Model is executed

    const { gl, camera, scene } = useThree() //finds the renderer (gl)
    const machine = useRef()
    const machineAux = useRef()
    const machineOutline = useRef()
    const cylinder = useRef()
    const selected = useRef()

    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //Important for performance. Limits the pixel ratio. More than 2 is unecessary.

    let { stepCount, modelProperties, partsInOut, setVisibleModel, setCurrentStepObj, currentStepObject, selectedParts, setProperties, setCurrentObject, visibleObj } = useContext(ModelContext)

    const [stepName, setStepName] = useState(false)
    const [stepNameNavi, setStepNameNavi] = useState(false)
    const [model, setModel] = useState(modelInCopy2)
    const [modelOutlineCopy, setModelOutlineCopy] = useState()
    const [modelAux, setModelAux] = useState(modelInCopy)
    const [modelInCurrent, setModelInCurrent] = useState(modelInCopy2)
    const [clickedObj, setClickedObj] = useState()
    //const [line, setLine] = useState()
    const [edge, setEdge] = useState()
    const [geometry, setGeometry] = useState()
    const [savedSelectedParts, setSavedSelectedParts] = useState()
    const [currentModel, setCurrentObj] = useState()
    const [geoGroup, setGeoGroup] = useState()

    //Materials
    const machineMaterial = new MeshBasicMaterial({ color: 0xebebeb }) //for previous steps
    const machineCurrentMaterial = new MeshBasicMaterial({ color: 0xffffff }) //for previous steps
    const curvesMaterial = new MeshBasicMaterial({ color: 0xff0000, wireframe: true }) //for curves
    const highlightMaterial = new MeshBasicMaterial({ color: 0xd1e0e0 })    //for highlighted parts
    var lineMat = new LineBasicMaterial({ color: 0x404040, linewidth: 10 }); //machine wireframe
    var lineHighlightMat = new LineBasicMaterial({ color: 0x669999, linewidth: 50 }); //highlight wireframe
    var lineBuiltMat = new LineBasicMaterial({ color: 0xa6a6a6, linewidth: 10 });

    const material = new THREE.ShaderMaterial(ConditionalEdgesShader); //for conditional lines
    material.uniforms.diffuse.value.set(0x000000);

    //Fabulaser Mini V3 - steps grouping
    const exceptionArray = [ //shown alone
        "291_Prepare_the_Fillet_Profile"
    ]
    const preparingStepArray = [ //shown grouped
        [
            "021_Prepare_base_back_plate_1",
            "022_Prepare_base_back_plate_2",
            "023_Prepare_base_back_plate_3"

        ],
        [
            "031_Prepare_base_front_plate_1",
            "032_Prepare_base_front_plate_2"
        ],
        [
            "04_Prepare_Y_ball_screws"
        ],
        [
            "061_Prepare_back_panel_1",
            "062_Prepare_back_panel_2"
        ],
        [
            "121_Prepare_X_Ball_Screw_1",
            "122_Prepare_X_Ball_Screw_2"
        ],
        [
            "131_Prepare_X_axis_1",
            "132_Prepare_X_axis_2",
            "133_Prepare_X_axis_3",
            "134_Prepare_X_axis_3"
        ],
        [
            "161_Prepare_Z_ball_screw_1",
            "162_Prepare_Z_ball_screw_2"
        ],
        [
            "171_Prepare_Z_axis_1",
            "172_Prepare_Z_axis_2",
            "173_Prepare_Z_axis_3",
            "174_Prepare_Z_axis_4",
            "175_Prepare_Z_axis_5"
        ],
        [
            "251_Prepare_the_bed_1",
            "252_Prepare_the_bed_2",
            "253_Prepare_the_bed_3"
        ],
        [
            "271_Prepare_window_front_panel_1",
            "272_Prepare_window_front_panel_2",
            "281Assemble_window_front",
            "284_Prepare_window_front_panel_4"
        ],
        [
            "291_Prepare_window_side_panels_1",
            "292_Prepare_window_side_panels_2"
        ],
        [
            "31_Prepare_back_window_frame"
        ],
        [
            "37_Prepare_the_back_door"
        ]

    ]
    const wiringStepArray = [ //add schematic
        "282_Wiring",
        "283_Prepare_window_front_panel_3_-_wiring",
        "36_Wiring_AC"
    ]

    const mainMachineBuildArray = []
    let preparingTempArray = []
    const modelAuxGeometryArray = []
    let subPrepArray = []

    useEffect(() => { //controls the parts in and out status
        if (partsInOut === true) {
            setModel(modelInCopy2)
            setCurrentObj(modelInCopy2.getObjectByName(stepName[stepCount]))
        } else if (partsInOut === false) {
            setModel(modelOutCopy)
            setCurrentObj(modelOutCopy.getObjectByName(stepName[stepCount]))
        }
    }, [partsInOut])

    useEffect(() => { //activated once in the first render
        // if (machineOutline.current) {
        //     machineOutline.current.scale.multiplyScalar(1.5)
        // }
        //let groupGeo = new BufferGeometry()
        model.traverse((children) => { //creates and array with the step titles names
            if (children.isObject3D && !children.isMesh && !children.isGroup) {
                stepsNames.push(children.name) //for title
                stepsNamesNavi.push(children.userData.name) //for navigation
            }
            /*             if (children.isMesh) {
                            let geoClone = new BufferGeometry()
                            geoClone = children.geometry.clone()
                            setGeoGroup(geoClone)
                        } */
        }, [])


        //sorts the step titles in the correct order for title
        stepsNames.sort()
        setStepName(stepsNames)
        //sorts the step titles in the correct order for navigation
        stepsNamesNavi.sort()
        setStepNameNavi(stepsNamesNavi)


        // modelInCurrent.traverse((o) => {
        //     o.frustumCulled = true //fixes disappearing faces
        //     if (o.isMesh) { //Assigns material to the objects of the current step
        //         o.frustumCulled = false //fixes disappearing faces
        //         o.material = machineCurrentMaterial
        //         machineCurrentMaterial.dispose()
        //         //var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
        //         //var wireframe = new LineSegments(geo, lineMat);
        //         //conditional lines
        //         // const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
        //         // const line = new THREE.LineSegments(lineGeom, material)
        //         // o.add(line)
        //         //o.add(wireframe);
        //         //o.add(outline)
        //         //geo.dispose()
        //         //o.geometry.dispose()
        //         machineCurrentMaterial.dispose()

        //         //const parent = o.parent;

        //         // Remove everything but the position attribute
        //         /*                     const mergedGeom = o.geometry.clone();
        //                             for (const key in mergedGeom.attributes) {
        //                                 if (key !== 'position') {
        //                                     mergedGeom.deleteAttribute(key);
        //                                 }
        //                             } */

        //         /*  // Create the conditional edges geometry and associated material
        //          const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(mergedGeom));

        //          // Create the line segments objects and replace the mesh
        //          const line = new THREE.LineSegments(lineGeom, material);
        //          line.position.copy(o.position);
        //          line.scale.copy(o.scale);
        //          line.rotation.copy(o.rotation);

        //          //const thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry(lineGeom);
        //          //const thickLines = new LineSegments2(thickLineGeom, new ConditionalLineMaterial({ color: LIGHT_LINES, linewidth: 2 }));
        //          //thickLines.position.copy(mesh.position);
        //          //thickLines.scale.copy(mesh.scale);
        //          //thickLines.rotation.copy(mesh.rotation); 

        //          //parent.remove(mesh);
        //          parent.add(line);
        //          //parent.add(thickLines); */

        //         if (o.userData.name === "Curves") { //Assigns material to curves
        //             o.material = curvesMaterial
        //             curvesMaterial.dispose()

        //         }

        //         o.geometry.dispose()

        //     }
        // })

        // modelOutCopy.traverse((o) => {
        //     o.frustumCulled = true //fixes disappearing faces
        //     if (o.isMesh && o.parent.userData.name != "Curves") { //Assigns material to the objects of the current step
        //         o.frustumCulled = false //fixes disappearing faces
        //         o.material = machineCurrentMaterial
        //         machineCurrentMaterial.dispose()
        //         var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
        //         var wireframe = new LineSegments(geo, lineMat);
        //         //conditional lines
        //         // const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
        //         // const line = new THREE.LineSegments(lineGeom, material)
        //         // o.add(line)
        //         //o.add(wireframe);
        //         //o.add(outline)
        //         geo.dispose()
        //         o.geometry.dispose()
        //         machineCurrentMaterial.dispose()

        //         //const parent = o.parent;

        //         // Remove everything but the position attribute
        //         /*                     const mergedGeom = o.geometry.clone();
        //                             for (const key in mergedGeom.attributes) {
        //                                 if (key !== 'position') {
        //                                     mergedGeom.deleteAttribute(key);
        //                                 }
        //                             } */

        //         /*  // Create the conditional edges geometry and associated material
        //          const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(mergedGeom));

        //          // Create the line segments objects and replace the mesh
        //          const line = new THREE.LineSegments(lineGeom, material);
        //          line.position.copy(o.position);
        //          line.scale.copy(o.scale);
        //          line.rotation.copy(o.rotation);

        //          //const thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry(lineGeom);
        //          //const thickLines = new LineSegments2(thickLineGeom, new ConditionalLineMaterial({ color: LIGHT_LINES, linewidth: 2 }));
        //          //thickLines.position.copy(mesh.position);
        //          //thickLines.scale.copy(mesh.scale);
        //          //thickLines.rotation.copy(mesh.rotation); 

        //          //parent.remove(mesh);
        //          parent.add(line);
        //          //parent.add(thickLines); */

        //         o.geometry.dispose()

        //     }
        //     if (o.userData.name === "Curves") { //Assigns material to curves
        //         o.material = curvesMaterial
        //         if (o.isGroup) {
        //             for (let i = 0; i < o.children.length; i++) {
        //                 if (o.children[i].isMesh) {
        //                     o.children[i].material = curvesMaterial
        //                 }

        //             }
        //         }
        //         //curvesMaterial.dispose()
        //     }
        // })

        //applies material for already built part (modelAux)
        modelAux.traverse((o) => {
            if (o.isMesh) {
                o.material = machineMaterial
                o.frustumCulled = false //fixes disappearing faces
                var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                var wireframe = new LineSegments(geo, lineBuiltMat);
                o.add(wireframe);
                // const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
                // const line = new THREE.LineSegments(lineGeom, material)
                // o.add(line)
                //o.add(outline)
                //geo.dispose()
                o.geometry.dispose()
                machineMaterial.dispose()
            }
        })

        setCurrentStepObj(modelInCopy.getObjectByName(stepName[0]))
        setCurrentObj(model.getObjectByName(stepName[0]))

        partsListChange()

    }, [])

    const isException = exceptionArray.some(arr => arr.includes(stepName[stepCount])) //boolean
    const isPreparingStep = preparingStepArray.some(arr => arr.includes(stepName[stepCount])) //boolean
    const wiringStep = useInterface((state) => { return state.wiringStep })
    const isWiringStep = useInterface((state) => { return state.isWiringStep })
    const isNotWiringStep = useInterface((state) => { return state.isNotWiringStep })
    if (wiringStepArray.some(arr => arr.includes(stepName[stepCount]))) {
        isWiringStep()
    }
    else {
        isNotWiringStep()
    }


    useEffect(() => { //activates if stepCount or stepName changed
        setCurrentStepObj(modelInCopy2.getObjectByName(stepName[stepCount])) //assigns the model of current step
        setCurrentObj(model.getObjectByName(stepName[stepCount]))
    }, [stepName, stepCount])

    useEffect(() => {
        console.log(currentStepObject)
        partsListChange()
    }, [stepName, stepCount, currentStepObject])

    useEffect(() => {
        if (currentModel) {
            //console.log(savedSelectedParts)
            // if (savedSelectedParts && savedSelectedParts != []) {
            //     for (let i = 0; i < currentModel.children.length; i++) {
            //         currentModel.children[i].traverse((mesh) => {
            //             if (mesh.isMesh && savedSelectedParts.includes(currentModel.children[i].userData.name && currentModel.children[i].userData.name === "Curves")) {
            //                 //mesh.frustumCulled = false //fixes disappearing faces
            //                 mesh.material = machineCurrentMaterial
            //                 var geometry = new EdgesGeometry(mesh.geometry, 20); // or WireframeGeometry
            //                 var wireframe = new LineSegments(geometry, lineMat);
            //                 mesh.add(wireframe);
            //                 geometry.dispose()
            //                 lineMat.dispose()
            //             }
            //         })
            //     }
            //     //setSavedSelectedParts([])
            // }

            setCurrentObject(currentModel.getObjectByName(stepName[stepCount])) //assigns the model of current step
            if (selectedParts != []) {
                highlightParts()
            }

        }
    }, [selectedParts, currentModel])

    //creates current step list of parts and title
    const partsListChange = useCallback(() => {
        //setCurrentStepObj(currentStepObject)
        let uniqueNames = []
        let partsCount = []
        const partsNamesArray = []
        //Alternative1 - takes the name of parts indenpendent of currentStepObject
        /* let stepTitle
        for (let i = 0; i < modelIn.scene.children.length; i++) { 
            if (modelIn.scene.children[i].name === `${stepName[stepCount]}`) {
                modelIn.scene.children[i].traverse((children) => {
                    //finds the name of the parts in the current step
                    if (children.isGroup) {
                        partsNamesArray.push(children.userData.name)
                    }
                    //unifies repeated names
                    uniqueNames = [...new Set(partsNamesArray)]
                    //counts repeated names in the array
                    partsCount = uniqueNames.map(value => [partsNamesArray.filter(str => str === value).length, value])

                    //finds the name of the step title in the current step
                    if (children.isObject3D && !children.isMesh && !children.isGroup && children.userData.name != undefined) {
                        stepTitle = children.userData.name
                    }
                })
            }
        }
        setProperties({ partsNames: partsCount, titleName: stepTitle }) */

        //Alternative 2 - traverses only the currentStepObject
        if (currentStepObject) {

            for (let i = 0; i < currentStepObject.children.length; i++) {
                currentStepObject.children[i].traverse((children) => {
                    //finds the name of the parts in the current step
                    if (children.isGroup && children.userData.name != undefined) {
                        partsNamesArray.push(children.userData.name)
                    }
                    //unifies repeated names
                    uniqueNames = [...new Set(partsNamesArray)]
                    //counts repeated names in the array
                    partsCount = uniqueNames.map(value => [partsNamesArray.filter(str => str === value).length, value])

                })
            }
            //finds the name of the step title in the current step
            const stepTitle = currentStepObject.userData.name
            setProperties({ partsNames: partsCount, titleName: stepTitle })
        }


    })

    const includePreviousStep = useCallback(() => {
        for (let n = stepCount - 1; n >= 0; n--) { //count down for previous steps
            for (let m = subPrepArray.length - 1; m >= 0; m--) { // count down the elements from subArray
                if (stepName[n] === subPrepArray[m]) { //if the current step is the same as in the subPrepArray, retrieves the model and adds to the preparringTemArray
                    let previousStepsModel = modelAux.getObjectByName(`${stepName[n]}`, true)
                    preparingTempArray.push(previousStepsModel)
                }
            }
        }
    })

    const preparingStepChange = useCallback(() => {

        for (let k = 0; k < preparingStepArray.length; k++) { //separates the individual arrays inside preparingStepArray
            subPrepArray = preparingStepArray[k];
            for (let j = 0; j < subPrepArray.length; j++) { //goes through every indiviual name inside the array
                const isPreparingStepTemp = subPrepArray.some(arr => arr.includes(stepName[stepCount])); //boolean - true if the current step name is found in the subarray
                if (isPreparingStepTemp) {
                    includePreviousStep()
                }
            }
        }

        let groupVisibleObjPrep = new Group()
        let clonedCurrentStepObject = currentModel.clone()
        groupVisibleObjPrep.add(clonedCurrentStepObject)
        //Go through each item of the preparingTempArray and display only what is not in the exception list
        preparingTempArray.filter(obj => preparingStepArray.some(arr => arr.includes(obj.name)))
            .forEach(obj => {
                obj.visible = true;
                let clonedObj = obj.clone();
                groupVisibleObjPrep.add(clonedObj)
            });

        //saves the visible objects to use in the visualization bounding box  
        setVisibleModel(groupVisibleObjPrep)

    })

    const mainMachineBuildStepChange = useCallback(() => {
        //If it is NOT listed in the exception Array or the preparing array, add it to the mainMachineBuildArray to be displayed later
        //counts backwards the models of the previous steps
        for (let i = stepCount - 1; i >= 0; i--) {
            let previousStepsModel = modelAux.getObjectByName(`${stepName[i]}`, true)
            mainMachineBuildArray.push(previousStepsModel)
        }

        let groupVisibleObj = new Group()
        let geometriesArray = []
        //Go through each item of the mainMachineBuildArray and display only what is not in the exception list
        mainMachineBuildArray.filter(obj => !exceptionArray.some(arr => arr.includes(obj.name)))
            .forEach(obj => {
                obj.visible = true;
                let clonedObj = obj.clone();
                groupVisibleObj.add(clonedObj)
            });
        //Alternative tro traverse only the modelaux of the step
        /*   groupVisibleObj.traverse((o) => {
              if (o.isMesh) {
                  o.material = machineMaterial
                  o.frustumCulled = false //fixes disappearing faces
                  var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                  var wireframe = new LineSegments(geo, lineBuiltMat);
                  o.add(wireframe);
                  // const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
                  // const line = new THREE.LineSegments(lineGeom, material)
                  // o.add(line)
                  //o.add(outline)
                  geo.dispose()
                  o.geometry.dispose()
                  machineMaterial.dispose()
              }
          }) */

        /*         for (let i = groupVisibleObj.children[0].children.length; i = 0; i++) {
                    if (groupVisibleObj.children[0].children[i].isMesh) {
                        let geoClone = new BufferGeometry()
                        geoClone = groupVisibleObj.children[0].children[i].geometry.clone()
                        geometriesArray.push(geoClone)
        
                    }
                }
                console.log(groupVisibleObj, geometriesArray) */
        // groupVisibleObj.traverse((o) => {
        //     if (o.isMesh) {
        //         let geoClone = new BufferGeometry()
        //         geoClone = o.geometry.clone()
        //         geometriesArray.push(geoClone)

        //     }
        // })
        // if (geometriesArray.length != 0) {
        //     let geom = BufferGeometryUtils.mergeBufferGeometries(geometriesArray)
        //     setGeoGroup(geom)
        // }
        let clonedCurrentStepObject = currentModel.clone()
        groupVisibleObj.add(clonedCurrentStepObject)
        //saves the visible objects to use in the visualization bounding box    
        setVisibleModel(groupVisibleObj)
    })

    const highlightParts = useCallback(() => {
        //console.log(model.scene, selectedParts)
        if (currentModel) {
            const geometriesArray = []
            for (let i = 0; i < currentModel.children.length; i++) {
                currentModel.children[i].traverse((mesh) => {
                    if (mesh.isMesh && selectedParts.includes(currentModel.children[i].userData.name)) {
                        mesh.frustumCulled = false //fixes disappearing faces
                        const clonedGeometry = mesh.geometry.clone()
                        geometriesArray.push(clonedGeometry)
                        mesh.material = highlightMaterial
                        var geometry = new EdgesGeometry(mesh.geometry, 20); // or WireframeGeometry
                        var wireframeHighlight = new LineSegments(geometry, lineHighlightMat);
                        mesh.add(wireframeHighlight);
                        highlightMaterial.dispose()
                        geometry.dispose()
                        lineHighlightMat.dispose()
                    } else if (mesh.isMesh && currentModel.children[i].userData.name != "Curves") {
                        mesh.frustumCulled = false //fixes disappearing faces
                        mesh.material = machineCurrentMaterial
                        var geometry = new EdgesGeometry(mesh.geometry, 20); // or WireframeGeometry
                        var wireframe = new LineSegments(geometry, lineMat);
                        mesh.add(wireframe);
                        geometry.dispose()
                        lineMat.dispose()
                    }
                    else if (mesh.userData.name === "Curves") { //Assigns material to curves
                        mesh.frustumCulled = false //fixes disappearing faces
                        mesh.material = curvesMaterial
                        if (mesh.isGroup) {
                            for (let i = 0; i < mesh.children.length; i++) {
                                if (mesh.children[i].isMesh) {
                                    mesh.children[i].frustumCulled = false //fixes disappearing faces
                                    mesh.children[i].material = curvesMaterial
                                }

                            }
                        }
                        //curvesMaterial.dispose()
                    }
                })
            }
            if (geometriesArray != undefined) {
                //console.log(geometriesArray)
                //const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometriesArray)
            }
            setSavedSelectedParts(selectedParts)
        }

    })
    const findClickedObj = useCallback(() => {
        clickedObj.traverse((obj) => {
            if (obj.name === "Botom_Panel") {
                console.log(clickedObj.userData.name)
            }
        })
    })
    const highlightOnClick = useCallback((event) => {
        //if (event.object === isGroup) {
        event.stopPropagation()
        //setClickedObj(event.object)
        // Setting "firstHitOnly" to true means the Mesh.raycast function will use the
        // bvh "raycastFirst" function to return a result more quickly.
        /*         const raycaster = new THREE.Raycaster();
                raycaster.firstHitOnly = true;
                raycaster.intersectObjects(event.object); */
        console.log(event.object)
        //}

    })
    const stepChange = useCallback(() => {
        //setProperties(state)
        //console.log(cylinder)
        //cylinder.current.geometry.computeBoundsTree()
        if (currentModel) {
            // console.log(currentModel)
            const currentModelCopy = currentModel.clone()
            //setModelOutlineCopy(currentModelCopy)
            /*             currentModelCopy.traverse((o) => {
                            if (o.isMesh) {
                                machineMaterial.side = BackSide
                                machineMaterial.color.set(0x000000)
                                o.material = machineMaterial
                                o.scale.multiplyScalar(1.005)
                            }
                        
                        }) */

            //setCurrentObj(currentStepObject)

            for (let i = 0; i < model.children.length; i++) {
                //initially makes the model invisible
                model.children[i].visible = false
            }

            for (let i = 0; i < modelAux.children.length; i++) {
                //initially makes the modelAux invisible
                modelAux.children[i].visible = false
            }

            // currentModel.traverse((o) => {
            //     o.frustumCulled = true //fixes disappearing faces
            //     if (o.isMesh) { //Assigns material to the objects of the current step
            //         o.frustumCulled = false //fixes disappearing faces
            //         machineMaterial.color.set(0xffffff);
            //         o.material = machineMaterial
            //         machineMaterial.dispose()
            //         var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
            //         var wireframe = new LineSegments(geo, lineMat);
            //         //conditional lines
            //         // const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(o.geometry));
            //         // const line = new THREE.LineSegments(lineGeom, material)
            //         // o.add(line)
            //         o.add(wireframe);
            //         //o.add(outline)
            //         geo.dispose()
            //         o.geometry.dispose()
            //         machineMaterial.dispose()

            //         //const parent = o.parent;

            //         // Remove everything but the position attribute
            //         /*                     const mergedGeom = o.geometry.clone();
            //                             for (const key in mergedGeom.attributes) {
            //                                 if (key !== 'position') {
            //                                     mergedGeom.deleteAttribute(key);
            //                                 }
            //                             } */

            //         /*  // Create the conditional edges geometry and associated material
            //          const lineGeom = new ConditionalEdgesGeometry(BufferGeometryUtils.mergeVertices(mergedGeom));

            //          // Create the line segments objects and replace the mesh
            //          const line = new THREE.LineSegments(lineGeom, material);
            //          line.position.copy(o.position);
            //          line.scale.copy(o.scale);
            //          line.rotation.copy(o.rotation);

            //          //const thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry(lineGeom);
            //          //const thickLines = new LineSegments2(thickLineGeom, new ConditionalLineMaterial({ color: LIGHT_LINES, linewidth: 2 }));
            //          //thickLines.position.copy(mesh.position);
            //          //thickLines.scale.copy(mesh.scale);
            //          //thickLines.rotation.copy(mesh.rotation); 

            //          //parent.remove(mesh);
            //          parent.add(line);
            //          //parent.add(thickLines); */

            //         if (o.userData.name === "Curves") { //Assigns material to curves
            //             o.material = curvesMaterial
            //             curvesMaterial.dispose()
            //         }

            //         o.geometry.dispose()

            //     }
            // });
            //If it is listed in the exception Array, show model
            if (isException) {
                console.log("exception")
                currentModel.visible = true;
                setVisibleModel(currentModel);
            }
            else if (isPreparingStep) {
                console.log("preparing step")
                currentModel.visible = true;
                preparingStepChange()

            }
            else {
                console.log("main building step")
                currentModel.visible = true;
                mainMachineBuildStepChange()
            }
        }

    }, [currentModel])

    useEffect(() => { //activated if currentStepObject changed
        stepChange()
        //console.log(state)
    }, [currentModel])

    const { setListOfStep } = useContext(ModelContext)
    setListOfStep(stepNameNavi)

    //stepModel = model.scene.getObjectByName(`03-1_PreparingBallScrewY`, true)

    // useEffect(() => {
    //const effect = new OutlineEffect(gl)
    // }, []);
    const [hovered, hover] = useState(null)
    return <>

        <Selection>

            {/*         {stepName ? (
            < primitive ref={machine}
                                 object={currentChildren} 
                object={model.scene.getObjectByName(`${stepName[stepCount]}`, true)}
                scale={1}
                onClick={MouseEvent}
                dispose={null}
                         rotation-x={Math.PI * 0.75}
        rotation-y={Math.PI * -0.25}
        rotation-z={Math.PI * 0.05} 
            //visible={false}
            >
            </primitive >) : null
        } */}

            {stepName ? (<>
                {/* <Bvh> */}
                < primitive ref={machine}
                    //onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}
                    object={model}
                    scale={1.0001}
                // onDoubleClick={highlightOnClick} 
                //position-y={0.01}
                >
                </primitive >
                {/* </Bvh>  */}
                < primitive ref={machineAux}
                    object={modelAux}
                    scale={1}
                >
                </primitive >
            </>
            ) : null
            }
            {/*             {geoGroup ? (<mesh geometry={geoGroup} material={machineMaterial}>
                <Edges />

                <Outlines thickness={0.0005} color="black" />

            </mesh>) : null}
 */}
            {/* Alternative to traverse only the model aux of the current step */}
            {/*             {visibleObj ? (
                < primitive ref={machineAux}
                    object={visibleObj}
                    scale={1}
                >
                </primitive >

            ) : null} */}
            {/* {modelOutlineCopy ? (
                < primitive ref={machineOutline}
                    object={modelOutlineCopy}
                //scale={2}
                >
                </primitive >
            ) : null} */}
            {/* <MemoizedModelAux modelInCopy={modelInCopy} /> */}
            {/*          <Select enabled={selectedParts}>
                {selectedParts ? (
                    <primitive ref={selected}
                        object={selectedParts}
                    >
                    </primitive>
                ) : null}
            </Select> */}

            {/*             <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                    selection={model.scene}
                    blendFunction={BlendFunction.ALPHA}
                    selectionLayer={1} // selection layer
                    blur={true}
                    visibleEdgeColor={0x00ff00}
                    hiddenEdgeColor={0x00ff00}
                    edgeStrength={50}
                    width={1000}
                    height={1000}
                    xRay={true}
                />
                <Highlight />
            </EffectComposer> */}

            {/*             {selectedParts ? (<>
                <Select enabled={hovered}>
                    < primitive
                        //onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}
                        object={selectedParts}
                        scale={1.0001}
                        onClick={hover}

                    >
                    </primitive ></Select >
            </>) : null
            } */}


            {/*             <mesh ref={cylinder} name={'cylinder'} scale={0.2}
            // onPointerOver={() => hover(true)}
            // onPointerOut={() => hover(false)} 
            //</Selection> onDoubleClick={highlightOnClick} 
            >
                <cylinderGeometry />
                <meshBasicMaterial color={0x000000} side={BackSide} />
                <Edges color={"white"} />
                <Outlines color={"white"} />

            </mesh> */}
            {/*             <mesh ref={cylinder} name={'cylinder'} scale={0.1}
            // onPointerOver={() => hover(true)}
            // onPointerOut={() => hover(false)} 
            //</Selection> onDoubleClick={highlightOnClick} 
            >
                <cylinderGeometry />
                <meshBasicMaterial color={0x0000ff} />
            </mesh>  */}

            {/* <mesh >
                <cylinderGeometry />
                <meshStandardMaterial />
                <Edges>
                    <meshBasicMaterial color={0x0000ff} depthTest={true} />
                </Edges>
            </mesh> */}

        </Selection>

    </>

}
export const MemoizedModel = React.memo(Model)