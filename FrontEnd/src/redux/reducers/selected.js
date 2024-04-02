const initialState = {
    isEdit: false,
    selectData: {},
    isDelete: false,
    parentSelectedData: {}
};

const selected = (state = initialState, action) => {
    switch (action.type) {
        case "MODELEDIT":
            return {
                ...state,
                isEdit: action.payload
            }
        case "SELECTDATA":
            return {
                ...state,
                selectData: action.payload
            }
        case "MODELDELETE":
            return {
                ...state,
                isDelete: action.payload
            }
        case "PARENTSELECTEDATA":
            return {
                ...state,
                parentSelectedData: action.payload
            }
        default:
            return state;
    }
};

export default selected;
