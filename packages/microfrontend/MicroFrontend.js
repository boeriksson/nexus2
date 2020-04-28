import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import useWebComponent from "./useWebComponent";

const MicroFrontend = (props) => {
    const {src, name, ...componentProps} = props;
    const containerRef = useRef();
    const tagName = useWebComponent(src, name, [...Object.values(componentProps)]);

    useEffect(() => {
        if (containerRef.current && tagName) {
            const currentElement = containerRef.current.firstChild;
            if (!currentElement) {
                const element = new (customElements.get(tagName))(props);
                containerRef.current.appendChild(element);
            } else if (currentElement.propsChangedCallback) {
                currentElement.propsChangedCallback(props);
            }
        }
    }, [tagName, componentProps]);

    return tagName ? <div key={tagName} ref={containerRef}/> : null;
};

MicroFrontend.propTypes = {
    src: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default MicroFrontend;
