import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const AnalyzerContainer = styled.div`
  background-color: #f0f4f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: #333;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #4a00e0;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StrengthMeter = styled.div`
  height: 8px;
  width: 100%;
  background-color: #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const StrengthIndicator = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => {
    if (props.score < 40) return '#ff4d4d';
    if (props.score < 70) return '#ffaa33';
    return '#44cc44';
  }};
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const ResultsContainer = styled.div`
  margin-top: 12px;
`;

const ScoreText = styled.p`
  font-weight: bold;
  margin-bottom: 8px;
  color: ${props => {
    if (props.score < 40) return '#d32f2f';
    if (props.score < 70) return '#f57c00';
    return '#388e3c';
  }};
`;

const CheckItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.9rem;
`;

const Icon = styled.span`
  display: inline-flex;
  margin-right: 8px;
  color: ${props => props.passed ? '#44cc44' : '#ff4d4d'};
`;

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    
    let score = 0;
    
    // Length check
    if (pass.length >= 8) score += 20;
    else if (pass.length >= 6) score += 10;
    
    // Character variety checks
    if (/[A-Z]/.test(pass)) score += 20; // Uppercase
    if (/[a-z]/.test(pass)) score += 15; // Lowercase
    if (/[0-9]/.test(pass)) score += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(pass)) score += 20; // Special characters
    
    // Patterns and common passwords
    if (/(.)\1\1/.test(pass)) score -= 10; // Repeated characters
    if (/^(password|123456|qwerty|admin).*/i.test(pass)) score -= 20; // Common passwords
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };
  
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  const strength = calculateStrength(password);
  
  const getStrengthText = (score) => {
    if (score < 40) return 'Weak';
    if (score < 70) return 'Moderate';
    if (score < 90) return 'Strong';
    return 'Very Strong';
  };
  
  return (
    <AnalyzerContainer>
      <Title>
        <FaLock /> Password Strength Analyzer
      </Title>
      
      <InputContainer>
        <PasswordInput
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter a password to check"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ToggleButton
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </ToggleButton>
      </InputContainer>
      
      <StrengthMeter>
        <StrengthIndicator percentage={strength} score={strength} />
      </StrengthMeter>
      
      {password && (
        <ResultsContainer>
          <ScoreText score={strength}>
            Password Strength: {getStrengthText(strength)} ({strength}%)
          </ScoreText>
          
          <CheckItem>
            <Icon passed={hasMinLength}>
              {hasMinLength ? <FaCheck /> : <FaTimes />}
            </Icon>
            At least 8 characters
          </CheckItem>
          
          <CheckItem>
            <Icon passed={hasUppercase}>
              {hasUppercase ? <FaCheck /> : <FaTimes />}
            </Icon>
            Contains uppercase letters
          </CheckItem>
          
          <CheckItem>
            <Icon passed={hasLowercase}>
              {hasLowercase ? <FaCheck /> : <FaTimes />}
            </Icon>
            Contains lowercase letters
          </CheckItem>
          
          <CheckItem>
            <Icon passed={hasNumbers}>
              {hasNumbers ? <FaCheck /> : <FaTimes />}
            </Icon>
            Contains numbers
          </CheckItem>
          
          <CheckItem>
            <Icon passed={hasSpecialChars}>
              {hasSpecialChars ? <FaCheck /> : <FaTimes />}
            </Icon>
            Contains special characters
          </CheckItem>
        </ResultsContainer>
      )}
    </AnalyzerContainer>
  );
};

export default PasswordAnalyzer;
