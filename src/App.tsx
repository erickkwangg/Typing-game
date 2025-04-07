import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import GameSettings from './components/GameSettings';
import TypingGame from './components/TypingGame';

export type Difficulty = 'easy' | 'medium' | 'hard';

const AppContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
`;

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Start a new game
  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  // End current game and return to settings
  const endGame = useCallback(() => {
    setGameStarted(false);
  }, []);

  return (
    <AppContainer>
      <Header />
      
      {!gameStarted ? (
        <GameSettings 
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartGame={startGame}
        />
      ) : (
        <TypingGame 
          text="" // We're passing an empty string since TypingGame selects its own text
          difficulty={difficulty}
          onEndGame={endGame}
        />
      )}
      
      <Footer>
        © {new Date().getFullYear()} Typing Racer | Race to improve your typing speed!
      </Footer>
    </AppContainer>
  );
}

export default App; 