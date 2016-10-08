import React, { Component } from 'react'
import { notification, message, Modal, Button } from 'antd'
import { GETSERVERS, GETPRODUCTS, GETTABLES, GETLOADING, GETROWKEYS, GETCURPRODUCT, GETSEARCH, GETACTIVE } from '../constants'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

const openNotification = (type) => {
    notification.open({
        message: type === 'success' ? '操作成功' : '操作失败',
        description: type === 'success' ? '你的操作已成功执行' : '你的操作失败了'
    })
}

function info(msg) {
    Modal.info({
        title: '服务器白名单信息',
        content: (
            <div>
                {
                    msg.map((e, i) =>
                        <p key={i}>{e}</p>
                    )
                }
            </div>
        ),
        onOk() {}
    })
}

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

export const setCurProduct = (cur) => {
    return {
        type: GETCURPRODUCT,
        cur: cur
    }
}

export const setSearch = (search) => {
    return {
        type: GETSEARCH,
        search: search
    }
}

export const setActive = (active) => {
    return {
        type: GETACTIVE,
        active: active
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

// 获取服务器数据
export function getTables(server, curProduct) {
    return (dispatch, getState) => {
        return dispatch(fetchTables(server, curProduct))
    }
}

function fetchTables(server, curProduct) {
    return dispatch => {
        let request = new Request('/get_server_by_issuer/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({issuer: server, product: curProduct})
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
            body: JSON.stringify({product: product})
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setServers(data))
            })
    }
}

// 修改服务器数据
export function changeServers(param) {
    return (dispatch, getState) => {
        return dispatch(fetchChangeServers(param))
    }
}

function fetchChangeServers(param) {
    return dispatch => {
        let request = new Request('/change_server_state/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(param)
        })

        dispatch(setLoading(true))

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                if (data.result === 1) {
                    openNotification('success')
                    dispatch(setSearch(''))
                    dispatch(getTables(param.curServer, param.product))
                } else {
                    openNotification('error')
                }
            })
    }
}

// 白名单操作
export function changeWhite(param) {
    return (dispatch, getState) => {
        return dispatch(fetchChangeWhite(param))
    }
}

function fetchChangeWhite(param) {
    return dispatch => {
        let request = new Request('/change_server_white/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({type: param.type, stateIds: param.stateIds, product: param.product})
        })

        dispatch(setLoading(true))
        const hide = message.loading('正在执行中...', 0)

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                dispatch(setLoading(false))
                setTimeout(hide, 0)

                if (data.result === 1) {
                    dispatch(setRowKeys([]))

                    param.type !==3 ? openNotification('success') : info(data.output)
                } else {
                    openNotification('error')
                }
            })
    }
}