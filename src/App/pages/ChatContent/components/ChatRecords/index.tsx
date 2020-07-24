import React, {useEffect} from "react";
import './index.less';
import {useChatStore} from "@/App/layout/Chat/ChatStore/ChatStore";
import {useGlobalStore} from "@/App/store/GlobalStore";
import {observer} from "mobx-react-lite";

const ChatRecords = observer(() => {
  const globalStore = useGlobalStore();
  const chatStore = useChatStore();

  useEffect(() => {
    let node = document.querySelector("#R_chat_content");
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  });

  return (
    <div className="chat-records-wrapper">
      {chatStore.chat.currentRecords.map((item) =>
        <div className={`message${item.fromId === globalStore.user.userInfo.userId ? ' self' : ''}`} key={item._id}>
          <div className="message-wrapper">
            <div className="message-content">
              {item.fromId !== globalStore.user.userInfo.userId && chatStore.chat.userId.includes('group') ?
                <h6>{item.nickname}</h6> : null}
              <span>{item.message}</span>
            </div>
          </div>
          <div className="message-options">
            <div className="avatar">
              <img src={item.avatar} alt="" />
            </div>
            <span className="message-date">{item.time}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatRecords;