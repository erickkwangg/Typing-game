import React from 'react';
import styled from 'styled-components';
import { Difficulty } from '../App';

interface GameSettingsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

const SettingsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  max-width: 600px;
  margin: 0 auto;
`;

const SettingsTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 25px;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #3498db, #2980b9);
    margin: 15px auto 0;
    border-radius: 2px;
  }
`;

const OptionGroup = styled.div`
  margin-bottom: 30px;
`;

const OptionLabel = styled.h3`
  color: #444;
  font-size: 1.2rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚙️';
    margin-right: 10px;
    font-size: 1.4rem;
  }
`;

const OptionButtons = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const OptionButton = styled.button<{ isActive: boolean }>`
  padding: 12px 20px;
  border: 2px solid ${props => props.isActive ? '#3498db' : '#ddd'};
  border-radius: 8px;
  background-color: ${props => props.isActive ? '#3498db' : 'white'};
  color: ${props => props.isActive ? 'white' : '#555'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 100px;
  
  &:hover {
    background-color: ${props => props.isActive ? '#2980b9' : '#f5f5f5'};
    border-color: ${props => props.isActive ? '#2980b9' : '#ccc'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
  }
`;

const StartButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px 25px;
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    background: linear-gradient(to right, #2980b9, #2471a3);
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
  }
`;

const DifficultyDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 15px;
  line-height: 1.5;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid #3498db;
`;

const GameSettings: React.FC<GameSettingsProps> = ({
  difficulty,
  onDifficultyChange,
  onStartGame
}) => {
  return (
    <SettingsContainer>
      <SettingsTitle>Game Settings</SettingsTitle>
      
      <OptionGroup>
        <OptionLabel>Difficulty Level</OptionLabel>
        <OptionButtons>
          <OptionButton 
            isActive={difficulty === 'easy'} 
            onClick={() => onDifficultyChange('easy')}
          >
            Easy
          </OptionButton>
          <OptionButton 
            isActive={difficulty === 'medium'} 
            onClick={() => onDifficultyChange('medium')}
          >
            Medium
          </OptionButton>
          <OptionButton 
            isActive={difficulty === 'hard'} 
            onClick={() => onDifficultyChange('hard')}
          >
            Hard
          </OptionButton>
        </OptionButtons>
        
        <DifficultyDescription>
          {difficulty === 'easy' && (
            "Easy texts contain simple vocabulary and shorter sentences, perfect for beginners or casual typing practice. You'll need to type 100 words to complete the race. Time limit: 3 minutes."
          )}
          {difficulty === 'medium' && (
            "Medium texts include richer vocabulary and slightly more complex sentence structures. Good for intermediate typists looking to improve. You'll need to type 150 words to complete the race. Time limit: 3 minutes."
          )}
          {difficulty === 'hard' && (
            "Hard texts feature advanced vocabulary, technical terms, and more complex sentence structures. Designed to challenge experienced typists. You'll need to type 200 words to complete the race. Time limit: 2 minutes."
          )}
        </DifficultyDescription>
      </OptionGroup>
      
      <StartButton onClick={onStartGame}>
        Start Typing Race!
      </StartButton>
    </SettingsContainer>
  );
};

export default GameSettings; 