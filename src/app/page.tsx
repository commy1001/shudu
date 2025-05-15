'use client';

import { useState, useEffect } from 'react';
import Square from './components/square';
import { validateSudoku } from './utils/sudokuRules';
import puzzles from '../data/puzzles.json';
import './globals.css'; 

const App = () => {
  const [squares, setSquares] = useState<(string | null)[]>(Array(81).fill(null));
  const [prefilled, setPrefilled] = useState<boolean[]>(Array(81).fill(false));
  const [errors, setErrors] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showErrors, setShowErrors] = useState(false); 
  const [message, setMessage] = useState('');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0); 
  const [puzzlesList] = useState(puzzles); 

  useEffect(() => {
    initializePuzzle(currentPuzzleIndex);
  }, [currentPuzzleIndex]);

  // 初始化题目
  const initializePuzzle = (index: number) => {
    const puzzle = puzzlesList[index].puzzle;
    const newPrefilled = puzzle.map(cell => cell !== null);
    setSquares(puzzle);
    setPrefilled(newPrefilled);
    setErrors([]);
    setIsCompleted(false);
    setShowErrors(false);
    setMessage(`当前题目: ${puzzlesList[index].name} (${puzzlesList[index].difficulty})`);
  };

  // 切换到下一题
  const nextPuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % puzzlesList.length;
    setCurrentPuzzleIndex(nextIndex);
  };

  // 切换到上一题
  const prevPuzzle = () => {
    const prevIndex = (currentPuzzleIndex - 1 + puzzlesList.length) % puzzlesList.length;
    setCurrentPuzzleIndex(prevIndex);
  };

  // 随机选择题目
  const randomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * puzzlesList.length);
    setCurrentPuzzleIndex(randomIndex);
  };

  // 处理输入
  const handleChange = (index: number, value: string) => {
    if (prefilled[index]) return;

    const sanitizedValue = value.replace(/[^1-9]/g, '').slice(0, 1);
    const nextSquares = [...squares];
    nextSquares[index] = sanitizedValue || null;
    setSquares(nextSquares);

    // 实时验证
    const newErrors = validateSudoku(nextSquares);
    setErrors(newErrors || []);
    checkCompletion(nextSquares, newErrors || []);
  };

  // 检查是否完成
  const checkCompletion = (grid: (string | null)[], errors: number[]) => {
    const filled = grid.every(cell => cell !== null);
    const valid = errors.length === 0;
    setIsCompleted(filled && valid);
    if (filled && valid) {
      setMessage('🎉 恭喜！数独完成！');
    }
  };

  // 手动检查答案
  const checkAnswer = () => {
    const newErrors = validateSudoku(squares);
    setErrors(newErrors || []);
    setShowErrors(true);

    if (newErrors?.length) {
      setMessage('❌ 存在错误，请检查高亮格子！');
    } else if (squares.some(cell => cell === null)) {
      setMessage('⚠️ 未完成，请继续填写！');
    } else {
      setMessage('🎉 全部正确！');
    }
  };

  return (
    <div className="sudoku-container">
      <div className="controls">
        <button onClick={checkAnswer} className="button">
          检查答案
        </button>
        <button onClick={() => initializePuzzle(currentPuzzleIndex)} className="button">
          重新开始
        </button>
        <button onClick={randomPuzzle} className="button" disabled={puzzlesList.length <= 1}>
          随机题目
        </button>
      </div>

      {message && (
        <div className={`message ${isCompleted ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <div style={{display: 'flex', gap: '10px'}}>
       <button onClick={prevPuzzle} className="button2" disabled={puzzlesList.length <= 1}>
          上一题
        </button>
        <button onClick={nextPuzzle} className="button2" disabled={puzzlesList.length <= 1}>
          下一题
        </button>
        </div>

      <div className="board">
        {Array.from({ length: 9 }, (_, row) => (
          <div className="board-row" key={row}>
            {Array.from({ length: 9 }, (_, col) => {
              const index = row * 9 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  isPrefilled={prefilled[index]}
                  isError={showErrors && errors.includes(index)}
                  onSquareChange={(value) => handleChange(index, value)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;