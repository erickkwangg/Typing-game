import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 25px 0;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  display: inline-block;
  
  &::before, &::after {
    content: '⚡';
    font-size: 2rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &::before {
    left: -40px;
  }
  
  &::after {
    right: -40px;
  }
`;

const GradientText = styled.span`
  background-image: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.4rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #3498db, #2980b9);
    margin: 20px auto 0;
    border-radius: 3px;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>Typing <GradientText>Racer</GradientText></Title>
      <Subtitle>Test your typing speed and race to the finish line!</Subtitle>
    </HeaderContainer>
  );
};

export default Header; 