import { GETPRODUCTS, GETSERVERS, GETTABLES, GETLOADING, GETROWKEYS, GETCURPRODUCT } from '../constants'

// 初始化state数据
const initialState = {
    products: [],
    curProduct: '请选择',
    serverNames: [],
    tableData: [],
    loading: false,
    keys: []
}

export default function serverLeft(state = initialState, action) {
    switch(action.type) {
        case GETPRODUCTS:
            return Object.assign({}, state, { products: action.products })
            break
        case GETCURPRODUCT:
            return Object.assign({}, state, { curProduct: action.cur })
            break
        case GETSERVERS:
            return Object.assign({}, state, { serverNames: action.servers })
            break
        case GETTABLES:
            return Object.assign({}, state, { tableData: action.tables })
            break
        case GETLOADING:
            return Object.assign({}, state, { loading: action.loading })
            break
        case GETROWKEYS:
            return Object.assign({}, state, { keys: action.keys })
            break
        default:
            return state
    }
}