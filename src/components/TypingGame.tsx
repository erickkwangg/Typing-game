import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import RaceTrack from './RaceTrack';
import Results from './Results';
import { Difficulty } from '../App';
import { easyTexts } from '../data/easyTexts';
import { mediumTexts } from '../data/mediumTexts';
import { hardTexts } from '../data/hardTexts';

interface TypingGameProps {
  text: string;
  difficulty: Difficulty;
  onEndGame: () => void;
}

const GameContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const TextContainer = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 25px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  height: 150px;
  overflow-y: auto;
  border: 2px solid #eee;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const HighlightedText = styled.span<{ isCorrect: boolean; isCurrent: boolean }>`
  background-color: ${props => props.isCurrent ? 'rgba(255, 255, 153, 0.7)' : 'transparent'};
  color: ${props => {
    if (props.isCurrent) return '#333';
    return props.isCorrect ? '#27ae60' : '#e74c3c';
  }};
  text-decoration: ${props => (!props.isCorrect && !props.isCurrent) ? 'line-through' : 'none'};
  transition: all 0.15s ease;
  padding: 0 1px;
  border-radius: 2px;
  position: relative;
  
  ${props => props.isCurrent && `
    box-shadow: 0 0 0 2px rgba(255, 255, 153, 0.5);
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 2px rgba(255, 255, 153, 0.5);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(255, 255, 153, 0.3);
      }
    }
  `}
`;

const UnusedText = styled.span`
  color: #999;
`;

const InputArea = styled.textarea`
  width: 100%;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: none;
  height: 120px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
  }
`;

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(to right, rgba(52, 152, 219, 0.05), rgba(52, 152, 219, 0.1));
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  border: 1px solid #f44336;
  color: #d32f2f;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚠️';
    margin-right: 10px;
    font-size: 1.3rem;
  }
`;

// Define target word counts for each difficulty level
const TARGET_WORD_COUNTS = {
  easy: 100,
  medium: 150,
  hard: 200
};

// Define time limits for each difficulty level (in seconds)
const TIME_LIMITS = {
  easy: 180,  // 3 minutes
  medium: 180, // 3 minutes
  hard: 120    // 2 minutes
};

// Select all text in the current difficulty level
const getAllTextsForDifficulty = (difficulty: Difficulty): string[] => {
  switch (difficulty) {
    case 'easy':
      return easyTexts.map(item => item.text);
    case 'medium':
      return mediumTexts.map(item => item.text);
    case 'hard':
      return hardTexts.map(item => item.text);
    default:
      return easyTexts.map(item => item.text);
  }
};

// Count words in a text
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

// Add persistent tracking of used texts across game sessions
const getUsedTextsFromStorage = (): Set<string> => {
  try {
    const storedUsedTexts = localStorage.getItem('typingRacer_usedTexts');
    if (storedUsedTexts) {
      return new Set(JSON.parse(storedUsedTexts));
    }
  } catch (error) {
    console.error("Error loading used texts from storage:", error);
  }
  return new Set<string>();
};

const saveUsedTextsToStorage = (texts: Set<string>) => {
  try {
    localStorage.setItem('typingRacer_usedTexts', JSON.stringify(Array.from(texts)));
  } catch (error) {
    console.error("Error saving used texts to storage:", error);
  }
};

