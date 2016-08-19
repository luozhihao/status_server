import { GETPRODUCTS, GETSERVERS } from '../constants'

// 初始化state数据
const initialState = {
    products: [],
    serverNames: []
}

export default function serverLeft(state = initialState, action) {
    switch(action.type) {
        case GETPRODUCTS:
            return Object.assign({}, state, { products: action.products })
            break
        case GETSERVERS:
            return Object.assign({}, state, { serverNames: action.servers })
            break
        default:
            return state
    }
}