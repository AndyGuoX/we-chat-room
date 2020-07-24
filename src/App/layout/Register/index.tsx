import React, {useEffect} from 'react';
import {Form, Input, Button, message} from 'antd';
import {observer} from 'mobx-react-lite';
import {useLocalStore} from "mobx-react-lite";
import {useHistory} from 'react-router-dom';
import './index.less';
import {useRegister, useGetAvatar} from '@/App/httpClientRequest/useApi';
import md5 from 'md5';
import {useGlobalStore} from "@/App/store/GlobalStore";

interface Store {
  avatarList: string[],
}

const Register = observer(props => {
  const globalStore = useGlobalStore();
  const socket = globalStore.socket;
  const router = useHistory();
  const {request: registerRequest, loading} = useRegister();
  const {request: getAvatar} = useGetAvatar();

  const store: Store = useLocalStore(() => ({
    avatarList: [],
  }));

  useEffect(() => {
    (async function () {
      store.avatarList = (await getAvatar()).data.data.avatarList;
    })();
  }, []);

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

  // 注册请求
  const registerSubmit = async (values: any) => {
    let random = Math.floor(Math.random() * store.avatarList.length);
    values.password = md5(values.password);
    values.avatar = store.avatarList[random];

    const res = await registerRequest(values);
    const resData = res.data;
    if (resData.code !== '1') {
      message.error(resData.message);
    } else {
      router.push('/login');
      message.success('注册成功');
      socket.emit('register');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className='welcome'>欢迎注册</h1>
        <Form
          onFinish={registerSubmit}
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
            name='nickname'
            rules={[
              {required: true, message: '昵称不能为空！'},
            ]
            }
          >
            <Input
              autoComplete='off'
              placeholder='请输入昵称'
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
              htmlType='submit'>注册</Button>
          </Form.Item>
        </Form>
        <div className="to-register">
          <span onClick={() => {
            router.push('/login')
          }}>去登陆</span>
        </div>
      </div>
    </div>
  );
});

export default Register;
// function W(CClass) {
//   return <Consumer>{(rouer)=><CClass {...router}/>}</Consumer>
// }