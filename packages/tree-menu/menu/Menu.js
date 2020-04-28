import React, {createRef} from 'react'
import {connect, useSelector} from 'react-redux'

import {updateTree} from './menuAction'
import {Container, TreeTopUL} from './menuStyle'
import TreeNode from './TreeNode'
import AddNode from './AddNode'

function unSelectTree(tree) {
    tree.map(node => {
        if (node.children) unSelectTree(node.children)
        if (node.selected) delete (node.selected)
    })
}

function flattenTree(tree) {
    const flattenBranch = (branch, flatTree, level) => {
        level++
        branch.map(node => {
            node.level = level
            flatTree.push(node)
            if (node.children && node.expanded) {
                flattenBranch(node.children, flatTree, level)
            }
        })
        return flatTree
    }
    return flattenBranch(tree, [], 0)
}

function deSelectNode(tree) {
    flattenTree(tree).forEach(node => {
        if (node.selected) {
            node.selected = false
        }
    })
}

const getIxOfNode = (flatTree, node) => flatTree.findIndex(nodeComp => node === nodeComp)

function findParent(tree, node) {
    const flatTree = flattenTree(tree)
    let ix = getIxOfNode(flatTree, node)
    const level = flatTree[ix].level
    if (level > 0) {
        flatTree[ix].selected = false
        while (flatTree[ix].level >= level) {
            ix--
        }
        return flatTree[ix]
    }
    return null
}

function getHandleKeyPress(keyMap, after) {
    return (e) => {
        const key = e.keyCode || e.which
        console.log('keyCode: ', key)
        if (keyMap.hasOwnProperty(key)) {
            keyMap[key](e)
            after && after()
        }
    }
}

function findNodeInFlatTree(tree) {
    const flatTree = flattenTree(tree)
    let ix = flatTree.findIndex(node => node.selected)
    if (ix < 0) ix = 0

    const hasChildren = flatTree[ix].children && flatTree[ix].children.length > 0;
    return {flatTree, ix, hasChildren}
}

function spaceKey(tree) {
    return () => { // 32: mellanslag  - toggle expanded
        const {flatTree, ix, hasChildren} = findNodeInFlatTree(tree)
        if (hasChildren) {
            flatTree[ix].expanded = !flatTree[ix].expanded
        }
    }
}

function leftArrowKey(tree) {
    return (e) => {     // 37: vänster - parent
        //             - if parent is root, nop
        let {flatTree, ix} = findNodeInFlatTree(tree)
        const level = flatTree[ix].level
        if (level > 0) {
            flatTree[ix].selected = false
            while (flatTree[ix].level >= level) {
                flatTree[ix].expanded = false
                ix--
            }
            flatTree[ix].expanded = false
            flatTree[ix].selected = true
            e.preventDefault()
        }
    }
}

function upArrowKey(tree) {
    return (e) => { // 38: upp      - previos sibling
        //              - if first child, parent
        //              - if parent is root, select last child of root
        const {flatTree, ix} = findNodeInFlatTree(tree)
        flatTree[ix].selected = false
        if (ix > 0) {
            flatTree[ix - 1].selected = true
        } else {
            flatTree[flatTree.length - 1].selected = true
        }
        e.preventDefault()
    }
}

function rightArrowKey(tree) {
    return (e) => { // 39: höger   - if children, select first child
        const {flatTree, ix, hasChildren} = findNodeInFlatTree(tree)
        const editKey = e.altKey || e.ctrlKey;
        if (editKey && !hasChildren) {
            flatTree[ix].addChild = true
        }
        if (hasChildren) {
            flatTree[ix].selected = false
            flatTree[ix].expanded = true
            flatTree[ix].children[0].selected = true
        }
        e.preventDefault()
    }
}

function downArrowKey(tree) {
    return (e) => {    // 40: ner     - next sibling
        //             - if last, parents next sibling
        //             - if root and bottom, select first child of root
        const {flatTree, ix, hasChildren} = findNodeInFlatTree(tree)
        const editKey = e.altKey || e.ctrlKey;
        flatTree[ix].selected = false
        if (editKey) {
            flatTree[ix].addSibling = true
        } else if (ix + 1 < flatTree.length) {
            flatTree[ix + 1].selected = true
        } else {
            flatTree[0].selected = true
        }
        e.preventDefault()
    }
}

function tabKey(tree, updateTree) {
    return downArrowKey(tree, updateTree)
}

const Menu = ({loadWork, tree}) => {
    let nodeIx = 0
    //const [tree, setTree] = useState(payload || [])
    const containerRef = createRef()

    const handleKeyPress = getHandleKeyPress({
        32: spaceKey(tree),
        37: leftArrowKey(tree),
        38: upArrowKey(tree),
        39: rightArrowKey(tree),
        40: downArrowKey(tree),
        9: tabKey(tree)
    }, () => updateTree([...tree]))

    function add(node, value, type) {
        if (type === 'child' && !node.hasOwnProperty('children')) node.children = []
        let addArray
        deSelectNode(tree)
        node.addSibling && delete node.addSibling
        node.addChild && delete node.addChild
        if (type === 'sibling') {
            const parent = findParent(tree, node)
            addArray = parent ? parent.children : tree
        } else {
            addArray = node.children
        }
        addArray.push({
            id: new Date().getTime(),
            label: value,
            selected: true
        })
        node.expanded = true
        updateTree([...tree])
        containerRef.current.focus()
    }

    const buildTree = (node) => {
        const handleClick = () => {
            if (node.children) node.expanded = !node.expanded
            unSelectTree(tree)
            node.selected = true
            loadWork(node.id)
            updateTree([...tree])
        }
        const handleAdd = (value, type) => {
            add(node, value, type);
        }
        return <TreeNode
            key={nodeIx++}
            node={node}
            buildTree={buildTree}
            handleAdd={handleAdd}
            handleClick={handleClick}
        />
    }

    return (
        tree.length === 0
            ? <AddNode add={add} type='sibling'/>
            : <Container tabIndex={-1} onKeyDown={handleKeyPress} ref={containerRef}>
                <TreeTopUL>
                    {buildTree({children: tree, expanded: true}, 'root')}
                </TreeTopUL>
            </Container>
    )
}

const mapDispatchToProps = {
    updateTree
}

const mapStateToProps = (state) => ({tree: state.tree})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)