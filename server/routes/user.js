/* user接口路由 */

var express = require('express');
var router = express.Router();
const UserInfo = require('../models/userInfo');
const UserGroupRelation = require('../models/userGroupRelation');
const GroupRecords = require('../models/groupRecords');
const PrivateRecords = require('../models/privateRecords');
const UserUserRelation = require('../models/userUserRelation');
const createToken = require('../token/createToken');
const decodeToken = require('../token/decodeToken');
const async = require('async');
const {avatarGetAddr, avatarLocalAddr} = require('../constant/constant');
const md5 = require('md5');
const generateUUID = require('../utils/index').generateUUID;
const fileDisplay = require('../utils/index').fileDisplay;

/* 登录接口 */
router.post('/login', (req, res) => {
  let reqJson = req.body;
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  reqJson.password = md5(reqJson.password);
  UserInfo.findOne(
    {'username': reqJson.username},
    ['password', 'userId'],
    function (err, docs) {
      if (err) console.log(err);
      if (!docs) {
        resJson.code = '-1';
        resJson.message = '用户名不存在！';
        res.json(resJson);
      } else {
        if (docs.password === reqJson.password) {
          let _docs = docs;
          UserInfo.update({'userId': docs.userId}, {'isOnline': true}, function (err, docs) {
            if (err) console.log(err);
            const tokenObj = {
              'userId': _docs.userId
            };
            resJson.token = createToken(tokenObj); // 创建一个新的token;
            resJson.data.userId = _docs.userId;
            res.json(resJson);
          });

        } else {
          resJson.code = '-2';
          resJson.message = '密码错误！';
          res.json(resJson);
        }
      }
    });
});

/* 注册接口 */
router.post('/register', (req, res) => {
  let reqJson = req.body;
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  let saveObj = {
    userId: generateUUID(),
    username: reqJson.username,
    password: md5(reqJson.password),
    nickname: reqJson.nickname,
    avatar: reqJson.avatar,
    isOnline: false,
  };
  UserInfo.findOne({'username': reqJson.username}, function (err, docs) {
    if (err) console.log(err);
    if (!docs) { // 用户名不重复
      UserInfo.create(
        saveObj,
        function (err, docs) {
          if (err) console.log(err);
          res.json(resJson);
        });
    } else {
      resJson.code = '-3';
      resJson.message = '用户名已存在';
      res.json(resJson);
    }
  });
});

/* 获取用户信息 */
router.get('/getUserInfo', (req, res) => {
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  let decoded = decodeToken(req); // 解码token，获得其中的身份信息
  let userId = decoded.userId;
  UserInfo.findOne(
    {'userId': userId},
    ['userId', 'nickname', 'avatar'],
    function (err, docs) {
      if (err) console.log(err);
      if (docs) {
        resJson.data = {
          'userId': docs.userId,
          'avatar': docs.avatar,
          'nickname': docs.nickname,
        };
        res.json(resJson);
      } else {
        res.status(401).json({'error': '401'});
      }
    });
});

/* 返回注册时选择头像列表 */
router.get('/getAvatar', async (req, res) => {
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  const allAvatar = await fileDisplay(avatarLocalAddr);
  for (let i = 0; i < allAvatar.length; i++) {
    allAvatar[i] = avatarGetAddr + '/' + allAvatar[i];
  }
  resJson.data.avatarList = allAvatar;
  res.json(resJson);
});

/* 获取所有用户列表 */
router.get('/getAllUser', async (req, res) => {
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  let decoded = decodeToken(req); // 解码token，获得其中的身份信息
  let userId = decoded.userId;
  async.parallel(
    {
      allUserList: function (callback) {
        UserInfo.find({'userId': {'$ne': userId}},
          ['userId', 'nickname', 'avatar', 'isOnline'],
          function (err, docs) {
            if (err) console.log(err);
            callback(err, docs);
          });
      },
      groupUnreadMessage: function (callback) {
        UserGroupRelation.count(
          {'userId': userId},
          function (err, docs) {
            callback(err, docs);
          }
        );
      },
      groupLatestMessage: function (callback) {
        GroupRecords.find({}).sort({_id: -1}).limit(1).exec((err, docs) => {
          callback(err, docs);
        });
      },
      privateUnreadMessage: function (callback) {
        UserUserRelation.find({'userId': userId},
          function (err, docs) {
            callback(err, docs);
          }
        );
      },
      privateLatestMessage: function (callback) {
        PrivateRecords.find({$or: [{'fromId': userId}, {'toId': userId}]}, (err, docs) => {
          callback(err, docs);
        });
      }
    },
    function (e, r) {
      if (e) console.log(e, r);
      const resData = [];
      const allUserList = r.allUserList;
      for (let i = 0; i < allUserList.length; i++) {
        let obj = {
          userId: allUserList[i].userId,
          nickname: allUserList[i].nickname,
          avatar: allUserList[i].avatar,
          isOnline: allUserList[i].isOnline,
          unreadMessage: 0,
          latestMessage: {
            fromId: '',
            message: '',
            time: '',
          }
        };
        if (allUserList[i].userId.includes('group')) { // 聊天室
          obj.unreadMessage = r.groupUnreadMessage;
          if (r.groupLatestMessage[0]) obj.latestMessage = r.groupLatestMessage[0];
        } else { // 私聊
          let unreadMessage = 0;
          for (let j = 0; j < r.privateUnreadMessage.length; j++) {
            if (userId === r.privateUnreadMessage[j].userId
              && allUserList[i].userId === r.privateUnreadMessage[j].fromId) {
              unreadMessage++;
            }
          }
          for (let z = 0; z < r.privateLatestMessage.length; z++) {
            if (r.privateLatestMessage[z].fromId === allUserList[i].userId
              || r.privateLatestMessage[z].toId === allUserList[i].userId) {
              obj.latestMessage = r.privateLatestMessage[z];
            }
          }
          obj.unreadMessage = unreadMessage;
        }
        resData.push(obj);
      }
      resJson.data.allUserList = resData;
      res.json(resJson);
    }
  );

});

/* 获取群聊天室所有记录 */
router.get('/getRoomRecords', async (req, res) => {
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  GroupRecords.find({}, (err, docs) => {
    if (err) console.log(err);
    resJson.data.allRoomRecords = docs;
    res.json(resJson);
  });
});

/* 获取私人聊天所有记录 */
router.get('/getPrivateRecords', async (req, res) => {
  let reqJson = req.query;
  let resJson = {
    'code': '1',
    'message': '',
    'data': {}
  };
  let decoded = decodeToken(req); // 解码token，获得其中的身份信息
  let userId = decoded.userId;
  const fromId = reqJson.fromId;
  PrivateRecords.find(
    {$or: [{$and: [{'fromId': userId}, {'toId': fromId}]}, {$and: [{'fromId': fromId}, {'toId': userId}]}]},
    (err, docs) => {
      if (err) console.log(err);
      resJson.data.privateRecords = docs;
      res.json(resJson);
    });
});


module.exports = router;

