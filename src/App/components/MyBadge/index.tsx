import React from 'react';
import './index.less';

function MyBadge(props) {
  return (
    <div className="my-badge">
      {props.children}
    </div>
  );
}

export default MyBadge;
