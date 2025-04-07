# Typing Racer

A fun typing racing game built with React and TypeScript where you can test and improve your typing skills.

## Features

- Three difficulty levels: Easy, Medium, and Hard
- Three time settings: 30 seconds, 1 minute, and 2 minutes
- Race car that accelerates based on your typing speed
- Real-time statistics: WPM, accuracy, characters typed
- Detailed results and scoring after each race
- Maximum score of 10,000 for each mode and setting
- Error handling and debugging capabilities

## How to Play

1. Select your difficulty level and time setting
2. Click "Start Typing"
3. Type the text as accurately and quickly as possible
4. Watch your car race across the track based on your typing speed
5. Complete as much text as possible before time runs out
6. View your detailed results and score

## Scoring System

Your score is calculated based on a combination of correct characters typed and words completed. The formula is designed so that the maximum possible score is 10,000 points, scaled according to the difficulty level and time setting.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Navigate to the project directory: `cd typing-racer`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm start` or `yarn start`
5. Open your browser to: `http://localhost:3000`

You can also use the included start script:
```
chmod +x start.sh
./start.sh
```

## Development

### Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run lint` - Checks for linting errors
- `npm run lint:fix` - Automatically fixes linting errors when possible
- `npm run typecheck` - Checks TypeScript types
- `npm run check` - Runs both lint and typecheck

### Error Handling

The application includes comprehensive error handling:

- Error boundaries catch and display React component errors
- Console logging for debugging issues
- User-friendly error messages
- Fallback mechanisms for critical functions

### Debugging

Set `REACT_APP_DEBUG=true` in the .env file to enable additional debugging information. Error messages will be displayed in the console and, when appropriate, in the UI.

## Built With

- React
- TypeScript
- Styled Components

## License

This project is licensed under the MIT License - see the LICENSE file for details. 