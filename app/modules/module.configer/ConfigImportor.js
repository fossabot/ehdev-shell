/**
 * Config Importor
 * @author ryan.bian
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Select,
  Radio,
  Upload,
  Modal,
  Icon,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

// import styles from './index.less';

@Form.create()
@connect(state => ({
  remoteConfigs: state['page.configer'].remote.configIds,
}))
class ImportForm extends Component {
  static propTypes = {
    remoteConfigs: PropTypes.arrayOf(PropTypes.string),
  }
  render() {
    const { remoteConfigs } = this.props;
    // eslint-disable-next-line react/prop-types
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const uploadProps = {};
    return (
      <Form
        layout="horizontal"
      >
        <FormItem
          label="添加模式"
          {...formItemLayout}
        >
          {
            getFieldDecorator('importMethod', {
              initialValue: 'select',
              exclusive: true,
            })(
              <Radio.Group>
                <Radio.Button value="select">选择</Radio.Button>
                <Radio.Button value="upload">导入</Radio.Button>
              </Radio.Group>
            )
          }
        </FormItem>
        {
          getFieldValue('importMethod') === 'select' &&
            <FormItem
              label="选择引擎"
              {...formItemLayout}
            >
              {
                getFieldDecorator('configName', {
                  rules: [{
                    required: true,
                    message: '请选择一个有效引擎',
                  }],
                })(
                  <Select>
                    {
                      remoteConfigs.map(
                        name => <Option key={name}>{name}</Option>
                      )
                    }
                  </Select>
                )
              }
            </FormItem>
        }
        {
          getFieldValue('importMethod') === 'upload' &&
            <FormItem
              label="导入tgz包"
              {...formItemLayout}
            >
              {
                getFieldDecorator('configEntity', {
                  rules: [{
                    required: true,
                    message: '请添加一个tgz包',
                  }],
                })(
                  <Upload {...uploadProps}>
                    <Button>
                      <Icon type="upload" />
                      点此上传
                    </Button>
                  </Upload>
                )
              }
            </FormItem>
        }
      </Form>
    );
  }
}

export default class ConfigImportor extends Component {
  static defaultProps = {
    visible: false,
    onCancel() {},
    onConfirm() {},
  }
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
  }
  handleSubmit = () => {
    this.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.onConfirm(values);
      }
    });
  }
  render() {
    const { visible } = this.props;
    const modalProps = {
      title: '添加引擎',
      visible,
      onCancel: this.props.onCancel,
      onOk: this.handleSubmit,
    };
    return (
      <Modal {...modalProps}>
        <ImportForm ref={node => this.form = node} />
      </Modal>
    );
  }
}
