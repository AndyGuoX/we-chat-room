import React, {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import './index.less';
import io from 'socket.io-client';
import {apiIp, sideWidth} from "@/common/constant";
import {Observer} from 'mobx-react-lite';
import routes from '@/App/router';

import WeChatHeader from "@/App/layout/Chat/WeChatHeader";
import SideUserList from "@/App/layout/Chat/SideUserList";
import {useGlobalStore} from "@/App/store/GlobalStore";
import {useChatStore} from "@/App/layout/Chat/ChatStore/ChatStore";
import {useMyInfo, useUserInfo} from "@/App/httpClientRequest/useApi";
import {generateUUID} from "@/App/utils";

const {Sider, Content} = Layout;

function ChatMain() {
  const globalStore = useGlobalStore();
  const chatStore = useChatStore();
  // const router = useHistory();
  const {request: getUserInfo} = useMyInfo();
  const {request: getAllUser} = useUserInfo();

  useEffect(() => {
    const socket = globalStore.socket;
    socket.on("allMessage", (data) => {
      let chatRoom = globalStore.user.allUserList[0];
      const {userId, avatar, nickname, message, time} = data;
      /* 对左侧用户列表进行数据更新 */
      chatRoom.latestMessage.time = time;
      chatRoom.latestMessage.message = message;
      if (userId !== globalStore.user.userInfo.userId) { // 发消息的不是自己
        chatRoom.latestMessage.message = `${nickname}:${message}`;
      }
      /* 当前不在群聊对话框 */
      if (!chatStore.chat.userId.includes('group')) {
        console.log(1);
        chatRoom.unreadMessage++;
      } else {
        socket.emit('clearGroupUnreadMessage', {'userId': globalStore.user.userInfo.userId});
        chatStore.chat.currentRecords.push({
          _id: generateUUID(),
          fromId: userId,
          nickname: nickname,
          avatar: avatar,
          message: message,
          time: time
        });
      }
    });
    socket.on("privateMessage", (data) => {
      let chatRoom;
      const {userId, toId, avatar, nickname, message, time} = data;
      for (let item of globalStore.user.allUserList) {
        if (item.userId === userId || item.userId === toId) {
          chatRoom = item;
        }
      }
      /* 对左侧用户列表进行数据更新 */
      chatRoom.latestMessage.time = time;
      chatRoom.latestMessage.message = message;
      /* 当前不在私聊对话框 */
      if (chatStore.chat.userId !== userId && chatStore.chat.userId !== toId) {
        chatRoom.unreadMessage++;
      } else {
        globalStore.socket.emit('clearPrivateUnreadMessage', {
          'userId': globalStore.user.userInfo.userId,
          'fromId': chatStore.chat.userId === userId ? userId : toId,
        });
        chatStore.chat.currentRecords.push({
          _id: generateUUID(),
          fromId: userId,
          nickname: nickname,
          avatar: avatar,
          message: message,
          time: time
        });
      }
    });
    socket.on("addNewUser", (data) => {
      globalStore.user.allUserList.push(data);
    });
    socket.on("userLogin", (data) => {
      globalStore.user.allUserList.forEach((value) => {
        if (value.userId === data.userId) {
          value.isOnline = true;
        }
      })
    });
    socket.on("userLogout", (data) => {
      globalStore.user.allUserList.forEach((value) => {
        if (value.userId === data.userId) {
          value.isOnline = false;
        }
      })
    });
    (async () => {
      globalStore.user.userInfo = (await getUserInfo()).data.data;
      socket.emit('login', {'userId': globalStore.user.userInfo.userId});
      globalStore.user.allUserList = (await getAllUser()).data.data.allUserList;
      let groupItem = globalStore.user.allUserList[0];
      if (groupItem.latestMessage.fromId) { // 聊天存在
        if (groupItem.latestMessage.fromId !== globalStore.user.userInfo.userId) {
          const latestMessageNickname = groupItem.latestMessage.nickname;
          groupItem.latestMessage.message = `${latestMessageNickname}:${groupItem.latestMessage.message}`;
        }
      }
    })();

    //监听浏览器关闭事件(绝对好使，需所有代码放到生命周期mounted中)
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isIE11 = userAgent.indexOf("rv:11.0") > -1; //判断是否是IE11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    if (!isIE && !isEdge && !isIE11) {//兼容chrome和firefox
      var _beforeUnload_time = 0, _gap_time = 0;
      var is_fireFox = navigator.userAgent.indexOf("Firefox") > -1;//是否是火狐浏览器
      window.onunload = function () {
        _gap_time = new Date().getTime() - _beforeUnload_time;
        if (_gap_time <= 5) {
          //谷歌浏览器关闭
        } else {
          //谷歌浏览器刷新
        }
        socket.emit('disconnection', {'userId': globalStore.user.userInfo.userId});
      };
      window.onbeforeunload = function () {
        _beforeUnload_time = new Date().getTime();
        if (is_fireFox) {
          //火狐浏览器关闭
        } else {
          //火狐浏览器刷新
        }
        socket.emit('disconnection', {'userId': globalStore.user.userInfo.userId});
      };
    }
    return () => {
      socket.emit('disconnection', {'userId': globalStore.user.userInfo.userId});
      globalStore.socket.close();
      globalStore.socket = io(apiIp);
    }
  }, []);

  return (
    <Layout className="back-layout-wrapper">
      <Sider
        className='chatSider'
        width={sideWidth}
      >
        <WeChatHeader />
        <Observer>
          {() =>
            <SideUserList
              allUserList={globalStore.user.allUserList}
            />
          }
        </Observer>
      </Sider>
      <Layout
        style={
          {
            marginLeft: sideWidth,
            backgroundColor: "#fff",
          }
        }
      >
        <Content
          style={{
            display: 'flex',
            height: '100vh',
          }}
        >
          <Observer>
            {() => <Switch>
              {routes.map((item: any) => {
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    exact={item.exact}
                    render={props => {
                      // document.title = `${item.title}-${siteName}`;
                      return <item.component {...props} />;
                    }
                    } />
                );
              })}
            </Switch>}
          </Observer>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ChatMain;
