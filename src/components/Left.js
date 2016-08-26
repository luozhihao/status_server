// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: null
        }
    }

    // 激活当前选中服务器
    getList = (i, value) => {
        this.setState({
            active: i
        })

        this.props.getTables(value)
    }

    // 选择产品获取服务器列表
    handleChange = value => {
        this.props.getCurProduct(value)
        this.props.getServers(value)
    }

    render() {
        const { products, serverNames, curProduct } = this.props
        const { getFieldProps } = this.props.form
        return(
            <ul className="sidebar">
                <li className="logo">
                    服务器列表
                </li>
                <li>
                    <Select 
                        style={{ width: '100%', marginBottom: '20px' }} 
                        {...getFieldProps('products')}
                        onChange={this.handleChange}
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
                            className={`serverList${this.state.active === i ? ' active' : ''}`} 
                            key={i} 
                            onClick={this.getList.bind(this, i, e.IssuerId)}
                        >
                            <Icon type="hdd" />
                            <span className="nametxt">{e.IssuerName}</span>
                        </li>
                    )
                }
            </ul>
        )
    }
}

Left = Form.create()(Left)

Left.propTypes = {
    products: PropTypes.array.isRequired,
    serverNames: PropTypes.array.isRequired,
    curProduct: PropTypes.string.isRequired
}

export default Left