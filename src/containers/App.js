import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    getProducts,
    getServers, 
    getTables, 
    setRowKeys, 
    setCurProduct, 
    changeServers, 
    setTables, 
    changeWhite, 
    setSearch,
    setActive,
    getEAI,
    setLoading,
    getPower,
    restartDumper
} from '../actions/count'
import Left from '../components/Left'
import Right from '../components/Right'
import SettingModal from '../components/SettingModal'
import CdnModal from '../components/CdnModal'
import UploadModal from '../components/UploadModal'
import EaiModal from '../components/EAIModal'
import { message } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            curServer: '',
            settingsModal: false,
            settingsData: null,
            cdnModal: false,
            cdnNames: [],
            uploadModal: false,
            EAIModal: false
        }
    }

    componentDidMount() {
        this.getUser()
        this.props.getProducts()
    }

    // 隐藏配置框
    handleCancel = () => {
        this.setState({ settingsModal: false })
    }

    cdnCancel = () => {
        this.setState({ cdnModal: false })
    }

    uploadCancel = () => {
        this.setState({ uploadModal: false })
    }

    EAICancel = () => {
        this.setState({ EAIModal: false })
    }

    // 显示配置框
    showSettings = () => {
        return fetch('/edit_product/?product=' + this.props.curProduct, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({ 
                    settingsModal: true,
                    settingsData: data
                })
            })
    }

    // 显示CDN框
    showCdn = () => {
        this.setState({ 
            cdnModal: true
        })

        this.getCdnName()
    }

    // 显示上传弹框
    showUpload = () => {
        this.setState({ 
            uploadModal: true
        })

        this.getCdnName()
    }

    // 显示EAI弹框
    showEAI = () => {
        const {getEAI, curProduct} = this.props

        this.setState({ 
            EAIModal: true
        })

        getEAI(curProduct)
    }

    // 获取CDN Name
    getCdnName = () => {
        return fetch('/get_product_cdns/?product=' + this.props.curProduct, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    cdnNames: data.cdn
                })
            })
    }

    // 保存CDN
    createCdn = (params) => {
        params.product = this.props.curProduct

        return fetch('cdn_save/', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(params)
            })
            .then((res) => { return res.json() })
            .then((data) => {
                if (data.result === 1) {
                    this.setState({
                        cdnModal: false
                    })

                    message.success('操作成功！')
                } else {
                    message.error('操作失败，请重试！')
                }
            })
    }

    // 当前选中产品
    getCurProduct = cur => {
        this.props.setCurProduct(cur)
    }

    // 激活当前选中服务器
    setActive = active => {
        this.props.setActive(active)
    }

    // 获取服务器列表
    getServers = product => {
        this.props.getServers(product)
    }

    // 获取表格数据
    getTables = server => {
        const { setSearch, getTables, curProduct } = this.props

        setSearch('')
        getTables(server, curProduct)
        this.setState({
            curServer: server
        })
    }

    // 刷新表格
    refreshTable = () => {
        const { curServer } = this.state
        const { setSearch, getTables, curProduct } = this.props

        setSearch('')
        getTables(curServer, curProduct)
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

    restart = () => {
        const {curProduct, keys, restartDumper} = this.props

        restartDumper({product: curProduct, stateIds: keys})
    }

    // 搜索内容
    searchFn = txt => {
        this.props.setSearch(txt)
    }

    // 获取权限
    getPower = (product) => {
        const { getPower } = this.props

        getPower(product)
    }

    // 获取用户名
    getUser = () => {
        return fetch('/userinfo/', {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    username: data.username
                })
            })
    }

    // 退出
    logout = () => {
        fetch('/logout/', {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                location.href="/"
            })
    }

    render() {
        const { 
            serverNames,
            products,
            curProduct, 
            tableData, 
            loading, 
            keys, 
            search, 
            refreshSearch, 
            active, 
            groups, 
            netTypes,
            setLoading,
            useCDN,
            config
        } = this.props

        const { 
            username, 
            settingsModal, 
            settingsData,
            cdnModal, 
            cdnNames, 
            uploadModal, 
            EAIModal,
            curServer 
        } = this.state

        return(
            <div className="main">
                <Left 
                    products={products}
                    curProduct={curProduct}
                    serverNames={serverNames} 
                    getServers={this.getServers}
                    getTables={this.getTables}
                    getCurProduct={this.getCurProduct}
                    showSettings={this.showSettings}
                    showCdn={this.showCdn}
                    setActive={this.setActive}
                    active={active}
                    getPower={this.getPower}
                    useCDN={useCDN}
                    config={config}
                ></Left>
                <Right
                    username={username}
                    logout={this.logout}
                    tableData={tableData} 
                    loading={loading}
                    selectedRowKeys={keys}
                    onSelectChange={this.onSelectChange}
                    changeServers={this.changeServers}
                    operateFn={this.operateFn}
                    searchFn={this.searchFn}
                    search={search}
                    showUpload={this.showUpload}
                    showEAI={this.showEAI}
                    useCDN={useCDN}
                    restart={this.restart}
                ></Right>
                {
                    this.state.settingsModal
                    ?
                    <SettingModal
                        settingsModal={settingsModal}
                        curProduct={curProduct}
                        getServers={this.getServers}
                        getCurProduct={this.getCurProduct}
                        handleCancel={this.handleCancel}
                        setActive={this.setActive}
                        data={settingsData}
                        getPower={this.getPower}
                    ></SettingModal>
                    :
                    ''
                }
                {
                    this.state.cdnModal
                    ?
                    <CdnModal
                        cdnModal={cdnModal}
                        cdnCancel={this.cdnCancel}
                        serverNames={serverNames}
                        createCdn={this.createCdn}
                        cdnNames={cdnNames}
                    >
                    </CdnModal>
                    :
                    ''
                }
                {
                    this.state.uploadModal
                    ?
                    <UploadModal
                        uploadModal={uploadModal}
                        uploadCancel={this.uploadCancel}
                        cdnNames={cdnNames}
                        serverNames={serverNames}
                        curServer={curServer}
                    >
                    </UploadModal>
                    :
                    ''
                }
                {
                    this.state.EAIModal
                    ?
                    <EaiModal
                        EAIModal={EAIModal}
                        EAICancel={this.EAICancel}
                        groups={groups}
                        netTypes={netTypes}
                        selectedRowKeys={keys}
                        refreshTable={this.refreshTable}
                        setLoading={setLoading}
                        curProduct={curProduct}
                    >
                    </EaiModal>
                    :
                    ''
                }
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
        active: state.serverLeft.active,
        groups: state.serverLeft.groups,
        netTypes: state.serverLeft.netTypes,
        useCDN: state.serverLeft.useCDN,
        config: state.serverLeft.config
    }
}

export default connect(getData, { 
    getProducts, 
    getServers, 
    getTables, 
    setRowKeys, 
    setCurProduct, 
    changeServers, 
    setTables, 
    changeWhite, 
    setSearch,
    setActive,
    getEAI,
    setLoading,
    getPower,
    restartDumper
})(App)