/*
* 按需引入 antd v4 的 icon 并匹配后台返回 icon 配置信息
*
* */

import {
  HomeOutlined,
  ClusterOutlined,
  FileTextOutlined,
  SettingOutlined,
  AuditOutlined
} from '@ant-design/icons';
import React from "react";

interface IconsMap {
  [propName: string]: any
}

let iconsMap: IconsMap = {};
iconsMap['home'] = <HomeOutlined />;
iconsMap['cluster'] = <ClusterOutlined />;
iconsMap['file-text'] = <FileTextOutlined />;
iconsMap['setting'] = <SettingOutlined />;
iconsMap['audit'] = <AuditOutlined />;

export default iconsMap;