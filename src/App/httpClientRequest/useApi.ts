import {useRequest} from './http';

import {apiIp} from "@/common/constant";

/*
* 用户登录
* @param {Object} params 登录参数
* @requestMethod POST
* */
export const useLogin = () => useRequest(`${apiIp}/api/login`, {method: 'post'});

/*
* 用户注册
* @param {Object} params 注册参数
* @requestMethod POST
* */
export const useRegister = () => useRequest(`${apiIp}/api/register`, {method: 'post'});

/*
* 获取用户注册时所需头像
* @requestMethod POST
* */
export const useGetAvatar = () => useRequest(`${apiIp}/api/getAvatar`, {method: 'get'});

/*
* 获取个人信息
* @requestMethod GET
* */
export const useMyInfo = () => useRequest(`${apiIp}/api/getUserInfo`, {method: 'get'});

/*
* 获取所有用户信息
* @requestMethod GET
* */
export const useUserInfo = () => useRequest(`${apiIp}/api/getAllUser`, {method: 'get'});


/*
* 获取群聊天记录
* @requestMethod GET
* */
export const useRoomRecords = () => useRequest(`${apiIp}/api/getRoomRecords`, {method: 'get'});

/*
* 获取私人聊天记录
* @requestMethod GET
* */
export const usePrivateRecords = () => useRequest(`${apiIp}/api/getPrivateRecords`, {method: 'get'});