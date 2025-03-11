import { useContext } from "react"
import { ModelContext } from "./ModelContext"


export default function MouseEvent() {

    let { visibleObj } = useContext(ModelContext)

    return <>
        {console.log(visibleObj)
        }
    </>

}