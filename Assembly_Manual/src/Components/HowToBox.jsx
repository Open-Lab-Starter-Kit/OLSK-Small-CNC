import { useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import StepHowTo from "./StepHowTo";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import useInterface from "/stores/useInterface";



export default function HowToBox() {

    const howTo = useRef()
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
    const boxVisibility = useInterface((state) => { return state.isVisible })

    return <>

        <button type="button"
            {...getToggleProps({
                onClick: () => setExpanded((prevExpanded) => !prevExpanded),
            })}
            className={isExpanded ? "expanded" : "btn"}
            style={{ position: 'absolute', top: '20px', left: '20px', visibility: `${boxVisibility}` }}>
            {isExpanded ? <><AiOutlineQuestionCircle /> How To <MdOutlineExpandLess /></> : <><AiOutlineQuestionCircle /> How To <MdOutlineExpandMore /></>}
        </button>
        <div ref={howTo} className="howToBoxContent" {...getCollapseProps()}>
            <StepHowTo />
        </div>

    </>

}