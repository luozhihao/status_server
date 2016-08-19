// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 0
        }
    }

    getList = (i) => {
        this.setState({
            active: i
        })
    }

    render() {
        const { products, serverNames } = this.props
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
                        placeholder="请选择"
                    >
                        {
                            products.map((e, i) => 
                                <Option value={e} key={i}>{e}</Option>
                            )
                        }
                    </Select>
                </li>
                {
                    serverNames.map((e, i) => 
                        <li className={`serverList${this.state.active === i ? ' active' : ''}`} key={i} onClick={this.getList.bind(this, i)}>
                            <Icon type="hdd" />
                            <span className="nametxt">{e}</span>
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
    serverNames: PropTypes.array.isRequired
}

export default Left