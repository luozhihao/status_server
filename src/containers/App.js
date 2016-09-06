import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProducts, getServers, getTables, setRowKeys, setCurProduct, changeServers, setTables, changeWhite, setSearch } from '../actions/count'
import Left from '../components/Left'
import Right from '../components/Right'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            curServer: ''
        }
    }

    componentDidMount() {
        this.getUser()
        this.props.getProducts()
    }

    // 当前选中产品
    getCurProduct = cur => {
        this.props.setCurProduct(cur)
    }

    // 获取服务器列表
    getServers = product => {
        this.props.getServers(product)
    }

    // 获取表格数据
    getTables = server => {
        this.props.setSearch('')
        this.props.getTables(server, this.props.curProduct)
        this.setState({
            curServer: server
        })
    }

    // 选中行id
    onSelectChange = keys => {
        this.props.setRowKeys(keys)
    }

    // 修改服务器列表
    changeServers = formData => {
        const {curProduct, keys, changeServers} = this.props

        changeServers({
            curServer: this.state.curServer,
            product: curProduct, 
            stateIds: keys,
            IsRuning: formData.isRunning,
            ServerStyle: formData.serverStyle,
            IsStartIPWhile: formData.isStartIpWhite
        })
    }

    // 开启关闭查询服务器白名单
    operateFn = type => {
        const {curProduct, keys, changeWhite} = this.props

        changeWhite({type: type, stateIds: keys, product: curProduct})
    }

    // 搜索内容
    searchFn = txt => {
        this.props.setSearch(txt)
    }

    // 获取用户名
    getUser = () => {
        let request = new Request('/userinfo/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    username: data.username
                })
            })
    }

    // 退出
    logout = () => {
        let request = new Request('/logout/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                location.href="/"
            })
    }

    render() {
        const { serverNames, products, curProduct, tableData, loading, keys, search, refreshSearch } = this.props

        return(
            <div className="main">
                <Left 
                    products={products}
                    curProduct={curProduct}
                    serverNames={serverNames} 
                    getServers={this.getServers}
                    getTables={this.getTables}
                    getCurProduct={this.getCurProduct}
                ></Left>
                <Right
                    username={this.state.username}
                    logout={this.logout}
                    tableData={tableData} 
                    loading={loading}
                    selectedRowKeys={keys}
                    onSelectChange={this.onSelectChange}
                    changeServers={this.changeServers}
                    operateFn={this.operateFn}
                    searchFn={this.searchFn}
                    search={search}
                    refreshSearch={refreshSearch}
                ></Right>
            </div>
        )
    }
}

const getData = state => {
    return {
        products: state.serverLeft.products,
        curProduct: state.serverLeft.curProduct,
        serverNames: state.serverLeft.serverNames,
        tableData: state.serverLeft.tableData,
        loading: state.serverLeft.loading,
        keys: state.serverLeft.keys,
        search: state.serverLeft.search,
        refreshSearch: state.serverLeft.refreshSearch
    }
}

export default connect(getData, { getProducts, getServers, getTables, setRowKeys, setCurProduct, changeServers, setTables, changeWhite, setSearch })(App)