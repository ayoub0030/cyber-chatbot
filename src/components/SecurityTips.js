import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLightbulb, FaChevronDown, FaChevronUp, FaBookmark, FaStar } from 'react-icons/fa';

const TipsContainer = styled.div`
  background-color: #f0f4f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TipsHeader = styled.div`
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

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? '#4a00e0' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#4a00e0' : '#ddd'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: ${props => props.active ? '#4a00e0' : '#f0f0f0'};
  }
`;

const TipsList = styled.div`
  max-height: 400px;
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

const TipCard = styled.div`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TipHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  background-color: ${props => props.isOpen ? '#f9f5ff' : 'white'};
  border-bottom: ${props => props.isOpen ? '1px solid #e6e6e6' : 'none'};
`;

const TipTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TipIcon = styled.div`
  color: #4a00e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TipContent = styled.div`
  padding: ${props => props.isOpen ? '12px 16px' : '0 16px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`;

const TipDescription = styled.p`
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444;
`;

const TipActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.active ? '#4a00e0' : '#666'};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SeverityBadge = styled.span`
  font-size: 0.7rem;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: 10px;
  background-color: ${props => {
    switch (props.level) {
      case 'critical': return '#ffebee';
      case 'important': return '#fff3e0';
      case 'useful': return '#e8f5e9';
      default: return '#e3f2fd';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'critical': return '#c62828';
      case 'important': return '#ef6c00';
      case 'useful': return '#2e7d32';
      default: return '#1565c0';
    }
  }};
`;

const DifficultyStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
`;

const Star = styled(FaStar)`
  color: ${props => props.filled ? '#4a00e0' : '#e0e0e0'};
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
  
  p {
    margin: 10px 0 0 0;
  }
