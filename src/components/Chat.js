import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaLock, FaShieldAlt, FaImage, FaTimes, FaQuestionCircle } from 'react-icons/fa';
import { getCyberResponse, analyzeImage } from '../services/geminiService';
import ChatMessage from './ChatMessage';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: #fff;
`;

const ChatHeader = styled.div`
  background: linear-gradient(90deg, #4a00e0 0%, #8e2de2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #eaeaea;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #4a00e0;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(90deg, #4a00e0 0%, #8e2de2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ImageButton = styled.button`
  background: transparent;
  color: #4a00e0;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(74, 0, 224, 0.1);
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  
  .dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background-color: #4a00e0;
    border-radius: 50%;
    animation: bounce 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(1) {
    animation-delay: 0s;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f4f9;
  border-radius: 12px;
  border: 1px dashed #4a00e0;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
`;

const ImageControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const RemoveImageButton = styled.button`
  background: transparent;
  color: #ff5252;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:hover {
    background-color: rgba(255, 82, 82, 0.1);
  }
`;

const AskAboutImageButton = styled.button`
  background: linear-gradient(90deg, #4a00e0 0%, #8e2de2 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImageQuestionInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-right: 10px;
  
  &:focus {
    border-color: #4a00e0;
    outline: none;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imageQuestion, setImageQuestion] = useState('');
  const [showImageQuestion, setShowImageQuestion] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        text: "Hello there! I'm CyberJester, your friendly cybersecurity assistant with a sense of humor. Ask me anything about cybersecurity, hacking, digital privacy, or related tech topics. You can also upload an image for me to analyze from a cybersecurity perspective!",
        isBot: true
      }
    ]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini
      const response = await getCyberResponse(input);
      
      // Add bot message
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev, 
        { 
          text: "Oops! My security protocols hit a firewall. Try again later!", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert('Image size should be less than 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageData(null);
    setImageQuestion('');
    setShowImageQuestion(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAskAboutImage = async () => {
    if (!imageData) return;
    
    // Toggle question input if not showing
    if (!showImageQuestion) {
      setShowImageQuestion(true);
      return;
    }
    
    // If showing and has question or using default, proceed with analysis
    const question = imageQuestion.trim() || "What can you tell me about this image from a cybersecurity perspective?";
    
    // Add user message with image
    const userMessage = { 
      text: question, 
      isBot: false,
      image: imageData
    };
    setMessages(prev => [...prev, userMessage]);
    setImageQuestion('');
    setIsLoading(true);
    
    try {
      // Get image analysis from Gemini
      const response = await analyzeImage(imageData, question);
      
      // Add bot message
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      
      // Clean up after successful analysis
      handleRemoveImage();
    } catch (error) {
      console.error("Error analyzing image:", error);
      setMessages(prev => [
        ...prev, 
        { 
          text: "Oops! I encountered an encryption error while analyzing that image. Please try again with a different image.", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderTitle>
          <FaShieldAlt size={24} />
          <h1>CyberJester</h1>
        </HeaderTitle>
        <FaLock size={18} />
      </ChatHeader>
      
      <ChatBody>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.text} 
            isBot={message.isBot}
            image={message.image}
          />
        ))}
        
        {isLoading && (
          <LoadingIndicator>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </LoadingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </ChatBody>
      
      {imageData && (
        <ImagePreviewContainer>
          <ImagePreview src={imageData} alt="Uploaded" />
          <ImageControls>
            {showImageQuestion ? (
              <>
                <ImageQuestionInput
                  type="text"
                  placeholder="Ask about this image (or leave empty for general analysis)"
                  value={imageQuestion}
                  onChange={(e) => setImageQuestion(e.target.value)}
                />
                <AskAboutImageButton onClick={handleAskAboutImage}>
                  <FaQuestionCircle size={14} />
                  Analyze
                </AskAboutImageButton>
              </>
            ) : (
              <>
                <RemoveImageButton onClick={handleRemoveImage}>
                  <FaTimes size={14} />
                  Remove
                </RemoveImageButton>
                <AskAboutImageButton onClick={handleAskAboutImage}>
                  <FaQuestionCircle size={14} />
                  Ask about this image
                </AskAboutImageButton>
              </>
            )}
          </ImageControls>
        </ImagePreviewContainer>
      )}
      
      <form onSubmit={handleSendMessage}>
        <ChatInputContainer>
          <ImageButton 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            title="Upload an image"
          >
            <FaImage size={20} />
          </ImageButton>
          <ImageUploadInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <ChatInput
            type="text"
            placeholder="Ask me about cybersecurity..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            <FaPaperPlane size={16} />
          </SendButton>
        </ChatInputContainer>
      </form>
    </ChatContainer>
  );
};

export default Chat;
