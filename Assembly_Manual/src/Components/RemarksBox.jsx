import { useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import StepRemarks from "/Containers/StepRemarks";
//import { LuAlertCircle } from "react-icons/lu";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";


export default function RemarksBox() {

    const remarks = useRef()
    const [isExpanded, setExpanded] = useState(true)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

    return <>
        <button type="button" {...getToggleProps({
            onClick: () => { setExpanded((prevExpanded) => !prevExpanded) },
        })} className="remarksCollapsible" style={{ position: 'absolute', top: '20px', left: '20px' }}>
            {isExpanded ? <> <MdOutlineExpandLess /></> : <> <MdOutlineExpandMore /></>}
        </button>
        <div ref={remarks} className="remarksContent" {...getCollapseProps()}>
            <StepRemarks />
        </div>
    </>
}