const TypingGame: React.FC<TypingGameProps> = ({
  text: textProp,
  difficulty,
  onEndGame
}) => {
  // Complete text pool for current difficulty
  const [textPool, setTextPool] = useState<string[]>([]);
  // Current text being typed
  const [currentText, setCurrentText] = useState<string>('');
  // Full text the user needs to type (may include multiple text segments)
  const [fullText, setFullText] = useState<string>('');
  // Total words typed across all texts
  const [totalWordsTyped, setTotalWordsTyped] = useState<number>(0);
  // Target word count for current difficulty
  const [targetWordCount, setTargetWordCount] = useState<number>(TARGET_WORD_COUNTS[difficulty]);
  // Time limit for current difficulty
  const [timeLimit, setTimeLimit] = useState<number>(TIME_LIMITS[difficulty]);
  // Time remaining in seconds
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMITS[difficulty]);
  // Used texts to avoid repeating the same text
  const [usedTexts, setUsedTexts] = useState<Set<string>>(new Set());
  // Store the most recently used text
  const [lastUsedText, setLastUsedText] = useState<string>('');
  
  const [inputText, setInputText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [typingStarted, setTypingStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [mistakesMade, setMistakesMade] = useState<number>(0);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const [charsTyped, setCharsTyped] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [carPosition, setCarPosition] = useState<number>(0);
  const [previousBestWpm, setPreviousBestWpm] = useState<number>(0);
  const [previousBestPosition, setPreviousBestPosition] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const lastCorrectIndexRef = useRef<number>(0);
  const currentPosRef = useRef<number>(0);
  
  // Initialize text pool, target word count, and time limit
  useEffect(() => {
    try {
      // Get all texts for the current difficulty
      const allTexts = getAllTextsForDifficulty(difficulty);
      
      // Make sure we have enough texts - duplicate and slightly modify if necessary
      let extendedTextPool = [...allTexts];
      
      // If we don't have at least 10 unique texts, create variations
      if (allTexts.length < 10) {
        // Add variations of existing texts by adding/removing some filler words
        const fillerPhrases = [
          "In other words, ", 
          "To put it simply, ", 
          "It's worth noting that ", 
          "Interestingly, ", 
          "Importantly, "
        ];
        
        allTexts.forEach(text => {
          const randomFiller = fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];
          extendedTextPool.push(randomFiller + text);
        });
      }
      
      // Shuffle the text pool to ensure random order
      const shuffledTextPool = [...extendedTextPool];
      for (let i = shuffledTextPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTextPool[i], shuffledTextPool[j]] = [shuffledTextPool[j], shuffledTextPool[i]];
      }
      
      // Get previously used texts from localStorage to avoid repeats across sessions
      const persistentUsedTexts = getUsedTextsFromStorage();
      
      // Filter out already used texts from previous sessions
      const filteredTextPool = shuffledTextPool.filter(poolText => {
        // Skip if already used in a previous session
        return !persistentUsedTexts.has(poolText);
      });
      
      // If we have no texts available after filtering, clear the persistent storage
      // This ensures users don't run out of texts after playing many games
      if (filteredTextPool.length === 0) {
        console.log("All texts have been used in previous sessions, resetting history");
        localStorage.removeItem('typingRacer_usedTexts');
        persistentUsedTexts.clear();
      }
      
      // Determine which pool to use
      const availablePool = filteredTextPool.length > 0 ? filteredTextPool : shuffledTextPool;
      
      // Select a completely random initial text from the available pool
      // IMPORTANT: We are deliberately NOT using the text prop at all to avoid repetition
      let initialText = '';
      if (availablePool.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePool.length);
        initialText = availablePool[randomIndex];
      } else {
        // This should never happen, but as a last resort create a generic text
        initialText = "The quick brown fox jumps over the lazy dog. This is a simple sentence for typing practice.";
      }
      
      // Update the persistent storage with our new text
      persistentUsedTexts.add(initialText);
      saveUsedTextsToStorage(persistentUsedTexts);
      
      // Save the text pool without the one we're using, for future selections
      const finalTextPool = shuffledTextPool.filter(t => {
        // Exact match check
        if (t === initialText) return false;
        
        // Check if the text contains the initial text or vice versa
        if (t.includes(initialText) || initialText.includes(t)) return false;
        
        return true;
      });
      
      setTextPool(finalTextPool);
      setLastUsedText(initialText);
      
      // Target word count and time settings
      setTargetWordCount(TARGET_WORD_COUNTS[difficulty]);
      setTimeLimit(TIME_LIMITS[difficulty]);
      setTimeLeft(TIME_LIMITS[difficulty]);
      
      // Initialize the used texts set
      const initialUsedTexts = new Set<string>();
      initialUsedTexts.add(initialText);
      setUsedTexts(initialUsedTexts);
      
      // Set the current text to our selected initial text
      setCurrentText(initialText);
      setFullText(initialText);
      
      console.log(`Initialized with text pool of ${finalTextPool.length} texts`);
      console.log(`Selected a fresh initial text: "${initialText.substring(0, 30)}..."`);
      console.log(`Tracked ${initialUsedTexts.size} texts as used initially`);
    } catch (error) {
      console.error("Error initializing text pool:", error);
      setError("Error loading text content. Please try again.");
    }
  }, [difficulty]);
  
  // This useEffect ensures car position is reset when component is mounted
  useEffect(() => {
    // Reset car position and previous best position on component mount
    setCarPosition(0);
    setPreviousBestPosition(0);
    
    // Clean up any existing game state
    setInputText('');
    setTypingStarted(false);
    setStartTime(null);
    setWpm(0);
    setGameOver(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWordsTyped(0);
    setCharsTyped(0);
    setAccuracy(100);
    setMistakesMade(0);
    setTotalWordsTyped(0);
    setTimeLeft(TIME_LIMITS[difficulty]);
    lastCorrectIndexRef.current = 0;
    currentPosRef.current = 0;
  }, [difficulty]);

  // Timer countdown
  useEffect(() => {
    if (typingStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [typingStarted, timeLeft, gameOver]);

  // Auto-scroll text as user types
  useEffect(() => {
    if (textContainerRef.current && typingStarted) {
      const container = textContainerRef.current;
      const currentPos = inputText.length;
      
      // Only scroll if the position has changed
      if (currentPos !== currentPosRef.current) {
        currentPosRef.current = currentPos;
        
        // Find the current character element
        const currentCharElement = container.querySelector(`[data-index="${currentPos}"]`);
        
        if (currentCharElement) {
          // Calculate where to scroll to keep current character in view with some context
          const containerHeight = container.clientHeight;
          const scrollPos = currentCharElement.getBoundingClientRect().top - 
                           container.getBoundingClientRect().top - 
                           (containerHeight / 2);
          
          // Smooth scroll to new position
          container.scrollTo({
            top: container.scrollTop + scrollPos,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [inputText, typingStarted]);

  // Calculate typing speed
  const calculateSpeed = useCallback(() => {
    try {
      if (!startTime) return 0;
      
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const totalWords = totalWordsTyped + inputText.trim().split(/\s+/).length;
      
      return timeElapsed > 0 ? Math.round(totalWords / timeElapsed) : 0;
    } catch (error) {
      console.error("Error calculating typing speed:", error);
      setError("Error calculating typing speed. Please try again.");
      return 0;
    }
  }, [startTime, inputText, totalWordsTyped]);

  // Calculate car position based on progress through the text
  const calculateCarPosition = useCallback(() => {
    try {
      // If no input yet, ensure car is at start position
      if (!typingStarted) {
        return 0;
      }
      
      // Calculate words typed so far (completed texts + current progress)
      const currentWordsTyped = totalWordsTyped + (inputText.trim().split(/\s+/).length || 0);
      
      // Calculate progress percentage based on total target words
      const progressPercentage = (currentWordsTyped / targetWordCount) * 100;
      
      // Ensure the position is between 0 and 100
      return Math.min(Math.max(0, progressPercentage), 100);
    } catch (error) {
      console.error("Error calculating car position:", error);
      return 0; // Default position
    }
  }, [typingStarted, inputText, totalWordsTyped, targetWordCount]);

  // Load previous best scores from localStorage based on difficulty
  useEffect(() => {
    try {
      const storageKey = `typingRacer_bestWpm_${difficulty}`;
      const savedBestWpm = localStorage.getItem(storageKey);
      
      if (savedBestWpm) {
        const bestWpm = parseInt(savedBestWpm, 10);
        setPreviousBestWpm(bestWpm);
      }
    } catch (error) {
      console.error("Error loading previous best score:", error);
      // Continue without previous best data
    }
  }, [difficulty]);

  // Save best score to localStorage when game ends
  useEffect(() => {
    if (gameOver && wpm > 0) {
      try {
        const storageKey = `typingRacer_bestWpm_${difficulty}`;
        const savedBestWpm = localStorage.getItem(storageKey);
        
        if (!savedBestWpm || wpm > parseInt(savedBestWpm, 10)) {
          localStorage.setItem(storageKey, wpm.toString());
        }
      } catch (error) {
        console.error("Error saving best score:", error);
      }
    }
  }, [gameOver, wpm, difficulty]);

  // Update stats on text input
  useEffect(() => {
    try {
      if (!typingStarted && inputText.length > 0) {
        setTypingStarted(true);
        setStartTime(Date.now());
      }

      if (typingStarted && !gameOver) {
        // Calculate correct and incorrect characters
        let correct = 0;
        let incorrect = 0;
        
        for (let i = 0; i < inputText.length; i++) {
          if (i < fullText.length) {
            if (inputText[i] === fullText[i]) {
              correct++;
            } else {
              incorrect++;
            }
          }
        }
        
        // Only count a mistake if the current character is wrong
        // Compare the current character with the previous state
        if (inputText.length > 0 && 
            inputText.length <= fullText.length && 
            inputText.length > lastCorrectIndexRef.current) {
          const currentPos = inputText.length - 1;
          if (inputText[currentPos] !== fullText[currentPos]) {
            setMistakesMade(prev => prev + 1);
          }
          lastCorrectIndexRef.current = inputText.length;
        }
        
        setCorrectChars(correct);
        setIncorrectChars(incorrect);
        setCharsTyped(inputText.length);
        setWordsTyped(inputText.trim().split(/\s+/).length);
        
        // Calculate accuracy
        const totalChars = correct + incorrect;
        setAccuracy(totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100);
        
        // Calculate WPM
        const currentWpm = calculateSpeed();
        setWpm(currentWpm);
        
        // Update car position based on progress through text
        setCarPosition(calculateCarPosition());
        
        // Check if user has completed the current text
        if (inputText.length >= fullText.length) {
          // Add the words from this text to the total
          const currentTextWordCount = fullText.trim().split(/\s+/).length;
          const newTotalWords = totalWordsTyped + currentTextWordCount;
          setTotalWordsTyped(newTotalWords);
          
          // CRITICAL FIX: Save the current completed text before adding more
          const completedText = fullText;
          
          // Check if we've reached the target word count
          if (newTotalWords >= targetWordCount) {
            setGameOver(true);
          } else {
            // Try to add more text
            // CRITICAL FIX: We need to get a completely new text, not append to existing one
            const newTextResult = getNewText(completedText);
            
            if (newTextResult) {
              // Reset input to start typing the new text
              setInputText('');
              // Set the new text as the current full text
              setFullText(newTextResult);
              setCurrentText(newTextResult);
              lastCorrectIndexRef.current = 0;
            } else {
              setGameOver(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating typing statistics:", error);
      setError("Error updating statistics. Game will continue, but results might be affected.");
    }
  }, [inputText, fullText, typingStarted, gameOver, calculateSpeed, calculateCarPosition, totalWordsTyped, targetWordCount]);

  // Auto-focus input field
  useEffect(() => {
    try {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error focusing input field:", error);
    }
  }, []);

  // Calculate final score
  const calculateScore = () => {
    try {
      // New scoring formula with focus on WPM and accuracy
      // Target: ~5000 for decent typing (60 WPM, 95% accuracy)
      // Target: ~8000 for excellent typing (100 WPM, 100% accuracy)
      
      // Base score heavily influenced by WPM
      const wpmFactor = wpm * 60;
      
      // Accuracy modifier: scales from 0.5 at 80% to 1.2 at 100%
      // Heavily penalizes low accuracy, rewards perfect accuracy
      const accuracyModifier = Math.max(0.5, (accuracy / 100) * 1.5 - 0.3);
      
      // Mistakes penalty
      const mistakesPenalty = Math.max(0, 1 - (mistakesMade / 100) * 0.5);
      
      // Words typed provides a small bonus
      const wordsBonus = Math.sqrt(totalWordsTyped) * 20;
      
      // Time bonus - more points for completing before time limit
      const timeBonus = timeLeft > 0 ? Math.sqrt(timeLeft) * 10 : 0;
      
      // Combine factors
      const rawScore = (wpmFactor + wordsBonus + timeBonus) * accuracyModifier * mistakesPenalty;
      
      // Difficulty modifier
      const difficultyMultiplier = {
        easy: 0.85,
        medium: 1.0,
        hard: 1.25
      }[difficulty];
      
      // Calculate final score
      const finalScore = Math.round(rawScore * difficultyMultiplier);
      
      // Cap at 10,000
      return Math.min(finalScore, 10000);
    } catch (error) {
      console.error("Error calculating score:", error);
      return 0; // Default score
    }
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      if (!gameOver) {
        // Get the new value
        const newValue = e.target.value;
        
        // Check if this might be a paste operation (sudden addition of multiple characters)
        if (newValue.length > inputText.length + 1) {
          // Only allow pasting if it exactly matches the expected next portion of text
          const addedText = newValue.substring(inputText.length);
          const expectedText = fullText.substring(inputText.length, newValue.length);
          
          if (addedText !== expectedText) {
            // Paste doesn't match expected text - ignore it
            setError("Copy-pasting is not allowed. Please type the text manually.");
            return;
          }
        }
        
        setInputText(newValue);
      }
    } catch (error) {
      console.error("Error handling input change:", error);
      setError("Error processing your typing. Please try again.");
    }
  };

  // Prevent paste operations
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setError("Copy-pasting is not allowed. Please type the text manually.");
  };

  // Render text with highlighting
  const renderText = () => {
    try {
      const elements = [];
      
      // Show a window of 500 characters, centered on the current typing position
      const windowSize = 500;
      const currentPos = inputText.length;
      const startPos = Math.max(0, currentPos - windowSize / 2);
      const endPos = Math.min(fullText.length, startPos + windowSize);
      
      for (let i = startPos; i < endPos; i++) {
        const isCurrent = i === inputText.length;
        const isTyped = i < inputText.length;
        const isCorrect = isTyped && fullText[i] === inputText[i];
        
        if (isTyped) {
          elements.push(
            <HighlightedText 
              key={i} 
              isCorrect={isCorrect} 
              isCurrent={isCurrent}
              data-index={i}
            >
              {fullText[i]}
            </HighlightedText>
          );
        } else if (isCurrent) {
          elements.push(
            <HighlightedText 
              key={i} 
              isCorrect={true} 
              isCurrent={true}
              data-index={i}
            >
              {fullText[i]}
            </HighlightedText>
          );
        } else {
          elements.push(
            <UnusedText 
              key={i}
              data-index={i}
            >
              {fullText[i]}
            </UnusedText>
          );
        }
      }
      
      return (
        <TextContainer ref={textContainerRef}>
          {elements}
        </TextContainer>
      );
    } catch (error) {
      console.error("Error rendering text:", error);
      return <div>Error rendering text. Please restart the game.</div>;
    }
  };

  // CRITICAL FIX: New function to get a completely fresh text
  const getNewText = useCallback((previousText: string): string | null => {
    // Check if we've already reached the target word count
    const currentWordCount = totalWordsTyped;
    if (currentWordCount >= targetWordCount) {
      return null;
    }
    
    console.log(`Getting completely new text, previously completed: "${previousText.substring(0, 30)}..."`);
    
    // Get unused texts from the pool with enhanced similarity checking
    const availableTexts = textPool.filter(potentialText => {
      // Skip if it's already in the used texts set
      if (usedTexts.has(potentialText)) return false;
      
      // Skip if it's the same as the last used text
      if (potentialText === lastUsedText) return false;
      
      // Skip if it contains or is contained in the previous text
      if (potentialText.includes(previousText) || previousText.includes(potentialText)) return false;
      
      // Skip if the first 20 characters match the previous text
      if (potentialText.length > 20 && previousText.length > 20) {
        if (potentialText.substring(0, 20) === previousText.substring(0, 20)) {
          return false;
        }
      }
      
      return true;
    });
    
    console.log(`Found ${availableTexts.length} unused texts out of ${textPool.length} total`);
    
    let newText = "";
    if (availableTexts.length > 0) {
      // Use a random unused text
      const randomIndex = Math.floor(Math.random() * availableTexts.length);
      newText = availableTexts[randomIndex];
      
      // Debug check for repetition
      if (newText === previousText) {
        console.error("CRITICAL ERROR: Selected text is the same as previous text!");
        // Force a different selection
        const remainingTexts = availableTexts.filter(t => t !== newText);
        if (remainingTexts.length > 0) {
          newText = remainingTexts[Math.floor(Math.random() * remainingTexts.length)];
        }
      }
    } else {
      // If all texts have been used, create a completely new unique variation
      console.log("All texts have been used, creating a variation");
      
      // Find a text that's completely different from the previous text
      const safeTexts = textPool.filter(t => !t.includes(previousText.substring(0, 30)));
      
      if (safeTexts.length > 0) {
        const baseText = safeTexts[Math.floor(Math.random() * safeTexts.length)];
        
        // Create a substantial variation to ensure uniqueness
        if (baseText) {
          // Create a complete transformation of the text
          const words = baseText.split(" ");
          
          // Add unique prefix
          const prefixes = [
            "In contrast, ", 
            "On the other hand, ", 
            "Alternatively, ",
            "Meanwhile, ",
            "Elsewhere, "
          ];
          const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          
          // Generate completely different text by reversing and transforming
          words.reverse();
          newText = randomPrefix + words.join(" ");
        }
      }
      
      // Fallback if we couldn't create a variation
      if (!newText) {
        newText = "The quick brown fox jumps over the lazy dog. This text is a fallback.";
      }
    }
    
    // Add the new text to used texts
    const newUsedTexts = new Set(usedTexts);
    newUsedTexts.add(newText);
    setUsedTexts(newUsedTexts);
    
    // Update the last used text reference
    setLastUsedText(newText);
    
    console.log(`Selected completely new text: "${newText.substring(0, 30)}..."`);
    
    return newText;
  }, [textPool, targetWordCount, usedTexts, lastUsedText, totalWordsTyped]);

  // Function to add more text when needed - DEPRECATED
  // We no longer use this function, but keep it for reference and to avoid breaking dependencies
  const addMoreText = useCallback(() => {
    console.log("WARNING: addMoreText is deprecated and should not be called");
    return false;
  }, []);

  const TimeDisplay = styled.div`
    background: ${props => timeLeft < 10 ? '#e74c3c' : '#2ecc71'};
    color: white;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 auto 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    animation: ${props => timeLeft < 10 ? 'pulse 1s infinite' : 'none'};
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }
    }
  `;

  return (
    <div>
      {gameOver ? (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          wordsTyped={totalWordsTyped}
          score={calculateScore()}
          difficulty={difficulty}
          onPlayAgain={onEndGame}
          previousBestWpm={previousBestWpm}
          mistakesMade={mistakesMade}
          timeLeft={timeLeft}
          timeLimit={timeLimit}
        />
      ) : (
        <GameContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <TimeDisplay>
            {formatTime(timeLeft)}
          </TimeDisplay>
          
          <RaceTrack 
            position={carPosition} 
            previousBestPosition={previousBestPosition}
            progress={carPosition}
            targetLength={targetWordCount}
          />
          
          {renderText()}
          
          <InputArea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder="Start typing here..."
            autoFocus
          />
          
          <StatContainer>
            <Stat>
              <StatLabel>WPM</StatLabel>
              <StatValue>{wpm}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Accuracy</StatLabel>
              <StatValue>{accuracy}%</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Progress</StatLabel>
              <StatValue>{Math.round(carPosition)}%</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Mistakes</StatLabel>
              <StatValue>{mistakesMade}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Best WPM</StatLabel>
              <StatValue>{previousBestWpm > 0 ? previousBestWpm : '-'}</StatValue>
            </Stat>
          </StatContainer>
        </GameContainer>
      )}
    </div>
  );
};

export default TypingGame; 