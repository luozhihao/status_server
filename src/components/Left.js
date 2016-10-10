// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Icon, Select, Button, Input, message } from 'antd'

const Option = Select.Option
const ButtonGroup = Button.Group

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            settingsModal: false,
            loading: false
        }
    }

    // 激活当前选中服务器
    getList = (i, value) => {
        const {setActive, getTables} = this.props

        setActive(i)
        getTables(value)
    }

    // 选择产品获取服务器列表
    handleChange = value => {
        const {getCurProduct, getServers, setActive, getPower} = this.props

        getCurProduct(value)
        getPower(value)
        getServers(value)
        setActive(null)
    }

    render() {
        const { products, serverNames, curProduct, showSettings, showCdn, active, useCDN, config } = this.props

        return(
            <div>
                <ul className="sidebar">
                    <li className="logo">
                        服务器列表
                    </li>
                    <li>
                        <Select 
                            style={{ width: '100%', marginBottom: '20px' }} 
                            onSelect={this.handleChange}
                            value={curProduct}
                            placeholder="请选择"
                        >
                            {
                                products.map((e, i) => 
                                    <Option value={e.value} key={i}>{e.value}</Option>
                                )
                            }
                        </Select>
                    </li>
                    {
                        serverNames.map((e, i) => 
                            <li 
                                className={`serverList${active === i ? ' active' : ''}`} 
                                key={i} 
                                onClick={this.getList.bind(this, i, e.IssuerId)}
                            >
                                <Icon type="hdd" />
                                <span className="nametxt">{e.IssuerName}</span>
                            </li>
                        )
                    }
                    {
                        curProduct !== '请选择'
                        ?
                        <li className="operate-box">
                            <div className="operate-setting">
                                {
                                    config
                                    ?
                                    <Button className="operate-btn" type="primary" onClick={showSettings}>配置</Button>
                                    :
                                    ''
                                }
                                {
                                    useCDN
                                    ?
                                    <Button className="operate-btn" style={{marginLeft: '5px'}} type="primary" onClick={showCdn}>CDN</Button>
                                    :
                                    ''
                                }
                            </div>
                        </li>
                        :
                        <li></li>
                    }
                </ul>
            </div>
        )
    }
}

Left.propTypes = {
    products: PropTypes.array.isRequired,
    serverNames: PropTypes.array.isRequired,
    curProduct: PropTypes.string.isRequired
}

export default Left