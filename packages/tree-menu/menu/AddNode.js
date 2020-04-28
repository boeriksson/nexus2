import styled, {css} from "styled-components";
import React, {useEffect, useState, createRef} from "react";

const AddEdit = styled.div`${({type}) => css`
    margin-left 0px;
    input {
        width: 100%;
    }
    ${type === 'child' && `
        margin-left: 15px;
    `}
`}`

const AddNode = ({add, type}) => {
    const [value, setValue] = useState(false)
    const addInput = createRef();

    useEffect(() => {
        addInput.current.focus()
    }, [])

    const handleKeyPress = (e) => {
        const key = e.keyCode || e.which
        if (key === 13) {
            addInput.current.blur()
            add(value, type)
        }
    }
    const handleChange = (e) => setValue(e.target.value)
    return <AddEdit type={type}><input type="text"
                                       ref={addInput}
                                       onChange={handleChange}
                                       onKeyPress={handleKeyPress}/></AddEdit>
}

export default AddNode