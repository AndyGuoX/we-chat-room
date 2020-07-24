import React, {useRef} from "react";
import './index.less';
import {Form, Input} from "antd";
import {
  ArrowRightOutlined
} from '@ant-design/icons';
import {useGlobalStore} from "@/App/store/GlobalStore";
import {useChatStore} from "@/App/layout/Chat/ChatStore/ChatStore";

function ChatSend() {
  const globalStore = useGlobalStore();
  const chatStore = useChatStore();
  const socket = globalStore.socket;
  const [form] = Form.useForm();
  const textareaRef: any = useRef(null);

  const sendMessage = () => {
    const message = form.getFieldsValue().message;
    if (message) {
      let obj = {
        userId: globalStore.user.userInfo.userId,
        toId: '',
        avatar: globalStore.user.userInfo.avatar,
        nickname: globalStore.user.userInfo.nickname,
        message: form.getFieldsValue().message,
      };
      if (chatStore.chat.userId.includes('group')) {
        socket.emit('sendToAll', obj);
      } else {
        obj.toId = chatStore.chat.userId;
        socket.emit('sendToPrivate', obj);
      }
      form.setFieldsValue({'message': ''});
      textareaRef.current.focus();
    }
  };
  return (
    <div className="chat-send-wrapper">
      <Form form={form} className="form-row">
        <Form.Item
          className="input-send"
          name="message"
        >
          <Input
            ref={textareaRef}
            className="send-area hidden-scrollbar"
            placeholder="Write your message..."
            onPressEnter={sendMessage}
            autoComplete='off'
          />
        </Form.Item>
        <Form.Item>
          <button className="btn-send" onClick={sendMessage}>
            <ArrowRightOutlined />
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChatSend