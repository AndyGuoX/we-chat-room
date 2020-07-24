import React from 'react';
import './index.less';
import {observer} from 'mobx-react-lite';
import {useChatStore} from "@/App/layout/Chat/ChatStore/ChatStore";
import {useGlobalStore} from "@/App/store/GlobalStore";
import MyBadge from "@/App/components/MyBadge";
import {useRoomRecords} from "@/App/httpClientRequest/useApi";
import {usePrivateRecords} from "@/App/httpClientRequest/useApi";

/**
 * 用户项
 * 包括姓名，头像，是否在线，未读消息数
 */

interface Props {
  /* 当前选中项用户 id */
  userId: string,
  /* 当前选中项用户昵称 */
  nickname: string,
  /* 当前选中项用户头像 */
  avatar: string,
  /* 当前选中项用户是否在线 */
  isOnline: boolean,
  /* 未读消息数 */
  unreadMessage: number,
  /* 最近的一条消息 */
  latestMessage: { message: string, time: string },
  /* 最近一条消息的时间 */
  latestMessageTime: string,
}

const UserItem = observer((props: Props) => {
  const chatStore = useChatStore();
  const globalStore = useGlobalStore();
  const {request: getAllRoomRecords} = useRoomRecords();
  const {request: getPrivateRecords} = usePrivateRecords();

  const chatTo = async () => {
    const {userId, nickname, avatar} = props;
    chatStore.chat.userId = userId;
    chatStore.chat.nickname = nickname;
    chatStore.chat.avatar = avatar;
    if (userId.includes('group')) { // 群聊
      globalStore.socket.emit('clearGroupUnreadMessage', {'userId': globalStore.user.userInfo.userId});
      globalStore.user.allUserList[0].unreadMessage = 0;
      chatStore.chat.currentRecords = (await getAllRoomRecords()).data.data.allRoomRecords;
    } else { // 私聊
      globalStore.socket.emit('clearPrivateUnreadMessage', {
        'userId': globalStore.user.userInfo.userId,
        'fromId': userId,
      });
      for (let item of globalStore.user.allUserList) {
        if (item.userId === userId) {
          item.unreadMessage = 0;
        }
      }
      chatStore.chat.currentRecords = (await getPrivateRecords({'fromId': userId})).data.data.privateRecords;
    }
    // setChatUserActive(userId);
  };

  return (
    <li className={`user-list-item${props.userId === chatStore.chat.userId ? ' active' : ''}`} onClick={chatTo}>
      <div className={`avatar avatar-${props.isOnline ? 'online' : 'offline'}`}>
        <img src={props.avatar} alt="" />
      </div>
      <div className="contacts-content">
        <div className="contacts-info">
          <span className="chat-name">{props.nickname}</span>
          <div className="chat-time">{props.latestMessage.time}</div>
        </div>
        <div className="contacts-texts">
          <p className="text-truncate">{props.latestMessage.message}</p>
          {
            props.unreadMessage !== 0 ? <MyBadge>{props.unreadMessage}</MyBadge> : null
          }
        </div>
      </div>
    </li>
  );
});

export default UserItem;