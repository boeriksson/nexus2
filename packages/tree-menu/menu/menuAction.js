export const UPDATE_MENU_TREE = 'UPDATE_MENU_TREE';

export const updateTree = tree => dispatch => {
    console.log('updateTree: ', tree)
    console.log('dispatch: ', dispatch)
    return dispatch({type: UPDATE_MENU_TREE, tree})
}