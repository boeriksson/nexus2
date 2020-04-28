import styled, {css} from "styled-components";

export const Container = styled.div`
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 300px;
    height: 100%;
    
    &:focus {
        outline: none;
    }
`

export const TreeTopUL = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`

export const Nested = styled.ul`
    list-style-type: none;
    display: block;
    padding-left: 15px;
`

export const Caret = styled.span`${({expanded}) => css`
    cursor: pointer;
    user-select: none;
    
    &::before {
        content: "\\25B6";
        color: black;
        display: inline-block;
        margin-right: 6px;
    }
    ${ expanded && `
        &::before {
            transform: rotate(90deg);
        }
    `}
`}`

export const Node = styled.li`${({selected}) => css`
    display: flex;
    & > div:first-child {
        flex-grow: 1;
        ${selected && `
            & > div:first-child {
                background-color: pink;
            }
        `}
    }
`}`
