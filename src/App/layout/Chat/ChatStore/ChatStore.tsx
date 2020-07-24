import React from 'react';
import {useLocalStore} from 'mobx-react-lite';

interface chatState {
  /* 当前选中用户 id */
  userId: string,
  /* 当前选中用户昵称 */
  nickname: string,
  /* 当前选中用户头像 */
  avatar: string
  /* 当前聊天内容 */
  currentRecords: any[],
  /* 聊天内容列表ref */
  recordsListRef: any,
}

let state: chatState = {
  userId: '',
  nickname: '',
  avatar: '',
  currentRecords: [],
  recordsListRef: React.createRef(),
};

interface chatStore {
  chat: chatState
}

function createStore() {
  return {
    chat: state,
  };
}

const storeContext = React.createContext<chatStore>({} as any);


export const ChatStoreProvider = ({children}: { children: any }) => {
  const store = useLocalStore(createStore);
  return <storeContext.Provider value={store}> {children}</storeContext.Provider>;
};

export const useChatStore = (): chatStore => {
  const store: chatStore = React.useContext(storeContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};


