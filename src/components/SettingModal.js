import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, Input, message } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

class SettingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount () {
        const {data} = this.props

        if (data) {
            this.props.form.setFieldsValue({
                db: data.db,
                host: data.host,
                port: data.port,
                user: data.user,
                pwd: data.pwd,
                incode: data.incode,
                outcode: data.outcode,
                whitecode: data.whitecode,
                gameId: data.gameId
            })
        }
    }

    // 选择产品获取服务器列表
    handleChange = value => {
        const { getCurProduct, getServers, setActive } = this.props

        getCurProduct(value)
        getServers(value)
        setActive(null)
    }

    // 提交配置信息
    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return
            }

            this.setState({loading: true})
            this.confirmSettings(values)
        })
    }

    // 提交配置信息回调
    confirmSettings = (values) => {
        const { curProduct } = this.props

        return fetch('/edit_product/', {
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
                    gameId: values.gameId,
                    product: curProduct
                })
            })
            .then((res) => { return res.json() })
            .then((data) => {
                if (data.result === 1) {
                    this.props.handleCancel()
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

    render() {
        const { getFieldProps } = this.props.form
        const { settingsModal, handleCancel, data } = this.props

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

        const gameIdProps = getFieldProps('gameId', {
            rules: [
                { required: true, message: '请填写gameId' }
            ]
        })

        return( 
            <Modal ref="modal"
                width="1000px"
                visible={settingsModal}
                title="配置" 
                onCancel={handleCancel}
                footer={[
                    <Button 
                        key="submit" 
                        type="primary" 
                        size="large" 
                        onClick={this.handleSubmit} 
                        loading={this.state.loading}
                    >
                        保存
                    </Button>,
                    <Button 
                        key="back" 
                        type="ghost" 
                        size="large" 
                        onClick={handleCancel}
                    >
                        关 闭
                    </Button>
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
                            <FormItem
                                {...formItemLayout}
                                label="gameId"
                                hasFeedback
                            >
                                <Input type="text" {...gameIdProps} placeholder="请输入gameId" />
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

SettingModal = Form.create()(SettingModal)

export default SettingModal