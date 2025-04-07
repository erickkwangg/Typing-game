import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Difficulty } from '../App';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  wordsTyped: number;
  score: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  previousBestWpm: number;
  mistakesMade?: number;
  timeLeft?: number;
  timeLimit?: number;
}

const ResultsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  text-align: center;
  
  h2 {
    margin-bottom: 25px;
    color: #2980b9;
    font-size: 2rem;
    position: relative;
    
    &::after {
      content: '';
      display: block;
      width: 100px;
      height: 3px;
      background-color: #3498db;
      margin: 15px auto 0;
      border-radius: 3px;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatBox = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const StatValue = styled.div<{ highlight?: boolean }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.highlight ? '#e74c3c' : '#2980b9'};
`;

const StatUnit = styled.span`
  font-size: 1rem;
  opacity: 0.7;
`;

const ScoreContainer = styled.div`
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 10px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '🏆';
    position: absolute;
    font-size: 100px;
    opacity: 0.1;
    right: -20px;
    top: -20px;
    transform: rotate(15deg);
  }
`;

const ScoreValue = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const PlayButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(46, 204, 113, 0.3);
  }
`;

const NewRecord = styled.div`
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 10px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const Results: React.FC<ResultsProps> = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  wordsTyped,
  score,
  difficulty,
  onPlayAgain,
  previousBestWpm,
  mistakesMade = 0,
  timeLeft = 0,
  timeLimit = 0
}) => {
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  
  useEffect(() => {
    if (previousBestWpm > 0 && wpm > previousBestWpm) {
      setIsNewRecord(true);
    }
  }, [wpm, previousBestWpm]);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate time used percentage
  const timeUsedPercentage = timeLimit > 0 ? Math.round(((timeLimit - timeLeft) / timeLimit) * 100) : 0;
  
  // Determine if time was exceeded
  const isTimeExceeded = timeLeft <= 0;
  
  return (
    <ResultsContainer>
      <h2>Race Complete!</h2>
      
      <StatsContainer>
        <StatBox>
          <StatLabel>Typing Speed</StatLabel>
          <StatValue highlight={isNewRecord}>{wpm}<StatUnit> WPM</StatUnit></StatValue>
          {isNewRecord && <NewRecord>New Record!</NewRecord>}
        </StatBox>
        
        <StatBox>
          <StatLabel>Accuracy</StatLabel>
          <StatValue>{accuracy}<StatUnit>%</StatUnit></StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Words Typed</StatLabel>
          <StatValue>{wordsTyped}</StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Time Used</StatLabel>
          <StatValue highlight={isTimeExceeded}>
            {isTimeExceeded ? 'Time Up!' : `${formatTime(timeLimit - timeLeft)} (${timeUsedPercentage}%)`}
          </StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Correct Characters</StatLabel>
          <StatValue>{correctChars}</StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Incorrect Characters</StatLabel>
          <StatValue>{incorrectChars}</StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Mistakes Made</StatLabel>
          <StatValue highlight={mistakesMade > 10}>{mistakesMade}</StatValue>
        </StatBox>
        
        <StatBox>
          <StatLabel>Previous Best</StatLabel>
          <StatValue>{previousBestWpm > 0 ? previousBestWpm : '-'}<StatUnit> WPM</StatUnit></StatValue>
        </StatBox>
      </StatsContainer>
      
      <ScoreContainer>
        <ScoreValue>{score}</ScoreValue>
        <ScoreLabel>FINAL SCORE</ScoreLabel>
        {timeLeft > 0 && (
          <ScoreBonus>+{Math.round(Math.sqrt(timeLeft) * 10)} time bonus</ScoreBonus>
        )}
      </ScoreContainer>
      
      <PlayButton onClick={onPlayAgain}>
        Race Again!
      </PlayButton>
    </ResultsContainer>
  );
};

const ScoreBonus = styled.div`
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3px 10px;
  margin: 8px auto 0;
  display: inline-block;
`;

export default Results; 