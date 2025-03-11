import React, { useRef, useEffect, useContext, useState } from "react";
import { ModelContext } from "/Components/ModelContext.jsx";


export default function StepNavigationMenu() {

    const { stepList, setStepPosition, stepCount, currentStepName, modelProperties } = useContext(ModelContext)
    const [btnClass, setBtnClass] = useState('stepNaviBtn');
    const [btnColor, setBtnColor] = useState();

    if (stepList) {
        const tempArray = [...Array(stepList.length)]
    }

    return (
        <div >
            <ul>
                {stepList ? stepList.map((name, index) =>
                    < li key={index} >
                        {modelProperties && name === modelProperties.titleName ?
                            <button
                                id={`${name}`}
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                onClick={() => {
                                    setStepPosition(index);
                                }}
                                className={'stepNaviBtn'}
                            >
                                {name}
                            </button>
                            :
                            <button
                                id={`${name}`}
                                style={{ backgroundColor: btnColor }}
                                onClick={() => {
                                    setStepPosition(index);
                                }}
                                className={'stepNaviBtn'}
                            >
                                {name}
                            </button>
                        }

                    </li>
                ) : null}


            </ul>

            {/*   {stepName.map((step, index) => (
                <button
                    key={index}
                    onClick={() => setStepCount(index)}
                    className={stepCount === index ? "active" : ""}
                >
                    {step}
                </button>
            ))} */}
        </div >
    );
}

export const MemoizedStepNavigationMenu = React.memo(StepNavigationMenu)