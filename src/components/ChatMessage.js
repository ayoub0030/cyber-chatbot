import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaUser } from 'react-icons/fa';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${props => props.isbot === "true" ? '#4a00e0' : '#2e7d32'};
  color: white;
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: ${props => props.isbot === "true" ? '#f0f4f9' : '#e3f2fd'};
  color: #333;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 14px;
    ${props => props.isbot === "true" ? 'left: -6px' : 'right: -6px'};
    width: 12px;
    height: 12px;
    background-color: ${props => props.isbot === "true" ? '#f0f4f9' : '#e3f2fd'};
    transform: rotate(45deg);
  }
`;

const MessageText = styled.p`
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.5;
`;

const MessageImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: block;
`;

const ChatMessage = ({ message, isBot, image }) => {
  // Convert boolean to string for DOM attributes
  const isBotString = String(isBot);
  
  return (
    <MessageContainer style={{ justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
      {isBot && (
        <Avatar isbot={isBotString}>
          <FaRobot />
        </Avatar>
      )}
      <MessageBubble isbot={isBotString}>
        {image && <MessageImage src={image} alt="User uploaded" />}
        <MessageText>{message}</MessageText>
      </MessageBubble>
      {!isBot && (
        <Avatar isbot={isBotString}>
          <FaUser />
        </Avatar>
      )}
    </MessageContainer>
  );
};

export default ChatMessage;
