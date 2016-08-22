import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProducts, getServers, getTables, setRowKeys } from '../actions/count'
import Left from '../components/Left'
import Right from '../components/Right'

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

class App extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getProducts()
    }

    // 获取服务器列表
    getServers = (product) => {
        this.props.getServers(product)
    }

    // 获取表格数据
    getTables = (server) => {
        this.props.getTables(server)
    }

    // 选中行id
    onSelectChange = (keys) => {
        this.props.setRowKeys(keys)
    }

    render() {
        const { serverNames, products, tableData, loading, keys } = this.props

        return(
            <div className="main">
                <Left 
                    products={products} 
                    serverNames={serverNames} 
                    getServers={this.getServers}
                    getTables={this.getTables}
                ></Left>
                <Right 
                    tableData={tableData} 
                    loading={loading}
                    selectedRowKeys={keys}
                    onSelectChange={this.onSelectChange}
                ></Right>
            </div>
        )
    }
}

const getData = state => {
    return {
        products: state.serverLeft.products,
        serverNames: state.serverLeft.serverNames,
        tableData: state.serverLeft.tableData,
        loading: state.serverLeft.loading,
        keys: state.serverLeft.keys
    }
}

export default connect(getData, { getProducts, getServers, getTables, setRowKeys })(App)