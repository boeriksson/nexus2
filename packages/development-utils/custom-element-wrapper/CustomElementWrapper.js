import React, {useEffect, useRef} from 'react'

const CustomElementWrapper = (props) => {
    const {name, clazz} = props
    const containerRef = useRef()

    useEffect(() => {
        if (!customElements.get(name)) {
            customElements.define(name, clazz)
        }
        if (containerRef.current) {
            const currentElement = containerRef.current.firstChild
            if (!currentElement) {
                const element = new (customElements.get(name))(props)
                containerRef.current.appendChild(element)
            } else {
                currentElement.propsChangedCallback(props)
            }
        }
    }, [props, containerRef])

    return <div ref={containerRef}/>
}

export default CustomElementWrapper