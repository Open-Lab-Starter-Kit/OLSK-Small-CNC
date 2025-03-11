import './style.css'
import ReactDOM from 'react-dom/client'
//import App from './App'
import Header from './Containers/Header.jsx'
import React from 'react'
import { Suspense, Component } from 'react'
import { ModelProvider, ModelContext } from "./Components/ModelContext.jsx"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HowToSection from './HowToSection.jsx';
import { Loader } from '@react-three/drei'
import SvgContainer from './Containers/svgContainer.jsx'
import { useProgress } from '@react-three/drei'


const root = ReactDOM.createRoot(document.querySelector('#root'))
const App = React.lazy(() => import('./App.jsx'))

// function Loader() {
//     const { active, progress, errors, item, loaded, total } = useProgress()
//      return <Html center>{progress} % loaded</Html>
// }

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error-reporting service
        logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong. Please reload the page.</h1>;
        }

        return this.props.children;
    }
}


root.render(
    <>
        <Suspense fallback={<Loader />}>
            <Router>
                <ModelProvider>

                    <div className='header'>
                        <Header />
                    </div>

                    <div id='app'>
                        <ErrorBoundary>
                            <Routes>
                                <Route path='/' element={<App />} />
                                <Route path='/HowTo/*' element={<HowToSection />} />
                            </Routes>
                        </ErrorBoundary>

                    </div>


                </ModelProvider>

            </Router>
        </Suspense >

    </>
)

