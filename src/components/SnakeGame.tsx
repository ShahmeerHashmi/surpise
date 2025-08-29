"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, isPaused, generateFood]);

  const changeDirection = useCallback((newDirection: Position) => {
    if (!gameStarted) return;
    
    // Prevent reversing into itself
    if (newDirection.x === -direction.x && newDirection.y === -direction.y) return;
    
    setDirection(newDirection);
  }, [gameStarted, direction]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !gameStarted) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && direction.x !== -1) {
          changeDirection({ x: 1, y: 0 }); // Right
        } else if (deltaX < 0 && direction.x !== 1) {
          changeDirection({ x: -1, y: 0 }); // Left
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && direction.y !== -1) {
          changeDirection({ x: 0, y: 1 }); // Down
        } else if (deltaY < 0 && direction.y !== 1) {
          changeDirection({ x: 0, y: -1 }); // Up
        }
      }
    }
    
    setTouchStart(null);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameStarted]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          🐍 Cute Snake Game 🎮
        </h1>
        <p className="text-xl text-green-100">Score: {score}</p>
      </motion.div>

      {/* Game Board */}
      <motion.div 
        className="relative bg-green-800 rounded-lg p-4 shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div 
          className="grid gap-1 bg-green-900 p-2 rounded select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(400px, 90vw)',
            height: 'min(400px, 90vw)'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <motion.div
                key={index}
                className={`
                  w-full h-full rounded-sm
                  ${isSnakeHead ? 'bg-yellow-400' : ''}
                  ${isSnakeBody ? 'bg-green-400' : ''}
                  ${isFood ? 'bg-red-500' : ''}
                  ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-green-800' : ''}
                `}
                animate={isFood ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isFood ? Infinity : 0 }}
              >
                {isSnakeHead && <span className="text-xs">😊</span>}
                {isFood && <span className="text-xs">🍎</span>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Start/Game Control Buttons */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {!gameStarted && (
          <motion.button
            onClick={resetGame}
            className="px-8 py-3 bg-yellow-400 text-green-800 font-bold rounded-full hover:bg-yellow-300 transition-colors mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎮 Start Game
          </motion.button>
        )}
        
        {gameStarted && !gameOver && (
          <motion.button
            onClick={() => setIsPaused(!isPaused)}
            onTouchStart={() => setIsPaused(!isPaused)}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-400 transition-colors mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </motion.button>
        )}
        
        {gameOver && (
          <div className="space-y-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-red-200"
            >
              Game Over! 💀
            </motion.div>
            <motion.button
              onClick={resetGame}
              className="px-8 py-3 bg-yellow-400 text-green-800 font-bold rounded-full hover:bg-yellow-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Play Again
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Touch Controls */}
      <motion.div 
        className="mt-4 block md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col items-center space-y-2">
          {/* Up Button */}
          <motion.button
            onTouchStart={() => changeDirection({ x: 0, y: -1 })}
            className="w-16 h-16 bg-green-600 text-white text-2xl rounded-full shadow-lg active:bg-green-700"
            whileTap={{ scale: 0.9 }}
          >
            ⬆️
          </motion.button>
          
          {/* Left and Right Buttons */}
          <div className="flex space-x-4">
            <motion.button
              onTouchStart={() => changeDirection({ x: -1, y: 0 })}
              className="w-16 h-16 bg-green-600 text-white text-2xl rounded-full shadow-lg active:bg-green-700"
              whileTap={{ scale: 0.9 }}
            >
              ⬅️
            </motion.button>
            <motion.button
              onTouchStart={() => changeDirection({ x: 1, y: 0 })}
              className="w-16 h-16 bg-green-600 text-white text-2xl rounded-full shadow-lg active:bg-green-700"
              whileTap={{ scale: 0.9 }}
            >
              ➡️
            </motion.button>
          </div>
          
          {/* Down Button */}
          <motion.button
            onTouchStart={() => changeDirection({ x: 0, y: 1 })}
            className="w-16 h-16 bg-green-600 text-white text-2xl rounded-full shadow-lg active:bg-green-700"
            whileTap={{ scale: 0.9 }}
          >
            ⬇️
          </motion.button>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-white">
          <span className="hidden md:inline">Use arrow keys to move • Space to pause</span>
          <span className="md:hidden">Swipe or use buttons to move • Tap pause button</span>
        </p>
      </motion.div>

      {/* Back Button */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link href="/Birthday" passHref>
          <motion.button
            className="px-6 py-3 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎂 Back to Birthday
          </motion.button>
        </Link>
      </motion.div>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && gameStarted && !gameOver && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⏸️ Paused</h2>
              <p className="text-gray-600">Press Space to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;