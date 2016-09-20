// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, Input, message } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

// 创建对象时设置初始化信息
const headers = new Headers()

const FormItem = Form.Item
const Option = Select.Option

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: null,
            settingsModal: false,
            loading: false,
            cdn: [{address: '', name: '', password: '', path: ''}]
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

        this.setState({active: null})
    }

    // 显示配置框
    showSettings = () => {
        let request = new Request('/edit_product/?product=' + this.props.curProduct, {
            headers,
            method: 'GET',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.props.form.setFieldsValue({
                    db: data.db,
                    host: data.host,
                    port: data.port,
                    user: data.user,
                    pwd: data.pwd,
                    incode: data.incode,
                    outcode: data.outcode,
                    whitecode: data.whitecode
                })

                this.setState({
                    cdn: data.cdn
                })

                this.setState({ settingsModal: true })
            })
    }

    // 隐藏配置框
    handleCancel = () => {
        this.setState({ settingsModal: false })
    }

    // 提交配置信息
    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return
            }

            // 检验CDN是否填全
            if (this.state.cdn.length) {
                let vaild =  this.state.cdn.every(e => 
                    e.address.trim() && e.name.trim() && e.password.trim() && e.path.trim()
                )

                if (!vaild) {
                    message.info('请补全CDN信息！')

                    return false
                }
            }

            this.setState({loading: true})
            this.confirmSettings(values)
        })
    }

    // 提交配置信息回调
    confirmSettings = (values) => {
        const { curProduct } = this.props

        let request = new Request('/edit_product/', {
            headers,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                db: values.db,
                host: values.host,
                port: values.port,
                user: values.user,
                pwd: values.pwd,
                incode: values.incode,
                outcode: values.outcode,
                whitecode: values.whitecode,
                cdn: this.state.cdn,
                product: curProduct
            })
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                if (data.result === 1) {
                    this.setState({settingsModal: false})
                    this.props.form.resetFields()
                    this.handleChange(curProduct)

                    message.success('连接成功！')
                } else if (data.result === -1) {
                    message.error('连接失败！')
                } else {
                    message.error('保存失败！')
                }
                this.setState({loading: false})
            })
    }

    // 添加CDN信息
    addCdn = () => {
        let arr = this.state.cdn.concat([{address: '', name: '', password: '', path: ''}])

        this.setState({
            cdn: arr
        })
    }

    // 修改cdn信息
    cdnChange = (e) => {
        let obj = e.target,
            value = obj.value,
            key = obj.name,
            index = obj.title

        let state = this.state.cdn

            state[parseInt(index)][key] = value

        this.setState({
            cdn: state
        })
    }

    // 删除cdn方法
    deleteFn = (i) => {
        this.state.cdn.splice(i, 1)

        this.setState({
            cdn: this.state.cdn
        })
    }   

    render() {
        const { products, serverNames, curProduct } = this.props
        const { getFieldProps } = this.props.form
        const formItemLayout = {
              labelCol: { span: 6 },
              wrapperCol: { span: 14 }
        }

        const dbProps = getFieldProps('db', {
            rules: [
                { required: true, message: '请填写数据库名称' }
            ]
        })

        const hostProps = getFieldProps('host', {
            rules: [
                { required: true, message: '请填写数据库IP地址' }
            ]
        })

        const portProps = getFieldProps('port', {
            initialValue: '1433',
            rules: [
                { required: true, message: '请填写端口号' }
            ]
        })

        const userProps = getFieldProps('user', {
            rules: [
                { required: true, message: '请填写用户名' }
            ]
        })

        const pwdProps = getFieldProps('pwd', {
            rules: [
                { required: true, message: '请填写密码' }
            ]
        })

        const incodeProps = getFieldProps('incode', {
            rules: [
                { required: true, message: '请填写内网测试命令' }
            ]
        })

        const outcode = getFieldProps('outcode', {
            rules: [
                { required: true, message: '请填写对外开放命令' }
            ]
        })

        const whitecode = getFieldProps('whitecode', {
            rules: [
                { required: true, message: '请填写查询白名单命令' }
            ]
        })

        return(
            <div>
                <ul className="sidebar">
                    <li className="logo">
                        服务器列表
                    </li>
                    <li>
                        <Select 
                            style={{ width: '100%', marginBottom: '20px' }} 
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
                    {
                        curProduct !== '请选择'
                        ?
                        <li className="text-center" style={{ marginTop: '20px'}}>
                            <Button type="primary" onClick={this.showSettings}>配置</Button>
                        </li>
                        :
                        <li></li>
                    }
                </ul>
                <Modal ref="modal"
                    width="1000px"
                    visible={this.state.settingsModal}
                    title="数据库配置" onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" size="large" onClick={this.handleSubmit} loading={this.state.loading}>
                        保存
                        </Button>,
                        <Button key="add" type="ghost" size="large" onClick={this.addCdn} loading={this.state.loading}>
                        添加CDN
                        </Button>,
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>关 闭</Button>
                  ]}
                >
                    <Form horizontal form={this.props.form} className="clearfix">
                        <div className="clearfix">
                            <div className="pull-left" style={{width: '500px'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="数据库IP"
                                    hasFeedback
                                >
                                    <Input type="text" {...hostProps} placeholder="请输入数据库IP地址" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="端口号"
                                    hasFeedback
                                >
                                    <Input type="text" {...portProps} placeholder="请输入数据库端口号" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="用户名"
                                    hasFeedback
                                >
                                    <Input type="text" {...userProps} placeholder="请输入用户名" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="密码"
                                    hasFeedback
                                >
                                    <Input {...pwdProps} placeholder="请输入密码" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="数据库名称"
                                    hasFeedback
                                >
                                    <Input type="text" {...dbProps} placeholder="请输入数据库名称" />
                                </FormItem>
                            </div>
                            <div className="pull-left" style={{width: '460px'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="内网测试命令"
                                    hasFeedback
                                >
                                    <Input type="text" {...incodeProps} placeholder="请输入内网测试命令" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="对外开放命令"
                                    hasFeedback
                                >
                                    <Input type="text" {...outcode} placeholder="请输入对外开放命令" />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="查询白名单命令"
                                    hasFeedback
                                >
                                    <Input type="text" {...whitecode} placeholder="请输入查询白名单命令" />
                                </FormItem>
                            </div>
                        </div>
                        <div className="cdn-box clearfix">
                            { 
                                this.state.cdn.map((e, i) => 
                                    <p className="text-center" key={i}>
                                        <Input
                                            name='address'
                                            title={i}
                                            style={{width: '20%'}}
                                            placeholder="请输入cdn地址"
                                            value={e.address}
                                            onChange={this.cdnChange}
                                        />
                                        <Input
                                            name='name'
                                            title={i}
                                            style={{width: '20%'}}
                                            placeholder="请输入cdn用户名"
                                            value={e.name}
                                            onChange={this.cdnChange}
                                        />
                                        <Input
                                            name='password'
                                            title={i}
                                            style={{width: '20%'}}
                                            placeholder="请输入cdn密码" 
                                            value={e.password}
                                            onChange={this.cdnChange}
                                        />
                                        <Input
                                            name='path'
                                            title={i}
                                            style={{width: '20%'}}
                                            placeholder="请输入文件路径" 
                                            value={e.path}
                                            onChange={this.cdnChange}
                                        />
                                        <Icon type="cross-circle" onClick={this.deleteFn.bind(this, i)} />
                                    </p>
                                )
                            }
                        </div>
                    </Form>
                </Modal>
            </div>
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