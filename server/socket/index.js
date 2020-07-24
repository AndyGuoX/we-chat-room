const sendToAll = require('../services/index').sendToAll;
const sendToPrivate = require('../services/index').sendToPrivate;
const getCurrentTime = require('../utils/index').getCurrentTime;
const clearGroupUnreadMessage = require('../services/index').clearGroupUnreadMessage;
const clearPrivateUnreadMessage = require('../services/index').clearPrivateUnreadMessage;
const getNewUser = require('../services/index').getNewUser;
const logout = require('../services/index').logout;
const login = require('../services/index').login;

const socketIo = require('socket.io');

module.exports = server => {
  const io = socketIo.listen(server);

  io.sockets.on('connection', socket => {
    console.log('连接成功');
    /* 监听注册事件 */
    socket.on('register', async () => {
      const newUser = (await getNewUser())[0];
      const obj = {
        userId: newUser.userId,
        nickname: newUser.nickname,
        avatar: newUser.avatar,
        isOnline: newUser.isOnline,
        unreadMessage: 0,
        latestMessage: {}
      };
      socket.broadcast.emit('addNewUser', obj);
    });
    /* 监听登录事件 */
    socket.on('login', async (data) => {
      await login(data);
      socket.join(data.userId);
      socket.broadcast.emit('userLogin', {'userId': data.userId});
    });
    /* 监听发送到群聊天室的消息 */
    socket.on('sendToAll', async (data) => {
      data.time = getCurrentTime();
      await sendToAll(data);
      // io.sockets.emit('allMessage',data);  // 推给所有连接的 client
      socket.emit('allMessage', data); // 只给自己推送
      socket.broadcast.emit('allMessage', data); // 给除自己外的 client 推送
    });
    /* 监听私人消息 */
    socket.on('sendToPrivate', async (data) => {
      data.time = getCurrentTime();
      // io.sockets.emit('privateMessage',data); // 推给房间内所有 client
      socket.emit('privateMessage', data); // 只给自己推送
      socket.to(data.toId).emit('privateMessage', data); // 推给除自己外的一个房间内的所有 client
      await sendToPrivate(data);
    });

    /* 监听清除群聊天室未读消息数 */
    socket.on('clearGroupUnreadMessage', async (data) => {
      await clearGroupUnreadMessage(data.userId);
    });
    /* 监听清除私人未读消息数 */
    socket.on('clearPrivateUnreadMessage', async (data) => {
      await clearPrivateUnreadMessage(data);
    });
    socket.on('disconnection', async (data) => {
      console.log('断开前');
      await logout(data);
      socket.leave(data.userId);
      socket.broadcast.emit('userLogout', {'userId': data.userId});
    });
    /* 断开连接 */
    socket.on('disconnect', () => {
      console.log('断开连接');
    });
  });
};