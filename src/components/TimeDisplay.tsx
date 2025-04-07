import React from 'react';
import styled from 'styled-components';

interface TimeDisplayProps {
  timeLeft: number;
  children?: React.ReactNode;
}

const TimeDisplayContainer = styled.div<{ timeLeft: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => {
    if (props.timeLeft < 10) return 'linear-gradient(135deg, #ff7675, #d63031)';
    if (props.timeLeft < 30) return 'linear-gradient(135deg, #fdcb6e, #e17055)';
    return 'linear-gradient(135deg, #55efc4, #00b894)';
  }};
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 2px dotted rgba(255, 255, 255, 0.5);
  }
`;

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeLeft, children }) => {
  return (
    <TimeDisplayContainer timeLeft={timeLeft}>
      {children}
    </TimeDisplayContainer>
  );
};

export default TimeDisplay; 