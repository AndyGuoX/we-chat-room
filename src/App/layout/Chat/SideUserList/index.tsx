import React, {useEffect} from 'react';
import './index.less';
import {observer} from 'mobx-react-lite';
import UserItem from "@/App/layout/Chat/SideUserList/components/UserItem";

/**
 * 左侧菜单
 *
 */

interface Props {
  allUserList: any[]
}

const SideUserList = observer((props: Props) => {

  useEffect(() => {

  });

  return (
    <ul className="all-user-list hidden-scrollbar">
      {
        props.allUserList.map((item) => {
          return (
            <UserItem
              key={item.userId}
              {...item}
            />);
        })
      }
    </ul>
  );
});

export default SideUserList;