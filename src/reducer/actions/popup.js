import actionTypes from "./actionTypes"

export const openPromotion = ({ row, col, x, y }) => {
    return {
        type : actionTypes.PROMOTION_OPEN, 
        payload : { row, col, x, y }
    }
}


export const closePopup = () => {
    return {
        type : actionTypes.PROMOTION_CLOSE
    }
}