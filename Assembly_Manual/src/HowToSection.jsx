import HowToMenu from './Containers/HowToMenu.jsx'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import H1 from './pages/H1.jsx';
import H2 from './pages/H2.jsx';
import H3 from './pages/H3.jsx';
import H4 from './pages/H4.jsx';
import H5 from './pages/H5.jsx';
import H6 from './pages/H6.jsx';
import H7 from './pages/H7.jsx';
import H8 from './pages/H8.jsx';
import H9 from './pages/H9-1.jsx';
import H10 from './pages/H10.jsx';
import H11 from './pages/H11.jsx';

import HowToText from './Containers/HowToText.jsx';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds } from '@react-three/drei';
import { Perf } from 'r3f-perf'

export default function HowToSection() {
    /*     const api = useBounds()
        api.refresh().fit() */


    return <>

        <HowToMenu />
        <section id="HowToArea">
            <div id='HowToImgArea'>
                <Canvas linear flat
                    camera={{
                        fov: 45,
                        near: 0.5,
                        far: 5000,
                        position: [7, 1, 10]
                    }}
                >
                    <color args={['#f5f5f5']} attach="background" />
                    <OrbitControls />
                    <Perf position="bottom-right" />

                    {/* <directionalLight position={[1, 2, 3]} intensity={10} /> */}
                    {/* <ambientLight intensity={10} /> */}
                    <Bounds
                        fit
                        clip
                        observe
                        damping={2}
                        margin={1}
                    >
                        <Routes>
                            <Route path='/H1' element={<H1 />} />
                            <Route path='/H2' element={<H2 />} />
                            <Route path='/H3' element={<H3 />} />
                            <Route path='/H4' element={<H4 />} />
                            <Route path='/H5' element={<H5 />} />
                            <Route path='/H6' element={<H6 />} />
                            <Route path='/H7' element={<H7 />} />
                            <Route path='/H8' element={<H8 />} />
                            <Route path='/H9' element={<H9 />} />
                            <Route path='/H10' element={<H10 />} />
                            <Route path='/H11' element={<H11 />} />

                        </Routes>
                    </Bounds>
                </Canvas>

            </div>
            <div id='HowToTextArea'>
                <HowToText />
            </div>
        </section>

    </>
}