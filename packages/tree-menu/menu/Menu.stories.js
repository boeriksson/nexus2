import React from 'react'
import Menu  from './Menu'

export default { title: 'Tree menu' }

const payload = [
    {
        label: "lövträd",
        expanded: true,
        children: [
            {
                id: 1,
                label: "björk",
                expanded: false,
                children: [
                    {
                        id:2,
                        label: "skogsbjörk"
                    },
                    {
                        id: 3,
                        label: "hängbjörk"
                    }
                ]
            },
            {
                id: 4,
                label: "ek",
                expanded: true,
                children: [
                    {
                        id: 5,
                        label: "skogsek"
                    },
                    {
                        id: 6,
                        label: "rödek"
                    },
                    {
                        id: 7,
                        label: "korkek"
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        label: "barrträd",
        expanded: false,
        children: [
            {
                id: 9,
                label: "tall"
            },
            {
                id: 10,
                label: "gran"
            }
        ]
    }
]

export const simpleTreeMenu = () => <Menu payload={payload}/>
export const emptyTreeMenu = () => <Menu/>
