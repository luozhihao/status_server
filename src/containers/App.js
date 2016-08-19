import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setProducts, setServers } from '../actions/count'
import Left from '../components/Left'
import Right from '../components/Right'

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

class App extends Component {

    componentDidMount() {
        this.props.setProducts()
        this.props.setServers()
    }

    render() {
        const { serverNames, products } = this.props

        return(
            <div className="main">
                <Left products={products} serverNames={serverNames}></Left>
                <Right></Right>
            </div>
        )
    }
}

const getData = state => {
    return {
        products: state.serverLeft.products,
        serverNames: state.serverLeft.serverNames
    }
}

export default connect(getData, { setProducts, setServers })(App)