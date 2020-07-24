import React from 'react';
import './index.less';
import {useHistory} from 'react-router';
import {useGlobalStore} from "@/App/store/GlobalStore";
import {Observer} from 'mobx-react-lite';
import {message} from "antd";

/**
 * 公共头部
 *
 */

function WeChatHeader() {
  const globalStore = useGlobalStore();
  const router = useHistory();

  return (
    <Observer>
      {() =>
        <div className="chat-header-wrapper">
          <div className="user-info-show">
            <div className="user-info">
              <img className='user-avatar' src={globalStore.user.userInfo.avatar} alt="" />
              <span className="nickname">{globalStore.user.userInfo.nickname}</span>
            </div>
            <div className="user-operator">
              <ul className="operator-list">
                <li className="operator-item" onClick={async () => {
                  globalStore.logout();
                  router.push("/");
                  message.success('退出成功');
                }
                }>退出登录
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    </Observer>

  );
}

export default WeChatHeader;