import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

interface RaceTrackProps {
  position: number; // 0-100 percentage
  previousBestPosition?: number; // Previous best score position
  progress: number; // Current progress through text (0-100)
  targetLength: number; // Total length of text to type
}

const TrackContainer = styled.div`
  width: 100%;
  height: 160px; // Increased height to accommodate two lanes
  background: linear-gradient(to bottom, #87CEEB, #4682B4);
  border-radius: 60px;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
  border: 4px solid #333;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
`;

const cloudFloat = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const Clouds = styled.div`
  position: absolute;
  top: 10px;
  width: 200%;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 120'%3E%3Cpath fill='%23fff' d='M0 0h1000v120H0z'/%3E%3Ccircle fill='%23fff' cx='100' cy='70' r='30'/%3E%3Ccircle fill='%23fff' cx='160' cy='70' r='40'/%3E%3Ccircle fill='%23fff' cx='220' cy='70' r='25'/%3E%3Ccircle fill='%23fff' cx='350' cy='70' r='35'/%3E%3Ccircle fill='%23fff' cx='420' cy='70' r='30'/%3E%3Ccircle fill='%23fff' cx='500' cy='70' r='40'/%3E%3Ccircle fill='%23fff' cx='580' cy='70' r='25'/%3E%3Ccircle fill='%23fff' cx='650' cy='70' r='35'/%3E%3Ccircle fill='%23fff' cx='720' cy='70' r='30'/%3E%3Ccircle fill='%23fff' cx='800' cy='70' r='40'/%3E%3Ccircle fill='%23fff' cx='880' cy='70' r='25'/%3E%3Ccircle fill='%23fff' cx='950' cy='70' r='35'/%3E%3C/svg%3E") repeat-x;
  opacity: 0.7;
  z-index: 1;
  animation: ${cloudFloat} 60s linear infinite;
`;

const TrackRoad = styled.div`
  width: 100%;
  height: 100px; // Increased height for two lanes
  background: linear-gradient(to bottom, #555, #333);
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  
  &::before {
    content: '';
    position: absolute;
    height: 6px;
    width: 100%;
    background: repeating-linear-gradient(
      to right,
      #fff,
      #fff 30px,
      transparent 30px,
      transparent 60px
    );
    top: 25%; // Top lane center
    transform: translateY(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    height: 6px;
    width: 100%;
    background: repeating-linear-gradient(
      to right,
      #fff,
      #fff 30px,
      transparent 30px,
      transparent 60px
    );
    top: 75%; // Bottom lane center
    transform: translateY(-50%);
  }
`;

const LaneDivider = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: repeating-linear-gradient(
    to right,
    #ffeb3b,
    #ffeb3b 20px,
    transparent 20px,
    transparent 40px
  );
  top: 60%;
  transform: translateY(-50%);
  z-index: 2;
  opacity: 0.8;
`;

const finishLinePulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
`;

const FinishLine = styled.div`
  position: absolute;
  right: 20px;
  height: 120px; // Increased height for two lanes
  width: 14px;
  background: repeating-linear-gradient(
    to bottom,
    black,
    black 10px,
    white 10px,
    white 20px
  );
  top: 60%;
  transform: translateY(-50%);
  z-index: 3;
  animation: ${finishLinePulse} 2s infinite;
  
  &::after {
    content: '🏁';
    position: absolute;
    font-size: 20px;
    right: -25px;
    top: -25px;
  }
`;

const StartLine = styled.div`
  position: absolute;
  left: 20px;
  height: 120px; // Increased height for two lanes
  width: 14px;
  background: repeating-linear-gradient(
    to bottom,
    white,
    white 10px,
    green 10px,
    green 20px
  );
  top: 60%;
  transform: translateY(-50%);
  z-index: 3;
  
  &::after {
    content: '🏁';
    position: absolute;
    font-size: 20px;
    left: -25px;
    top: -25px;
    transform: scaleX(-1);
  }
`;

const carBounce = keyframes`
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(-53%);
  }
`;

const wheelSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Car = styled.div<{ position: number; isTopLane?: boolean; isShadow?: boolean }>`
  width: 80px;
  height: 40px;
  position: absolute;
  top: ${props => props.isTopLane ? '45%' : '75%'};
  transform: translateY(-50%);
  left: ${props => Math.max(5, Math.min(90, props.position))}%;
  transition: left 0.3s ease-out;
  z-index: 4;
  animation: ${carBounce} 0.6s ease-in-out infinite;
  opacity: ${props => props.isShadow ? 0.6 : 1};
  filter: ${props => props.isShadow ? 'grayscale(70%)' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => props.isShadow 
      ? 'linear-gradient(to bottom, #777, #555)'
      : 'linear-gradient(to bottom, #e74c3c, #c0392b)'};
    border-radius: 12px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
  }
  
  /* Car windows */
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 22px;
    background: ${props => props.isShadow 
      ? 'linear-gradient(135deg, #999, #777)'
      : 'linear-gradient(135deg, #3498db, #2980b9)'};
    border-radius: 6px;
    top: 4px;
    left: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Wheel = styled.div<{ left: number; isRear?: boolean }>`
  width: 16px;
  height: 16px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  bottom: -7px;
  left: ${props => props.left}px;
  border: 3px solid #222;
  animation: ${wheelSpin} 0.5s linear infinite;
  transform-origin: center center;
  
  /* Wheel cap */
  &::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    background-color: #aaa;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const headlightFlash = keyframes`
  0%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 10px 3px rgba(255, 235, 59, 0.7);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px 5px rgba(255, 235, 59, 0.9);
  }
