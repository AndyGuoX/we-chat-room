import React from 'react';
import {Form, Input, Button, message} from 'antd';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import './index.less';
import {useLogin} from '@/App/httpClientRequest/useApi';
import {setToken} from "@/App/utils/operatorLocalStorage";
import {useGlobalStore} from "@/App/store/GlobalStore";
import md5 from 'md5';

const Login = observer(props => {
  const globalStore = useGlobalStore();
  const socket = globalStore.socket;
  const router = useHistory();
  const {request: loginRequest, loading} = useLogin();

  // 验证登录表单
  const pwdValidate = (rule: any, value: string) => {
    const regular = /^[a-zA-Z0-9]{6,20}$/;
    if (!value) {
      return Promise.reject('密码不能为空！');
    }
    if (regular.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject('密码为 6-20 位数字和字母！');
    }
  };

  // 登录请求
  const loginSubmit = async (values: any) => {
    values.password = md5(values.password);
    const res = await loginRequest(values);
    const resData = res.data;
    if (resData.code !== '1') {
      message.error(resData.message);
    } else {
      setToken(`Bearer ${resData.token}`);
      globalStore.user.token = resData.token;
      router.push('/');
      message.success('登录成功');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className='welcome'>欢迎登录</h1>
        <Form
          onFinish={loginSubmit}
        >
          <Form.Item
            name='username'
            rules={[
              {required: true, message: '账号不能为空！'},
            ]
            }
          >
            <Input
              autoComplete='off'
              placeholder='请输入用户名'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {validator: pwdValidate}
            ]}
          >
            <Input.Password
              placeholder='请输入 6-20 位数字和字母'
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              className='login-btn'
              type='primary'
              htmlType='submit'>登录</Button>
          </Form.Item>
        </Form>
        <div className="to-register">
          <span onClick={() => {
            router.push('/register')
          }}>去注册</span>
        </div>
      </div>
    </div>
  );
});

export default Login;
// function W(CClass) {
//   return <Consumer>{(rouer)=><CClass {...router}/>}</Consumer>
// }