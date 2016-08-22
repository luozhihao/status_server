import { GETSERVERS, GETPRODUCTS, GETTABLES, GETLOADING, GETROWKEYS } from '../constants'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

export const setProducts = (data = []) => {
    return {
        type: GETPRODUCTS,
        products: data
    }
}

export const setServers = (data = []) => {
    return {
        type: GETSERVERS,
        servers: data
    }
}

export const setTables = (data = []) => {
    return {
        type: GETTABLES,
        tables: data
    }
}

export const setLoading = (status = true) => {
    return {
        type: GETLOADING,
        loading: status
    }
}

export const setRowKeys = (keys = []) => {
    return {
        type: GETROWKEYS,
        keys: keys
    }
}

// 获取产品下拉框数据
export function getProducts() {
    return (dispatch, getState) => {
        return dispatch(fetchProducts())
    }
}

function fetchProducts() {
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
}

// 获取服务器列表
export function getServers(product) {
    return (dispatch, getState) => {
        return dispatch(fetchServers(product))
    }
}

function fetchServers(product) {
    return dispatch => {
        let request = new Request('/get_issuers_by_product/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: `product=${product}`
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setServers(data))
            })
    }
}

// 获取服务器数据
export function getTables(server) {
    return (dispatch, getState) => {
        return dispatch(fetchTables(server))
    }
}

function fetchTables(server) {
    return dispatch => {
        let request = new Request('/get_server_by_issuer/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: `issuer=${server}`
        })

        dispatch(setLoading(true))

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setRowKeys([]))
                dispatch(setTables(data))
                dispatch(setLoading(false))
            })
    }
}