`;

const tipsList = [
  {
    id: 1,
    title: "Use a password manager",
    description: "Password managers help you create strong, unique passwords for all your accounts and securely store them. This prevents password reuse across multiple sites, a common security vulnerability. Most password managers can also autofill your credentials, making it easier to use complex passwords.",
    category: "passwords",
    severity: "critical",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 2,
    title: "Enable Two-Factor Authentication (2FA)",
    description: "Two-factor authentication adds an extra layer of security by requiring something you know (password) and something you have (like your phone). Even if your password is compromised, attackers still can't access your account without the second factor. Enable 2FA on all services that support it, especially email, banking, and social media accounts.",
    category: "authentication",
    severity: "critical",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 3,
    title: "Keep software updated",
    description: "Software updates often contain security patches for newly discovered vulnerabilities. Keeping your operating system, applications, and devices updated is one of the simplest yet most effective security practices. Enable automatic updates whenever possible, and regularly check for updates on devices that don't support this feature.",
    category: "general",
    severity: "important",
    difficulty: 1,
    bookmarked: false
  },
  {
    id: 4,
    title: "Be cautious with email attachments",
    description: "Email attachments are a common vector for malware. Never open attachments from unknown senders, and be suspicious of unexpected attachments even from known contacts. Pay special attention to executable files (.exe, .bat, .cmd, .scr, etc.) and office documents with macros. When in doubt, contact the sender through a different channel to verify.",
    category: "phishing",
    severity: "important",
    difficulty: 1,
    bookmarked: false
  },
  {
    id: 5,
    title: "Use a VPN on public Wi-Fi",
    description: "Public Wi-Fi networks are inherently insecure and can expose your browsing activity and personal information. Using a VPN (Virtual Private Network) encrypts your internet connection, protecting your data from potential eavesdroppers on the network. Always use a reputable VPN service when connecting to public Wi-Fi at cafes, airports, hotels, etc.",
    category: "network",
    severity: "important",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 6,
    title: "Backup your data regularly",
    description: "Regular backups are your best defense against ransomware and data loss. Follow the 3-2-1 backup rule: keep at least 3 copies of your data, on 2 different types of storage media, with 1 copy stored offsite (like in the cloud). Regularly test your backups to ensure they're working correctly and can be restored when needed.",
    category: "data",
    severity: "critical",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 7,
    title: "Use secure browsing practices",
    description: "Only visit websites with HTTPS (look for the padlock icon), use privacy-focused browsers or extensions that block trackers, and consider using private browsing mode for sensitive activities. Be careful about what information you share online, and regularly clear your browsing history and cookies.",
    category: "browsing",
    severity: "useful",
    difficulty: 1,
    bookmarked: false
  },
  {
    id: 8,
    title: "Secure your home network",
    description: "Change your router's default username and password, use WPA3 encryption if available (or at least WPA2), enable the router's firewall, and regularly update your router's firmware. Also consider setting up a guest network for visitors and IoT devices to keep them separate from your primary network.",
    category: "network",
    severity: "important",
    difficulty: 3,
    bookmarked: false
  },
  {
    id: 9,
    title: "Use encrypted communications",
    description: "Use end-to-end encrypted messaging apps like Signal, WhatsApp, or Telegram for sensitive communications. This ensures that only you and the intended recipient can read the messages, protecting them from interception by third parties, including the service provider itself.",
    category: "communication",
    severity: "useful",
    difficulty: 1,
    bookmarked: false
  },
  {
    id: 10,
    title: "Learn to recognize phishing attempts",
    description: "Phishing attacks attempt to trick you into revealing sensitive information or installing malware. Look for warning signs like unexpected requests for personal information, urgent language, spelling/grammar errors, mismatched or suspicious URLs, and generic greetings. When in doubt, contact the supposed sender through official channels.",
    category: "phishing",
    severity: "critical",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 11,
    title: "Practice good social media hygiene",
    description: "Be mindful of what you share on social media, as this information can be used for social engineering attacks. Regularly review your privacy settings, limit the personal information visible on your profiles, be selective about friend/connection requests, and consider whether your posts could reveal sensitive information (like your location or when you're away from home).",
    category: "privacy",
    severity: "useful",
    difficulty: 2,
    bookmarked: false
  },
  {
    id: 12,
    title: "Use device encryption",
    description: "Enable full-disk encryption on all your devices to protect your data if they're lost or stolen. Most modern operating systems offer built-in encryption tools (BitLocker for Windows, FileVault for macOS, and LUKS for Linux). For mobile devices, ensure screen locks are enabled with strong PINs or biometrics.",
    category: "data",
    severity: "important",
    difficulty: 3,
    bookmarked: false
  }
];

const SecurityTips = () => {
  const [tips, setTips] = useState(tipsList);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openTipId, setOpenTipId] = useState(null);
  
  // Get unique categories from tips
  const categories = ['all', ...new Set(tips.map(tip => tip.category))];
  
  // Filter tips by category
  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);
  
  // Toggle tip open/closed
  const toggleTip = (id) => {
    setOpenTipId(openTipId === id ? null : id);
  };
  
  // Toggle bookmark for a tip
  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setTips(tips.map(tip => 
      tip.id === id ? { ...tip, bookmarked: !tip.bookmarked } : tip
    ));
  };
  
  return (
    <TipsContainer>
      <TipsHeader>
        <Title>
          <FaLightbulb /> Security Tips & Best Practices
        </Title>
      </TipsHeader>
      
      <Categories>
        {categories.map(category => (
          <CategoryButton 
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </CategoryButton>
        ))}
      </Categories>
      
      <TipsList>
        {filteredTips.length > 0 ? (
          filteredTips.map(tip => (
            <TipCard key={tip.id}>
              <TipHeader 
                onClick={() => toggleTip(tip.id)}
                isOpen={openTipId === tip.id}
              >
                <TipTitle>
                  <TipIcon>
                    <FaLightbulb />
                  </TipIcon>
                  {tip.title}
                  <SeverityBadge level={tip.severity}>
                    {tip.severity.toUpperCase()}
                  </SeverityBadge>
                </TipTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DifficultyStars>
                    <Star filled={tip.difficulty >= 1} />
                    <Star filled={tip.difficulty >= 2} />
                    <Star filled={tip.difficulty >= 3} />
                  </DifficultyStars>
                  <TipIcon style={{ marginLeft: '10px' }}>
                    {openTipId === tip.id ? <FaChevronUp /> : <FaChevronDown />}
                  </TipIcon>
                </div>
              </TipHeader>
              
              <TipContent isOpen={openTipId === tip.id}>
                <TipDescription>{tip.description}</TipDescription>
                
                <TipActions>
                  <ActionButton 
                    onClick={(e) => toggleBookmark(tip.id, e)}
                    active={tip.bookmarked}
                  >
                    <FaBookmark />
                    {tip.bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </ActionButton>
                </TipActions>
              </TipContent>
            </TipCard>
          ))
        ) : (
          <EmptyState>
            <FaLightbulb size={32} color="#ccc" />
            <p>No security tips available for this category.</p>
          </EmptyState>
        )}
      </TipsList>
    </TipsContainer>
  );
};

export default SecurityTips;
