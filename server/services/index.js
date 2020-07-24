const UserGroupRelation = require('../models/userGroupRelation');
const UserUserRelation = require('../models/userUserRelation');
const GroupRecords = require('../models/groupRecords');
const PrivateRecords = require('../models/privateRecords');
const UserInfo = require('../models/userInfo');
const async = require('async');


const sendToAll = ({userId, avatar, nickname, message, time}) => {
  UserInfo.find({}, function (err, docs) {
    docs.shift();
    async.parallel({
      groupRecords: function (callback) {
        GroupRecords.create(
          {'fromId': userId, 'nickname': nickname, 'avatar': avatar, 'message': message, 'time': time},
          function (err) {
            callback(err);
          });
      },
      userGroup: function (callback) {
        for (let i = 0; i < docs.length; i++) {
          let id = docs[i].userId;
          if (id !== userId) {
            UserGroupRelation.create({'userId': id, 'fromId': userId}, function (err) {
            });
          }
        }
        callback();
      }, function(err, docs) {
        if (err) console.log(err);
      }
    });
  });
};

const sendToPrivate = async ({userId, toId, avatar, nickname, message, time}) => {
  await async.parallel({
    privateRecords: function (callback) {
      PrivateRecords.create(
        {'fromId': userId, 'toId': toId, 'nickname': nickname, 'avatar': avatar, 'message': message, 'time': time},
        function (err) {
          callback(err);
        });
    },
    userUser: function (callback) {
      UserUserRelation.create({'userId': toId, 'fromId': userId}, function (err) {
        callback(err);
      });
    }, function(err, docs) {
      if (err) console.log(err);
    }
  });
};

const clearGroupUnreadMessage = async (id) => {
  return new Promise((resolve, reject) => {
    UserGroupRelation.remove({'userId': id}, (err, ducs) => {
      if (err) return reject(err);
      return resolve();
    });
  });

};

const clearPrivateUnreadMessage = async ({userId, fromId}) => {
  return new Promise((resolve, reject) => {
    UserUserRelation.remove({$and: [{'userId': userId}, {'fromId': fromId}]}, (err, ducs) => {
      if (err) return reject(err);
      return resolve();
    });
  });

};

const getNewUser = async () => {
  return new Promise((resolve, reject) => {
    UserInfo.find({}).sort({_id: -1}).limit(1).exec((err, docs) => {
      if (err) return reject(err);
      return resolve(docs);
    });
  });

};

const logout = async ({userId}) => {
  return new Promise((resolve, reject) => {
    UserInfo.update({'userId': userId}, {'isOnline': false}, function (err, docs) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

const login = async ({userId}) => {
  return new Promise((resolve, reject) => {
    UserInfo.update({'userId': userId}, {'isOnline': true}, function (err, docs) {
      if (err) return reject(err);
      return resolve();
    });
  });
};

module.exports = {
  sendToAll,
  sendToPrivate,
  clearGroupUnreadMessage,
  clearPrivateUnreadMessage,
  getNewUser,
  logout,
  login
};