`;

const Headlight = styled.div<{ left: number }>`
  width: 8px;
  height: 8px;
  background-color: #ffeb3b;
  border-radius: 50%;
  position: absolute;
  bottom: 14px;
  left: ${props => props.left}px;
  box-shadow: 0 0 10px 3px rgba(255, 235, 59, 0.7);
  z-index: 5;
  animation: ${headlightFlash} 1s infinite;
`;

const Exhaust = styled.div`
  position: absolute;
  width: 6px;
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  bottom: 8px;
  left: 5px;
  z-index: 3;

  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 8px;
    background: linear-gradient(to left, rgba(100, 100, 100, 0.8), transparent);
    left: -12px;
    top: -2px;
    border-radius: 4px;
  }
`;

const MileMarker = styled.div<{ position: number }>`
  position: absolute;
  top: 25%;
  bottom: 25%;
  width: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  left: ${props => props.position}%;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: -4px;
    width: 12px;
    height: 12px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  
  &::before {
    content: '${props => props.position}%';
    position: absolute;
    top: -20px;
    left: -10px;
    color: white;
    font-weight: bold;
    font-size: 12px;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  }
`;

const YouLabel = styled.div`
  position: absolute;
  top: 30%;
  left: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  background-color: rgba(231, 76, 60, 0.7);
  padding: 3px 8px;
  border-radius: 10px;
  z-index: 10;
`;

const PreviousBestLabel = styled.div`
  position: absolute;
  top: 80%;
  left: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  border-radius: 10px;
  z-index: 10;
`;

const RaceTrack: React.FC<RaceTrackProps> = ({ position, previousBestPosition = 0, progress, targetLength }) => {
  // Use ref to track previous position to prevent backward movement
  const prevPositionRef = useRef<number>(0);
  const displayPositionRef = useRef<number>(0);
  
  // Reset the references when the component is first mounted or position is zero
  useEffect(() => {
    if (position === 0) {
      // If position is 0, reset both the refs and display position to ensure fresh start
      prevPositionRef.current = 0;
      displayPositionRef.current = 0;
    }
  }, [position]);
  
  // Use a smaller value to make car movement more gradual, but responsive enough to avoid stalling
  const speedFactor = 0.2; // Increased from 0.15 to make it more responsive
  
  useEffect(() => {
    // Track animation frame to allow cancellation
    let animationFrameId: number;
    
    // Don't start animation if position is 0, ensure cars are at starting position
    if (position === 0) {
      displayPositionRef.current = 0;
      prevPositionRef.current = 0;
      return;
    }
    
    // Animation function for smooth car movement
    const animatePosition = () => {
      // Calculate the new position with easing
      const targetPosition = Math.max(5, Math.min(90, position));
      const currentPosition = displayPositionRef.current;
      const distance = targetPosition - currentPosition;
      
      // Update even with minimal distance to ensure car always moves
      // Removed the 0.1 threshold that could cause stalling
      if (distance > 0) {
        // Move a percentage of the remaining distance for smooth easing
        // Add a minimum increment of 0.05 to ensure movement even with tiny distances
        const movement = Math.max(distance * speedFactor, 0.05);
        
        // Clamp the new position to ensure it's never more than the target
        const newPosition = Math.min(currentPosition + movement, targetPosition);
        displayPositionRef.current = newPosition;
        prevPositionRef.current = newPosition;
        
        // Continue animation
        animationFrameId = requestAnimationFrame(animatePosition);
      } else if (distance < 0) {
        // We still don't want to move backward
        // Just snap to current position if target is behind
        displayPositionRef.current = currentPosition;
        prevPositionRef.current = currentPosition;
      }
    };
    
    // Start animation if we're not at the target position and position is not 0
    if (Math.abs(position - displayPositionRef.current) > 0.01 && position > 0) {
      animationFrameId = requestAnimationFrame(animatePosition);
    }
    
    // Cleanup animation on unmount or when position changes
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position, speedFactor]);
  
  // For the actual initial render, ensure cars always start from the beginning of the track
  const carPosition = position === 0 ? 5 : displayPositionRef.current < 5 ? 5 : displayPositionRef.current;
  
  // Previous best position - also ensure shadow car starts at beginning
  const shadowPosition = previousBestPosition === 0 ? 5 : previousBestPosition < 5 ? 5 : previousBestPosition;
  
  // Calculate position for mile markers
  const mileMarkers = [25, 50, 75];
  
  return (
    <TrackContainer>
      <Clouds />
      <TrackRoad />
      <LaneDivider />
      <StartLine />
      {mileMarkers.map((markerPos, index) => (
        <MileMarker key={index} position={markerPos} />
      ))}
      <FinishLine />
      
      <YouLabel>You</YouLabel>
      <Car position={carPosition} isTopLane={true}>
        <Wheel left={18} />
        <Wheel left={55} isRear={true} />
        <Headlight left={78} />
        <Headlight left={78} />
        <Exhaust />
      </Car>
      
      <PreviousBestLabel>Best</PreviousBestLabel>
      <Car position={shadowPosition} isTopLane={false} isShadow={true}>
        <Wheel left={18} />
        <Wheel left={55} isRear={true} />
      </Car>
    </TrackContainer>
  );
};

export default RaceTrack; 