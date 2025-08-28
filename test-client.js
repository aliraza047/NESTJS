const io = require('socket.io-client');

const socket = io('http://localhost:2000', {
  query: { userId: '6880b75c2e5734cfe06a3a50' },
});

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);

   // Send a chat message
  socket.emit('sendMessage', {
    senderId: '6880b75c2e5734cfe06a3a50',    
    receiverId: '68a42f053c674fcbd1422742',  
    content: 'Hello, this is a test message!!'
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('userOnline', (userId) => {
  console.log('User online:', userId);
});

socket.on('userOffline', (userId) => {
  console.log('User offline:', userId);
});

socket.on('newMessage', (data) => {
  console.log('New message received:', data);
});


const sendTyping = (chatId, senderId,receiverId) => {
  socket.emit('typing', { chatId, senderId , receiverId });

   setTimeout(() => {
    socket.emit('stopTyping', { chatId, senderId, receiverId });
  }, 2000);

};

sendTyping('68aee23f840a540f3c193b0a', "6880b75c2e5734cfe06a3a50", "68a42f053c674fcbd1422742")
const currentChatId = "68aee23f840a540f3c193b0a"
socket.on('typing', (data) => {
  if (data.chatId === currentChatId) {
    console.log(`${data.senderId} is typing...`);
    // Show typing indicator in UI for this chat
  }
});

socket.on('stopTyping', (data) => {
  if (data.chatId === currentChatId) {
    console.log(`${data.senderId} stopped typing.`);
    // Hide typing indicator in UI for this chat
  }
});
