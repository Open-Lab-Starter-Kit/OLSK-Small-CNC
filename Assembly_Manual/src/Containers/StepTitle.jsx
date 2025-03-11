import { useContext } from 'react'
import { ModelContext } from '/Components/ModelContext.jsx'

export default function StepTitle() {

    const { modelProperties } = useContext(ModelContext)

    return <>
        <div >
            {modelProperties ? modelProperties.titleName : null}
        </div>
    </>


}