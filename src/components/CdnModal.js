import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, Input, message } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

class CdnModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            operate: '1'
        }
    }

    // 选择新建或修改
    operateFn = value => {
        this.setState({
            operate: value
        })
    }

    // 保存校验
    createCdn = e => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return
            }

            this.setState({loading: true})
            this.props.createCdn(values)
        })
    }

    // 渠道选择
    issuerChange = value => {
        return fetch('/get_issuer_path/?issuer=' + value, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.props.form.setFieldsValue({path: data.path})
            })
    }

    // CDN名称选择
    nameChange = value => {
        return fetch('/get_cdn_info/?cdn_id=' + value, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.props.form.setFieldsValue({
                    cdn_ip: data.cdn_ip,
                    cdn_user: data.cdn_user,
                    cdn_pwd: data.cdn_pwd
                })
            })
    }

    render() {
        const { getFieldProps } = this.props.form
        const { cdnCancel, cdnModal, serverNames, cdnNames } = this.props
        const { operate, loading } = this.state

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }

        const cdnAddressProps = getFieldProps('cdn_ip', {
            rules: [
                { required: true, message: '请填写CDN地址' }
            ]
        })

        const cdnUserProps = getFieldProps('cdn_user', {
            rules: [
                { required: true, message: '请填写CDN用户名' }
            ]
        })

        const cdnPasswordProps = getFieldProps('cdn_pwd', {
            rules: [
                { required: true, message: '请填写CDN密码' }
            ]
        })

        const issuerProps = getFieldProps('issuer', {
            rules: [
                { required: true, type: 'number', message: '请选择渠道' }
            ]
        })

        const pathProps = getFieldProps('path', {
            rules: [
                { required: true, message: '请填写路径' }
            ]
        })

        return(
            <Modal ref="modal"
                width="600px"
                visible={cdnModal}
                title="CDN配置" onCancel={cdnCancel}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.createCdn} loading={loading}>
                    保存
                    </Button>,
                    <Button key="back" type="ghost" size="large" onClick={cdnCancel}>关 闭</Button>
                ]}
            >
                <Form horizontal form={this.props.form} className="clearfix">
                    <FormItem
                        {...formItemLayout}
                        label="操作"
                    >
                        <Select
                            defaultValue="1"
                            onSelect={this.operateFn}
                        >   
                            <Option value="1">新建</Option>
                            <Option value="2">修改</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN名称"
                        hasFeedback
                    >   
                        {
                            this.state.operate === '1'
                            ?
                            <Input 
                                type="text" 
                                {...getFieldProps('cdn_name', {rules: [{ required: operate === '1', message: '请填写CDN名称' }]})} 
                                placeholder="请输入CDN名称" />
                            :
                            <Select 
                                {...getFieldProps('cdn_id', {rules: [{ required: operate === '2', message: '请选择CDN名称' }]})}
                                onSelect={this.nameChange}
                                placeholder="请选择CDN名称"
                            >   
                                {
                                    cdnNames.map((e, i) =>
                                        <Option value={e.value}>{e.label}</Option>
                                    )
                                }
                            </Select>
                        }
                        
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN地址"
                        hasFeedback
                    >
                        <Input type="text" {...cdnAddressProps} placeholder="请输入cdn地址" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN用户名"
                        hasFeedback
                    >
                        <Input type="text" {...cdnUserProps} placeholder="请输入cdn用户名" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN密码"
                        hasFeedback
                    >
                        <Input type="text" {...cdnPasswordProps} placeholder="请输入cdn密码" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="渠道"
                    >
                        <Select 
                            {...issuerProps} 
                            placeholder="请选择渠道"
                            onSelect={this.issuerChange}
                        >
                            {
                                serverNames.map((e, i) =>
                                    <Option value={e.IssuerId} key={i}>{e.IssuerName}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="路径"
                        hasFeedback
                    >
                        <Input type="text" {...pathProps} placeholder="请输入文件路径" />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

CdnModal = Form.create()(CdnModal)

export default CdnModal