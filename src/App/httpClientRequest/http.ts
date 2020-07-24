import axios from 'axios';
import {message} from 'antd';
import {getToken} from "@/App/utils/operatorLocalStorage";
import {useCallback, useState} from 'react';
import {useGlobalStore} from "@/App/store/GlobalStore";
import {useHistory} from 'react-router-dom';

const instance = axios.create({    //创建axios实例，在这里可以设置请求的默认配置
  timeout: 3000,
  // baseURL: process.env.NODE_ENV === 'production' ? '' : '/api',   //根据自己配置的反向代理去设置不同环境的baeUrl
});
// 文档中的统一设置post请求头。
instance.defaults.headers.post['Content-Type'] = 'application/json';
// delete 请求头
// instance.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded';

let httpCode: { [propName: number]: string } = {        // 这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时'
};

export const useRequest = (url: string, config: any) => {
  const [loading, setLoading] = useState(false);
  const globalStore = useGlobalStore();
  const router = useHistory();
  const request = useCallback(async (params?: any, pathParams?: string | number) => {
    const requestUrl = pathParams ? `${url}/${pathParams}` : url;
    const authorization = getToken();
    if (authorization) {
      /*
        此处有坑，在此记录
        request.headers['Authorization']
        必须通过此种形式设置Authorization,否则后端即使收到字段也会出现问题，返回401
        - request.headers.Authorization或request.headers.authorization可以设置成功，
        浏览器查看也没有任何问题，但是在后端会报401并且后端一律只能拿到小写的，
        也就是res.headers.authorization，后端用大写获取会报undefined
      */
      axios.defaults.headers['Authorization'] = authorization;
    } else {
      delete axios.defaults.headers['Authorization'];
    }

    setLoading(true);
    let response;
    try {
      if (config.method === 'get') {
        response = await axios({
          url: requestUrl,
          params,
          ...config
        });

      } else {
        response = await axios({
          url: requestUrl,
          data: params,
          ...config
        });
      }
      return response;
    } catch (error) {
      if (error.response) {
        // 根据请求失败的http状态码去给用户相应的提示
        let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message;
        message.error(tips);
        if (error.response.status === 401) {
          globalStore.logout();
          router.push('/login');
        }
        return Promise.reject(tips);
      } else {
        message.error('请求超时，请刷新重试');
        return Promise.reject('请求超时，请刷新重试');
      }
    } finally {
      setLoading(false);
    }

  }, [url, config]);
  return {request, loading};
};
