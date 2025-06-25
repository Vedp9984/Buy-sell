import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Chat.css'; // Import the CSS file

const Chat = () => {
  const [userId, setUserId] = useState('user1'); // Example user ID, you can change this as needed
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    // Load chat history for the specific user from local storage
    const storedHistory = JSON.parse(localStorage.getItem(`chatHistory_${userId}`)) || [];
    setChatHistory(storedHistory);
  }, [userId]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/api/chat', { message: input });
      const botMessage = { sender: 'bot', text: response.data.reply };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Update chat history
      const updatedHistory = chatHistory.map(chat => 
        chat.id === selectedChat.id ? { ...chat, messages: finalMessages } : chat
      );
      setChatHistory(updatedHistory);
      localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleNewChat = () => {
    const newChat = { id: Date.now(), messages: [] };
    setChatHistory([...chatHistory, newChat]);
    setSelectedChat(newChat);
    setMessages([]);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  return (
    <div>
      <Navbar />
      <div className="chat-page">
        <div className="chat-history">
          <h2>Chat History</h2>
          <button onClick={handleNewChat}>New Chat</button>
          <ul>
            {chatHistory.map((chat) => (
              <li key={chat.id} onClick={() => handleSelectChat(chat)}>
                Chat {new Date(chat.id).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;