import { Canvas, useThree } from '@react-three/fiber'
import ButtonNext from './Components/ButtonNext.jsx'
import ButtonPartsOut from './Components/ButtonPartsOut.jsx'
import PartsList from './Containers/PartsList.jsx'
import { ModelProvider, ModelContext } from "./Components/ModelContext.jsx"
import { Suspense, useState, useEffect, useRef, useContext, useMemo, Fragment, Component } from 'react'
import { Bounds, Center, OrbitControls, useBounds, CameraControls, PerspectiveCamera, useGLTF, useProgress, Bvh } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Placeholder from './Components/Placeholder.jsx'
import Model, { MemoizedModel } from './Components/Model.jsx'
import * as THREE from "three"
import StepTitle from './Containers/StepTitle.jsx'
import StepNavigationMenu, { MemoizedStepNavigationMenu } from "./Containers/StepNavigationMenu.jsx"
import CenterModel from './Components/CenterModel.jsx'
import StepRemarks from './Containers/StepRemarks.jsx'
import { Outline, EffectComposer, Selection } from '@react-three/postprocessing'
import RemarksBox from './Components/RemarksBox.jsx'
import HowToBox from './Components/HowToBox.jsx'
import { LuAlertCircle } from "react-icons/lu";
import { MdViewInAr } from "react-icons/md";
import CameraPositions from './Components/CameraPositions.jsx'
import useInterface from './stores/useInterface.jsx'
import SvgContainer from './Containers/svgContainer.jsx'


export default function App() {

    const modelIn = useGLTF('./OLSK_Small_CNC_V3_All_In.glb') //Substitute the file name here for ALL IN
    const modelOut = useGLTF('./OLSK_Small_CNC_V3_All_Out.glb') //Substitute the file name here for ALL OUT
    const modelInCopy = useMemo(() => modelIn.scene.clone(), [modelIn])
    const modelInCopy2 = useMemo(() => modelIn.scene.clone(), [modelIn])
    const modelOutCopy = useMemo(() => modelOut.scene.clone(), [modelOut])

    //const modelInCopyCond = useMemo(() => modelIn.scene.clone(), [modelIn])

    const [modelLoaded, setModelLoaded] = useState(false);
    const cameraControlsRef = useRef()
    const modelRef = useRef()

    useGLTF.clear('./OLSK_Small_CNC_V3_All_In.glb')  //Substitute the file name here for ALL IN
    useGLTF.clear('./OLSK_Small_CNC_V3_All_Out.glb') //Substitute the file name here for ALL OUT

    const reset = useInterface((state) => state.resetCamera)

    return <>

        <Fragment>
            <aside className="stepNavi">
                <MemoizedStepNavigationMenu />
            </aside>
            <section id="currentStepArea">
                <nav className='currentStepBar' >
                    <h2 id="stepTitleArea">
                        <StepTitle />
                    </h2>
                    <div id="stepControl">
                        <ButtonNext />
                        {/*                             <button id="previousStep" className="btn" type="reset">&#10094; Previous</button>
 */}                        </div>
                </nav>

                <div className="infoColumn">
                    <div className="stepPartsArea">
                        <PartsList />
                    </div>
                    <div className="stepRemarksArea">

                        <StepRemarks />
                    </div>
                </div>


                <article className="viewArea" id="viewArea">


                    <Suspense fallback={null} >
                        <Canvas linear flat
                            frameloop='demand'
                            camera={{
                                fov: 45,
                                near: 1,
                                far: 10,
                                position: [4, 1, 8]
                            }}
                        >
                            <Controls />
                            <color args={['#f5f5f5']} attach="background" />
                            {/*                             <Perf position="bottom-right" />
 */}
                            {/* <directionalLight position={[1, 2, 3]} intensity={10} /> */}
                            {/* <ambientLight intensity={10} /> */}
                            <Bounds
                                clip
                                observe
                                damping={2}
                                margin={0.85}
                            >
                                {/* <primitive object={new THREE.AxesHelper(50)} /> */}
                                <Suspense fallback={null} >

                                    <MemoizedModel modelIn={modelIn} modelOut={modelOut} modelInCopy={modelInCopy} modelInCopy2={modelInCopy2} modelOutCopy={modelOutCopy} />
                                    <CenterModel />
                                </Suspense>
                            </Bounds>
                            <CameraPositions />
                            {/*  <CameraControls
                                ref={cameraControlsRef}
                                minDistance={200}
                                maxDistance={2000}
                                enabled={false}
                                fitToBox={true}
                                fitToSphere={false}
                            /> */}

                        </Canvas>
                    </Suspense>
                    <SvgContainer />

                    <button className="btn" style={{ position: 'absolute', bottom: '20px', left: '20px' }}
                        onClick={reset}
                    ><MdViewInAr /> Reset Camera</button>
                    <ButtonPartsOut />
                    {/* <RemarksBox /> */}
                    <HowToBox />

                </article>

                {/* <div className='viewAreaPlaceholder' id="viewAreaPlaceholder">
                    <p >Please wait a moment, <br />
                        the model is being prepared.</p>
                </div> */}
            </section>
        </Fragment >
    </>
}
useGLTF.preload('./OLSK_Small_CNC_V3_All_In.glb') //Substitute the file name here for ALL IN
useGLTF.preload('./OLSK_Small_CNC_V3_All_Out.glb') //Substitute the file name here for ALL OUT


function Controls() {

    const controls = useRef()

    return <>
        <OrbitControls
            ref={controls}
            makeDefault
            enableDamping={false}
            enableRotate={true}
            minAzimuthAngle={Infinity}
            maxAzimuthAngle={Infinity}
            minPolarAngle={0}
            maxPolarAngle={Infinity}
        /*             minDistance={200}
                    maxDistance={2000} */
        />
    </>

}
