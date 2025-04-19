import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaNewspaper, FaExternalLinkAlt, FaSync, FaExclamationTriangle } from 'react-icons/fa';

const NewsFeedContainer = styled.div`
  background-color: #f0f4f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NewsFeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: #333;
`;

const RefreshButton = styled.button`
  background: transparent;
  color: #4a00e0;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(74, 0, 224, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NewsListContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const NewsItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: white;
  border-left: 4px solid ${props => props.severity === 'high' ? '#ff4d4d' : props.severity === 'medium' ? '#ffaa33' : '#4a00e0'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NewsTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SeverityIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => props.severity === 'high' ? '#ffebee' : props.severity === 'medium' ? '#fff8e1' : '#e8f5e9'};
  color: ${props => props.severity === 'high' ? '#d32f2f' : props.severity === 'medium' ? '#f57c00' : '#388e3c'};
`;

const NewsDescription = styled.p`
  margin: 8px 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #888;
`;

const NewsLink = styled.a`
  color: #4a00e0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  
  .spinner {
    border: 3px solid rgba(74, 0, 224, 0.1);
    border-radius: 50%;
    border-top: 3px solid #4a00e0;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 0.9rem;
`;

// Mock news data - in a real app, you would fetch this from a cybersecurity news API
const mockNewsData = [
  {
    id: 1,
    title: "Critical RCE Vulnerability Found in Popular Web Framework",
    description: "Security researchers have discovered a remote code execution vulnerability affecting millions of websites. Patch immediately.",
    date: "2025-04-18",
    source: "CyberSec Monitor",
    url: "https://example.com/news/1",
    severity: "high"
  },
  {
    id: 2,
    title: "New Ransomware Variant Targets Healthcare Sector",
    description: "A sophisticated ransomware campaign is specifically targeting hospitals and healthcare providers with phishing emails disguised as COVID-19 updates.",
    date: "2025-04-17",
    source: "Threat Intelligence Weekly",
    url: "https://example.com/news/2",
    severity: "high"
  },
  {
    id: 3,
    title: "Major Cloud Provider Reports DDoS Attack",
    description: "Services were temporarily disrupted as engineers mitigated one of the largest distributed denial-of-service attacks recorded this year.",
    date: "2025-04-16",
    source: "Cloud Security Today",
    url: "https://example.com/news/3",
    severity: "medium"
  },
  {
    id: 4,
    title: "Government Issues Advisory on Nation-State Threats",
    description: "Intelligence agencies have released a joint advisory warning about increased cyber espionage activities targeting critical infrastructure.",
    date: "2025-04-15",
    source: "National Cyber Authority",
    url: "https://example.com/news/4",
    severity: "medium"
  },
  {
    id: 5,
    title: "New Browser Extension Steals Cryptocurrency Wallet Keys",
    description: "Users are advised to verify the authenticity of browser extensions, as malicious add-ons imitating popular tools have been discovered.",
    date: "2025-04-14",
    source: "Crypto Security Alert",
    url: "https://example.com/news/5",
    severity: "medium"
  },
  {
    id: 6,
    title: "Best Practices for Secure Remote Work Published",
    description: "Industry association releases comprehensive guide for organizations to secure their remote workforce against emerging threats.",
    date: "2025-04-13",
    source: "Enterprise Security",
    url: "https://example.com/news/6",
    severity: "low"
  }
];

const SecurityNewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate fetching news data
  const fetchNews = async () => {
    // Reset state before fetching
    setLoading(true);
    setError(null);
    setRefreshing(true);
    
    try {
      // In a real implementation, you would fetch from an actual API
      // const response = await fetch('https://api.example.com/cybersecurity-news');
      // const data = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data for demonstration
      setNewsItems(mockNewsData);
    } catch (err) {
      setError('Failed to fetch security news. Please try again later.');
      console.error('Error fetching security news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);
  
  // Format date in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <NewsFeedContainer>
      <NewsFeedHeader>
        <Title>
          <FaNewspaper /> Cybersecurity News Feed
        </Title>
        <RefreshButton onClick={fetchNews} disabled={refreshing}>
          <FaSync className={refreshing ? 'rotating' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </NewsFeedHeader>
      
      {error && (
        <ErrorMessage>
          <FaExclamationTriangle />
          {error}
        </ErrorMessage>
      )}
      
      {loading && !refreshing ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : (
        <NewsListContainer>
          {newsItems.map(news => (
            <NewsItem key={news.id} severity={news.severity}>
              <NewsTitle>
                {news.severity === 'high' && <FaExclamationTriangle color="#d32f2f" />}
                {news.title}
              </NewsTitle>
              
              <SeverityIndicator severity={news.severity}>
                {news.severity === 'high' ? 'HIGH RISK' : 
                 news.severity === 'medium' ? 'MEDIUM RISK' : 'INFORMATIONAL'}
              </SeverityIndicator>
              
              <NewsDescription>{news.description}</NewsDescription>
              
              <NewsFooter>
                <span>{formatDate(news.date)} • {news.source}</span>
                <NewsLink href={news.url} target="_blank" rel="noopener noreferrer">
                  Read more <FaExternalLinkAlt size={12} />
                </NewsLink>
              </NewsFooter>
            </NewsItem>
          ))}
        </NewsListContainer>
      )}
    </NewsFeedContainer>
  );
};

export default SecurityNewsFeed;
