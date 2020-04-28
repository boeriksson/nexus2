import React, {useState} from "react";
import AddNode from "./AddNode";
import {Caret, Nested, Node} from "./menuStyle";

const TreeNode = ({node, buildTree, handleAdd, handleClick}) => {
    function getHead() {
        return <div onClick={handleClick}>
            {node.label && node.children
                ? <Caret data-tooltip="tooltipCaret"
                         expanded={node.expanded}>{node.label}</Caret>
                : <span data-tooltip="tooltip">{node.label}</span>}
        </div>;
    }

    return (
        <Node selected={node.selected}>
            <div>
                {getHead()}
                {node.children && node.expanded &&
                <>
                    <Nested>{node.children.map((child) => buildTree(child))}</Nested>
                </>}
                {node.addChild && <AddNode add={handleAdd} type='child'/>}
                {node.addSibling && <AddNode add={handleAdd} type='sibling'/>}
            </div>
        </Node>
    )
}

export default TreeNode