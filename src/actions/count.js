import { GETSERVERS, GETPRODUCTS } from '../constants'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

// 获取产品列表
export const setProducts = (data = ['关云长', '天子']) => {
    return {
        type: GETPRODUCTS,
        products: data
    }
}

// 获取产品列表
export const setServers = (data = ['1[Snail]', '2[main]', '3[ios_audit]', '4[qudao_audit]', '5[Main_Hui_server]', '10000[IOS]', '10001[HUN]', '10002[YHLM]', '10003[YYB]']) => {
    return {
        type: GETSERVERS,
        servers: data
    }
}

/*// 获取产品下拉框数据
export function getServers() {
    return (dispatch, getState) => {
        return dispatch(fetchProducts())
    }
}

function fetchServers() {
    return dispatch => {
        let request = new Request('/get_user_products/', {
            headers,
            method: 'POST',
            credentials: 'include' // 添加cookies
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setProducts(data))
            })
    }
}*/