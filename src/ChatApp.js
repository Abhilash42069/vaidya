import React, { useState, useEffect } from 'react';
import { FaBars, FaMicrophone, FaPaperPlane, FaImage } from 'react-icons/fa';
import './App.css';

const ChatApp = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setMessages(storedMessages);
  }, []);

  // Save current chat messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'text', content: input, isUserMessage: true }]);
      setInput('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMessages([...messages, { type: 'image', content: imageUrl, isUserMessage: true }]);
    }
  };

  const handleRecordStart = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setMessages([...messages, { type: 'audio', content: audioUrl, isUserMessage: true }]);
        setIsRecording(false);
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000); // Record for 3 seconds
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Clear only the chat input, but keep history intact
  const handleNewChat = () => {
    setInput(''); // Clear input field
    // Only clear the messages shown in the chat window (not stored in localStorage)
    // To achieve this, we need to store the chat message temporarily
    const currentChat = messages.length > 0 ? [messages[messages.length - 1]] : [];
    setMessages(currentChat); // Store only the last message if present
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <div className={`chat-container ${isDarkMode ? 'dark' : ''}`}>
        {/* Top Bar */}
        <div className={`top-bar ${isDarkMode ? 'dark' : ''}`}>
          <button className="hamburger" onClick={toggleHistory}>
            <FaBars />
          </button>
          <div className="right-buttons">
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload" className="image-upload-button">
              <FaImage />
            </label>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleNewChat} className="new-chat-button">
              New Chat
            </button>
          </div>
        </div>

        {/* Collapsible Chat History */}
        <div className={`chat-history ${isHistoryOpen ? 'open' : ''} ${isDarkMode ? 'dark' : ''}`}>
          <h3>Chat History</h3>
          <ul>
            {JSON.parse(localStorage.getItem('chatHistory'))?.map((message, index) => (
              <li key={index}>{message.type === 'text' ? message.content : message.type}</li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className={`chat-window ${isHistoryOpen ? 'shifted' : ''} ${isDarkMode ? 'dark' : ''}`}>
          <div className="messages">
            {messages.map((message, index) => (
              <div className={`message ${message.type} ${message.isUserMessage ? 'user' : ''}`} key={index}>
                {message.type === 'text' && <p>{message.content}</p>}
                {message.type === 'image' && <img src={message.content} alt="Uploaded" />}
                {message.type === 'audio' && <audio controls src={message.content} />}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
            <button onClick={handleRecordStart} disabled={isRecording}>
              <FaMicrophone />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
