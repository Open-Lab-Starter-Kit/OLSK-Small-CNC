import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'


export default create(subscribeWithSelector((set) => {
    return {
        blocksCount: 3,

        cameraPositionTag: 'zero',

        svgReset: 'zero',

        isVisible: 'visible',

        wiringStep: false,

        resetCamera: () => {
            set(() => {

                return { cameraPositionTag: 'initial' }
            })
        },

        freeControls: () => {
            set(() => {

                return { cameraPositionTag: 'zero' }

            })
        },

        topCamera: () => {
            set((state) => {
                return {
                    cameraPosition: 'top'
                }
            })
        },

        isNotVisibleToggle: () => {
            set(() => {
                return { isVisible: 'hidden' }
            })
        },

        isVisibleToggle: () => {
            set(() => {
                return { isVisible: 'visible' }
            })
        },

        isWiringStep: () => {
            set(() => {
                return { wiringStep: true }
            })
        },
        isNotWiringStep: () => {
            set(() => {
                return { wiringStep: false }
            })
        }
    }
}))