import React from "react";
import './index.less';
import {useChatStore} from "@/App/layout/Chat/ChatStore/ChatStore";
import {Observer} from "mobx-react-lite";

function ChatHeader() {
  const chatStore = useChatStore();
  return (
    <Observer>
      {() =>
        <div className="chat-to-header-wrapper">
          <div className="chat-info">
            <div className="avatar">
              <img src={chatStore.chat.avatar} alt="" />
            </div>
            <div className="chat-name">{chatStore.chat.nickname}</div>
          </div>
        </div>
      }
    </Observer>

  );
}

export default ChatHeader;