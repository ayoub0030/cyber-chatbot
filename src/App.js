import React from 'react';
import Chat from './components/Chat';
import styled from 'styled-components';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Chat />
    </AppContainer>
  );
}

export default App;
