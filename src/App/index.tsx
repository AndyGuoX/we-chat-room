import React, {useEffect} from 'react';
import {Switch, Route, withRouter, Redirect} from 'react-router-dom';
import './index.less';
import {siteName} from "@/common/constant";

import ChatMain from "@/App/layout/Chat/ChatMain";
import Login from "@/App/layout/Login";
import Register from "@/App/layout/Register";
import {getToken} from "@/App/utils/operatorLocalStorage";
import {ChatStoreProvider} from "@/App/layout/Chat/ChatStore/ChatStore";

function App(props: any) {
  useEffect(() => {
    /* 捕获全局 reject 并取消报错*/
    window.addEventListener('unhandledrejection', (e) => {
      e.preventDefault();
    });
  }, []);
  return (
    <Switch>
      <Route path='/login' render={() => {
        document.title = `登录-${siteName}`;
        return getToken() ? <Redirect to='/' /> : <Login />;
      }} />
      <Route path='/register' render={() => {
        document.title = `注册-${siteName}`;
        return <Register />;
      }} />
      <Route path='/' render={() => {
        document.title = `聊天-${siteName}`;
        return getToken() ? <ChatStoreProvider><ChatMain /></ChatStoreProvider> : <Redirect to='/login' />;
      }} />
    </Switch>
  );
}

export default withRouter(App);
